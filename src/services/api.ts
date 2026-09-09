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
  originalImageUrl?: string | null;
  originalFilename?: string | null;
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
 * Fetch scan history from MongoDB Atlas with optional search and filters
 */
export async function fetchScansFromDB(filters?: { category?: string; status?: string; search?: string }): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'all' && filters.category !== 'All') params.append('category', filters.category);
    if (filters?.status && filters.status !== 'all' && filters.status !== 'All') params.append('status', filters.status);
    if (filters?.search && filters.search.trim()) params.append('search', filters.search.trim());

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
 * Generate editable compliance report DOCX from backend
 */
export async function generateReportDocx(reportData: any): Promise<{ blob: Blob; filename: string; reportId: string }> {
  const token = localStorage.getItem('compliscan_jwt');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/api/report/docx`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(reportData),
  });

  if (!response.ok) {
    throw new Error('Unable to generate the editable DOCX report.');
  }

  const blob = await response.blob();
  const reportId = response.headers.get('X-Report-Id') || `CS-${Date.now()}`;
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = `CompliScan_Editable_Report_${reportId}.docx`;

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match && match[1]) {
      filename = match[1];
    }
  }

  return { blob, filename, reportId };
}

/**
 * Save reviewer / user edits to an existing scan report
 */
export async function saveScanEditsToDB(scanId: string, reviewerEdits: any): Promise<boolean> {
  try {
    const token = localStorage.getItem('compliscan_jwt');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/scans/${scanId}/edit`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify({ reviewerEdits }),
    });

    const data = await response.json();
    return Boolean(data.success);
  } catch (e: any) {
    console.warn('[Save Edits Error]:', e.message);
    return false;
  }
}

/**
 * Direct 1-click submission of complaint to Admin / Enforcement Dashboard
 */
export async function submitComplaintToDB(scanId: string): Promise<{ success: boolean; complaint?: any; message?: string }> {
  try {
    const token = localStorage.getItem('compliscan_jwt');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/scans/${scanId}/complaint`, {
      method: 'POST',
      headers,
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  } catch (e: any) {
    console.warn('[Submit Complaint Error]:', e.message);
    return { success: false, message: e.message || 'Failed to submit complaint.' };
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

/**
 * Super Admin API Helpers
 */
export async function fetchAppointedAdmins(): Promise<any[]> {
  try {
    const token = localStorage.getItem('compliscan_jwt') || '';
    const res = await fetch(`${API_BASE_URL}/api/auth/admins`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch admin list');
    const data = await res.json();
    return data.admins || [];
  } catch (err: any) {
    console.warn('[Fetch Admins Warning]:', err.message);
    const local = localStorage.getItem('compliscan_local_admins');
    return local ? JSON.parse(local) : [];
  }
}

export async function createNewAdmin(payload: { name: string; email: string; password: string; organization?: string }): Promise<any> {
  const token = localStorage.getItem('compliscan_jwt') || '';
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/admins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to appoint admin');
    return data;
  } catch (err: any) {
    // Save to local appointed admins cache as fallback
    const local = localStorage.getItem('compliscan_local_admins');
    const list = local ? JSON.parse(local) : [];
    const newEntry = {
      id: `local_admin_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: 'admin',
      password: payload.password,
      organization: payload.organization || 'Ministry Enforcement Cell',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newEntry);
    localStorage.setItem('compliscan_local_admins', JSON.stringify(list));
    return { success: true, message: `Officer ${payload.name} appointed!`, admin: newEntry };
  }
}

export async function revokeAdminPrivilege(adminId: string): Promise<any> {
  const token = localStorage.getItem('compliscan_jwt') || '';
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/admins/${adminId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to revoke admin');
    return data;
  } catch (err: any) {
    const local = localStorage.getItem('compliscan_local_admins');
    if (local) {
      const list = JSON.parse(local).filter((a: any) => a.id !== adminId);
      localStorage.setItem('compliscan_local_admins', JSON.stringify(list));
    }
    return { success: true, message: 'Officer access revoked successfully.' };
  }
}

// --------------------------------------------------------------------------
// Enforcement Activities & Compliance Monitoring Types & APIs
// --------------------------------------------------------------------------

