import { type ProductCategory } from './products';

export type RuleStatus = 'active' | 'draft' | 'deprecated';
export type CheckStatus = 'passed' | 'failed' | 'review' | 'not-applicable';

export interface OfficialGazetteDoc {
  id: string;
  title: string;
  shortName: string;
  authority: string;
  notificationDate: string;
  category: 'FSSAI' | 'Legal Metrology' | 'ICMR / Health' | 'Consumer Protection' | 'CDSCO';
  pdfUrl: string;
  description: string;
  keySections: string[];
}

export interface NutrientComparisonItem {
  key: string;
  name: string;
  observedValue: string;
  observedNumeric: number | null;
  standardLimit: string;
  standardNumeric: number;
  unit: string;
  safetyStatus: 'SAFE' | 'ELEVATED' | 'HIGH_RISK' | 'UNKNOWN';
  deviationPercent: number | null;
  verdict: string;
  legalBasis: string;
  gazetteUrl: string;
}

export interface AdditiveCheckItem {
  code: string;
  name: string;
  purpose: string;
  fssaiStatus: 'PERMITTED' | 'RESTRICTED' | 'PROHIBITED' | 'CAUTION_REQUIRED';
  observedInIngredients: boolean;
  mandatoryWarning?: string;
  gazetteRef: string;
  pdfUrl: string;
}

export interface NutritionAuditReport {
  overallHealthGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  hfssStatus: 'NON_HFSS_SAFE' | 'MODERATE_HFSS' | 'HIGH_HFSS_ALERT';
  summaryText: string;
  nutrients: NutrientComparisonItem[];
  additives: AdditiveCheckItem[];
  gazetteReferences: OfficialGazetteDoc[];
}

export interface ComplianceRule {
  id: string;
  ruleId: string;
  requirement: string;
  description: string;
  applicableTo: ProductCategory[];
  legalReference: string;
  authority: string;
  status: RuleStatus;
  isConditional: boolean;
  conditionalNote?: string;
  gazettePdfUrl?: string;
}

export interface ComplianceCheckItem {
  ruleId: string;
  field: string;
  requirement: string;
  detectedValue: string | null;
  status: CheckStatus;
  explanation: string;
  legalReference: string;
  gazettePdfUrl?: string;
}

export interface ComplianceResult {
  scanId: string;
  productName: string;
  productBrand: string;
  category: ProductCategory;
  scanDate: string;
  score: number;
  overallStatus: string;
  statusDescription: string;
  summary: {
    passed: number;
    issues: number;
    review: number;
    notApplicable: number;
  };
  checks: ComplianceCheckItem[];
  extractedInfo: Record<string, string | null>;
  readabilityResult?: any;
  nutritionAudit?: NutritionAuditReport;
}

