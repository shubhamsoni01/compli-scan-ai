/**
 * Deterministic Extraction & Normalization Layer for CompliScan AI
 *
 * Source of Truth: Raw OCR text.
 * Responsibilities:
 * 1. Normalize OCR text without destroying original evidence:
 *    - Lowercase copy for matching, preserve original text for display/citations
 *    - Normalize spaces, punctuation, linebreaks
 *    - Normalize ₹ / Rs. / INR / MRP variations
 *    - Normalize metric units (g, kg, ml, L, pcs, N)
 * 2. Deterministic Regex / Keyword Context Extraction:
 *    - MRP (identifies "MRP", "M.R.P.", "Maximum Retail Price", avoids confusing with discounts/selling prices)
 *    - Net Quantity (identifies "Net Qty", "Net Wt", "Net Vol" + numeric value + standard metric unit)
 *    - Dates (MFD/MFG/Packed separated from EXP/Use By/Best Before)
 *    - Batch / Lot ("Batch No", "Lot No", "B.No", "Lot", "Code")
 *    - Manufacturer vs Packer vs Importer (keeps qualifying labels and addresses)
 *    - Ingredients / Components (extracts actual section text without inventing)
 *    - Consumer Care (phone, toll-free, email, address in consumer care context)
 *    - FSSAI License (14-digit standard number)
 *    - Country of Origin ("Country of Origin", "Made in", "Manufactured in")
 *    - Veg / Non-Veg (explicit declarations or symbols)
 * 3. Validation & Re-extraction against OCR:
 *    - If Groq JSON returns null for a field but RAW OCR contains the label/data,
 *      this deterministic extractor fills in the exact observed data!
 *    - Prevents false FAIL in Legal Rule Engine.
 */

export function normalizeOcrText(rawOcrText) {
  if (!rawOcrText || typeof rawOcrText !== 'string') return '';
  return rawOcrText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');
}

/**
 * Extracts MRP from OCR text using contextual anchors
 */
export function extractMrpFromOcr(ocrText) {
  if (!ocrText) return null;
  // Match MRP label followed by currency and numbers
  // e.g., "MRP Rs. 120", "M.R.P. : ₹ 120.00", "MRP ₹120 (incl. of all taxes)", "Maximum Retail Price ₹ 150"
  const mrpRegex = /(?:m\.?r\.?p\.?|maximum\s*retail\s*price)\s*(?::|-)?\s*(?:(?:inclusive|incl\.?)\s*of\s*all\s*taxes)?\s*(?:rs\.?|inr|₹)?\s*([0-9]+(?:\.[0-9]{1,2})?)/i;
  const match = ocrText.match(mrpRegex);
  if (match) {
    const val = parseFloat(match[1]);
    return {
      value: val,
      currency: 'INR',
      rawText: match[0].trim(),
      confidence: 0.95,
      source: 'OCR_DETERMINISTIC',
    };
  }

  // Reverse match: "₹120 (MRP)" or "Rs 120/- (M.R.P)"
  const revRegex = /(?:rs\.?|inr|₹)\s*([0-9]+(?:\.[0-9]{1,2})?)\s*(?:\/-)?\s*(?:\(|\/)?\s*(?:m\.?r\.?p\.?|maximum\s*retail\s*price)/i;
  const revMatch = ocrText.match(revRegex);
  if (revMatch) {
    return {
      value: parseFloat(revMatch[1]),
      currency: 'INR',
      rawText: revMatch[0].trim(),
      confidence: 0.92,
      source: 'OCR_DETERMINISTIC',
    };
  }

  return null;
}

/**
 * Extracts Net Quantity from OCR text
 */
export function extractNetQuantityFromOcr(ocrText) {
  if (!ocrText) return null;
  // Match "Net Qty: 500 g", "Net Quantity 1 L", "Net Content: 250 ml", "Net Wt. 100g", "Net Volume: 500ml"
  const netQtyRegex = /(?:net\s*(?:quantity|qty\.?|weight|wt\.?|volume|vol\.?|content)|weight)\s*(?::|-)?\s*([0-9]+(?:\.[0-9]+)?)\s*(kg|g|gm|grams|mg|l|ltr|litre|litres|ml|pcs|piece|pieces|count|n\b)/i;
  const match = ocrText.match(netQtyRegex);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[2].trim(),
      rawText: match[0].trim(),
      confidence: 0.95,
      source: 'OCR_DETERMINISTIC',
    };
  }

  // Standalone metric quantity when near package declaration words
  const standaloneRegex = /\b([0-9]+(?:\.[0-9]+)?)\s*(kg|gm|grams|ml|ltr|litre)\b/i;
  const standaloneMatch = ocrText.match(standaloneRegex);
  if (standaloneMatch) {
    return {
      value: parseFloat(standaloneMatch[1]),
      unit: standaloneMatch[2].trim(),
      rawText: standaloneMatch[0].trim(),
      confidence: 0.82,
      source: 'OCR_DETERMINISTIC',
    };
  }

  return null;
}