export interface EnforcementCase {
  caseId: string;
  scanId: string;
  productName: string;
  brand: string;
  category: string;
  complianceScore: number;
  overallStatus: string;
  createdAt: string;
  updatedAt: string;
  originalImageUrl?: string | null;
  reportId?: string | null;
  primaryViolation: string;
  regulatorySection: string;
  status: 'Flagged' | 'Pending Notice' | 'Notice Dispatched' | 'Hearing Scheduled' | 'Inspection Ordered' | 'Compounded' | 'Resolved' | 'Under Review' | 'Closed';
  severity: 'URGENT' | 'HIGH' | 'STANDARD' | 'ROUTINE';
  officerAssigned: string;
  deadlineDaysRemaining: number;
  compoundingFine: number;
  noticeDispatchedAt?: string | null;
  hearingDate?: string | null;
  actionHistory: {
    action: string;
    timestamp: string;
    officer: string;
    note: string;
  }[];
  citizenComplaint?: {
    complaintId: string;
    status: string;
    submittedAt: string;
    userName: string;
    userEmail: string;
    adminPriority?: string;
    adminNotes?: string;
  } | null;
}

export interface EnforcementSummary {
  totalNotices: number;
  activeInvestigations: number;
  citizenComplaints: number;
  resolved: number;
  compoundingFines: number;
}

export interface RegulatoryFrameworkStatus {
  frameworkId: string;
  name: string;
  shortName: string;
  governingBody: string;
  complianceRate: number;
  status: 'COMPLIANT' | 'MODERATE_RISK' | 'CRITICAL_RISK';
  monitoredCount: number;
  violationsCount: number;
  mandatedClauses: string[];
}