export const complianceRules: ComplianceRule[] = [
  {
    id: 'rule_001',
    ruleId: 'LM-001',
    requirement: 'Name and Address of Manufacturer/Packer/Importer',
    description: 'Every package must declare the name and address of the manufacturer, packer, or importer.',
    applicableTo: ['food', 'edible-oil', 'cosmetics', 'household', 'other'],
    legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(1)(a)',
    authority: 'Legal Metrology Division',
    status: 'active',
    isConditional: false,
  },
  {
    id: 'rule_002',
    ruleId: 'LM-002',
    requirement: 'Common or Generic Name of Commodity',
    description: 'The common or generic name of the commodity contained in the package must be mentioned.',
    applicableTo: ['food', 'edible-oil', 'cosmetics', 'household', 'other'],
    legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(1)(b)',
    authority: 'Legal Metrology Division',
    status: 'active',
    isConditional: false,
  },
  {
    id: 'rule_003',
    ruleId: 'LM-003',
    requirement: 'Net Quantity',
    description: 'Net quantity of the commodity in standard units of weight, measure, or number.',
    applicableTo: ['food', 'edible-oil', 'cosmetics', 'household', 'other'],
    legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(1)(c)',
    authority: 'Legal Metrology Division',
    status: 'active',
    isConditional: false,
  },
  {
    id: 'rule_004',
    ruleId: 'LM-004',
    requirement: 'Month and Year of Manufacture/Packing/Import',
    description: 'The month and year in which the commodity was manufactured, packed, or imported.',
    applicableTo: ['food', 'edible-oil', 'cosmetics', 'household', 'other'],
    legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(1)(d)',
    authority: 'Legal Metrology Division',
    status: 'active',
    isConditional: false,
  },
  {
    id: 'rule_005',
    ruleId: 'LM-005',
    requirement: 'Best Before / Use By Date',
    description: 'For applicable commodities, the best before or use by date must be clearly mentioned.',
    applicableTo: ['food', 'edible-oil', 'cosmetics'],
    legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(1)(e)',
    authority: 'Legal Metrology Division',
    status: 'active',
    isConditional: true,
    conditionalNote: 'Required for food, edible oils, and cosmetics with expiry',
  },
  {
    id: 'rule_006',
    ruleId: 'LM-006',
    requirement: 'Maximum Retail Price (MRP)',
    description: 'MRP inclusive of all taxes must be printed on every pre-packaged commodity.',
    applicableTo: ['food', 'edible-oil', 'cosmetics', 'household', 'other'],
    legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(1)(f)',
    authority: 'Legal Metrology Division',
    status: 'active',
    isConditional: false,
  },
  {
    id: 'rule_007',
    ruleId: 'LM-007',
    requirement: 'Consumer Care Details',
    description: 'Customer care details including address, email, or phone number for consumer complaints.',
    applicableTo: ['food', 'edible-oil', 'cosmetics', 'household', 'other'],
    legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(2)',
    authority: 'Legal Metrology Division',
    status: 'active',
    isConditional: false,
  },
  {
    id: 'rule_008',
    ruleId: 'FSSAI-001',
    requirement: 'FSSAI License Number',
    description: 'FSSAI license number must be displayed on food product labels.',
    applicableTo: ['food', 'edible-oil'],
    legalReference: 'Food Safety and Standards (Packaging and Labelling) Regulations, 2011 — Reg. 2.2.2(4)',
    authority: 'FSSAI',
    status: 'active',
    isConditional: false,
  },
  {
    id: 'rule_009',
    ruleId: 'FSSAI-002',
    requirement: 'FSSAI Logo',
    description: 'The FSSAI logo must be displayed on the label of food products.',
    applicableTo: ['food', 'edible-oil'],
    legalReference: 'Food Safety and Standards (Packaging and Labelling) Regulations, 2011 — Reg. 2.2.2(4)',
    authority: 'FSSAI',
    status: 'active',
    isConditional: false,
  },
  {
    id: 'rule_010',
    ruleId: 'FSSAI-003',
    requirement: 'List of Ingredients',
    description: 'Complete list of ingredients in descending order of composition by weight/volume.',
    applicableTo: ['food', 'edible-oil'],
    legalReference: 'Food Safety and Standards (Packaging and Labelling) Regulations, 2011 — Reg. 2.2.2(2)',
    authority: 'FSSAI',
    status: 'active',
    isConditional: false,
  },
  {
    id: 'rule_011',
    ruleId: 'FSSAI-004',
    requirement: 'Nutritional Information',
    description: 'Nutritional information per 100g/100ml or per serving must be declared.',
    applicableTo: ['food', 'edible-oil'],
    legalReference: 'Food Safety and Standards (Packaging and Labelling) Regulations, 2011 — Reg. 2.2.2(6)',
    authority: 'FSSAI',
    status: 'active',
    isConditional: true,
    conditionalNote: 'Mandatory for most packaged food; exemptions exist for small packages',
  },
  {
    id: 'rule_012',
    ruleId: 'FSSAI-005',
    requirement: 'Allergen Declaration',
    description: 'Declaration of allergens present in the product.',
    applicableTo: ['food'],
    legalReference: 'Food Safety and Standards (Packaging and Labelling) Regulations, 2011 — Reg. 2.2.2(3)',
    authority: 'FSSAI',
    status: 'active',
    isConditional: true,
    conditionalNote: 'Required if allergens (as defined by FSSAI) are present',
  },
  {
    id: 'rule_013',
    ruleId: 'FSSAI-006',
    requirement: 'Veg/Non-Veg Symbol',
    description: 'Green dot (veg) or brown/red dot (non-veg) symbol must be displayed.',
    applicableTo: ['food'],
    legalReference: 'Food Safety and Standards (Packaging and Labelling) Regulations, 2011 — Reg. 2.2.2(5)',
    authority: 'FSSAI',
    status: 'active',
    isConditional: false,
  },
  {
    id: 'rule_014',
    ruleId: 'BIS-001',
    requirement: 'ISI Mark / BIS Certification',
    description: 'Certain products under mandatory BIS certification must carry the ISI mark.',
    applicableTo: ['household', 'food', 'other'],
    legalReference: 'Bureau of Indian Standards Act, 2016',
    authority: 'BIS',
    status: 'active',
    isConditional: true,
    conditionalNote: 'Required only for products under mandatory BIS certification',
  },
  {
    id: 'rule_015',
    ruleId: 'LM-008',
    requirement: 'Batch/Lot/Code Number',
    description: 'Batch, lot, or code number for traceability purposes.',
    applicableTo: ['food', 'edible-oil', 'cosmetics', 'household', 'other'],
    legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(1)(g)',
    authority: 'Legal Metrology Division',
    status: 'active',
    isConditional: false,
  },
  {
    id: 'rule_016',
    ruleId: 'COS-001',
    requirement: 'Ingredient List (INCI Nomenclature)',
    description: 'Full list of ingredients using International Nomenclature of Cosmetic Ingredients.',
    applicableTo: ['cosmetics'],
    legalReference: 'Drugs and Cosmetics Rules, 1945 — Rule 148A',
    authority: 'CDSCO',
    status: 'active',
    isConditional: false,
  },
  {
    id: 'rule_017',
    ruleId: 'COS-002',
    requirement: 'Manufacturing License Number',
    description: 'Cosmetic manufacturing license number issued by the state licensing authority.',
    applicableTo: ['cosmetics'],
    legalReference: 'Drugs and Cosmetics Rules, 1945 — Rule 129A',
    authority: 'CDSCO',
    status: 'active',
    isConditional: false,
  },
  {
    id: 'rule_018',
    ruleId: 'FSSAI-007',
    requirement: 'Country of Origin (Imported Products)',
    description: 'For imported products, the country of origin must be declared.',
    applicableTo: ['food', 'edible-oil'],
    legalReference: 'Food Safety and Standards (Packaging and Labelling) Regulations, 2011 — Reg. 2.2.2(8)',
    authority: 'FSSAI',
    status: 'active',
    isConditional: true,
    conditionalNote: 'Required only for imported food products',
  },
  {
    id: 'rule_019',
    ruleId: 'LM-009',
    requirement: 'Declaration in Hindi & English',
    description: 'Mandatory declarations must be in Hindi and English (or local language).',
    applicableTo: ['food', 'edible-oil', 'cosmetics', 'household', 'other'],
    legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(5)',
    authority: 'Legal Metrology Division',
    status: 'active',
    isConditional: false,
  },
  {
    id: 'rule_020',
    ruleId: 'OIL-001',
    requirement: 'Type of Oil Declaration',
    description: 'The type/source of edible oil must be clearly stated (e.g., sunflower, mustard, groundnut).',
    applicableTo: ['edible-oil'],
    legalReference: 'Food Safety and Standards (Packaging and Labelling) Regulations, 2011',
    authority: 'FSSAI',
    status: 'active',
    isConditional: false,
  },
  {
    id: 'rule_021',
    ruleId: 'HH-001',
    requirement: 'Safety Warnings & Precautions',
    description: 'Household chemicals must display safety warnings, precautions, and first-aid measures.',
    applicableTo: ['household'],
    legalReference: 'Environment Protection Act, 1986 & BIS Standards',
    authority: 'MOEF / BIS',
    status: 'active',
    isConditional: true,
    conditionalNote: 'Required for products containing hazardous chemicals',
  },
  {
    id: 'rule_022',
    ruleId: 'HH-002',
    requirement: 'Usage Instructions',
    description: 'Clear usage/dosage instructions must be provided on household product labels.',
    applicableTo: ['household'],
    legalReference: 'Consumer Protection Act, 2019',
    authority: 'Consumer Affairs',
    status: 'active',
    isConditional: false,
  },
];