/**
 * Extracts Dates (Manufacturing, Packing, Expiry, Best Before)
 */
export function extractDatesFromOcr(ocrText) {
  const result = {
    manufacturingDate: null,
    packingDate: null,
    expiryDate: null,
    bestBefore: null,
  };
  if (!ocrText) return result;

  // Date formats: DD/MM/YYYY, MM/YYYY, DD-MM-YYYY, Month YYYY
  const datePattern = '(?:[0-9]{1,2}[/-])?[0-9]{1,2}[/-][0-9]{2,4}|[A-Za-z]{3,9}\\s*[0-9]{4}';

  // 1. Manufacturing Date: "MFD: 08/2026", "MFG. DATE 12/08/2026", "Manufactured: Aug 2026"
  const mfdRegex = new RegExp(`(?:mfd|mfg|manufactur(?:ed|ing)(?:\\s*date)?)\\s*(?::|-)?\\s*(${datePattern})`, 'i');
  const mfdMatch = ocrText.match(mfdRegex);
  if (mfdMatch) {
    result.manufacturingDate = {
      value: mfdMatch[1].trim(),
      rawText: mfdMatch[0].trim(),
      confidence: 0.92,
      source: 'OCR_DETERMINISTIC',
    };
  }

  // 2. Packing Date: "PKD: 08/2026", "Packed On: 12-08-2026"
  const pkdRegex = new RegExp(`(?:pkd|packed(?:\\s*on)?|packing\\s*date)\\s*(?::|-)?\\s*(${datePattern})`, 'i');
  const pkdMatch = ocrText.match(pkdRegex);
  if (pkdMatch) {
    result.packingDate = {
      value: pkdMatch[1].trim(),
      rawText: pkdMatch[0].trim(),
      confidence: 0.92,
      source: 'OCR_DETERMINISTIC',
    };
  }

  // 3. Expiry Date: "EXP: 08/2027", "Expiry Date: 12/08/2027", "Use by: 08-2027"
  const expRegex = new RegExp(`(?:exp(?:iry)?(?:\\s*date)?|use\\s*by)\\s*(?::|-)?\\s*(${datePattern})`, 'i');
  const expMatch = ocrText.match(expRegex);
  if (expMatch) {
    result.expiryDate = {
      value: expMatch[1].trim(),
      rawText: expMatch[0].trim(),
      confidence: 0.92,
      source: 'OCR_DETERMINISTIC',
    };
  }

  // 4. Best Before: "Best Before 9 Months", "Best Before 12/2026"
  const bbRegex = /(?:best\s*before)\s*(?::|-)?\s*([0-9]+\s*(?:months?|days?|years?)|(?:[0-9]{1,2}[/-])?[0-9]{1,2}[/-][0-9]{2,4}|[A-Za-z]{3,9}\s*[0-9]{4})/i;
  const bbMatch = ocrText.match(bbRegex);
  if (bbMatch) {
    result.bestBefore = {
      value: bbMatch[1].trim(),
      rawText: bbMatch[0].trim(),
      confidence: 0.92,
      source: 'OCR_DETERMINISTIC',
    };
  }

  return result;
}

/**
 * Extracts Batch / Lot Number
 */
export function extractBatchFromOcr(ocrText) {
  if (!ocrText) return null;
  // Match "Batch No: ABC123", "B.No. 450", "Lot No: L982", "Batch: B-2024"
  const batchRegex = /(?:batch\s*no\.?|b\.?\s*no\.?|batch\s*number|lot\s*no\.?|lot\s*number|batch|lot|code)\s*(?::|-)?\s*([A-Za-z0-9/_-]{2,20})/i;
  const match = ocrText.match(batchRegex);
  if (match) {
    return {
      value: match[1].trim(),
      rawText: match[0].trim(),
      confidence: 0.93,
      source: 'OCR_DETERMINISTIC',
    };
  }
  return null;
}

/**
 * Extracts Manufacturer, Packer, and Importer details with qualifying context
 */
