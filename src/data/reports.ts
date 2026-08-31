export interface Report {
  id: string;
  reportId: string;
  scanId: string;
  productName: string;
  brand: string;
  category: string;
  score: number;
  status: string;
  date: string;
  generatedAt: string;
  format: string;
}

export const mockReports: Report[] = [
  {
    id: 'rpt_001',
    reportId: 'RPT-2026-0842',
    scanId: 'scan_001',
    productName: 'Uncle Chips Spicy Treat',
    brand: 'Uncle Chips',
    category: 'Food',
    score: 82,
    status: 'potential-issue',
    date: '2026-08-28',
    generatedAt: '2026-08-28T14:35:00',
    format: 'PDF',
  },
  {
    id: 'rpt_002',
    reportId: 'RPT-2026-0841',
    scanId: 'scan_002',
    productName: 'Clinic Plus Strong & Long Shampoo',
    brand: 'Clinic Plus',
    category: 'Cosmetics',
    score: 78,
    status: 'needs-review',
    date: '2026-08-27',
    generatedAt: '2026-08-27T10:18:00',
    format: 'PDF',
  },
  {
    id: 'rpt_003',
    reportId: 'RPT-2026-0840',
    scanId: 'scan_003',
    productName: 'Fortune Sunlite Refined Sunflower Oil',
    brand: 'Fortune',
    category: 'Edible Oil',
    score: 96,
    status: 'compliant',
    date: '2026-08-26',
    generatedAt: '2026-08-26T09:52:00',
    format: 'PDF',
  },
  {
    id: 'rpt_004',
    reportId: 'RPT-2026-0839',
    scanId: 'scan_004',
    productName: 'Surf Excel Matic Top Load',
    brand: 'Surf Excel',
    category: 'Household',
    score: 65,
    status: 'potential-issue',
    date: '2026-08-25',
    generatedAt: '2026-08-25T16:25:00',
    format: 'PDF',
  },
  {
    id: 'rpt_005',
    reportId: 'RPT-2026-0838',
    scanId: 'scan_005',
    productName: 'Dove Beauty Bathing Bar',
    brand: 'Dove',
    category: 'Cosmetics',
    score: 89,
    status: 'compliant',
    date: '2026-08-24',
    generatedAt: '2026-08-24T11:08:00',
    format: 'PDF',
  },
  {
    id: 'rpt_006',
    reportId: 'RPT-2026-0837',
    scanId: 'scan_006',
    productName: 'Parle-G Gold Biscuits',
    brand: 'Parle',
    category: 'Food',
    score: 91,
    status: 'compliant',
    date: '2026-08-23',
    generatedAt: '2026-08-23T13:42:00',
    format: 'PDF',
  },
  {
    id: 'rpt_007',
    reportId: 'RPT-2026-0836',
    scanId: 'scan_007',
    productName: 'Saffola Gold Blended Oil',
    brand: 'Saffola',
    category: 'Edible Oil',
    score: 94,
    status: 'compliant',
    date: '2026-08-22',
    generatedAt: '2026-08-22T15:20:00',
    format: 'PDF',
  },
  {
    id: 'rpt_008',
    reportId: 'RPT-2026-0835',
    scanId: 'scan_008',
    productName: 'Himalaya Neem Face Wash',
    brand: 'Himalaya',
    category: 'Cosmetics',
    score: 87,
    status: 'compliant',
    date: '2026-08-21',
    generatedAt: '2026-08-21T10:33:00',
    format: 'PDF',
  },
];

export const reportStats = {
  total: 8,
  compliant: 5,
  issues: 2,
  review: 1,
};