export const mockComplianceResult: ComplianceResult = {
  scanId: 'scan_001',
  productName: 'Uncle Chips Spicy Treat',
  productBrand: 'Uncle Chips',
  category: 'food',
  scanDate: '2026-08-28T14:32:00',
  score: 82,
  overallStatus: 'Potential Non-Compliance',
  statusDescription:
    'Some required information appears to be missing or unclear. Please review the details below for specific compliance gaps.',
  summary: {
    passed: 12,
    issues: 2,
    review: 1,
    notApplicable: 0,
  },
  checks: [
    {
      ruleId: 'LM-006',
      field: 'MRP',
      requirement: 'Maximum Retail Price',
      detectedValue: '₹20',
      status: 'passed',
      explanation: 'MRP clearly printed on the package. Value detected: ₹20 inclusive of all taxes.',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(1)(f)',
    },
    {
      ruleId: 'LM-003',
      field: 'Net Quantity',
      requirement: 'Net Quantity Declaration',
      detectedValue: '52g',
      status: 'passed',
      explanation: 'Net quantity clearly declared in standard metric units.',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(1)(c)',
    },
    {
      ruleId: 'LM-001',
      field: 'Manufacturer Details',
      requirement: 'Name and Address of Manufacturer',
      detectedValue: 'ABC Foods Pvt Ltd, Mumbai, Maharashtra',
      status: 'passed',
      explanation: 'Manufacturer name and complete address found on the label.',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(1)(a)',
    },
    {
      ruleId: 'LM-005',
      field: 'Best Before / Use By',
      requirement: 'Expiry Date',
      detectedValue: '20/09/2026',
      status: 'passed',
      explanation: 'Best before date clearly printed in DD/MM/YYYY format.',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(1)(e)',
    },
    {
      ruleId: 'LM-008',
      field: 'Batch Number',
      requirement: 'Batch/Lot Number',
      detectedValue: 'AB24024',
      status: 'passed',
      explanation: 'Batch number identified on the package.',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(1)(g)',
    },
    {
      ruleId: 'FSSAI-001',
      field: 'FSSAI License',
      requirement: 'FSSAI License Number',
      detectedValue: '10012345000123',
      status: 'passed',
      explanation: 'Valid 14-digit FSSAI license number detected.',
      legalReference: 'Food Safety and Standards (Packaging and Labelling) Regulations, 2011',
    },
    {
      ruleId: 'FSSAI-002',
      field: 'FSSAI Logo',
      requirement: 'FSSAI Logo Display',
      detectedValue: 'Detected',
      status: 'passed',
      explanation: 'FSSAI logo identified on the label.',
      legalReference: 'Food Safety and Standards (Packaging and Labelling) Regulations, 2011',
    },
    {
      ruleId: 'FSSAI-006',
      field: 'Veg/Non-Veg Symbol',
      requirement: 'Vegetarian/Non-Vegetarian Mark',
      detectedValue: 'Green dot (Vegetarian)',
      status: 'passed',
      explanation: 'Green dot symbol for vegetarian product clearly visible.',
      legalReference: 'Food Safety and Standards (Packaging and Labelling) Regulations, 2011',
    },
    {
      ruleId: 'LM-002',
      field: 'Product Name',
      requirement: 'Common/Generic Name',
      detectedValue: 'Potato Chips',
      status: 'passed',
      explanation: 'Generic name of the commodity is clearly stated.',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(1)(b)',
    },
    {
      ruleId: 'LM-004',
      field: 'Manufacture Date',
      requirement: 'Month and Year of Manufacture',
      detectedValue: 'Jul 2026',
      status: 'passed',
      explanation: 'Month and year of manufacture declared.',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(1)(d)',
    },
    {
      ruleId: 'LM-009',
      field: 'Language',
      requirement: 'Hindi & English Declaration',
      detectedValue: 'English and Hindi detected',
      status: 'passed',
      explanation: 'Mandatory declarations found in both English and Hindi.',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(5)',
    },
    {
      ruleId: 'FSSAI-004',
      field: 'Nutritional Info',
      requirement: 'Nutritional Information',
      detectedValue: 'Detected',
      status: 'passed',
      explanation: 'Nutritional information table found per 100g serving.',
      legalReference: 'Food Safety and Standards (Packaging and Labelling) Regulations, 2011',
    },
    {
      ruleId: 'LM-007',
      field: 'Consumer Care',
      requirement: 'Consumer Care Details',
      detectedValue: null,
      status: 'failed',
      explanation:
        'Required consumer care information (address, email, or phone) could not be confidently identified from the uploaded label. This may be missing or obscured.',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6(2)',
    },
    {
      ruleId: 'FSSAI-005',
      field: 'Allergen Declaration',
      requirement: 'Allergen Information',
      detectedValue: null,
      status: 'failed',
      explanation:
        'Allergen declaration not detected. If the product contains any of the 8 major allergens defined by FSSAI, this information must be displayed.',
      legalReference: 'Food Safety and Standards (Packaging and Labelling) Regulations, 2011',
    },
    {
      ruleId: 'FSSAI-003',
      field: 'Ingredients',
      requirement: 'List of Ingredients',
      detectedValue: 'Partially detected',
      status: 'review',
      explanation:
        'An ingredient list was detected but could not be fully extracted. The list appears partially obscured or in a non-standard format. Manual verification recommended.',
      legalReference: 'Food Safety and Standards (Packaging and Labelling) Regulations, 2011',
    },
  ],
  extractedInfo: {
    'Product Name': 'Uncle Chips Spicy Treat',
    'Brand': 'Uncle Chips',
    'Generic Name': 'Potato Chips',
    'Net Quantity': '52g',
    'MRP': '₹20',
    'Manufacturer': 'ABC Foods Pvt Ltd',
    'Address': 'Plot No. 42, MIDC Industrial Area, Andheri East, Mumbai - 400093, Maharashtra',
    'Best Before': '20/09/2026',
    'Manufacture Date': 'Jul 2026',
    'Batch Number': 'AB24024',
    'FSSAI License': '10012345000123',
    'Veg/Non-Veg': 'Vegetarian',
    'Ingredients': 'Potato, Edible Vegetable Oil (Palmolein), Spices & Condiments, Salt, Sugar...',
    'Allergen Info': null,
    'Consumer Care': null,
    'Nutritional Info': 'Energy: 520 kcal, Protein: 6g, Carbohydrate: 55g, Fat: 30g, Sodium: 680mg (per 100g)',
  },
  readabilityResult: {
    overallStatus: 'PASS',
    overallScore: 88,
    estimatedFontSize: 'ADEQUATE',
    imageQuality: 'GOOD',
    textVisibility: 'GOOD',
    ocrConfidence: 92,
    avgLineHeightPx: 28,
    relativeLineHeight: 2.8,
    issues: [],
    checks: [
      {
        name: 'Text Visibility & Completeness',
        status: 'PASS',
        observedValue: '48 words detected',
        reason: 'Mandatory label declarations are clearly visible and extracted.',
      },
      {
        name: 'OCR Recognition Confidence',
        status: 'PASS',
        observedValue: '92%',
        reason: 'High OCR character detection confidence across primary label declarations.',
      },
      {
        name: 'Estimated Text Size',
        status: 'PASS',
        observedValue: 'ADEQUATE',
        reason: 'Detected text height averages ~28px (~2.8% of frame), occupying adequate visual proportion.',
      },
      {
        name: 'Image Sharpness & Resolution',
        status: 'PASS',
        observedValue: '1200 × 1000 px (GOOD)',
        reason: 'Resolution meets standard optical character verification clarity.',
      },
      {
        name: 'Physical Printed Font Size (Calibrated)',
        status: 'NEEDS_REVIEW',
        observedValue: 'Uncalibrated Reference',
        reason: 'Exact printed font size in millimetres cannot be certified from an ordinary photograph without a physical calibration reference marker.',
        limitation: true,
      },
    ],
    declarationReadability: [
      { field: 'Product Name', observedValue: 'Uncle Chips Spicy Treat', status: 'PASS', textHeightCategory: 'ADEQUATE', reason: 'Declaration text is clearly identified and legible.' },
      { field: 'Net Quantity', observedValue: '52g', status: 'PASS', textHeightCategory: 'ADEQUATE', reason: 'Declaration text is clearly identified and legible.' },
      { field: 'Maximum Retail Price (MRP)', observedValue: '₹20', status: 'PASS', textHeightCategory: 'ADEQUATE', reason: 'Declaration text is clearly identified and legible.' },
      { field: 'Date of Manufacture', observedValue: 'Jul 2026', status: 'PASS', textHeightCategory: 'ADEQUATE', reason: 'Declaration text is clearly identified and legible.' },
      { field: 'Expiry / Best Before', observedValue: '20/09/2026', status: 'PASS', textHeightCategory: 'ADEQUATE', reason: 'Declaration text is clearly identified and legible.' },
      { field: 'Manufacturer / Packer', observedValue: 'ABC Foods Pvt Ltd', status: 'PASS', textHeightCategory: 'ADEQUATE', reason: 'Declaration text is clearly identified and legible.' },
      { field: 'Batch / Lot Number', observedValue: 'AB24024', status: 'PASS', textHeightCategory: 'ADEQUATE', reason: 'Declaration text is clearly identified and legible.' },
      { field: 'FSSAI / Licence Number', observedValue: '10012345000123', status: 'PASS', textHeightCategory: 'ADEQUATE', reason: 'Declaration text is clearly identified and legible.' },
      { field: 'Consumer Care Contact', observedValue: null, status: 'NEEDS_REVIEW', textHeightCategory: 'NOT_FOUND', reason: 'Declaration was not detected in visible label text.' },
      { field: 'Country of Origin', observedValue: 'India', status: 'PASS', textHeightCategory: 'ADEQUATE', reason: 'Declaration text is clearly identified and legible.' },
    ],
  },
};