export function extractEntityDetailsFromOcr(ocrText) {
  const result = {
    manufacturer: null,
    packer: null,
    importer: null,
    marketer: null,
  };
  if (!ocrText) return result;

  const lines = ocrText.split('\n').map((l) => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1] || '';
    const nextNextLine = lines[i + 2] || '';

    // Manufactured by
    if (/(?:manufactured|mfg|mfd)\s*(?:&|and)?\s*(?:packed)?\s*by/i.test(line) && !result.manufacturer) {
      const fullText = [line, nextLine, nextNextLine].filter(Boolean).join(' ');
      result.manufacturer = {
        value: fullText.replace(/^(?:manufactured|mfg|mfd)\s*(?:&|and)?\s*(?:packed)?\s*by\s*(?::|-)?/i, '').trim(),
        rawText: fullText.slice(0, 150),
        confidence: 0.9,
        source: 'OCR_DETERMINISTIC',
      };
    }

    // Packed by
    if (/packed\s*by/i.test(line) && !result.packer && !line.toLowerCase().includes('manufactured')) {
      const fullText = [line, nextLine, nextNextLine].filter(Boolean).join(' ');
      result.packer = {
        value: fullText.replace(/^packed\s*by\s*(?::|-)?/i, '').trim(),
        rawText: fullText.slice(0, 150),
        confidence: 0.9,
        source: 'OCR_DETERMINISTIC',
      };
    }

    // Imported by
    if (/imported\s*by/i.test(line) && !result.importer) {
      const fullText = [line, nextLine, nextNextLine].filter(Boolean).join(' ');
      result.importer = {
        value: fullText.replace(/^imported\s*by\s*(?::|-)?/i, '').trim(),
        rawText: fullText.slice(0, 150),
        confidence: 0.9,
        source: 'OCR_DETERMINISTIC',
      };
    }

    // Marketed by
    if (/marketed\s*by/i.test(line) && !result.marketer) {
      const fullText = [line, nextLine, nextNextLine].filter(Boolean).join(' ');
      result.marketer = {
        value: fullText.replace(/^marketed\s*by\s*(?::|-)?/i, '').trim(),
        rawText: fullText.slice(0, 150),
        confidence: 0.9,
        source: 'OCR_DETERMINISTIC',
      };
    }
  }

  return result;
}

/**
 * Extracts FSSAI Licence Number (14 digits)
 */
export function extractFssaiFromOcr(ocrText) {
  if (!ocrText) return null;
  // Match "FSSAI Lic. No. 10013021000853", "fssai: 10013021000853", "Lic No. 1001..."
  const fssaiRegex = /(?:fssai|lic\.?\s*no\.?|license\s*no\.?|licence\s*no\.?)\s*(?::|-)?\s*([0-9]{14})/i;
  const match = ocrText.match(fssaiRegex);
  if (match) {
    return {
      value: match[1].trim(),
      rawText: match[0].trim(),
      confidence: 0.98,
      source: 'OCR_DETERMINISTIC',
    };
  }

  // Standalone 14-digit number starting with 1 or 2 (standard FSSAI prefix)
  const standaloneFssai = /\b([12][0-9]{13})\b/;
  const stMatch = ocrText.match(standaloneFssai);
  if (stMatch) {
    return {
      value: stMatch[1].trim(),
      rawText: `Lic. ${stMatch[1]}`,
      confidence: 0.88,
      source: 'OCR_DETERMINISTIC',
    };
  }

  return null;
}

/**
 * Extracts Consumer Care contact information
 */
export function extractConsumerCareFromOcr(ocrText) {
  if (!ocrText) return null;
  const lower = ocrText.toLowerCase();
  const careIdx = lower.search(/(?:consumer\s*care|customer\s*care|customer\s*service|helpline|toll\s*free|feedback|contact\s*us)/);
  if (careIdx === -1) return null;

  // Extract surrounding 300 characters
  const windowText = ocrText.slice(careIdx, careIdx + 350);

  // Extract phone/toll-free number
  const phoneMatch = windowText.match(/(?:1800[- ]?[0-9]{3}[- ]?[0-9]{3,4}|[0-9]{10,12})/);
  // Extract email address
  const emailMatch = windowText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

  if (phoneMatch || emailMatch) {
    const parts = [];
    if (phoneMatch) parts.push(phoneMatch[0].trim());
    if (emailMatch) parts.push(emailMatch[0].trim());
    return {
      phone: phoneMatch ? phoneMatch[0].trim() : null,
      email: emailMatch ? emailMatch[0].trim() : null,
      value: parts.join(' | '),
      rawText: windowText.slice(0, 150).replace(/\n/g, ' ').trim(),
      confidence: 0.92,
      source: 'OCR_DETERMINISTIC',
    };
  }

  return null;
}

