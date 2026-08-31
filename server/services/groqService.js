/**
 * Groq LLM Structuring Service
 * Converts raw OCR text into structured product information via Groq API.
 * Returns STRICT JSON only. Does NOT hallucinate missing information.
 */

export async function structureProductWithGroq(ocrText) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GROQ_API_KEY_HERE') {
    console.error('[Groq Notice] GROQ_API_KEY is not configured in .env. Please set GROQ_API_KEY in compli-scan-ai/.env');
    throw new Error('AI structuring service requires GROQ_API_KEY. Please set GROQ_API_KEY in the server .env file.');
  }

  if (!ocrText || typeof ocrText !== 'string' || ocrText.trim().length === 0) {
    throw new Error('No text provided for analysis.');
  }

  const systemPrompt = `You are an expert AI parser specializing in Indian packaged consumer product labels (Legal Metrology, FSSAI, CDSCO, BIS).
Your job is to convert OCR text extracted from a product label into structured product information.

CRITICAL INSTRUCTIONS:
1. You must return STRICT JSON ONLY. Do not write introductory text, markdown codeblocks, or explanations.
2. Distinguish accurately between:
   - Information clearly found
   - Information not found (return null)
   - Information unclear or partially truncated (return null or note only what is legible)
3. NEVER hallucinate, guess, or invent product names, numbers, dates, or licenses. If you are not certain, return null.
4. For "category", select strictly one of: "Food", "Edible Oil", "Cosmetics", "Household", or "Unknown".
5. Keep "rawText" set to the input OCR text.

Expected JSON Schema:
{
  "productName": string or null,
  "brand": string or null,
  "category": "Food" | "Edible Oil" | "Cosmetics" | "Household" | "Unknown",
  "mrp": string or null,
  "netQuantity": string or null,
  "manufacturer": string or null,
  "manufacturingDate": string or null,
  "expiryDate": string or null,
  "batchNumber": string or null,
  "consumerCare": string or null,
  "ingredients": string or null,
  "countryOfOrigin": string or null,
  "licenseNumber": string or null,
  "rawText": string
}`;

  const userPrompt = `Extract structured product label information from this OCR text:

--- OCR TEXT START ---
${ocrText.slice(0, 4000)}
--- OCR TEXT END ---`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

  const model = process.env.GROQ_MODEL?.trim() || 'openai/gpt-oss-20b';

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errBody = '';
      try {
        const errJson = await response.json();
        errBody = errJson?.error?.message || JSON.stringify(errJson);
      } catch {
        errBody = await response.text();
      }
      console.error(`[Groq API ${response.status}]:`, errBody);

      if (response.status === 429) {
        throw new Error('AI analysis rate limit reached. Please retry in a few moments.');
      }
      if (response.status === 401) {
        throw new Error('Invalid GROQ_API_KEY. Please verify the API key in your .env file.');
      }
      throw new Error(`AI service responded with status ${response.status}: ${errBody || 'Request error'}`);
    }

    const data = await response.json();
    const messageContent = data.choices?.[0]?.message?.content;

    if (!messageContent) {
      throw new Error('AI service returned an empty response.');
    }

    let parsed;
    try {
      parsed = JSON.parse(messageContent);
    } catch {
      // Fallback: extract json if wrapped in backticks
      const match = messageContent.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('Failed to parse structured information from the analysis service.');
      }
    }

    // Sanitize category to supported enum
    const validCategories = ['Food', 'Edible Oil', 'Cosmetics', 'Household'];
    let category = parsed.category;
    if (!validCategories.includes(category)) {
      category = 'Unknown';
    }

    return {
      productName: parsed.productName || null,
      brand: parsed.brand || null,
      category,
      mrp: parsed.mrp || null,
      netQuantity: parsed.netQuantity || null,
      manufacturer: parsed.manufacturer || null,
      manufacturingDate: parsed.manufacturingDate || null,
      expiryDate: parsed.expiryDate || null,
      batchNumber: parsed.batchNumber || null,
      consumerCare: parsed.consumerCare || null,
      ingredients: parsed.ingredients || null,
      countryOfOrigin: parsed.countryOfOrigin || null,
      licenseNumber: parsed.licenseNumber || null,
      rawText: ocrText,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('AI analysis request timed out. Please try again.');
    }
    throw err;
  }
}