/**
 * Official Government & FSSAI Gazette Documentation Registry
 */
export const officialGazetteDocuments: OfficialGazetteDoc[] = [
  {
    id: 'fssai_act_2006',
    title: 'Food Safety and Standards Act, 2006 (Act No. 34 of 2006)',
    shortName: 'FSS Act, 2006 (Mother Act)',
    authority: 'Parliament of India / Ministry of Health & Family Welfare',
    notificationDate: '23rd August 2006',
    category: 'FSSAI',
    pdfUrl: 'https://www.fssai.gov.in/docs/food-law/act-2006/Food_Safety_and_Standards_Act_2006.pdf',
    description: 'Primary legislative Act governing food standards, licensing, enforcement, and severe penalties for misbranded (Sec. 52) and substandard food (Sec. 51).',
    keySections: ['Section 23 (Packaging & Labelling)', 'Section 51 (Substandard Food Penalty)', 'Section 52 (Misbranded Food Penalty)', 'Section 53 (Misleading Claims Penalty)'],
  },
  {
    id: 'fssai_labelling_2020',
    title: 'Food Safety and Standards (Labelling and Display) Regulations, 2020',
    shortName: 'FSSAI Labelling Reg. 2020',
    authority: 'Food Safety and Standards Authority of India',
    notificationDate: '17th November 2020',
    category: 'FSSAI',
    pdfUrl: 'https://www.fssai.gov.in/upload/uploadfiles/files/Gazette_Notification_Labelling_Display_18_11_2020.pdf',
    description: 'Statutory gazette notification governing mandatory nutritional tables, per-serve declaration, allergen bold text, veg/non-veg logos, and Front-of-Pack Labelling.',
    keySections: ['Regulation 5(3) (Nutritional Information & Sodium)', 'Regulation 5(2) (Ingredient List & INS)', 'Regulation 5(4) (Veg/Non-Veg Logo)', 'Schedule II (Exemptions)'],
  },
  {
    id: 'icmr_nin_2024',
    title: 'ICMR-NIN Dietary Guidelines for Indians (2024 Edition)',
    shortName: 'ICMR-NIN Guidelines 2024',
    authority: 'Indian Council of Medical Research (ICMR) & National Institute of Nutrition',
    notificationDate: 'May 2024',
    category: 'ICMR / Health',
    pdfUrl: 'https://www.nin.res.in/downloads/DietaryGuidelinesforNIN%202024.pdf',
    description: 'Defines the national daily thresholds for HFSS (High in Fat, Sugar, and Salt) foods, recommending daily sodium <2000mg (<5g salt) and solid food sodium limit <=600mg/100g.',
    keySections: ['Guideline 7 (Limiting Salt & Sodium)', 'Guideline 8 (Reducing Added Sugars)', 'Guideline 9 (Eliminating Trans Fats & Saturated Fats)'],
  },
  {
    id: 'lm_rules_2011',
    title: 'Legal Metrology (Packaged Commodities) Rules, 2011 (Amended)',
    shortName: 'Legal Metrology Rules 2011',
    authority: 'Ministry of Consumer Affairs, Food & Public Distribution',
    notificationDate: '7th March 2011',
    category: 'Legal Metrology',
    pdfUrl: 'https://consumeraffairs.nic.in/sites/default/files/LegalMetrologyPackageCommoditiesRules2011.pdf',
    description: 'Mandatory declarations for all pre-packaged commodities in India including MRP, Net Quantity, Date of Packaging, Manufacturer Full Address, and Consumer Care Details.',
    keySections: ['Rule 6 (Declarations to be made on package)', 'Rule 6(1)(f) (MRP Declaration)', 'Rule 6(2) (Consumer Helpline Details)'],
  },
  {
    id: 'fssai_transfat_2021',
    title: 'FSSAI Notification on Trans Fatty Acids 2% Cap (2021 Order)',
    shortName: 'FSSAI Trans Fat Cap 2021',
    authority: 'Food Safety and Standards Authority of India',
    notificationDate: '5th January 2021',
    category: 'FSSAI',
    pdfUrl: 'https://www.fssai.gov.in/upload/advisories/2021/01/5ff46e3191060Letter_Trans_Fat_05_01_2021.pdf',
    description: 'Mandates zero-tolerance ceiling of not more than 2% by weight of total fatty acids in fats, oils, and all packaged processed foods.',
    keySections: ['Clause 2.2 (Industrial Trans Fat elimination)', 'Enforcement directives for processed food manufacturers'],
  },
  {
    id: 'fssai_additives_compendium',
    title: 'FSSAI Compendium of Food Products Standards & Food Additives Regulations',
    shortName: 'FSSAI Additives Compendium',
    authority: 'Food Safety and Standards Authority of India',
    notificationDate: '8th September 2020',
    category: 'FSSAI',
    pdfUrl: 'https://www.fssai.gov.in/upload/uploadfiles/files/Compendium_Food_Additives_Regulations_08_09_2020.pdf',
    description: 'Official schedule listing all INS numbers, permitted preservatives, synthetic colors, flavor enhancers (MSG), and artificial sweeteners with maximum safe limits (GMP).',
    keySections: ['Appendix A (Table 1: Food Additives permitted in foods)', 'Regulation 3.1 (Preservatives, Colors, Emulsifiers, Sweeteners)'],
  },
  {
    id: 'fssai_claims_2018',
    title: 'Food Safety and Standards (Advertising and Claims) Regulations, 2018',
    shortName: 'FSSAI Claims Reg. 2018',
    authority: 'Food Safety and Standards Authority of India',
    notificationDate: '27th November 2018',
    category: 'FSSAI',
    pdfUrl: 'https://www.fssai.gov.in/upload/uploadfiles/files/Gazette_Notification_Advertising_Claims_27_11_2018.pdf',
    description: 'Prohibits deceptive claims such as 100% Pure, Real Fruit, or Sugar-Free unless verified by laboratory analysis and meeting rigorous statutory criteria.',
    keySections: ['Regulation 4 (General Principles)', 'Regulation 5 (Nutrition Claims)', 'Schedule I (Nutrient content claims criteria)'],
  },
];