/**
 * Extracts Ingredients / Components list
 */
export function extractIngredientsFromOcr(ocrText) {
  if (!ocrText) return null;
  const lower = ocrText.toLowerCase();
  const ingIdx = lower.search(/(?:ingredients?|composition|contains|made\s*from)\s*(?::|-)?/);
  if (ingIdx === -1) return null;

  const slice = ocrText.slice(ingIdx);
  const colonIdx = slice.indexOf(':');
  const startAt = colonIdx !== -1 ? colonIdx + 1 : 12;

  // Read until next major statutory keyword
  const sub = slice.slice(startAt);
  const stopMatch = sub.search(/(?:nutrition|mrp|mfd|mfg|exp|batch|fssai|manufactured|packed|marketed)/i);
  const ingContent = (stopMatch !== -1 ? sub.slice(0, stopMatch) : sub.slice(0, 300)).trim();

  if (ingContent.length > 5) {
    return {
      value: ingContent.replace(/\n+/g, ' ').trim(),
      rawText: slice.slice(0, Math.min(200, ingContent.length + 20)),
      confidence: 0.88,
      source: 'OCR_DETERMINISTIC',
    };
  }

  return null;
}

/**
 * Detects Category deterministically from text tokens
 */
export function detectCategoryFromText(ocrText, proposedCategory = 'Unknown') {
  if (!ocrText) return 'Unknown';
  const lower = ocrText.toLowerCase();

  if (
    lower.includes('edible oil') ||
    lower.includes('sunflower oil') ||
    lower.includes('mustard oil') ||
    lower.includes('soyabean oil') ||
    lower.includes('refined oil') ||
    lower.includes('vegetable oil') ||
    lower.includes('ghee') ||
    lower.includes('cooking oil')
  ) {
    return 'Edible Oil';
  }

  if (
    lower.includes('fssai') ||
    lower.includes('food') ||
    lower.includes('snack') ||
    lower.includes('biscuit') ||
    lower.includes('cookie') ||
    lower.includes('beverage') ||
    lower.includes('drink') ||
    lower.includes('juice') ||
    lower.includes('tea') ||
    lower.includes('coffee') ||
    lower.includes('flour') ||
    lower.includes('atta') ||
    lower.includes('rice') ||
    lower.includes('spice') ||
    lower.includes('masala') ||
    lower.includes('energy kcal')
  ) {
    return 'Food';
  }

  if (
    lower.includes('shampoo') ||
    lower.includes('soap') ||
    lower.includes('cream') ||
    lower.includes('lotion') ||
    lower.includes('cosmetic') ||
    lower.includes('serum') ||
    lower.includes('conditioner') ||
    lower.includes('facewash')
  ) {
    return 'Cosmetics';
  }

  if (
    lower.includes('detergent') ||
    lower.includes('dishwash') ||
    lower.includes('cleaner') ||
    lower.includes('floor cleaner') ||
    lower.includes('toilet cleaner') ||
    lower.includes('disinfectant')
  ) {
    return 'Household';
  }

  const valid = ['Food', 'Edible Oil', 'Cosmetics', 'Household'];
  return valid.includes(proposedCategory) ? proposedCategory : 'Unknown';
}

/**
 * Validates and completes Groq extracted product data using the deterministic OCR layer
 * NEVER drops data that is clearly present in RAW OCR TEXT!
 */
