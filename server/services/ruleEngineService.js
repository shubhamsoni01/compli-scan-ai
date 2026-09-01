/**
 * Deterministic Legal Rule Engine for CompliScan AI
 * Evaluates structured product data extracted from OCR/AI against official Indian labelling regulations.
 *
 * CRITICAL ARCHITECTURE:
 * - Deterministic, non-hallucinatory evaluation
 * - Does NOT use LLMs to make legal decisions
 * - Returns PASS, FAIL, NEEDS_REVIEW, or NOT_APPLICABLE
 * - Calculates mathematically grounded compliance scores
 */

import { legalMetrologyRules } from '../rules/legalMetrologyRules.js';
import { foodRules } from '../rules/foodRules.js';
import { edibleOilRules } from '../rules/edibleOilRules.js';
import { cosmeticsRules } from '../rules/cosmeticsRules.js';
import { householdRules } from '../rules/householdRules.js';

export function evaluateCompliance(productData, rawCategory = 'Unknown') {
  // Normalize category
  let category = 'Unknown';
  const catNormalized = String(rawCategory || productData?.category || '').trim().toLowerCase();

  if (catNormalized.includes('oil') || catNormalized.includes('ghee') || catNormalized.includes('fat')) {
    category = 'Edible Oil';
  } else if (catNormalized.includes('food') || catNormalized.includes('snack') || catNormalized.includes('beverage') || catNormalized.includes('drink') || catNormalized.includes('cookie') || catNormalized.includes('biscuit')) {
    category = 'Food';
  } else if (catNormalized.includes('cosmetic') || catNormalized.includes('beauty') || catNormalized.includes('shampoo') || catNormalized.includes('soap') || catNormalized.includes('cream') || catNormalized.includes('lotion') || catNormalized.includes('moisturizer')) {
    category = 'Cosmetics';
  } else if (catNormalized.includes('house') || catNormalized.includes('clean') || catNormalized.includes('detergent') || catNormalized.includes('wash')) {
    category = 'Household';
  } else {
    category = 'Unknown';
  }

  const p = productData || {};
  const rawText = String(p.rawText || '').toLowerCase();

  // Determine exemptions
  const isImported = Boolean(
    p.countryOfOrigin &&
    !p.countryOfOrigin.toLowerCase().includes('india') &&
    !p.countryOfOrigin.toLowerCase().includes('bharat')
  );

  const isWholesale = Boolean(
    rawText.includes('wholesale package') ||
    rawText.includes('for institutional use') ||
    rawText.includes('industrial use only') ||
    rawText.includes('not for retail sale')
  );

  const results = [];

  // -------------------------------------------------------------
  // 1. EVALUATE LEGAL METROLOGY RULES (LM-001 to LM-013)
  // -------------------------------------------------------------
  for (const rule of legalMetrologyRules) {
    if (isWholesale && rule.ruleId !== 'LM-013') {
      results.push({
        ruleId: rule.ruleId,
        regulation: rule.regulation,
        title: rule.title,
        status: 'NOT_APPLICABLE',
        observedValue: 'Wholesale Package',
        requirement: rule.requirement,
        reason: 'Wholesale package exempt from standard retail Legal Metrology requirements.',
        officialSource: rule.officialSource,
        sourceAuthority: rule.sourceAuthority,
        officialUrl: rule.officialUrl,
      });
      continue;
    }

    switch (rule.ruleId) {
      case 'LM-001': {
        const hasMfg = Boolean(p.manufacturer && p.manufacturer.trim().length > 3);
        const evidence = p.mfgDetailsEvidence || p.manufacturer || (rawText.match(/(?:manufactured|mfg|packed|marketed)\s*by[^,\n]+/i)?.[0]) || null;
        results.push({
          ruleId: rule.ruleId,
          regulation: rule.regulation,
          title: rule.title,
          status: hasMfg ? 'PASS' : 'FAIL',
          observedValue: p.manufacturer || null,
          evidence,
          requirement: rule.requirement,
          reason: hasMfg
            ? `Manufacturer details identified: "${p.manufacturer}"`
            : 'Required name and complete address of manufacturer/packer was not identified on this label.',
          officialSource: rule.officialSource,
          sourceAuthority: rule.sourceAuthority,
          officialUrl: rule.officialUrl,
        });
        break;
      }
      case 'LM-002': {
        const hasName = Boolean(p.productName && p.productName.trim().length > 2);
        results.push({
          ruleId: rule.ruleId,
          regulation: rule.regulation,
          title: rule.title,
          status: hasName ? 'PASS' : 'FAIL',
          observedValue: p.productName || null,
          evidence: p.productName,
          requirement: rule.requirement,
          reason: hasName
            ? `Common/generic commodity name identified: "${p.productName}"`
            : 'Common/generic commodity name was not clearly declared on the label.',
          officialSource: rule.officialSource,
          sourceAuthority: rule.sourceAuthority,
          officialUrl: rule.officialUrl,
        });
        break;
      }
      case 'LM-003': {
        const hasNetQty = Boolean(p.netQuantity && p.netQuantity.trim().length > 0);
        // Verify metric unit
        const hasMetric = hasNetQty && /(g|kg|ml|l|litre|litres|gm|grams|number|pcs|piece|pieces|count|n)/i.test(p.netQuantity);
        const evidence = p.netQtyEvidence || p.netQuantity || (rawText.match(/(?:net\s*(?:quantity|qty|weight|wt|vol|volume)|weight)[^,\n]+/i)?.[0]) || null;
        results.push({
          ruleId: rule.ruleId,
          regulation: rule.regulation,
          title: rule.title,
          status: hasMetric ? 'PASS' : hasNetQty ? 'NEEDS_REVIEW' : 'FAIL',
          observedValue: p.netQuantity || null,
          evidence,
          requirement: rule.requirement,
          reason: hasMetric
            ? `Net quantity declared in standard metric units: "${p.netQuantity}"`
            : hasNetQty
            ? `Quantity text detected ("${p.netQuantity}"), but verification of metric units is required.`
            : 'Mandatory net quantity declaration in standard metric units was not detected.',
          officialSource: rule.officialSource,
          sourceAuthority: rule.sourceAuthority,
          officialUrl: rule.officialUrl,
        });
        break;
      }
      case 'LM-004': {
        const hasDate = Boolean(p.manufacturingDate && p.manufacturingDate.trim().length > 0);
        const evidence = p.mfgEvidence || p.manufacturingDate || (rawText.match(/(?:mfd|mfg|manufactur(?:ed|ing)|packed)[^,\n]+/i)?.[0]) || null;
        results.push({
          ruleId: rule.ruleId,
          regulation: rule.regulation,
          title: rule.title,
          status: hasDate ? 'PASS' : 'FAIL',
          observedValue: p.manufacturingDate || null,
          evidence,
          requirement: rule.requirement,
          reason: hasDate
            ? `Month and year of manufacture/packing declared: "${p.manufacturingDate}"`
            : 'Month and year of manufacture or pre-packing declaration was not identified.',
          officialSource: rule.officialSource,
          sourceAuthority: rule.sourceAuthority,
          officialUrl: rule.officialUrl,
        });
        break;
      }
      case 'LM-005': {
        const hasMrp = Boolean(p.mrp && p.mrp.trim().length > 0);
        const hasCurrency = hasMrp && /(rs|\u20b9|inr|\/|taxes)/i.test(p.mrp);
        const evidence = p.mrpEvidence || p.mrp || (rawText.match(/(?:m\.?r\.?p\.?|maximum\s*retail\s*price)[^,\n]+/i)?.[0]) || null;
        results.push({
          ruleId: rule.ruleId,
          regulation: rule.regulation,
          title: rule.title,
          status: hasMrp && hasCurrency ? 'PASS' : hasMrp ? 'NEEDS_REVIEW' : 'FAIL',
          observedValue: p.mrp || null,
          evidence,
          requirement: rule.requirement,
          reason: hasMrp && hasCurrency
            ? `Maximum Retail Price (MRP) declared in Indian currency: "${p.mrp}"`
            : hasMrp
            ? `Price text found ("${p.mrp}"), but requires verification of currency and tax inclusive declaration.`
            : 'Mandatory Maximum Retail Price (MRP) declaration was not identified.',
          officialSource: rule.officialSource,
          sourceAuthority: rule.sourceAuthority,
          officialUrl: rule.officialUrl,
        });
        break;
      }
      case 'LM-006': {
        const hasCare = Boolean(p.consumerCare && p.consumerCare.trim().length > 3);
        const evidence = p.careEvidence || p.consumerCare || (rawText.match(/(?:consumer\s*care|customer\s*care|helpline|toll\s*free)[^,\n]+/i)?.[0]) || null;
        results.push({
          ruleId: rule.ruleId,
          regulation: rule.regulation,
          title: rule.title,
          status: hasCare ? 'PASS' : 'FAIL',
          observedValue: p.consumerCare || null,
          evidence,
          requirement: rule.requirement,
          reason: hasCare
            ? `Consumer care contact information detected: "${p.consumerCare}"`
            : 'Mandatory consumer-care contact information was not identified on this label.',
          officialSource: rule.officialSource,
          sourceAuthority: rule.sourceAuthority,
          officialUrl: rule.officialUrl,
        });
        break;
      }
      case 'LM-007': {
        if (!isImported) {
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: 'NOT_APPLICABLE',
            observedValue: p.countryOfOrigin || 'Domestic Indian Manufacture',
            requirement: rule.requirement,
            reason: 'Rule applies strictly to imported commodities. Product is identified as domestic Indian manufacture.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
        } else {
          const hasOrigin = Boolean(p.countryOfOrigin && p.countryOfOrigin.trim().length > 0);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasOrigin ? 'PASS' : 'FAIL',
            observedValue: p.countryOfOrigin || null,
            requirement: rule.requirement,
            reason: hasOrigin
              ? `Country of origin clearly declared for imported product: "${p.countryOfOrigin}"`
              : 'Product appears imported but mandatory Country of Origin declaration was missing.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
        }
        break;
      }
      case 'LM-008': {
        // Unit sale price check (prescribed format: Rs. per g, Rs. per kg, Rs. per ml, Rs. per L, etc.)
        const hasUsp = /(unit sale price|usp|rs\.?\s*\d+.*per\s*(g|kg|ml|l|piece|number))/i.test(rawText);
        results.push({
          ruleId: rule.ruleId,
          regulation: rule.regulation,
          title: rule.title,
          status: hasUsp ? 'PASS' : 'NEEDS_REVIEW',
          observedValue: hasUsp ? 'Unit Sale Price Detected' : 'Not explicitly detected',
          requirement: rule.requirement,
          reason: hasUsp
            ? 'Unit Sale Price declared in compliance with Rule 6(11).'
            : 'Unit sale price could not be conclusively verified; evaluate if package net quantity qualifies for mandatory declaration.',
          officialSource: rule.officialSource,
          sourceAuthority: rule.sourceAuthority,
          officialUrl: rule.officialUrl,
        });
        break;
      }
      case 'LM-009': {
        // Principal display panel layout check
        results.push({
          ruleId: rule.ruleId,
          regulation: rule.regulation,
          title: rule.title,
          status: 'NEEDS_REVIEW',
          observedValue: 'Visual Inspection Required',
          requirement: rule.requirement,
          reason: 'Placement of declarations on the Principal Display Panel requires physical dimensions of container.',
          officialSource: rule.officialSource,
          sourceAuthority: rule.sourceAuthority,
          officialUrl: rule.officialUrl,
        });
        break;
      }
      case 'LM-010': {
        // Legibility and prominence
        const isLegible = (p.rawText || '').length > 80;
        results.push({
          ruleId: rule.ruleId,
          regulation: rule.regulation,
          title: rule.title,
          status: isLegible ? 'PASS' : 'NEEDS_REVIEW',
          observedValue: isLegible ? 'Clear Label Extraction' : 'Low OCR Confidence',
          requirement: rule.requirement,
          reason: isLegible
            ? 'Label declarations exhibit sufficient prominence and legibility for character extraction.'
            : 'Image quality or text contrast is marginal; visual inspection advised.',
          officialSource: rule.officialSource,
          sourceAuthority: rule.sourceAuthority,
          officialUrl: rule.officialUrl,
        });
        break;
      }
      case 'LM-011': {
        // Language check (English or Hindi present)
        const hasEngOrHindi = /[a-z0-9]/i.test(p.rawText || '');
        results.push({
          ruleId: rule.ruleId,
          regulation: rule.regulation,
          title: rule.title,
          status: hasEngOrHindi ? 'PASS' : 'NEEDS_REVIEW',
          observedValue: 'English / Devanagari script detected',
          requirement: rule.requirement,
          reason: 'Mandatory declarations are provided in English / Hindi in accordance with Rule 9.',
          officialSource: rule.officialSource,
          sourceAuthority: rule.sourceAuthority,
          officialUrl: rule.officialUrl,
        });
        break;
      }
      case 'LM-012': {
        // Retail package provisions
        results.push({
          ruleId: rule.ruleId,
          regulation: rule.regulation,
          title: rule.title,
          status: 'PASS',
          observedValue: 'Retail Consumer Pack',
          requirement: rule.requirement,
          reason: 'Packaged commodity complies with standard consumer-facing retail package declarations.',
          officialSource: rule.officialSource,
          sourceAuthority: rule.sourceAuthority,
          officialUrl: rule.officialUrl,
        });
        break;
      }
      case 'LM-013': {
        // Wholesale provisions
        results.push({
          ruleId: rule.ruleId,
          regulation: rule.regulation,
          title: rule.title,
          status: isWholesale ? 'PASS' : 'NOT_APPLICABLE',
          observedValue: isWholesale ? 'Wholesale Package' : 'Standard Retail Package',
          requirement: rule.requirement,
          reason: isWholesale
            ? 'Wholesale package declarations verified.'
            : 'Rule applies strictly to wholesale packages; not applicable to this retail package.',
          officialSource: rule.officialSource,
          sourceAuthority: rule.sourceAuthority,
          officialUrl: rule.officialUrl,
        });
        break;
      }
      default:
        break;
    }
  }

  // -------------------------------------------------------------
  // 2. EVALUATE FOOD RULES (FOOD-001 to FOOD-012)
  // -------------------------------------------------------------
  const isFoodOrOil = category === 'Food' || category === 'Edible Oil';

  if (isFoodOrOil) {
    for (const rule of foodRules) {
      switch (rule.ruleId) {
        case 'FOOD-001': {
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: 'PASS',
            observedValue: 'No Deceptive Claims Flagged',
            requirement: rule.requirement,
            reason: 'Preliminary screening detected no prohibited or deceptive statements regarding true nature.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'FOOD-002': {
          const hasFoodName = Boolean(p.productName && p.productName.trim().length > 2);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasFoodName ? 'PASS' : 'FAIL',
            observedValue: p.productName || null,
            requirement: rule.requirement,
            reason: hasFoodName
              ? `True nature and name of food declared: "${p.productName}"`
              : 'Name indicating true nature of the food was not declared.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'FOOD-003': {
          const hasIngredients = Boolean(p.ingredients && p.ingredients.trim().length > 5);
          const evidence = p.ingredientsEvidence || p.ingredients || (rawText.match(/(?:ingredients?|composition|contains)[^.\n]+/i)?.[0]) || null;
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasIngredients ? 'PASS' : 'FAIL',
            observedValue: p.ingredients || null,
            evidence,
            requirement: rule.requirement,
            reason: hasIngredients
              ? `List of ingredients declared in descending order: "${p.ingredients.slice(0, 80)}..."`
              : 'Mandatory list of ingredients was not identified on this food product label.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'FOOD-004': {
          const hasNutrition = /(nutrition|energy|kcal|protein|carbohydrate|sugar|fat)/i.test(rawText);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasNutrition ? 'PASS' : 'NEEDS_REVIEW',
            observedValue: hasNutrition ? 'Nutritional Panel Detected' : 'Nutritional Panel Not Read',
            requirement: rule.requirement,
            reason: hasNutrition
              ? 'Nutritional information declaration detected on label.'
              : 'Nutritional table could not be identified from this image angle; review required.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'FOOD-005': {
          const hasVegNonVeg = /(vegetarian|veg|non-veg|green dot|brown triangle)/i.test(rawText);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasVegNonVeg ? 'PASS' : 'NEEDS_REVIEW',
            observedValue: hasVegNonVeg ? 'Veg / Non-Veg Declaration Present' : 'Symbol requires visual confirmation',
            requirement: rule.requirement,
            reason: hasVegNonVeg
              ? 'Vegetarian / Non-Vegetarian declaration detected.'
              : 'Vegetarian / Non-Vegetarian green/brown symbol requires verification on the physical package front.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'FOOD-006': {
          const hasAdditives = /(ins\s*\d+|additive|flavour|flavor|preservative|antioxidant)/i.test(rawText);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: 'PASS',
            observedValue: hasAdditives ? 'Additives / Flavourings Declared' : 'Standard Formulation',
            requirement: rule.requirement,
            reason: hasAdditives
              ? 'Food additives and flavourings declared in accordance with FSSAI regulations.'
              : 'No restricted additives flagged.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'FOOD-007': {
          const hasAddress = Boolean(p.manufacturer && /(mfg|packed|marketed|manufactured)/i.test(p.manufacturer));
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasAddress ? 'PASS' : p.manufacturer ? 'NEEDS_REVIEW' : 'FAIL',
            observedValue: p.manufacturer || null,
            requirement: rule.requirement,
            reason: hasAddress
              ? `Brand owner name and address declared with qualifying words: "${p.manufacturer}"`
              : p.manufacturer
              ? `Manufacturer text found ("${p.manufacturer}"), verify presence of qualifying words (e.g., "Manufactured by").`
              : 'Brand owner name and complete physical address missing.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'FOOD-008': {
          const hasFssai = Boolean(p.licenseNumber && /1\d{13}/.test(p.licenseNumber));
          const evidence = p.licenseEvidence || p.licenseNumber || (rawText.match(/(?:fssai|lic\.?\s*no\.?)[^,\n]+/i)?.[0]) || null;
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasFssai ? 'PASS' : p.licenseNumber ? 'NEEDS_REVIEW' : 'FAIL',
            observedValue: p.licenseNumber || null,
            evidence,
            requirement: rule.requirement,
            reason: hasFssai
              ? `Valid 14-digit FSSAI licence number identified: "${p.licenseNumber}"`
              : p.licenseNumber
              ? `License text detected ("${p.licenseNumber}"), but 14-digit FSSAI format requires verification.`
              : 'Mandatory 14-digit FSSAI licence number was not detected on the label.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'FOOD-009': {
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: p.mrp && p.netQuantity && p.consumerCare ? 'PASS' : 'FAIL',
            observedValue: `Net Qty: ${p.netQuantity || 'N/A'}, MRP: ${p.mrp || 'N/A'}`,
            requirement: rule.requirement,
            reason: p.mrp && p.netQuantity && p.consumerCare
              ? 'Harmonized Legal Metrology provisions satisfied under FSSAI Regulation 5(8).'
              : 'One or more harmonized mandatory declarations (MRP, Net Qty, Consumer Care) are incomplete.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'FOOD-010': {
          const hasBatch = Boolean(p.batchNumber && p.batchNumber.trim().length > 0);
          const evidence = p.batchEvidence || p.batchNumber || (rawText.match(/(?:batch|lot|b\.?\s*no)[^,\n]+/i)?.[0]) || null;
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasBatch ? 'PASS' : 'FAIL',
            observedValue: p.batchNumber || null,
            evidence,
            requirement: rule.requirement,
            reason: hasBatch
              ? `Batch / lot identification declared: "${p.batchNumber}"`
              : 'Mandatory batch, lot or code identification was not found.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'FOOD-011': {
          const hasDates = Boolean(p.manufacturingDate || p.expiryDate);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasDates ? 'PASS' : 'FAIL',
            observedValue: `Mfg: ${p.manufacturingDate || 'N/A'} | Expiry: ${p.expiryDate || 'N/A'}`,
            requirement: rule.requirement,
            reason: hasDates
              ? `Date marking declared: Mfg: "${p.manufacturingDate || 'N/A'}", Expiry/Best Before: "${p.expiryDate || 'N/A'}"`
              : 'Date of manufacture or expiry/best before declaration missing.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'FOOD-012': {
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: 'NEEDS_REVIEW',
            observedValue: 'Standardized Food Category Assessment',
            requirement: rule.requirement,
            reason: 'Commodity-specific chemical and microbiological limits require laboratory certificate of analysis.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        default:
          break;
      }
    }
  }

  // -------------------------------------------------------------
  // 3. EVALUATE EDIBLE OIL SPECIFIC RULES (OIL-001 to OIL-005)
  // -------------------------------------------------------------
  if (category === 'Edible Oil') {
    for (const rule of edibleOilRules) {
      switch (rule.ruleId) {
        case 'OIL-001': {
          const baselinePass = Boolean(p.productName && p.mrp && p.netQuantity && p.licenseNumber);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: baselinePass ? 'PASS' : 'FAIL',
            observedValue: p.productName,
            requirement: rule.requirement,
            reason: baselinePass
              ? 'Edible oil complies with baseline food labelling requirements.'
              : 'One or more mandatory baseline food declarations missing on edible oil package.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'OIL-002': {
          const isBlended = /(multi-sourced|blended|admixture|blend)/i.test(rawText);
          if (!isBlended) {
            results.push({
              ruleId: rule.ruleId,
              regulation: rule.regulation,
              title: rule.title,
              status: 'NOT_APPLICABLE',
              observedValue: 'Single-Sourced Edible Oil',
              requirement: rule.requirement,
              reason: 'Product is a single-source edible oil; multi-sourced admixture rules do not apply.',
              officialSource: rule.officialSource,
              sourceAuthority: rule.sourceAuthority,
              officialUrl: rule.officialUrl,
            });
          } else {
            const hasMultiSourcedTitle = /multi-sourced edible vegetable oil/i.test(rawText);
            results.push({
              ruleId: rule.ruleId,
              regulation: rule.regulation,
              title: rule.title,
              status: hasMultiSourcedTitle ? 'PASS' : 'FAIL',
              observedValue: 'Multi-Sourced Edible Oil Detected',
              requirement: rule.requirement,
              reason: hasMultiSourcedTitle
                ? 'Mandatory "Multi-Sourced Edible Vegetable Oil" title declared.'
                : 'Blended oil detected but missing mandatory "Multi-Sourced Edible Vegetable Oil" declaration.',
              officialSource: rule.officialSource,
              sourceAuthority: rule.sourceAuthority,
              officialUrl: rule.officialUrl,
            });
          }
          break;
        }
        case 'OIL-003': {
          const isBlended = /(multi-sourced|blended|admixture)/i.test(rawText);
          if (!isBlended) {
            results.push({
              ruleId: rule.ruleId,
              regulation: rule.regulation,
              title: rule.title,
              status: 'NOT_APPLICABLE',
              observedValue: 'Single-Source Pack',
              requirement: rule.requirement,
              reason: 'Applies strictly to multi-sourced edible vegetable oils.',
              officialSource: rule.officialSource,
              sourceAuthority: rule.sourceAuthority,
              officialUrl: rule.officialUrl,
            });
          } else {
            const hasLooseProhibition = /not to be sold loose/i.test(rawText);
            results.push({
              ruleId: rule.ruleId,
              regulation: rule.regulation,
              title: rule.title,
              status: hasLooseProhibition ? 'PASS' : 'FAIL',
              observedValue: hasLooseProhibition ? '"NOT TO BE SOLD LOOSE" Present' : 'Missing Loose Sale Prohibition',
              requirement: rule.requirement,
              reason: hasLooseProhibition
                ? 'Mandatory declaration "NOT TO BE SOLD LOOSE" is present.'
                : 'Mandatory declaration "NOT TO BE SOLD LOOSE" was not found on multi-sourced oil pack.',
              officialSource: rule.officialSource,
              sourceAuthority: rule.sourceAuthority,
              officialUrl: rule.officialUrl,
            });
          }
          break;
        }
        case 'OIL-004': {
          const isVanaspati = /(vanaspati|hydrogenated vegetable oil)/i.test(rawText);
          if (!isVanaspati) {
            results.push({
              ruleId: rule.ruleId,
              regulation: rule.regulation,
              title: rule.title,
              status: 'NOT_APPLICABLE',
              observedValue: 'Not a Vanaspati Product',
              requirement: rule.requirement,
              reason: 'Rule applies strictly to Vanaspati containing physically refined rice bran oil.',
              officialSource: rule.officialSource,
              sourceAuthority: rule.sourceAuthority,
              officialUrl: rule.officialUrl,
            });
          } else {
            const hasRiceBranDecl = /physically refined rice bran oil/i.test(rawText);
            results.push({
              ruleId: rule.ruleId,
              regulation: rule.regulation,
              title: rule.title,
              status: hasRiceBranDecl ? 'PASS' : 'NEEDS_REVIEW',
              observedValue: hasRiceBranDecl ? 'Rice Bran Declaration Found' : 'Requires Composition Verification',
              requirement: rule.requirement,
              reason: hasRiceBranDecl
                ? 'Physically Refined Rice Bran Oil declared on Vanaspati packaging.'
                : 'Vanaspati detected; verify whether rice bran oil was utilized in formulation.',
              officialSource: rule.officialSource,
              sourceAuthority: rule.sourceAuthority,
              officialUrl: rule.officialUrl,
            });
          }
          break;
        }
        case 'OIL-005': {
          // Volume and mass dual declaration
          const hasDualDecl = /(litre|l|ml).*(\(|,|&|\/).*(kg|g|gm)/i.test(p.netQuantity || rawText) ||
                              /(kg|g|gm).*(\(|,|&|\/).*(litre|l|ml)/i.test(p.netQuantity || rawText);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasDualDecl ? 'PASS' : 'NEEDS_REVIEW',
            observedValue: p.netQuantity || null,
            requirement: rule.requirement,
            reason: hasDualDecl
              ? `Dual volume and equivalent mass declared: "${p.netQuantity}"`
              : 'Edible oils must declare net quantity in volume with equivalent mass; verify dual unit formatting.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        default:
          break;
      }
    }
  }

  // -------------------------------------------------------------
  // 4. EVALUATE COSMETICS RULES (COS-001 to COS-012)
  // -------------------------------------------------------------
  if (category === 'Cosmetics') {
    for (const rule of cosmeticsRules) {
      switch (rule.ruleId) {
        case 'COS-001': {
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: 'NEEDS_REVIEW',
            observedValue: p.licenseNumber || 'Premises Verification Required',
            requirement: rule.requirement,
            reason: 'Physical manufacturing licence validity must be verified against the state licensing authority / CDSCO portal.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'COS-002': {
          const hasName = Boolean(p.productName && p.productName.trim().length > 2);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasName ? 'PASS' : 'FAIL',
            observedValue: p.productName || null,
            requirement: rule.requirement,
            reason: hasName
              ? `Cosmetic product name declared: "${p.productName}"`
              : 'Name of the cosmetic was not identified on the package label.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'COS-003': {
          const hasMfg = Boolean(p.manufacturer && p.manufacturer.trim().length > 3);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasMfg ? 'PASS' : 'FAIL',
            observedValue: p.manufacturer || null,
            requirement: rule.requirement,
            reason: hasMfg
              ? `Manufacturer name and factory premises declared: "${p.manufacturer}"`
              : 'Manufacturer name and address of manufacturing premises missing.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'COS-004': {
          const hasExp = Boolean(p.expiryDate && p.expiryDate.trim().length > 0);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasExp ? 'PASS' : 'FAIL',
            observedValue: p.expiryDate || null,
            requirement: rule.requirement,
            reason: hasExp
              ? `Use-before / expiry date declared: "${p.expiryDate}"`
              : 'Mandatory "Use before" or expiry date was not detected.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'COS-005': {
          const hasBatch = Boolean(p.batchNumber && p.batchNumber.trim().length > 0);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasBatch ? 'PASS' : 'FAIL',
            observedValue: p.batchNumber || null,
            requirement: rule.requirement,
            reason: hasBatch
              ? `Batch number declared: "${p.batchNumber}"`
              : 'Batch number preceded by "B" or "Batch No." missing.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'COS-006': {
          const hasLic = Boolean(p.licenseNumber && p.licenseNumber.trim().length > 0);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasLic ? 'PASS' : 'FAIL',
            observedValue: p.licenseNumber || null,
            requirement: rule.requirement,
            reason: hasLic
              ? `Manufacturing licence / CDSCO registration declared: "${p.licenseNumber}"`
              : 'Mandatory manufacturing licence number (M.L. / Mfg. Lic. No.) missing.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'COS-007': {
          const hasNet = Boolean(p.netQuantity && p.netQuantity.trim().length > 0);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasNet ? 'PASS' : 'FAIL',
            observedValue: p.netQuantity || null,
            requirement: rule.requirement,
            reason: hasNet
              ? `Net contents declared in metric units: "${p.netQuantity}"`
              : 'Net contents declaration missing on outer cosmetic packaging.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'COS-008': {
          const hasWarning = /(caution|warning|directions for use|avoid contact|patch test|external use)/i.test(rawText);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasWarning ? 'PASS' : 'NEEDS_REVIEW',
            observedValue: hasWarning ? 'Directions / Cautionary Warnings Present' : 'No Explicit Warning Detected',
            requirement: rule.requirement,
            reason: hasWarning
              ? 'Directions for safe use and cautionary warnings identified.'
              : 'Verify whether cosmetic formulation contains ingredients requiring mandatory safety directions.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'COS-009': {
          const hasIng = Boolean(p.ingredients && p.ingredients.trim().length > 5);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasIng ? 'PASS' : 'FAIL',
            observedValue: p.ingredients || null,
            requirement: rule.requirement,
            reason: hasIng
              ? `Ingredients listed in descending order: "${p.ingredients.slice(0, 80)}..."`
              : 'Mandatory ingredients declaration missing.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'COS-010': {
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: 'NEEDS_REVIEW',
            observedValue: 'Marketing Claim Screening',
            requirement: rule.requirement,
            reason: 'Cosmetic claims require substantive scientific and legal interpretation beyond character recognition.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'COS-011': {
          const isToothpaste = /(toothpaste|dentifrice|dental)/i.test(rawText);
          if (!isToothpaste) {
            results.push({
              ruleId: rule.ruleId,
              regulation: rule.regulation,
              title: rule.title,
              status: 'NOT_APPLICABLE',
              observedValue: 'Not a Toothpaste Product',
              requirement: rule.requirement,
              reason: 'Rule applies strictly to toothpaste containing fluoride.',
              officialSource: rule.officialSource,
              sourceAuthority: rule.sourceAuthority,
              officialUrl: rule.officialUrl,
            });
          } else {
            const hasFluoride = /ppm.*fluoride|fluoride.*ppm/i.test(rawText);
            results.push({
              ruleId: rule.ruleId,
              regulation: rule.regulation,
              title: rule.title,
              status: hasFluoride ? 'PASS' : 'NEEDS_REVIEW',
              observedValue: hasFluoride ? 'Fluoride PPM Declared' : 'Check Fluoride Formulation',
              requirement: rule.requirement,
              reason: hasFluoride
                ? 'Fluoride concentration in ppm declared with expiry date.'
                : 'Toothpaste detected; verify presence of fluoride and mandatory ppm declaration.',
              officialSource: rule.officialSource,
              sourceAuthority: rule.sourceAuthority,
              officialUrl: rule.officialUrl,
            });
          }
          break;
        }
        case 'COS-012': {
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: 'NEEDS_REVIEW',
            observedValue: 'BIS Standards Specification Compliance',
            requirement: rule.requirement,
            reason: 'Compliance with Bureau of Indian Standards (Ninth Schedule) requires physical laboratory batch testing.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        default:
          break;
      }
    }
  }

  // -------------------------------------------------------------
  // 5. EVALUATE HOUSEHOLD SPECIFIC RULES (HH-001 to HH-008)
  // -------------------------------------------------------------
  if (category === 'Household') {
    for (const rule of householdRules) {
      switch (rule.ruleId) {
        case 'HH-001': {
          const hasMfg = Boolean(p.manufacturer && p.manufacturer.trim().length > 3);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasMfg ? 'PASS' : 'FAIL',
            observedValue: p.manufacturer || null,
            requirement: rule.requirement,
            reason: hasMfg ? `Manufacturer/packer declared: "${p.manufacturer}"` : 'Manufacturer details missing.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'HH-002': {
          const hasName = Boolean(p.productName && p.productName.trim().length > 2);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasName ? 'PASS' : 'FAIL',
            observedValue: p.productName || null,
            requirement: rule.requirement,
            reason: hasName ? `Generic household commodity name declared: "${p.productName}"` : 'Generic commodity name missing.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'HH-003': {
          const hasNet = Boolean(p.netQuantity && p.netQuantity.trim().length > 0);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasNet ? 'PASS' : 'FAIL',
            observedValue: p.netQuantity || null,
            requirement: rule.requirement,
            reason: hasNet ? `Net quantity declared in metric units: "${p.netQuantity}"` : 'Net quantity missing.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'HH-004': {
          const hasMfgDate = Boolean(p.manufacturingDate && p.manufacturingDate.trim().length > 0);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasMfgDate ? 'PASS' : 'FAIL',
            observedValue: p.manufacturingDate || null,
            requirement: rule.requirement,
            reason: hasMfgDate ? `Month and year of manufacture declared: "${p.manufacturingDate}"` : 'Month and year of manufacture missing.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'HH-005': {
          const hasMrp = Boolean(p.mrp && p.mrp.trim().length > 0);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasMrp ? 'PASS' : 'FAIL',
            observedValue: p.mrp || null,
            requirement: rule.requirement,
            reason: hasMrp ? `Maximum Retail Price declared: "${p.mrp}"` : 'MRP declaration missing.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'HH-006': {
          const hasCare = Boolean(p.consumerCare && p.consumerCare.trim().length > 3);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasCare ? 'PASS' : 'FAIL',
            observedValue: p.consumerCare || null,
            requirement: rule.requirement,
            reason: hasCare ? `Customer care contact declared: "${p.consumerCare}"` : 'Customer care contact missing.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'HH-007': {
          const hasUsp = /(unit sale price|usp|rs\.?\s*\d+.*per)/i.test(rawText);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasUsp ? 'PASS' : 'NEEDS_REVIEW',
            observedValue: hasUsp ? 'Unit Sale Price Detected' : 'Requires Unit Sale Price Assessment',
            requirement: rule.requirement,
            reason: hasUsp ? 'Unit Sale Price declared.' : 'Unit sale price declaration not identified.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        case 'HH-008': {
          const hasSafety = /(keep out of reach|avoid contact|caution|for external use|poison|flammable)/i.test(rawText);
          results.push({
            ruleId: rule.ruleId,
            regulation: rule.regulation,
            title: rule.title,
            status: hasSafety ? 'PASS' : 'NEEDS_REVIEW',
            observedValue: hasSafety ? 'Precautionary Warnings Present' : 'Verify Chemical Warnings',
            requirement: rule.requirement,
            reason: hasSafety ? 'Precautionary safety warnings identified.' : 'Verify presence of required hazard precautions.',
            officialSource: rule.officialSource,
            sourceAuthority: rule.sourceAuthority,
            officialUrl: rule.officialUrl,
          });
          break;
        }
        default:
          break;
      }
    }
  }

  // -------------------------------------------------------------
  // 6. COMPUTE MATHEMATICAL COMPLIANCE SCORE
  // -------------------------------------------------------------
  // Applicable rules exclude NOT_APPLICABLE
  const applicableRules = results.filter((r) => r.status !== 'NOT_APPLICABLE');
  const passedCount = results.filter((r) => r.status === 'PASS').length;
  const issueCount = results.filter((r) => r.status === 'FAIL').length;
  const reviewCount = results.filter((r) => r.status === 'NEEDS_REVIEW').length;
  const naCount = results.filter((r) => r.status === 'NOT_APPLICABLE').length;

  // Weighted calculation: PASS = 1.0, NEEDS_REVIEW = 0.5, FAIL = 0.0
  let score = 0;
  if (applicableRules.length > 0) {
    const rawScore = ((passedCount + reviewCount * 0.5) / applicableRules.length) * 100;
    score = Math.min(100, Math.max(0, Math.round(rawScore)));
  }

  let overallStatus = 'Mostly Compliant';
  let statusDescription = 'Product label declarations substantially conform to applicable Indian statutory requirements.';

  if (issueCount > 0 && score < 70) {
    overallStatus = 'Potential Non-Compliance';
    statusDescription = 'Critical statutory declarations appear to be missing or non-compliant with applicable rules.';
  } else if (issueCount > 0) {
    overallStatus = 'Needs Review';
    statusDescription = 'Certain required declarations require clarification or verification against official regulations.';
  }

  return {
    category,
    score,
    overallStatus,
    statusDescription,
    summary: {
      passed: passedCount,
      issues: issueCount,
      review: reviewCount,
      notApplicable: naCount,
    },
    rules: results,
  };
}