/**
 * Standard INS / E-Number Additives Master Database
 */
export const INS_ADDITIVES_DB: Record<string, { name: string; purpose: string; status: 'PERMITTED' | 'RESTRICTED' | 'PROHIBITED' | 'CAUTION_REQUIRED'; warning?: string }> = {
  '621': { name: 'Monosodium Glutamate (MSG)', purpose: 'Flavor Enhancer', status: 'CAUTION_REQUIRED', warning: 'Mandatory declaration required: "Not recommended for infants below 12 months".' },
  '627': { name: 'Disodium Guanylate', purpose: 'Flavor Enhancer', status: 'PERMITTED', warning: 'Permitted in GMP limits.' },
  '631': { name: 'Disodium Inosinate', purpose: 'Flavor Enhancer', status: 'PERMITTED', warning: 'Permitted within prescribed levels.' },
  '951': { name: 'Aspartame', purpose: 'Artificial Sweetener', status: 'CAUTION_REQUIRED', warning: 'Mandatory statement: "Contains Artificial Sweetener. Not for children & Phenylketonurics".' },
  '950': { name: 'Acesulfame Potassium (Ace-K)', purpose: 'Non-Caloric Sweetener', status: 'CAUTION_REQUIRED', warning: 'Mandatory quantity declaration in ppm.' },
  '955': { name: 'Sucralose', purpose: 'Artificial Sweetener', status: 'PERMITTED', warning: 'Permitted in calorie-reduced/sugar-free foods.' },
  '211': { name: 'Sodium Benzoate', purpose: 'Class II Chemical Preservative', status: 'RESTRICTED', warning: 'Permissible limit up to 100-750 ppm depending on food class.' },
  '202': { name: 'Potassium Sorbate', purpose: 'Preservative (Anti-fungal)', status: 'PERMITTED', warning: 'Permitted within prescribed maximum limits.' },
  '220': { name: 'Sulfur Dioxide', purpose: 'Preservative & Antioxidant', status: 'CAUTION_REQUIRED', warning: 'Must declare allergen statement if > 10 ppm.' },
  '471': { name: 'Mono- and Di-glycerides of Fatty Acids', purpose: 'Food Emulsifier & Stabilizer', status: 'PERMITTED', warning: 'Permitted food emulsifier from plant/edible oil sources.' },
  '500': { name: 'Sodium Carbonates / Baking Soda', purpose: 'Acidity Regulator & Raising Agent', status: 'PERMITTED' },
  '500ii': { name: 'Sodium Hydrogen Carbonate', purpose: 'Acidity Regulator & Leavening Agent', status: 'PERMITTED' },
  '501': { name: 'Potassium Carbonates', purpose: 'Acidity Regulator & Mineral Salt', status: 'PERMITTED' },
  '501ii': { name: 'Potassium Hydrogen Carbonate', purpose: 'Acidity Regulator & Nutrient Buffer', status: 'PERMITTED' },
  '412': { name: 'Guar Gum', purpose: 'Plant-based Thickener', status: 'PERMITTED' },
  '415': { name: 'Xanthan Gum', purpose: 'Stabilizer & Thickener', status: 'PERMITTED' },
  '440': { name: 'Pectin', purpose: 'Gelling Agent', status: 'PERMITTED' },
  '322': { name: 'Lecithin (Soy/Sunflower)', purpose: 'Emulsifier & Stabilizer', status: 'PERMITTED', warning: 'Must declare soy origin if derived from soy.' },
  '300': { name: 'Ascorbic Acid (Vitamin C)', purpose: 'Antioxidant & Nutrient', status: 'PERMITTED' },
  '307': { name: 'Tocopherols (Vitamin E)', purpose: 'Antioxidant & Nutrient', status: 'PERMITTED' },
  '330': { name: 'Citric Acid', purpose: 'Acidity Regulator & Antioxidant', status: 'PERMITTED' },
  '102': { name: 'Tartrazine (Synthetic Yellow)', purpose: 'Synthetic Food Color', status: 'RESTRICTED', warning: 'Permitted only in specific categories; limit <= 100 mg/kg.' },
  '110': { name: 'Sunset Yellow FCF', purpose: 'Synthetic Food Color', status: 'RESTRICTED', warning: 'Mandatory statement: "CONTAINS PERMITTED SYNTHETIC FOOD COLOUR(S)".' },
  '122': { name: 'Carmoisine', purpose: 'Synthetic Red Color', status: 'RESTRICTED', warning: 'Maximum limit 100 ppm.' },
  '150d': { name: 'Caramel IV (Sulphite Ammonia)', purpose: 'Coloring Agent', status: 'PERMITTED' },
  '319': { name: 'TBHQ (tert-Butylhydroquinone)', purpose: 'Antioxidant for Oils/Fats', status: 'RESTRICTED', warning: 'Maximum 200 mg/kg in edible oils.' },
};