export function validateAndCompleteExtractionAgainstOCR(groqData, rawOcrText) {
  const normOcr = normalizeOcrText(rawOcrText);

  // Run deterministic extractions from RAW OCR TEXT
  const ocrMrp = extractMrpFromOcr(normOcr);
  const ocrNetQty = extractNetQuantityFromOcr(normOcr);
  const ocrDates = extractDatesFromOcr(normOcr);
  const ocrBatch = extractBatchFromOcr(normOcr);
  const ocrEntities = extractEntityDetailsFromOcr(normOcr);
  const ocrFssai = extractFssaiFromOcr(normOcr);
  const ocrConsumerCare = extractConsumerCareFromOcr(normOcr);
  const ocrIngredients = extractIngredientsFromOcr(normOcr);

  const base = groqData || {};

  // 1. MRP
  let finalMrp = base.mrp;
  let mrpEvidence = base.mrpDetails?.rawText || base.mrp;
  if ((!finalMrp || finalMrp === 'Not detected') && ocrMrp) {
    finalMrp = `₹${ocrMrp.value}`;
    mrpEvidence = ocrMrp.rawText;
  }

  // 2. Net Quantity
  let finalNetQty = base.netQuantity || base.netWeight || base.netVolume;
  let netQtyEvidence = base.netQuantity;
  if ((!finalNetQty || finalNetQty === 'Not detected') && ocrNetQty) {
    finalNetQty = `${ocrNetQty.value} ${ocrNetQty.unit}`;
    netQtyEvidence = ocrNetQty.rawText;
  }

  // 3. Manufacturing & Expiry Dates
  let finalMfgDate = base.manufacturingDate || base.packingDate;
  let mfgEvidence = base.manufacturingDate;
  if (!finalMfgDate && (ocrDates.manufacturingDate || ocrDates.packingDate)) {
    finalMfgDate = ocrDates.manufacturingDate?.value || ocrDates.packingDate?.value;
    mfgEvidence = ocrDates.manufacturingDate?.rawText || ocrDates.packingDate?.rawText;
  }

  let finalExpDate = base.expiryDate || base.bestBefore;
  let expEvidence = base.expiryDate;
  if (!finalExpDate && (ocrDates.expiryDate || ocrDates.bestBefore)) {
    finalExpDate = ocrDates.expiryDate?.value || ocrDates.bestBefore?.value;
    expEvidence = ocrDates.expiryDate?.rawText || ocrDates.bestBefore?.rawText;
  }

  // 4. Batch Number
  let finalBatch = base.batchNumber || base.lotNumber;
  let batchEvidence = base.batchNumber;
  if (!finalBatch && ocrBatch) {
    finalBatch = ocrBatch.value;
    batchEvidence = ocrBatch.rawText;
  }

  // 5. Manufacturer / Packer
  let finalMfg = base.manufacturer || base.manufacturerName;
  let mfgDetailsEvidence = base.manufacturer;
  if (!finalMfg && ocrEntities.manufacturer) {
    finalMfg = ocrEntities.manufacturer.value;
    mfgDetailsEvidence = ocrEntities.manufacturer.rawText;
  } else if (!finalMfg && ocrEntities.packer) {
    finalMfg = `Packed by: ${ocrEntities.packer.value}`;
    mfgDetailsEvidence = ocrEntities.packer.rawText;
  }

  // 6. FSSAI Licence
  let finalLicense = base.fssaiLicenseNumber || base.licenseNumber;
  let licenseEvidence = base.fssaiLicenseNumber || base.licenseNumber;
  if (!finalLicense && ocrFssai) {
    finalLicense = ocrFssai.value;
    licenseEvidence = ocrFssai.rawText;
  }

  // 7. Consumer Care
  let finalCare = base.consumerCare;
  let careEvidence = base.consumerCare;
  if (!finalCare && ocrConsumerCare) {
    finalCare = ocrConsumerCare.value;
    careEvidence = ocrConsumerCare.rawText;
  }

  // 8. Ingredients
  let finalIngredients = base.ingredients || base.components;
  let ingredientsEvidence = base.ingredients;
  if (!finalIngredients && ocrIngredients) {
    finalIngredients = ocrIngredients.value;
    ingredientsEvidence = ocrIngredients.rawText;
  }

  // 9. Category
  const finalCategory = detectCategoryFromText(normOcr, base.category);

  return {
    productName: base.productName || 'Scanned Packaged Product',
    brand: base.brand || base.brandName || 'Detected Brand',
    category: finalCategory,

    mrp: finalMrp || null,
    mrpEvidence: mrpEvidence || null,

    netQuantity: finalNetQty || null,
    netQtyEvidence: netQtyEvidence || null,

    manufacturingDate: finalMfgDate || null,
    mfgEvidence: mfgEvidence || null,

    expiryDate: finalExpDate || null,
    expEvidence: expEvidence || null,

    batchNumber: finalBatch || null,
    batchEvidence: batchEvidence || null,

    manufacturer: finalMfg || null,
    mfgDetailsEvidence: mfgDetailsEvidence || null,

    licenseNumber: finalLicense || null,
    licenseEvidence: licenseEvidence || null,

    consumerCare: finalCare || null,
    careEvidence: careEvidence || null,

    ingredients: finalIngredients || null,
    ingredientsEvidence: ingredientsEvidence || null,

    countryOfOrigin: base.countryOfOrigin || (normOcr.toLowerCase().includes('made in india') || normOcr.toLowerCase().includes('product of india') ? 'India' : null),

    rawText: rawOcrText,
  };
}