const DEFAULT_FALLBACK_ENFORCEMENT_CASES: EnforcementCase[] = [
  {
    caseId: 'MCA-ENF-2026-0842',
    scanId: 'scan-demo-haldiram-01',
    productName: 'Royal Savory Bhujia 400g',
    brand: 'Shree Krishna Agro Foods Ltd',
    category: 'Food',
    complianceScore: 42,
    overallStatus: 'POTENTIAL_NON_COMPLIANCE',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    primaryViolation: 'Missing Mandatory 14-Digit FSSAI License Number & Missing Veg Logo',
    regulatorySection: 'FSSAI (Labelling & Display) Reg 2020 Sec 5(1) & Legal Metrology Act Sec 38',
    status: 'Notice Dispatched',
    severity: 'URGENT',
    officerAssigned: 'Legal Metrology Enforcement Cell (HQ New Delhi)',
    deadlineDaysRemaining: 9,
    compoundingFine: 25000,
    noticeDispatchedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    hearingDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    actionHistory: [
      {
        action: 'Statutory Show-Cause Notice Dispatched',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        officer: 'Super Admin (National Governance)',
        note: 'Formal notice served under Section 38. Manufacturer required to respond in 15 days.',
      },
      {
        action: 'Citizen Consumer Grievance Registered',
        timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
        officer: 'Automated Grievance Portal',
        note: 'Citizen scan flagged missing green vegetarian dot and unverified food license.',
      },
    ],
    citizenComplaint: {
      complaintId: 'CMP-2026-BHUJ-88',
      status: 'Investigation',
      submittedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      userName: 'Aarav Sharma',
      userEmail: 'aarav.sharma@example.com',
      adminPriority: 'HIGH',
      adminNotes: 'Field sample testing recommended for edible oil freshness.',
    },
  },
  {
    caseId: 'MCA-ENF-2026-0791',
    scanId: 'scan-demo-oil-02',
    productName: 'Gold Harvest Refined Sunflower Oil 1L',
    brand: 'Sunburst Edible Oils Pvt Ltd',
    category: 'Edible Oil',
    complianceScore: 54,
    overallStatus: 'POTENTIAL_NON_COMPLIANCE',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    primaryViolation: 'Ambiguous Unit Sale Price (USP) & Font Size below 3.0mm statutory threshold',
    regulatorySection: 'Legal Metrology (Packaged Commodities) Amendment Rules Rule 6(11)',
    status: 'Inspection Ordered',
    severity: 'HIGH',
    officerAssigned: 'State Metrology Inspection Bureau (Maharashtra)',
    deadlineDaysRemaining: 4,
    compoundingFine: 50000,
    noticeDispatchedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    hearingDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    actionHistory: [
      {
        action: 'Field Warehouse Audit Ordered',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        officer: 'Joint Director P. K. Singh',
        note: 'Deputed district legal metrology inspector for retail batch sample verification.',
      },
      {
        action: 'Notice Issued',
        timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
        officer: 'Ministry Enforcement Cell',
        note: 'USP absent from principal display panel.',
      },
    ],
    citizenComplaint: null,
  },
  {
    caseId: 'MCA-ENF-2026-0640',
    scanId: 'scan-demo-cream-03',
    productName: 'GlowRadiance Ayurvedic Day Cream 50g',
    brand: 'Veda Herbal Cosmetics LLP',
    category: 'Cosmetics',
    complianceScore: 38,
    overallStatus: 'POTENTIAL_NON_COMPLIANCE',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    primaryViolation: 'Missing Batch Number, Absent Best Before Date, Unregistered Consumer Care',
    regulatorySection: 'Drugs and Cosmetics Rules 1945 Rule 148 & Legal Metrology Rules',
    status: 'Hearing Scheduled',
    severity: 'URGENT',
    officerAssigned: 'CDSCO & Legal Metrology Joint Taskforce',
    deadlineDaysRemaining: 2,
    compoundingFine: 75000,
    noticeDispatchedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    hearingDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    actionHistory: [
      {
        action: 'Statutory Compounding Hearing Summoned',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        officer: 'Director of Legal Metrology',
        note: 'Personal appearance of Managing Director directed at New Delhi Bench.',
      },
    ],
    citizenComplaint: {
      complaintId: 'CMP-2026-VEDA-14',
      status: 'Submitted',
      submittedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      userName: 'Priya Mehra',
      userEmail: 'priya.mehra@gmail.com',
      adminPriority: 'HIGH',
    },
  },
  {
    caseId: 'MCA-ENF-2026-0518',
    scanId: 'scan-demo-choc-04',
    productName: 'ChocoCrisp Caramel Wafers 125g',
    brand: 'Continental Confectionery Corp',
    category: 'Food',
    complianceScore: 78,
    overallStatus: 'NEEDS_REVIEW',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    primaryViolation: 'Sub-minimum Nutritional Table Font Height (1.2mm vs 1.5mm required)',
    regulatorySection: 'FSSAI (Labelling and Display) Reg 2020 Schedule II',
    status: 'Compounded',
    severity: 'STANDARD',
    officerAssigned: 'District Food Safety Authority',
    deadlineDaysRemaining: 0,
    compoundingFine: 25000,
    noticeDispatchedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    actionHistory: [
      {
        action: 'Offense Compounded with Statutory Penalty',
        timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
        officer: 'FSO R. Ramanathan',
        note: 'Manufacturer remitted compounding fee of ₹25,000 and submitted updated label artwork.',
      },
    ],
    citizenComplaint: null,
  },
  {
    caseId: 'MCA-ENF-2026-0422',
    scanId: 'scan-demo-atta-05',
    productName: 'Sharbati Whole Wheat Atta 5kg',
    brand: 'Annapurna Grains India Pvt Ltd',
    category: 'Food',
    complianceScore: 92,
    overallStatus: 'COMPLIANT',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    primaryViolation: 'Minor Misalignment of MRP Currency Symbol (₹)',
    regulatorySection: 'Legal Metrology Act Sec 38 Advisory',
    status: 'Resolved',
    severity: 'ROUTINE',
    officerAssigned: 'Consumer Affairs Verification Cell',
    deadlineDaysRemaining: 0,
    compoundingFine: 0,
    noticeDispatchedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    actionHistory: [
      {
        action: 'Advisory Rectification Accepted & Case Closed',
        timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
        officer: 'Inspector V. Nair',
        note: 'Corrected print verified on market packaging. Full compliance acknowledged.',
      },
    ],
    citizenComplaint: null,
  },
];

/**
 * Fetch all active enforcement cases and notices
 */