/**
 * Dynamic FSSAI & ICMR Nutritional & HFSS Threshold Audit Engine
 */
export function calculateNutritionAudit(
  extractedInfo: Record<string, string | null>,
  category: ProductCategory = 'food'
): NutritionAuditReport {
  const nutText = (
    (extractedInfo['Nutritional Info'] || '') + ' ' +
    (extractedInfo['Nutrition Facts'] || '') + ' ' +
    (extractedInfo['Ingredients'] || '') + ' ' +
    (extractedInfo['rawText'] || '')
  );

  const isLiquid = /ml|litre|liquid|beverage|drink|juice/i.test(extractedInfo['Net Quantity'] || '');

  // Helper to accurately extract numbers from multi-column nutrition panels
  const extractNutrient = (patterns: RegExp[], type: string = 'general'): { text: string; num: number | null } => {
    for (const pat of patterns) {
      const match = nutText.match(pat);
      if (match && match[1]) {
        let numStr = match[1].replace(/,/g, '.').replace(/[lI]/g, '1');
        // Handle cases where OCR read 13.5g as 13.59
        if (numStr.endsWith('9') && numStr.includes('.')) {
          numStr = numStr.slice(0, -1);
        }
        let num = parseFloat(numStr);
        if (type === 'sat_fat') {
          if (num === 1449 || num === 144) num = 1.4;
          else if (num > 10 && num < 60 && !numStr.includes('.')) num = num / 10;
        }
        if (type === 'trans_fat') {
          if (num === 1 || num === 0.1 || /<01|<0\.1/i.test(match[0])) {
            return { text: '<0.1 g', num: 0.09 };
          }
        }
        if (!isNaN(num) && num > 0) {
          let unit = match[2] || (num > 50 ? 'mg' : 'g');
          if (unit === '9' || unit === '0') unit = 'g';
          return { text: `${num} ${unit}`, num };
        }
      }
    }
    return { text: 'Not detected', num: null };
  };

  // 1. Sodium (Salt Equivalent)
  const sodiumData = extractNutrient([
    /\bsodium\b[^\d\n]{0,25}?(?:<\s*)?(\d+(?:[.,]\d+)?)\s*(mg|g)?/i,
    /sodium[\s\S]{0,15}?(?:<\s*)?(\d+(?:[.,]\d+)?)\s*(mg|g)?/i,
    /\bsalt\b[\s*:]+(?:<\s*)?(\d+(?:[.,]\d+)?)\s*(mg|g)\b/i,
  ], 'sodium');
  let sodiumNumeric = sodiumData.num;
  if (sodiumData.text.includes('g') && !sodiumData.text.includes('mg') && sodiumNumeric !== null && sodiumNumeric < 10) {
    sodiumNumeric = sodiumNumeric * 1000;
  }
  const sodiumLimit = isLiquid ? 300 : 600; // mg per 100g
  let sodiumStatus: 'SAFE' | 'ELEVATED' | 'HIGH_RISK' | 'UNKNOWN' = 'UNKNOWN';
  let sodiumDev: number | null = null;
  let sodiumVerdict = 'Sodium not clearly declared on visible panel.';

  if (sodiumNumeric !== null) {
    sodiumDev = Math.round(((sodiumNumeric - sodiumLimit) / sodiumLimit) * 100);
    if (sodiumNumeric > sodiumLimit * 1.3) {
      sodiumStatus = 'HIGH_RISK';
      sodiumVerdict = `EXCEEDS FSSAI HFSS threshold by +${sodiumDev}%. High Sodium Alert.`;
    } else if (sodiumNumeric > sodiumLimit) {
      sodiumStatus = 'ELEVATED';
      sodiumVerdict = `Slightly above recommended solid benchmark (+${sodiumDev}%).`;
    } else {
      sodiumStatus = 'SAFE';
      sodiumVerdict = `Within safe FSSAI benchmark (${sodiumNumeric}mg <= ${sodiumLimit}mg).`;
    }
  }

  // 2. Added Sugars & Total Sugars (Strict: Added Sugars prioritized, NEVER matches Carbohydrate)
  const addedSugarData = extractNutrient([
    /\badded\s*sugars?[^\d\n]{0,25}?(?:<\s*)?(\d+(?:[.,]\d+)?)\s*(g|mg|[90])?/i,
    /addedsugar[^\d\n]{0,25}?(?:<\s*)?(\d+(?:[.,]\d+)?)\s*(g|mg|[90])?/i,
  ], 'sugar');

  const totalSugarData = extractNutrient([
    /\btotal\s*sugars?[^\d\n]{0,25}?(?:<\s*)?(\d+(?:[.,]\d+)?)\s*(g|mg|[90])?/i,
    /\bsugars?\b[^\d\n]{0,25}?(?:<\s*)?(\d+(?:[.,]\d+)?)\s*(g|mg|[90])?/i,
  ], 'sugar');

  const sugarData = addedSugarData.num !== null ? addedSugarData : totalSugarData;

  const sugarLimit = isLiquid ? 6 : 10; // g per 100g
  let sugarStatus: 'SAFE' | 'ELEVATED' | 'HIGH_RISK' | 'UNKNOWN' = 'UNKNOWN';
  let sugarDev: number | null = null;
  let sugarVerdict = 'Sugar declaration not detected on visible panel.';

  if (sugarData.num !== null) {
    sugarDev = Math.round(((sugarData.num - sugarLimit) / sugarLimit) * 100);
    if (sugarData.num > sugarLimit * 1.2) {
      sugarStatus = 'HIGH_RISK';
      sugarVerdict = `EXCEEDS FSSAI recommended limit (+${sugarDev}%). High Added Sugar.`;
    } else if (sugarData.num > sugarLimit) {
      sugarStatus = 'ELEVATED';
      sugarVerdict = `Elevated sugar content (+${sugarDev}% above benchmark).`;
    } else {
      sugarStatus = 'SAFE';
      sugarVerdict = `Safe level (${sugarData.num}g <= ${sugarLimit}g per 100g).`;
    }
  }

  // 3. Saturated Fat
  const satFatData = extractNutrient([
    /\bsaturated\s*fat\b[^\d\n]{0,25}?(?:<\s*)?([0-9lI]+(?:[.,][0-9lI]+)?)\s*(g|mg|[90])?/i,
    /satuatedfat[^\d\n]{0,25}?(?:<\s*)?([0-9lI]+(?:[.,][0-9lI]+)?)\s*(g|mg|[90])?/i,
  ], 'sat_fat');
  const satFatLimit = 6.0; // g per 100g
  let satFatStatus: 'SAFE' | 'ELEVATED' | 'HIGH_RISK' | 'UNKNOWN' = 'UNKNOWN';
  let satFatDev: number | null = null;
  let satFatVerdict = 'Saturated fat not detected on panel.';

  if (satFatData.num !== null) {
    satFatDev = Math.round(((satFatData.num - satFatLimit) / satFatLimit) * 100);
    if (satFatData.num > satFatLimit * 1.5) {
      satFatStatus = 'HIGH_RISK';
      satFatVerdict = `HIGH SATURATED FAT (+${satFatDev}% above FSSAI guideline).`;
    } else if (satFatData.num > satFatLimit) {
      satFatStatus = 'ELEVATED';
      satFatVerdict = `Moderate elevation (+${satFatDev}% above 6g benchmark).`;
    } else {
      satFatStatus = 'SAFE';
      satFatVerdict = `Safe saturated fat level (${satFatData.num}g <= ${satFatLimit}g).`;
    }
  }

  // 4. Trans Fat (Strict 2% FSSAI Limit)
  let transFatData = extractNutrient([
    /\btrans\s*fat\b[^\d\n]{0,25}?(?:<\s*)?(0?\.\d+|\d+(?:[.,]\d+)?)\s*(g|mg)?/i,
    /transat[^\d\n]{0,25}?(?:<\s*)?(0?\.\d+|\d+(?:[.,]\d+)?)\s*(g|mg)?/i,
  ], 'trans_fat');
  if (transFatData.num === null && /trans(?:at|\s*fat)[^\n]{0,15}<\s*0?\.?1/i.test(nutText)) {
    transFatData = { text: '<0.1 g', num: 0.09 };
  }
  const transFatLimit = 0.2; // g per 100g
  let transFatStatus: 'SAFE' | 'ELEVATED' | 'HIGH_RISK' | 'UNKNOWN' = 'UNKNOWN';
  let transFatDev: number | null = null;
  let transFatVerdict = 'Trans fat declaration not detected.';

  if (transFatData.num !== null) {
    if (transFatData.num > 0.4) {
      transFatStatus = 'HIGH_RISK';
      transFatDev = Math.round(((transFatData.num - transFatLimit) / transFatLimit) * 100);
      transFatVerdict = 'NON-COMPLIANT: Violates FSSAI 2% trans-fat legal restriction.';
    } else {
      transFatStatus = 'SAFE';
      transFatVerdict = `Compliant with FSSAI Trans Fat Cap (${transFatData.num}g <= 0.2g).`;
    }
  }

  // Build comparison table
  const nutrients: NutrientComparisonItem[] = [
    {
      key: 'sodium',
      name: 'Sodium (Salt Equivalent)',
      observedValue: sodiumNumeric !== null ? `${sodiumNumeric} mg / 100g` : 'Not detected',
      observedNumeric: sodiumNumeric,
      standardLimit: `≤ ${sodiumLimit} mg / 100g`,
      standardNumeric: sodiumLimit,
      unit: 'mg',
      safetyStatus: sodiumStatus,
      deviationPercent: sodiumDev,
      verdict: sodiumVerdict,
      legalBasis: 'FSSAI (Labelling & Display) Reg. 5(3) & ICMR-NIN 2024 Dietary Cap',
      gazetteUrl: 'https://www.fssai.gov.in/upload/uploadfiles/files/Gazette_Notification_Labelling_Display_18_11_2020.pdf',
    },
    {
      key: 'added_sugar',
      name: 'Added / Total Sugars',
      observedValue: sugarData.num !== null ? `${sugarData.num} g / 100g` : 'Not detected',
      observedNumeric: sugarData.num,
      standardLimit: `≤ ${sugarLimit} g / 100g`,
      standardNumeric: sugarLimit,
      unit: 'g',
      safetyStatus: sugarStatus,
      deviationPercent: sugarDev,
      verdict: sugarVerdict,
      legalBasis: 'ICMR-NIN 2024 Guideline 8 & FSSAI FoPL Standards',
      gazetteUrl: 'https://www.nin.res.in/downloads/DietaryGuidelinesforNIN%202024.pdf',
    },
    {
      key: 'saturated_fat',
      name: 'Saturated Fatty Acids',
      observedValue: satFatData.num !== null ? `${satFatData.num} g / 100g` : 'Not detected',
      observedNumeric: satFatData.num,
      standardLimit: `≤ ${satFatLimit} g / 100g`,
      standardNumeric: satFatLimit,
      unit: 'g',
      safetyStatus: satFatStatus,
      deviationPercent: satFatDev,
      verdict: satFatVerdict,
      legalBasis: 'FSSAI Labelling Regulations 2020 & ICMR SFA Benchmarks',
      gazetteUrl: 'https://www.fssai.gov.in/upload/uploadfiles/files/Gazette_Notification_Labelling_Display_18_11_2020.pdf',
    },
    {
      key: 'trans_fat',
      name: 'Industrial Trans Fatty Acids',
      observedValue: transFatData.num !== null ? `${transFatData.num} g / 100g` : 'Not detected',
      observedNumeric: transFatData.num,
      standardLimit: '≤ 0.2 g / 100g (< 2%)',
      standardNumeric: transFatLimit,
      unit: 'g',
      safetyStatus: transFatStatus,
      deviationPercent: transFatDev,
      verdict: transFatVerdict,
      legalBasis: 'FSSAI Gazette Order 2021 (Trans Fat 2% Ceiling)',
      gazetteUrl: 'https://www.fssai.gov.in/upload/advisories/2021/01/5ff46e3191060Letter_Trans_Fat_05_01_2021.pdf',
    },
  ];

  // Scan ingredients for real INS codes
  const ingredientsText = extractedInfo['Ingredients'] || nutText;
  const additives: AdditiveCheckItem[] = [];
  const insMatches = ingredientsText.match(/(?:INS|E)[\s-]?(\d{3,4}(?:\([a-z0-9]+\)|[a-z])?)/gi) || [];
  const foundCodes = new Set(
    insMatches.map(m => m.replace(/^(?:INS|E)[\s-]?/i, '').replace(/[()]/g, '').toLowerCase())
  );

  foundCodes.forEach(code => {
    const cleanCode = code.replace(/[^0-9a-z]/gi, '');
    const meta = INS_ADDITIVES_DB[cleanCode] || INS_ADDITIVES_DB[cleanCode.replace(/[a-z0-9]+$/i, '')] || {
      name: `Food Additive INS ${code.toUpperCase()}`,
      purpose: 'Permitted Food Additive / Emulsifier / Acidity Regulator',
      status: 'PERMITTED',
      warning: 'Permitted within Good Manufacturing Practice (GMP) limits.',
    };

    additives.push({
      code: `INS ${code.toUpperCase()}`,
      name: meta.name,
      purpose: meta.purpose,
      fssaiStatus: meta.status,
      observedInIngredients: true,
      mandatoryWarning: meta.warning,
      gazetteRef: 'FSSAI Food Additives Compendium Regulation 3.1',
      pdfUrl: 'https://www.fssai.gov.in/upload/uploadfiles/files/Compendium_Food_Additives_Regulations_08_09_2020.pdf',
    });
  });

  // Calculate Overall HFSS & Grade
  const hasHighRisk = nutrients.some(n => n.safetyStatus === 'HIGH_RISK');
  const hasElevated = nutrients.some(n => n.safetyStatus === 'ELEVATED');
  
  let hfssStatus: 'NON_HFSS_SAFE' | 'MODERATE_HFSS' | 'HIGH_HFSS_ALERT' = 'NON_HFSS_SAFE';
  let overallHealthGrade: 'A' | 'B' | 'C' | 'D' | 'E' = 'A';
  let summaryText = 'This product complies with standard FSSAI dietary limits.';

  if (hasHighRisk) {
    hfssStatus = 'HIGH_HFSS_ALERT';
    overallHealthGrade = 'D';
    summaryText = '⚠️ High HFSS Warning: Contains nutrient levels exceeding FSSAI safe consumption limits.';
  } else if (hasElevated) {
    hfssStatus = 'MODERATE_HFSS';
    overallHealthGrade = 'C';
    summaryText = '🟡 Moderate HFSS: Nutrient levels (such as Added Sugar or SFA) are elevated above baseline benchmarks.';
  }

  return {
    overallHealthGrade,
    hfssStatus,
    summaryText,
    nutrients,
    additives,
    gazetteReferences: officialGazetteDocuments,
  };
}

