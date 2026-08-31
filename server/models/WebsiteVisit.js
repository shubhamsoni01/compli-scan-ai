/**
 * Mongoose WebsiteVisit Model
 * Database: compliscan_ai
 * Collection: website_visits
 */

import mongoose from 'mongoose';

const WebsiteVisitSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  page: {
    type: String,
    default: '/',
  },
  visitedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  userAgent: {
    type: String,
    default: '',
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'unknown'],
    default: 'unknown',
  },
  browser: {
    type: String,
    default: 'unknown',
  },
  operatingSystem: {
    type: String,
    default: 'unknown',
  },
}, {
  timestamps: true,
  collection: 'website_visits',
});

// Composite index for fast session and timestamp lookups
WebsiteVisitSchema.index({ sessionId: 1, visitedAt: -1 });

export const WebsiteVisit = mongoose.models.WebsiteVisit || mongoose.model('WebsiteVisit', WebsiteVisitSchema);
export default WebsiteVisit;
