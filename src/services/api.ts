/**
 * CompliScan AI Client API Layer
 * Connects the frontend to the backend OCR and Groq analysis endpoints.
 * Never stores or exposes API keys in client-side code.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export interface ReadabilityCheck {
  name: string;
  status: 'PASS' | 'NEEDS_REVIEW' | 'FAIL';
  observedValue?: string | number | null;
  reason: string;
  limitation?: boolean;
}

export interface DeclarationReadability {
  field: string;
  observedValue: string | null;
  status: 'PASS' | 'NEEDS_REVIEW' | 'FAIL';
  textHeightCategory: string;
  reason: string;
}

export interface ReadabilityResult {
  overallStatus: 'PASS' | 'NEEDS_REVIEW' | 'FAIL';
  overallScore: number;
  estimatedFontSize: 'VERY_SMALL' | 'SMALL' | 'ADEQUATE' | 'LARGE';
  imageQuality: 'EXCELLENT' | 'GOOD' | 'ADEQUATE' | 'LOW';
  textVisibility: 'GOOD' | 'MODERATE' | 'POOR';
  ocrConfidence: number | null;
  avgLineHeightPx?: number | null;
  relativeLineHeight?: number | null;
  issues: string[];
  checks: ReadabilityCheck[];
  declarationReadability?: DeclarationReadability[];
  analyzedAt?: string;
}

export interface OCRResponse {
  success: boolean;
  text?: string;
  ocrEngine?: string;
  error?: string;
  ocrData?: {
    lines?: Array<{ text: string; height?: number | null; minTop?: number | null }>;
    words?: Array<{ wordText: string; left?: number; top?: number; height?: number; width?: number }>;
  };
  imageMetadata?: {
    width?: number | null;
    height?: number | null;
    fileSize?: number;
    mimeType?: string;
  };
}

export interface StructuredProduct {
  productName: string | null;
  brand: string | null;
  category: 'Food' | 'Edible Oil' | 'Cosmetics' | 'Household' | 'Unknown';
  mrp: string | null;
  netQuantity: string | null;
  manufacturer: string | null;
  manufacturingDate: string | null;
  expiryDate: string | null;
  batchNumber: string | null;
  consumerCare: string | null;
  ingredients: string | null;
  countryOfOrigin: string | null;
  licenseNumber: string | null;
  rawText: string;
}

export interface ComplianceRuleResult {
  ruleId: string;
  regulation: string;
  title: string;
  status: 'PASS' | 'FAIL' | 'NEEDS_REVIEW' | 'NOT_APPLICABLE';
  observedValue: string | null;
  requirement: string;
  reason: string;
  officialSource: string;
  sourceAuthority: string;
  officialUrl?: string;
}

export interface ComplianceEvaluation {
  category: string;
  score: number;
  overallStatus: string;
  statusDescription: string;
  summary: {
    passed: number;
    issues: number;
    review: number;
    notApplicable: number;
  };
  rules: ComplianceRuleResult[];
}

export interface AnalyzeResponse {
  success: boolean;
  data?: StructuredProduct;
  compliance?: ComplianceEvaluation;
  error?: string;
}

/**
 * Image compressor & validator utility
 * Resizes images exceeding 1920px or 4MB on canvas before upload to ensure fast, reliable OCR transmission.
 */
export async function prepareImageForOCR(file: File): Promise<File> {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    throw new Error('Unsupported format. Please upload a JPG, PNG, or WEBP image.');
  }

  // If already under 2MB, send directly
  if (file.size <= 2 * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const maxDim = 1920;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const compressed = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressed);
        },
        'image/jpeg',
        0.88
      );
    };

    img.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Send image to backend OCR endpoint
 */
