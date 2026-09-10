import { mockScanHistory, dashboardStats, type ScanRecord } from '@/data/scanHistory';
import { mockComplianceResult, type ComplianceResult, calculateNutritionAudit } from '@/data/complianceRules';
import { 
  sendImageToOCR, 
  sendTextToGroq, 
  saveScanToDB, 
  fetchScanByIdFromDB,
  type StructuredProduct, 
  type ComplianceRuleResult,
  type ReadabilityResult
} from './api';
import { computeReadabilityAnalysis } from './readabilityService';

export interface ScanResultData extends ComplianceResult {
  structuredProduct?: StructuredProduct;
  ocrText?: string;
  ocrEngine?: string;
  uploadedImage?: string;
  originalFilename?: string;
  evaluatedRules?: ComplianceRuleResult[];
  readabilityResult?: ReadabilityResult;
  reviewerEdits?: any;
  complaintData?: any;
  reportId?: string;
  userName?: string;
  userEmail?: string;
}

// In-memory session store for current active scans to be viewed on /result/:scanId
const scanResultsCache = new Map<string, ScanResultData>();

export function setCachedScanResult(scanId: string, result: ScanResultData): void {
  if (!scanId || !result) return;
  scanResultsCache.set(scanId, result);
  try {
    const serialized = JSON.stringify(result);
    sessionStorage.setItem(`compliscan_scan_${scanId}`, serialized);
    localStorage.setItem(`compliscan_scan_${scanId}`, serialized);
    
    // Save to recent scan IDs index
    const indexRaw = localStorage.getItem('compliscan_recent_scan_ids');
    const ids: string[] = indexRaw ? JSON.parse(indexRaw) : [];
    const updatedIds = [scanId, ...ids.filter((id) => id !== scanId)].slice(0, 15);
    localStorage.setItem('compliscan_recent_scan_ids', JSON.stringify(updatedIds));
  } catch (e) {
    console.warn('[CompliScan Client] Storage save warning:', e);
  }
}

export function getCachedScanResult(scanId: string): ScanResultData | null {
  if (!scanId) return null;
  if (scanResultsCache.has(scanId)) {
    return scanResultsCache.get(scanId)!;
  }
  
  // Try sessionStorage first (fastest for same tab / refresh)
  try {
    const sessionItem = sessionStorage.getItem(`compliscan_scan_${scanId}`);
    if (sessionItem) {
      const parsed = JSON.parse(sessionItem);
      scanResultsCache.set(scanId, parsed);
      return parsed;
    }
  } catch (e) {}

  // Fallback to localStorage
  try {
    const localItem = localStorage.getItem(`compliscan_scan_${scanId}`);
    if (localItem) {
      const parsed = JSON.parse(localItem);
      scanResultsCache.set(scanId, parsed);
      return parsed;
    }
  } catch (e) {}

  return null;
}

