/**
 * Groq LLM Structuring Service for CompliScan AI
 * Converts raw OCR text into complete, structured product information via Groq API.
 * Returns STRICT JSON only. Does NOT hallucinate missing information.
 *
 * Designed to extract:
 * - productName, brandName/brand, category
 * - mrp (with normalized value & currency)
 * - netQuantity, netWeight, netVolume
 * - manufacturerName, manufacturerAddress, manufacturer
 * - packerName, packerAddress
 * - importerName, importerAddress
 * - batchNumber, lotNumber
 * - manufacturingDate, packingDate, expiryDate, bestBefore
 * - consumerCareName, consumerCarePhone, consumerCareEmail, consumerCareAddress, consumerCare
 * - countryOfOrigin
 * - fssaiLicenseNumber / licenseNumber
 * - ingredients, components, ingredientsConfidence
 * - vegNonVegDeclaration
 * - productDescription, otherMandatoryDeclarations
 */

export async function structureProductWithGroq(ocrText) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GROQ_API_KEY_HERE') {
    console.error('[Groq Notice] GROQ_API_KEY is not configured in .env.');
    throw new Error('AI structuring service requires GROQ_API_KEY. Please set GROQ_API_KEY in the server .env file.');
  }

  if (!ocrText || typeof ocrText !== 'string' || ocrText.trim().length === 0) {
    throw new Error('No text provided for analysis.');
  }

  const systemPrompt = `You are a specialized legal document and product label information extraction system for Indian consumer packaged goods under Legal Metrology, FSSAI, CDSCO, and BIS.

CRITICAL OPERATING DIRECTIVES:
1. You are SOLELY an information extraction system. You DO NOT make compliance determinations.
2. Extract information ONLY from the provided OCR text.
3. NEVER guess, assume, or invent product names, numbers, dates, addresses, licenses, or ingredients.
4. If a field is not present or cannot be read reliably, you MUST return null.
5. Return STRICT JSON ONLY adhering to the specified schema. No markdown formatting, no explanations.

DETAILED FIELD EXTRACTION RULES:

1. MRP:
   - Identify: "MRP", "M.R.P.", "Maximum Retail Price", "Rs.", "₹", "incl. of all taxes".
   - Distinguish from selling price, discount, or offer price.
   - Extract raw text (e.g. "MRP ₹120.00 (incl. of all taxes)") and normalized value (number or string).

2. NET QUANTITY / WEIGHT / VOLUME:
   - Identify: "Net Qty", "Net Quantity", "Net Wt", "Net Weight", "Net Vol", "Net Content".
   - Extract exact value and unit (e.g., "500 g", "1 kg", "250 ml", "1 L", "10 N", "2 pcs").
   - Do NOT convert or calculate units.

3. DATES (MFD vs PKD vs EXP vs BEST BEFORE):
   - "MFD" / "MFG" / "Manufactured" -> manufacturingDate
   - "PKD" / "Packed" / "Packing Date" -> packingDate
   - "EXP" / "Expiry" / "Use By" -> expiryDate
   - "Best Before [X] Months" or date -> bestBefore
   - Do NOT assume every date means expiry. Separate MFD from EXP.

4. BATCH / LOT:
   - "Batch No", "Batch Number", "B.No", "Lot No", "Lot Number", "Batch Code" -> batchNumber.

5. MANUFACTURER vs PACKER vs IMPORTER:
   - "Manufactured by", "Mfg by", "Mfd by" -> manufacturerName, manufacturerAddress
   - "Packed by", "Pre-packed by" -> packerName, packerAddress
   - "Imported by", "Marketed by" -> importerName, importerAddress
   - Keep names and complete addresses. Do NOT merge them into one generic field.

6. CONSUMER CARE:
   - "Customer Care", "Consumer Care", "Helpline", "Toll Free", "Feedback"
   - Extract consumerCarePhone, consumerCareEmail, consumerCareAddress.

7. INGREDIENTS / COMPONENTS:
   - "Ingredients", "Composition", "Contains", "Made from"
   - Extract the entire legible ingredient list. If partially readable, extract what is visible and set ingredientsConfidence: "LOW" or "HIGH".

8. FSSAI / LICENCE:
   - "FSSAI", "Lic. No.", "License Number" (14-digit FSSAI number or CDSCO/BIS cosmetics license).

9. CATEGORY:
   - Must be strictly one of: "Food", "Edible Oil", "Cosmetics", "Household", or "Unknown".

EXPECTED JSON OUTPUT STRUCTURE:
{
  "productName": string or null,
  "brandName": string or null,
  "brand": string or null,
  "category": "Food" | "Edible Oil" | "Cosmetics" | "Household" | "Unknown",

  "mrp": string or null,
  "mrpDetails": {
    "value": number or string or null,
    "currency": "INR",
    "rawText": string or null
  } or null,

  "netQuantity": string or null,
  "netWeight": string or null,
  "netVolume": string or null,

  "manufacturerName": string or null,
  "manufacturerAddress": string or null,
  "manufacturer": string or null,

  "packerName": string or null,
  "packerAddress": string or null,

  "importerName": string or null,
  "importerAddress": string or null,

  "batchNumber": string or null,
  "lotNumber": string or null,

  "manufacturingDate": string or null,
  "packingDate": string or null,
  "expiryDate": string or null,
  "bestBefore": string or null,

  "consumerCareName": string or null,
  "consumerCarePhone": string or null,
  "consumerCareEmail": string or null,
  "consumerCareAddress": string or null,
  "consumerCare": string or null,

  "countryOfOrigin": string or null,
  "fssaiLicenseNumber": string or null,
  "licenseNumber": string or null,

  "ingredients": string or null,
  "components": string or null,
  "ingredientsConfidence": "HIGH" | "MEDIUM" | "LOW" | null,

  "vegNonVegDeclaration": "VEG" | "NON_VEG" | null,
  "productDescription": string or null,
  "otherMandatoryDeclarations": string or null,
  "rawText": string
}`;

  // Use the entire OCR text up to 12,000 characters (never aggressively truncate)
  const fullOcrSlice = ocrText.slice(0, 12000);

  const userPrompt = `Analyze the following complete OCR text from a product label and extract all structured fields strictly according to instructions:

--- COMPLETE OCR TEXT START ---
${fullOcrSlice}
--- COMPLETE OCR TEXT END ---`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

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

    // Unify manufacturer representation
    const manufacturerSummary = parsed.manufacturer ||
      (parsed.manufacturerName ? `${parsed.manufacturerName}${parsed.manufacturerAddress ? ', ' + parsed.manufacturerAddress : ''}` : null) ||
      (parsed.packerName ? `Packed by: ${parsed.packerName}${parsed.packerAddress ? ', ' + parsed.packerAddress : ''}` : null);

    // Unify consumer care representation
    const consumerCareSummary = parsed.consumerCare ||
      [parsed.consumerCarePhone, parsed.consumerCareEmail, parsed.consumerCareAddress].filter(Boolean).join(' | ') || null;

    // Unify license representation
    const licenseNumber = parsed.fssaiLicenseNumber || parsed.licenseNumber || null;

    // Format MRP cleanly
    const mrp = parsed.mrp || (parsed.mrpDetails?.rawText) || (parsed.mrpDetails?.value ? `₹${parsed.mrpDetails.value}` : null);

    // Format Net Quantity cleanly
    const netQuantity = parsed.netQuantity || parsed.netWeight || parsed.netVolume || null;

    // Date unification
    const manufacturingDate = parsed.manufacturingDate || parsed.packingDate || null;
    const expiryDate = parsed.expiryDate || parsed.bestBefore || null;

    return {
      // Primary keys
      productName: parsed.productName || null,
      brand: parsed.brand || parsed.brandName || null,
      brandName: parsed.brandName || parsed.brand || null,
      category,
      mrp,
      mrpDetails: parsed.mrpDetails || null,
      netQuantity,
      netWeight: parsed.netWeight || null,
      netVolume: parsed.netVolume || null,

      manufacturer: manufacturerSummary,
      manufacturerName: parsed.manufacturerName || null,
      manufacturerAddress: parsed.manufacturerAddress || null,
      packerName: parsed.packerName || null,
      packerAddress: parsed.packerAddress || null,
      importerName: parsed.importerName || null,
      importerAddress: parsed.importerAddress || null,

      manufacturingDate,
      packingDate: parsed.packingDate || null,
      expiryDate,
      bestBefore: parsed.bestBefore || null,
      batchNumber: parsed.batchNumber || parsed.lotNumber || null,
      lotNumber: parsed.lotNumber || null,

      consumerCare: consumerCareSummary,
      consumerCarePhone: parsed.consumerCarePhone || null,
      consumerCareEmail: parsed.consumerCareEmail || null,
      consumerCareAddress: parsed.consumerCareAddress || null,

      ingredients: parsed.ingredients || parsed.components || null,
      components: parsed.components || null,
      ingredientsConfidence: parsed.ingredientsConfidence || null,

      countryOfOrigin: parsed.countryOfOrigin || null,
      licenseNumber,
      fssaiLicenseNumber: parsed.fssaiLicenseNumber || null,

      vegNonVegDeclaration: parsed.vegNonVegDeclaration || null,
      productDescription: parsed.productDescription || null,
      otherMandatoryDeclarations: parsed.otherMandatoryDeclarations || null,
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