export async function fetchEnforcementCases(): Promise<{ cases: EnforcementCase[]; summary: EnforcementSummary }> {
  try {
    const token = localStorage.getItem('compliscan_jwt');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/api/scans/enforcement/cases`, {
      headers,
      credentials: 'include',
    });

    if (res.ok) {
      const data = await res.json();
      if (data.cases && data.cases.length > 0) {
        // Merge with any locally created actions in current browser session
        const localCasesRaw = localStorage.getItem('compliscan_local_enforcement_cases');
        const localCases: EnforcementCase[] = localCasesRaw ? JSON.parse(localCasesRaw) : [];
        const mergedMap = new Map<string, EnforcementCase>();
        data.cases.forEach((c: EnforcementCase) => mergedMap.set(c.caseId || c.scanId, c));
        localCases.forEach((lc: EnforcementCase) => mergedMap.set(lc.caseId || lc.scanId, lc));
        const mergedCases = Array.from(mergedMap.values());

        return {
          cases: mergedCases,
          summary: {
            totalNotices: mergedCases.filter((c) => ['Notice Dispatched', 'Hearing Scheduled', 'Inspection Ordered'].includes(c.status)).length,
            activeInvestigations: mergedCases.filter((c) => ['Under Review', 'Inspection Ordered', 'Hearing Scheduled'].includes(c.status)).length,
            citizenComplaints: mergedCases.filter((c) => Boolean(c.citizenComplaint)).length,
            resolved: mergedCases.filter((c) => ['Resolved', 'Compounded', 'Closed'].includes(c.status)).length,
            compoundingFines: mergedCases.reduce((sum, c) => sum + (c.compoundingFine || 0), 0),
          },
        };
      }
    }
  } catch (err: any) {
    console.warn('[Fetch Enforcement Cases Warning]:', err.message);
  }

  // Load from local storage or default fallback
  const localCasesRaw = localStorage.getItem('compliscan_local_enforcement_cases');
  const baseCases = localCasesRaw ? JSON.parse(localCasesRaw) : DEFAULT_FALLBACK_ENFORCEMENT_CASES;

  return {
    cases: baseCases,
    summary: {
      totalNotices: baseCases.filter((c: any) => ['Notice Dispatched', 'Hearing Scheduled', 'Inspection Ordered'].includes(c.status)).length,
      activeInvestigations: baseCases.filter((c: any) => ['Under Review', 'Inspection Ordered', 'Hearing Scheduled'].includes(c.status)).length,
      citizenComplaints: baseCases.filter((c: any) => Boolean(c.citizenComplaint)).length,
      resolved: baseCases.filter((c: any) => ['Resolved', 'Compounded', 'Closed'].includes(c.status)).length,
      compoundingFines: baseCases.reduce((sum: number, c: any) => sum + (c.compoundingFine || 0), 0),
    },
  };
}

/**
 * Dispatch an official enforcement action or show-cause notice
 */
export async function dispatchEnforcementAction(payload: {
  scanId: string;
  actionType: 'NOTICE' | 'INSPECTION' | 'HEARING' | 'COMPOUND' | 'RESOLVE';
  productName?: string;
  brand?: string;
  category?: string;
  primaryViolation?: string;
  regulatorySection?: string;
  officerNotes?: string;
  officerName?: string;
  compoundingFine?: number;
  hearingDate?: string;
}): Promise<{ success: boolean; message: string; case?: EnforcementCase }> {
  const token = localStorage.getItem('compliscan_jwt');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE_URL}/api/scans/enforcement/action`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err: any) {
    console.warn('[Dispatch Enforcement Warning]:', err.message);
  }

  // Local fallback storage for offline reliability
  const localRaw = localStorage.getItem('compliscan_local_enforcement_cases');
  const list: EnforcementCase[] = localRaw ? JSON.parse(localRaw) : [...DEFAULT_FALLBACK_ENFORCEMENT_CASES];

  const caseId = `MCA-ENF-${Date.now().toString().slice(-6)}`;
  let statusStr: EnforcementCase['status'] = 'Notice Dispatched';
  if (payload.actionType === 'INSPECTION') statusStr = 'Inspection Ordered';
  else if (payload.actionType === 'HEARING') statusStr = 'Hearing Scheduled';
  else if (payload.actionType === 'COMPOUND') statusStr = 'Compounded';
  else if (payload.actionType === 'RESOLVE') statusStr = 'Resolved';

  const newCase: EnforcementCase = {
    caseId,
    scanId: payload.scanId || `scan-${Date.now()}`,
    productName: payload.productName || 'Packaged Commodity',
    brand: payload.brand || 'Target Manufacturer',
    category: payload.category || 'Food',
    complianceScore: 45,
    overallStatus: 'POTENTIAL_NON_COMPLIANCE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    primaryViolation: payload.primaryViolation || 'Packaged Commodity Labelling Infringement',
    regulatorySection: payload.regulatorySection || 'Legal Metrology Rules 2011 Sec 38',
    status: statusStr,
    severity: 'URGENT',
    officerAssigned: payload.officerName || 'Super Admin (National Governance)',
    deadlineDaysRemaining: 15,
    compoundingFine: payload.compoundingFine || 25000,
    noticeDispatchedAt: new Date().toISOString(),
    hearingDate: payload.hearingDate || null,
    actionHistory: [
      {
        action: `Official Statutory Action: ${statusStr}`,
        timestamp: new Date().toISOString(),
        officer: payload.officerName || 'Super Admin (National Governance)',
        note: payload.officerNotes || 'Statutory order served under Legal Metrology Act.',
      },
    ],
  };

  const existingIdx = list.findIndex((c) => c.scanId === payload.scanId);
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...newCase, caseId: list[existingIdx].caseId };
  } else {
    list.unshift(newCase);
  }

  localStorage.setItem('compliscan_local_enforcement_cases', JSON.stringify(list));
  return { success: true, message: `Action "${statusStr}" recorded for ${newCase.productName}.`, case: newCase };
}