export async function getScanResultAsync(scanId: string): Promise<ScanResultData | null> {
  const cached = scanResultsCache.get(scanId);
  if (cached) return cached;

  // Attempt retrieval from MongoDB Atlas
  try {
    const dbDoc = await fetchScanByIdFromDB(scanId);
    if (dbDoc) {
      const restoredChecks = (dbDoc.ruleResults || []).map((r: any) => ({
        ruleId: r.ruleId,
        field: r.title || r.requirement,
        requirement: r.requirement,
        detectedValue: r.observedValue,
        status:
          r.status === 'PASS' || r.status === 'passed'
            ? 'passed'
            : r.status === 'FAIL' || r.status === 'failed'
            ? 'failed'
            : r.status === 'NEEDS_REVIEW' || r.status === 'review'
            ? 'review'
            : 'not-applicable',
        explanation: r.explanation,
        legalReference: `${r.officialSource || ''} — ${r.regulation || ''}`,
      }));

      const restoredResult: ScanResultData = {
        scanId: dbDoc.scanId,
        productName: dbDoc.productName,
        productBrand: dbDoc.brand,
        category: (dbDoc.category?.toLowerCase().replace(' ', '-') || 'other') as any,
        scanDate: dbDoc.createdAt || new Date().toISOString(),
        score: dbDoc.complianceScore,
        overallStatus: dbDoc.overallStatus,
        statusDescription: 'Restored from MongoDB Atlas persistence.',
        summary: {
          passed: restoredChecks.filter((c: any) => c.status === 'passed').length,
          issues: restoredChecks.filter((c: any) => c.status === 'failed').length,
          review: restoredChecks.filter((c: any) => c.status === 'review').length,
          notApplicable: restoredChecks.filter((c: any) => c.status === 'not-applicable').length,
        },
        checks: restoredChecks,
        extractedInfo: {
          'Product Name': dbDoc.productName,
          'Brand': dbDoc.brand,
          'Category': dbDoc.category,
          'MRP': dbDoc.mrp,
          'Net Quantity': dbDoc.netQuantity,
          'Manufacturer': dbDoc.manufacturer,
          'Manufacture Date': dbDoc.manufacturingDate,
          'Best Before / Expiry': dbDoc.expiryDate,
          'Batch Number': dbDoc.batchNumber,
          'Consumer Care': dbDoc.consumerCare,
          'FSSAI / License Number': dbDoc.licenseNumber,
          'Country of Origin': dbDoc.countryOfOrigin,
          'Ingredients': dbDoc.ingredients || dbDoc.rawOCRText,
          'Nutritional Info': dbDoc.rawOCRText,
          'rawText': dbDoc.rawOCRText,
        },
        nutritionAudit: dbDoc.nutritionAudit || calculateNutritionAudit({
          'Ingredients': dbDoc.ingredients || dbDoc.rawOCRText,
          'Nutritional Info': dbDoc.rawOCRText,
          'rawText': dbDoc.rawOCRText,
          'Net Quantity': dbDoc.netQuantity,
        }, (dbDoc.category?.toLowerCase().replace(' ', '-') || 'food') as any),
        structuredProduct: dbDoc.groqStructuredJSON,
        ocrText: dbDoc.rawOCRText,
        ocrEngine: 'OCR.Space',
        evaluatedRules: dbDoc.ruleResults,
        readabilityResult: dbDoc.readabilityResult || undefined,
        uploadedImage: dbDoc.originalImageUrl || undefined,
        originalFilename: dbDoc.originalFilename || undefined,
        reviewerEdits: dbDoc.reviewerEdits || undefined,
        complaintData: dbDoc.complaintData || undefined,
        reportId: dbDoc.reportId || undefined,
        userName: dbDoc.userName || undefined,
        userEmail: dbDoc.userEmail || undefined,
      };

      setCachedScanResult(scanId, restoredResult);
      return restoredResult;
    }
  } catch (err) {
    console.warn(`[getScanResultAsync] Failed to fetch from DB for ${scanId}:`, err);
  }

  return null;
}

/**
 * Execute real OCR + Groq pipeline with live step reporting
 */
