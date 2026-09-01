/**
 * Mongoose Scan Model
 * Database: compliscan_ai
 * Collection: scans
 */

import mongoose from 'mongoose';

const RuleResultSchema = new mongoose.Schema({
  ruleId: { type: String, required: true },
  ruleName: { type: String },
  regulation: { type: String },
  title: { type: String },
  requirement: { type: String },
  status: { 
    type: String, 
    required: true,
    enum: ['PASS', 'FAIL', 'NEEDS_REVIEW', 'NOT_APPLICABLE', 'passed', 'failed', 'review', 'not-applicable'] 
  },
  observedValue: { type: String, default: null },
  requiredValue: { type: String, default: null },
  explanation: { type: String },
  officialSource: { type: String },
  sourceAuthority: { type: String },
  officialUrl: { type: String },
}, { _id: false });

const ScanSchema = new mongoose.Schema({
  scanId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
  },
  userId: {
    type: String,
    default: null,
    index: true,
  },
  userName: { type: String, default: 'CompliScan User' },
  userEmail: { type: String, default: '' },
  originalImageUrl: { type: String, default: null },
  originalFilename: { type: String, default: null },
  reportId: { type: String, default: null },
  // Extracted Product Metadata
  productName: { type: String, default: 'Not detected' },
  brand: { type: String, default: 'Not detected' },
  category: { type: String, default: 'Unknown' },
  mrp: { type: String, default: null },
  netQuantity: { type: String, default: null },
  manufacturer: { type: String, default: null },
  manufacturingDate: { type: String, default: null },
  expiryDate: { type: String, default: null },
  batchNumber: { type: String, default: null },
  consumerCare: { type: String, default: null },
  ingredients: { type: String, default: null },
  countryOfOrigin: { type: String, default: null },
  licenseNumber: { type: String, default: null },

  // Exact Raw OCR Text (unmodified)
  rawOCRText: { type: String, default: '' },

  // Exact Groq Structured JSON (unmodified)
  groqStructuredJSON: { type: mongoose.Schema.Types.Mixed, default: {} },

  // Deterministic Rule Engine Results
  ruleResults: [RuleResultSchema],

  // Compliance Scoring
  complianceScore: { type: Number, required: true, min: 0, max: 100 },
  overallStatus: { 
    type: String, 
    required: true,
    enum: ['COMPLIANT', 'POTENTIAL_NON_COMPLIANCE', 'NEEDS_REVIEW', 'Mostly Compliant', 'Potential Non-Compliance', 'Needs Review']
  },

  // Generated Report Data & Metadata
  reportData: { type: mongoose.Schema.Types.Mixed, default: null },

  // Font Size & Readability Analysis Results
  readabilityResult: { type: mongoose.Schema.Types.Mixed, default: null },

  // Reviewer / User Edits for Editable Report (Separate from original AI data)
  reviewerEdits: { type: mongoose.Schema.Types.Mixed, default: null },

  // Optional complaint structure for future readiness
  complaintData: { type: mongoose.Schema.Types.Mixed, default: null },
}, {
  timestamps: true, // adds createdAt & updatedAt
  collection: 'scans',
});

// Avoid model overwrite errors upon hot-reload
export const Scan = mongoose.models.Scan || mongoose.model('Scan', ScanSchema);
export default Scan;