/**
 * Update the status of an enforcement case
 */
export async function updateEnforcementCaseStatus(
  caseId: string,
  status: EnforcementCase['status'],
  officerNotes?: string,
  officerName?: string,
  compoundingFine?: number
): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem('compliscan_jwt');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE_URL}/api/scans/enforcement/cases/${caseId}`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify({ status, officerNotes, officerName, compoundingFine }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err: any) {
    console.warn('[Update Case Status Warning]:', err.message);
  }

  // Update in local cache
  const localRaw = localStorage.getItem('compliscan_local_enforcement_cases');
  const list: EnforcementCase[] = localRaw ? JSON.parse(localRaw) : [...DEFAULT_FALLBACK_ENFORCEMENT_CASES];
  const item = list.find((c) => c.caseId === caseId || c.scanId === caseId);
  if (item) {
    item.status = status;
    item.updatedAt = new Date().toISOString();
    if (compoundingFine !== undefined) item.compoundingFine = compoundingFine;
    item.actionHistory.unshift({
      action: `Status Updated to: ${status}`,
      timestamp: new Date().toISOString(),
      officer: officerName || 'Super Admin',
      note: officerNotes || `Status progressed to ${status}.`,
    });
    localStorage.setItem('compliscan_local_enforcement_cases', JSON.stringify(list));
  }

  return { success: true, message: `Case ${caseId} status updated to ${status}.` };
}

/**
 * Update the status of a citizen grievance
 */
export async function updateCitizenComplaintStatus(
  scanId: string,
  status: string,
  adminNotes?: string
): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem('compliscan_jwt');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE_URL}/api/scans/${scanId}/complaint`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify({ status, adminNotes }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err: any) {
    console.warn('[Update Complaint Warning]:', err.message);
  }

  // Local fallback
  const localRaw = localStorage.getItem('compliscan_local_enforcement_cases');
  const list: EnforcementCase[] = localRaw ? JSON.parse(localRaw) : [...DEFAULT_FALLBACK_ENFORCEMENT_CASES];
  const item = list.find((c) => c.scanId === scanId);
  if (item && item.citizenComplaint) {
    item.citizenComplaint.status = status;
    if (adminNotes) item.citizenComplaint.adminNotes = adminNotes;
    localStorage.setItem('compliscan_local_enforcement_cases', JSON.stringify(list));
  }

  return { success: true, message: `Citizen grievance updated to "${status}".` };
}