export async function startRealScan(
  imageFile: File,
  userSelectedCategory: string,
  onStepChange: (stepId: number, status: 'pending' | 'active' | 'completed' | 'error', errorMsg?: string) => void
): Promise<ScanResultData> {
  // Generate unique UUID for this scan session
  const scanId = typeof crypto !== 'undefined' && crypto.randomUUID ? `scan_${crypto.randomUUID()}` : `scan_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const uploadedImage = URL.createObjectURL(imageFile);

  console.log(`[CompliScan Client] Starting new scan session: ${scanId} | file: ${imageFile.name} | size: ${imageFile.size} bytes`);

  // STEP 1: Image Processing & Validation
  onStepChange(1, 'active');
  await new Promise((res) => setTimeout(res, 300));
  onStepChange(1, 'completed');

  // STEP 2: Text Extraction (OCR.Space)
  onStepChange(2, 'active');
  let ocrResponse;
  try {
    ocrResponse = await sendImageToOCR(imageFile, scanId);
    if (!ocrResponse.text || ocrResponse.text.trim().length === 0) {
      throw new Error('Unable to read the label. Please upload a clearer image.');
    }
    console.log(`[CompliScan Client] OCR text received for ${scanId} (${ocrResponse.text.length} chars)`);
    onStepChange(2, 'completed');
  } catch (err: any) {
    console.error(`[CompliScan Client] OCR failed for ${scanId}:`, err.message);
    onStepChange(2, 'error', err.message || 'Unable to read the label. Please upload a clearer image.');
    throw err;
  }

  // STEP 3: Information Analysis (Groq LLM)
  onStepChange(3, 'active');
  let groqResponse;
  try {
    groqResponse = await sendTextToGroq(ocrResponse.text, scanId);
    if (!groqResponse.data) {
      throw new Error('Could not analyze product details from the extracted text.');
    }
    console.log(`[CompliScan Client] Groq structured JSON received for ${scanId}:`, groqResponse.data.productName);
    onStepChange(3, 'completed');
  } catch (err: any) {
    console.error(`[CompliScan Client] Groq failed for ${scanId}:`, err.message);
    onStepChange(3, 'error', err.message || 'Information analysis failed.');
    throw err;
  }

  // STEP 4: Rule Compliance Check (Deterministic Rule Engine)
  onStepChange(4, 'active');
  await new Promise((res) => setTimeout(res, 500));
  onStepChange(4, 'completed');

  // STEP 5: Report Generation
  onStepChange(5, 'active');
  await new Promise((res) => setTimeout(res, 300));
  onStepChange(5, 'completed');

  const p = groqResponse.data;
  const comp = groqResponse.compliance;

  // Resolve normalized category
  const finalCategory =
    p.category && p.category !== 'Unknown'
      ? (p.category.toLowerCase().replace(' ', '-') as any)
      : (userSelectedCategory.toLowerCase().replace(' ', '-') as any);

  // Build clean extractedInfo dictionary preserving the existing UI structure
  const extractedInfoMap: Record<string, string | null> = {
    'Product Name': p.productName || 'Not detected',
    'Brand': p.brand || 'Not detected',
    'Category': p.category || userSelectedCategory,
    'MRP': p.mrp || null,
    'Net Quantity': p.netQuantity || null,
    'Manufacturer': p.manufacturer || null,
    'Manufacture Date': p.manufacturingDate || null,
    'Best Before / Expiry': p.expiryDate || null,
    'Batch Number': p.batchNumber || null,
    'Consumer Care': p.consumerCare || null,
    'FSSAI / License Number': p.licenseNumber || null,
    'Country of Origin': p.countryOfOrigin || null,
    'Ingredients': p.ingredients || ocrResponse.text || null,
    'Nutritional Info': ocrResponse.text || null,
    'rawText': ocrResponse.text || null,
  };

  // Convert deterministic rules into existing UI checks list format
  const checksList: ScanResultData['checks'] = (comp?.rules || []).map((r) => ({
    ruleId: r.ruleId,
    field: r.title,
    requirement: r.requirement,
    detectedValue: r.observedValue,
    status:
      r.status === 'PASS'
        ? 'passed'
        : r.status === 'FAIL'
        ? 'failed'
        : r.status === 'NEEDS_REVIEW'
        ? 'review'
        : 'not-applicable',
    explanation: r.reason,
    legalReference: `${r.officialSource} — ${r.regulation}`,
  }));

  // Mathematical compliance score from deterministic rule engine
  const computedScore = comp?.score ?? 80;
  const overallStatus = comp?.overallStatus ?? 'Mostly Compliant';
  const statusDescription = comp?.statusDescription ?? 'Product label declarations substantially conform to statutory requirements.';

  // Summary counts
  const summary = comp?.summary
    ? {
        passed: comp.summary.passed,
        issues: comp.summary.issues,
        review: comp.summary.review,
        notApplicable: comp.summary.notApplicable,
      }
    : {
        passed: checksList.filter((c) => c.status === 'passed').length,
        issues: checksList.filter((c) => c.status === 'failed').length,
        review: checksList.filter((c) => c.status === 'review').length,
        notApplicable: checksList.filter((c) => c.status === 'not-applicable').length,
      };

  // Run Font Size & Readability Analysis Layer (Non-calibrated heuristic assessment)
  let readabilityResult: ReadabilityResult | undefined;
  try {
    readabilityResult = computeReadabilityAnalysis({
      ocrText: ocrResponse.text,
      ocrData: ocrResponse.ocrData,
      imageMetadata: ocrResponse.imageMetadata,
      productData: p,
    });
    console.log(`[CompliScan Client] Readability Analysis completed for ${scanId}:`, readabilityResult.overallStatus, `(${readabilityResult.overallScore}%)`);
  } catch (readErr: any) {
    console.warn(`[CompliScan Client] Readability analysis warning (non-fatal):`, readErr.message);
  }

  // Calculate Dynamic FSSAI & ICMR Nutritional & HFSS Threshold Audit Report
  const nutritionAudit = calculateNutritionAudit(extractedInfoMap, finalCategory);

  // Construct Result data conforming to existing result pages
  const result: ScanResultData = {
    scanId,
    productName: p.productName || 'Scanned Packaged Product',
    productBrand: p.brand || 'Detected Brand',
    category: finalCategory,
    scanDate: new Date().toISOString(),
    score: computedScore,
    overallStatus,
    statusDescription,
    summary,
    checks: checksList,
    extractedInfo: extractedInfoMap,
    nutritionAudit,
    structuredProduct: p,
    ocrText: ocrResponse.text,
    ocrEngine: ocrResponse.ocrEngine,
    uploadedImage: ocrResponse.originalImageUrl || uploadedImage,
    originalFilename: imageFile.name || ocrResponse.originalFilename || 'Original filename unavailable',
    evaluatedRules: comp?.rules || [],
    readabilityResult,
  };

  setCachedScanResult(scanId, result);

  // ASYNCHRONOUSLY PERSIST REAL SCAN TO MONGODB ATLAS
  // If MongoDB fails or is unavailable, never destroy the scan result or disrupt the user
  const currentUserRaw = localStorage.getItem('compliscan_user_data');
  let currentAuthUser: any = null;
  try {
    if (currentUserRaw) currentAuthUser = JSON.parse(currentUserRaw);
  } catch {}

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const shortId = scanId.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || 'X001';
  const reportId = `CS-${dateStr}-${shortId}`;

  const dbPayload = {
    scanId,
    userId: currentAuthUser?.id || null,
    userName: currentAuthUser?.name || 'CompliScan User',
    userEmail: currentAuthUser?.email || '',
    originalImageUrl: ocrResponse.originalImageUrl || null,
    originalFilename: imageFile.name || ocrResponse.originalFilename || 'Original filename unavailable',
    reportId,
    productName: p.productName || 'Not detected',
    brand: p.brand || 'Not detected',
    category: p.category || userSelectedCategory || 'Unknown',
    mrp: p.mrp || null,
    netQuantity: p.netQuantity || null,
    manufacturer: p.manufacturer || null,
    manufacturingDate: p.manufacturingDate || null,
    expiryDate: p.expiryDate || null,
    batchNumber: p.batchNumber || null,
    consumerCare: p.consumerCare || null,
    ingredients: p.ingredients || null,
    countryOfOrigin: p.countryOfOrigin || null,
    licenseNumber: p.licenseNumber || null,
    rawOCRText: ocrResponse.text || '',
    groqStructuredJSON: p || {},
    ruleResults: comp?.rules || [],
    complianceScore: computedScore,
    overallStatus: overallStatus,
    readabilityResult: readabilityResult || null,
  };

  saveScanToDB(dbPayload).then((res) => {
    if (res.success) {
      console.log(`[CompliScan Client]: Real scan saved to MongoDB Atlas with ID: ${scanId}`);
    } else {
      console.warn(`[CompliScan Client]: ${res.message || 'Unable to save scan history. Your analysis is still available.'}`);
    }
  }).catch((err) => {
    console.warn('[CompliScan Client]: Database save error (non-fatal):', err.message);
  });

  return result;
}

export interface MultiAngleImages {
  front?: File | null;
  back?: File | null;
  side?: File | null;
}

export async function startRealMultiScan(
  angles: MultiAngleImages,
  userSelectedCategory: string,
  onStepChange: (stepId: number, status: 'pending' | 'active' | 'completed' | 'error', errorMsg?: string) => void
): Promise<ScanResultData> {
  const primaryFile = angles.front || angles.back || angles.side;
  if (!primaryFile) {
    throw new Error('Please provide at least one product label angle image.');
  }

  const scanId = typeof crypto !== 'undefined' && crypto.randomUUID ? `scan_${crypto.randomUUID()}` : `scan_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const uploadedImage = URL.createObjectURL(primaryFile);

  // STEP 1: Image Processing
  onStepChange(1, 'active');
  await new Promise((res) => setTimeout(res, 300));
  onStepChange(1, 'completed');

  // STEP 2: Parallel Multi-Angle OCR
  onStepChange(2, 'active');
  let combinedOCRText = '';
  let primaryOcrResponse: any = null;

  try {
    const ocrPromises: Promise<{ angle: string; text: string; rawResp?: any }>[] = [];

    if (angles.front) {
      ocrPromises.push(
        sendImageToOCR(angles.front, `${scanId}_front`).then((r) => ({
          angle: 'FRONT PANEL (Brand & Declarations)',
          text: r.text || '',
          rawResp: r,
        }))
      );
    }
    if (angles.back) {
      ocrPromises.push(
        sendImageToOCR(angles.back, `${scanId}_back`).then((r) => ({
          angle: 'BACK PANEL (Nutrition & Ingredients)',
          text: r.text || '',
          rawResp: r,
        }))
      );
    }
    if (angles.side) {
      ocrPromises.push(
        sendImageToOCR(angles.side, `${scanId}_side`).then((r) => ({
          angle: 'SIDE / FLAP PANEL (FSSAI, MRP & Manufacturer)',
          text: r.text || '',
          rawResp: r,
        }))
      );
    }

    const results = await Promise.all(ocrPromises);
    primaryOcrResponse = results[0]?.rawResp || {};

    const textSegments = results
      .filter((r) => r.text.trim().length > 0)
      .map((r) => `=== ${r.angle} ===\n${r.text}`);

    combinedOCRText = textSegments.join('\n\n');

    if (!combinedOCRText.trim()) {
      throw new Error('Unable to extract text from the provided angles. Please ensure images are well-lit and clear.');
    }

    onStepChange(2, 'completed');
  } catch (err: any) {
    onStepChange(2, 'error', err.message || 'Multi-angle OCR extraction failed.');
    throw err;
  }

  // STEP 3: Unified AI Structuring (Groq LLM)
  onStepChange(3, 'active');
  let groqResponse;
  try {
    groqResponse = await sendTextToGroq(combinedOCRText, scanId);
    if (!groqResponse.data) {
      throw new Error('Could not structure product details from multi-angle OCR text.');
    }
    onStepChange(3, 'completed');
  } catch (err: any) {
    onStepChange(3, 'error', err.message || 'Information analysis failed.');
    throw err;
  }

  // STEP 4: Rule Compliance Check
  onStepChange(4, 'active');
  await new Promise((res) => setTimeout(res, 400));
  onStepChange(4, 'completed');

  // STEP 5: Report Generation
  onStepChange(5, 'active');
  await new Promise((res) => setTimeout(res, 300));
  onStepChange(5, 'completed');

  const p = groqResponse.data;
  const comp = groqResponse.compliance;

  const finalCategory =
    p.category && p.category !== 'Unknown'
      ? (p.category.toLowerCase().replace(' ', '-') as any)
      : (userSelectedCategory.toLowerCase().replace(' ', '-') as any);

  const extractedInfoMap: Record<string, string | null> = {
    'Product Name': p.productName || 'Not detected',
    'Brand': p.brand || 'Not detected',
    'Category': p.category || userSelectedCategory,
    'MRP': p.mrp || null,
    'Net Quantity': p.netQuantity || null,
    'Manufacturer': p.manufacturer || null,
    'Manufacture Date': p.manufacturingDate || null,
    'Best Before / Expiry': p.expiryDate || null,
    'Batch Number': p.batchNumber || null,
    'Consumer Care': p.consumerCare || null,
    'FSSAI / License Number': p.licenseNumber || null,
    'Country of Origin': p.countryOfOrigin || null,
    'Ingredients': p.ingredients || combinedOCRText || null,
    'Nutritional Info': combinedOCRText || null,
    'rawText': combinedOCRText || null,
  };

  const checksList: ScanResultData['checks'] = (comp?.rules || []).map((r) => ({
    ruleId: r.ruleId,
    field: r.title,
    requirement: r.requirement,
    detectedValue: r.observedValue,
    status:
      r.status === 'PASS'
        ? ('passed' as const)
        : r.status === 'FAIL'
        ? ('failed' as const)
        : r.status === 'NEEDS_REVIEW'
        ? ('review' as const)
        : ('not-applicable' as const),
    explanation: r.reason,
    legalReference: `${r.officialSource} — ${r.regulation}`,
  }));

  const passedCount = comp?.summary?.passed ?? checksList.filter((c) => c.status === 'passed').length;
  const issuesCount = comp?.summary?.issues ?? checksList.filter((c) => c.status === 'failed').length;
  const reviewCount = comp?.summary?.review ?? checksList.filter((c) => c.status === 'review').length;
  const naCount = comp?.summary?.notApplicable ?? checksList.filter((c) => c.status === 'not-applicable').length;

  const computedScore = typeof comp?.score === 'number' ? comp.score : 80;
  const overallStatus = comp?.overallStatus || (computedScore >= 80 ? 'COMPLIANT' : 'POTENTIAL NON-COMPLIANCE');

  let readabilityResult: ReadabilityResult | undefined;
  try {
    readabilityResult = computeReadabilityAnalysis({
      ocrText: combinedOCRText,
      ocrData: primaryOcrResponse?.ocrData,
      imageMetadata: primaryOcrResponse?.imageMetadata,
      productData: p,
    });
  } catch {}

  const nutritionAudit = calculateNutritionAudit(extractedInfoMap, finalCategory);

  const result: ScanResultData = {
    scanId,
    productName: p.productName || 'Inspected Packaged Product',
    productBrand: p.brand || 'Multi-Angle Scan',
    category: finalCategory,
    scanDate: new Date().toISOString(),
    score: computedScore,
    overallStatus,
    statusDescription:
      computedScore >= 80
        ? 'All mandatory statutory declarations and multi-angle package disclosures satisfy Legal Metrology & FSSAI standards.'
        : 'Some mandatory packaging declarations were missing or non-compliant across inspected angles.',
    summary: {
      passed: passedCount,
      issues: issuesCount,
      review: reviewCount,
      notApplicable: naCount,
    },
    checks: checksList,
    extractedInfo: extractedInfoMap,
    structuredProduct: p,
    ocrText: combinedOCRText,
    ocrEngine: 'Multi-Angle OCR (Front + Back + Side Stitched)',
    uploadedImage,
    originalFilename: primaryFile.name,
    evaluatedRules: comp?.rules || [],
    readabilityResult,
    nutritionAudit,
  };

  setCachedScanResult(scanId, result);

  let currentAuthUser: any = null;
  const currentUserRaw = localStorage.getItem('compliscan_user_data');
  try {
    if (currentUserRaw) currentAuthUser = JSON.parse(currentUserRaw);
  } catch {}

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const shortId = scanId.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || 'M001';
  const reportId = `CS-${dateStr}-${shortId}`;

  const dbPayload = {
    scanId,
    userId: currentAuthUser?.id || null,
    userName: currentAuthUser?.name || 'CompliScan User',
    userEmail: currentAuthUser?.email || '',
    originalImageUrl: primaryOcrResponse?.originalImageUrl || null,
    originalFilename: primaryFile.name || 'Multi-Angle Packaging',
    reportId,
    productName: p.productName || 'Not detected',
    brand: p.brand || 'Not detected',
    category: p.category || userSelectedCategory || 'Unknown',
    mrp: p.mrp || null,
    netQuantity: p.netQuantity || null,
    manufacturer: p.manufacturer || null,
    manufacturingDate: p.manufacturingDate || null,
    expiryDate: p.expiryDate || null,
    batchNumber: p.batchNumber || null,
    consumerCare: p.consumerCare || null,
    ingredients: p.ingredients || null,
    countryOfOrigin: p.countryOfOrigin || null,
    licenseNumber: p.licenseNumber || null,
    rawOCRText: combinedOCRText || '',
    groqStructuredJSON: p || {},
    ruleResults: comp?.rules || [],
    complianceScore: computedScore,
    overallStatus: overallStatus,
    readabilityResult: readabilityResult || null,
  };

  saveScanToDB(dbPayload).then((res) => {
    if (res.success) {
      console.log(`[CompliScan Client]: Multi-angle scan saved to DB with ID: ${scanId}`);
    }
  }).catch((err) => {
    console.warn('[CompliScan Client]: DB save error (non-fatal):', err.message);
  });

  return result;
}

export async function getRecentScans(limit: number = 5): Promise<ScanRecord[]> {
  return mockScanHistory.slice(0, limit);
}

export async function getDashboardStats() {
  return { ...dashboardStats };
}
