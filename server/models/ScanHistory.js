/**
 * Mongoose ScanHistory (Activity Tracking) Model
 * Database: compliscan_ai
 * Collection: scan_history
 */

import mongoose from 'mongoose';

const ScanHistorySchema = new mongoose.Schema({
  scanId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  sessionId: {
    type: String,
    default: null,
    index: true,
  },
  scannedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  category: {
    type: String,
    default: 'Unknown',
    index: true,
  },
  productName: {
    type: String,
    default: 'Not detected',
  },
  ocrSuccess: {
    type: Boolean,
    default: true,
  },
  analysisSuccess: {
    type: Boolean,
    default: true,
  },
  complianceScore: {
    type: Number,
    default: 0,
  },
  complianceStatus: {
    type: String,
    enum: ['COMPLIANT', 'POTENTIAL_NON_COMPLIANCE', 'NEEDS_REVIEW', 'FAILED'],
    default: 'NEEDS_REVIEW',
  },
}, {
  timestamps: true,
  collection: 'scan_history',
});

ScanHistorySchema.index({ scannedAt: -1 });

export const ScanHistory = mongoose.models.ScanHistory || mongoose.model('ScanHistory', ScanHistorySchema);
export default ScanHistory;
