import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/chat/complibot
 * Interactive legal & consumer safety copilot for current scan audit
 */
router.post('/complibot', async (req, res) => {
  try {
    const { message, productContext, history = [], language = 'en' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message is required.' });
    }

    const apiKey = process.env.GROQ_API_KEY;

    // Build context string from product
    const contextSummary = productContext ? `
CURRENT INSPECTED PRODUCT DATA:
- Product Name: ${productContext.productName || 'Not specified'}
- Brand: ${productContext.brand || 'Not specified'}
- Category: ${productContext.category || 'General Packaged Food'}
- Compliance Score: ${productContext.score || 0}% (${productContext.overallStatus || 'Under Review'})
- Failed / Issue Rules: ${JSON.stringify(productContext.failedRules || [])}
- Observed Declarations: ${JSON.stringify(productContext.extractedInfo || {})}
- Nutrition Audit: ${JSON.stringify(productContext.nutritionAudit || {})}
- FSSAI License: ${productContext.fssaiLicense || 'Not detected'}
- MRP / Net Qty: MRP: ${productContext.mrp || 'N/A'}, Net Qty: ${productContext.netQuantity || 'N/A'}
` : 'No specific product attached.';

    const systemPrompt = `You are CompliBot AI, an expert AI Legal & Consumer Safety Assistant for Indian Packaged Commodities, built for Smart India Hackathon (SIH 2026) under the Ministry of Consumer Affairs, Food & Public Distribution and FSSAI.

Your knowledge includes:
1. Legal Metrology Act 2009 & Legal Metrology (Packaged Commodities) Rules 2011 (Rule 6, Rule 9 font sizes, Section 36 penalties up to ₹1,00,000 / imprisonment).
2. FSSAI (Labelling and Display) Regulations 2020 (HFSS thresholds, Veg/Non-Veg logo dimensions, allergen disclosures).
3. Consumer Protection Act 2019 & CCPA Guidelines on Prevention of Misleading Advertisements 2022/2024.

GUIDELINES:
- Answer accurately based on the CURRENT INSPECTED PRODUCT DATA provided.
- If asked to draft a legal notice or statutory report, provide a clean, formal notice template with applicable Section/Rule numbers.
- If asked about health/nutrition, analyze the HFSS numbers (sugar, sodium, saturated fat) factually.
- Language instruction: If the user writes in Hindi or requests Hindi, answer in clear, professional Hindi (or Hinglish if conversational). Otherwise answer in precise English.
- Use markdown formatting with bullet points and bold highlights.

${contextSummary}
`;

    // If Groq API key is available, call Groq LLM
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_GROQ_API_KEY_HERE') {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-6).map((h) => ({
          role: h.sender === 'user' ? 'user' : 'assistant',
          content: h.text,
        })),
        { role: 'user', content: message },
      ];

      for (const model of ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'gemma2-9b-it']) {
        try {
          const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              messages,
              temperature: 0.3,
              max_tokens: 1024,
            }),
          });

          if (groqResponse.ok) {
            const data = await groqResponse.json();
            const reply = data.choices?.[0]?.message?.content;
            if (reply) {
              return res.status(200).json({ success: true, reply });
            }
          }
        } catch (chatErr) {
          console.warn(`[CompliBot Model Error]: ${model} failed, trying next...`);
        }
      }
    }

    // Fallback deterministic statutory responses if offline or no Groq key
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('notice') || lower.includes('draft') || lower.includes('section 36')) {
      reply = `### 🏛️ STATUTORY NOTICE UNDER LEGAL METROLOGY ACT, 2009\n\n**To:** The Manufacturer / Packer / Importer of **${productContext?.productName || 'Inspected Product'}**\n\n**Subject:** Notice for Non-Compliance under Rule 6 of the Legal Metrology (Packaged Commodities) Rules, 2011 read with Section 36 of the Legal Metrology Act, 2009.\n\n**Inspection Findings:**\nUpon automated verification by CompliScan AI, the retail package was found to violate mandatory statutory declarations:\n${(productContext?.failedRules || []).map((r, i) => `- **Violation ${i + 1}:** ${typeof r === 'object' ? r.field + ': ' + r.explanation : r}`).join('\n') || '- Inadequate / Missing Mandatory Package Declarations'}\n\n**Statutory Penalty Warning:**\nUnder Section 36(1) of the Legal Metrology Act, 2009, failure to comply attracts a penalty of up to **₹25,000** for the first offence, **₹50,000** for the second offence, and up to **₹1,00,000 or imprisonment** for subsequent offences.\n\nYou are hereby directed to submit a written explanation within 15 days.`;
    } else if (lower.includes('sugar') || lower.includes('diabet') || lower.includes('health') || lower.includes('safe')) {
      reply = `### 🩺 Health & Nutrition Assessment for ${productContext?.productName || 'This Product'}\n\n- **Category:** ${productContext?.category || 'Food'}\n- **HFSS Status:** Based on FSSAI thresholds, products exceeding 6g/100g sugar or 4g/100g saturated fat are categorized as HFSS (High Fat, Sugar, and Salt).\n- **Dietary Advice:** Individuals with diabetes or hypertension should carefully monitor portion sizes. Always check the mandatory allergen and trans-fat declarations on the back panel.`;
    } else if (lower.includes('hindi') || lower.includes('हिंदी')) {
      reply = `### 🇮🇳 उत्पाद वैधानिक सारांश (${productContext?.productName || 'उत्पाद'})\n\n- **अनुपालन स्कोर:** ${productContext?.score || 82}%\n- **FSSAI स्थिति:** पैकेज पर आवश्यक वैधानिक घोषणाओं (जैसे MRP, निर्माण तिथि, शाकाहारी/मांसाहारी लोगो) का निरीक्षण किया गया है।\n- **अधिनियम:** लीगल मेट्रोलॉजी अधिनियम 2009 एवं FSSAI विनियम 2020 के तहत यदि कोई उल्लंघन पाया जाता है, तो निर्माता पर वैधानिक नोटिस जारी किया जा सकता है।`;
    } else {
      reply = `### 📋 CompliScan AI Statutory Advisory\n\nFor **${productContext?.productName || 'this packaged product'}**:\n- **Current Score:** ${productContext?.score || 0}%\n- **Status:** ${productContext?.overallStatus || 'Under Review'}\n- **Key Rules Evaluated:** Legal Metrology Rule 6(1) (MRP, Net Qty, Best Before, Consumer Care) & FSSAI Labelling Regulations 2020.\n\nFeel free to ask for a legal notice draft, fine calculations, or health advisories!`;
    }

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error('[CompliBot Chat Error]:', error.message);
    return res.status(500).json({ success: false, error: 'CompliBot is currently unavailable.' });
  }
});

export default router;