export async function sendImageToOCR(file: File, scanId?: string): Promise<OCRResponse & { scanId?: string }> {
  const preparedFile = await prepareImageForOCR(file);
  const formData = new FormData();
  formData.append('image', preparedFile);

  const token = localStorage.getItem('compliscan_jwt');
  const headers: Record<string, string> = {};
  if (scanId) headers['X-Scan-Id'] = scanId;
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/api/ocr`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'OCR processing failed. Please upload a clearer label photo.');
  }

  return data;
}

/**
 * Send OCR text to backend Groq analysis endpoint
 */
export async function sendTextToGroq(ocrText: string, scanId?: string): Promise<AnalyzeResponse & { scanId?: string }> {
  const token = localStorage.getItem('compliscan_jwt');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ ocrText, scanId }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'AI Information Analysis failed.');
  }

  return data;
}

/**
 * Generate official compliance report PDF from backend
 */
export async function generateReportPDF(reportData: any): Promise<{ blob: Blob; filename: string; reportId: string }> {
  const response = await fetch(`${API_BASE_URL}/api/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reportData),
  });

  if (!response.ok) {
    let errMessage = 'Unable to generate the report. Please try again.';
    try {
      const errJson = await response.json();
      if (errJson.error) errMessage = errJson.error;
    } catch {
      // Ignore text parse errors
    }
    throw new Error(errMessage);
  }

  const blob = await response.blob();
  const reportId = response.headers.get('X-Report-Id') || `CS-${Date.now()}`;
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = `CompliScan_Report_${reportId}.pdf`;

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match && match[1]) {
      filename = match[1];
    }
  }

  return { blob, filename, reportId };
}

/**
 * Save real scan to MongoDB Atlas via backend
 */
export async function saveScanToDB(scanPayload: any): Promise<{ success: boolean; scanId?: string; message?: string }> {
  try {
    const token = localStorage.getItem('compliscan_jwt');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/scans`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(scanPayload),
    });

    const data = await response.json();
    return data;
  } catch (err: any) {
    console.warn('[MongoDB Save Client Warning]:', err.message);
    return {
      success: false,
      message: 'Unable to save scan history. Your analysis is still available.',
    };
  }
}

/**
 * Fetch scan history from MongoDB Atlas
 */
export async function fetchScansFromDB(filters?: { category?: string; status?: string }): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);

    const token = localStorage.getItem('compliscan_jwt');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = `${API_BASE_URL}/api/scans${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      headers,
      credentials: 'include',
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.scans || [];
  } catch (err: any) {
    console.warn('[MongoDB Fetch Client Warning]:', err.message);
    return [];
  }
}

/**
 * Fetch single saved scan by ID from MongoDB Atlas
 */
export async function fetchScanByIdFromDB(scanId: string): Promise<any | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scans/${scanId}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.scan || null;
  } catch (err: any) {
    console.warn(`[MongoDB Lookup Client Warning for ${scanId}]:`, err.message);
    return null;
  }
}

/**
 * Anonymous Session Manager
 * Uses localStorage to persist unique visitor session ID without tracking personal data
 */
export function getAnonymousSessionId(): string {
  try {
    let sid = localStorage.getItem('compliscan_session_id');
    if (!sid) {
      sid = typeof crypto !== 'undefined' && crypto.randomUUID
        ? `sess_${crypto.randomUUID()}`
        : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem('compliscan_session_id', sid);
    }
    return sid;
  } catch {
    return 'sess_fallback';
  }
}

/**
 * Record a real anonymous visit
 */
export async function recordVisit(page: string = window.location.pathname): Promise<void> {
  try {
    const sessionId = getAnonymousSessionId();
    await fetch(`${API_BASE_URL}/api/stats/visit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId, page }),
    });
  } catch (err: any) {
    console.warn('[Visit recording warning]:', err.message);
  }
}

export interface RealStatsResponse {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  weekVisits: number;
  monthVisits: number;
  totalScans: number;
  successfulScans: number;
  failedScans: number;
  compliantProducts: number;
  nonCompliantProducts: number;
  needsReviewProducts: number;
  complianceRate: number;
  categoryDistribution: { name: string; scans: number }[];
  monthlyScans: { month: string; scans: number; compliant: number }[];
  commonIssues: { issue: string; count: number }[];
}

/**
 * Fetch real aggregate statistics from MongoDB
 */
export async function fetchRealStats(): Promise<RealStatsResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/stats`);
    if (!res.ok) {
      throw new Error('Failed to fetch statistics');
    }
    const data: RealStatsResponse = await res.json();
    return data;
  } catch (err: any) {
    console.warn('[Real stats fetch error]:', err.message);
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      todayVisits: 0,
      weekVisits: 0,
      monthVisits: 0,
      totalScans: 0,
      successfulScans: 0,
      failedScans: 0,
      compliantProducts: 0,
      nonCompliantProducts: 0,
      needsReviewProducts: 0,
      complianceRate: 0,
      categoryDistribution: [],
      monthlyScans: [],
      commonIssues: [],
    };
  }
}
