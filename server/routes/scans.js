import express from 'express';
import { Scan } from '../models/Scan.js';
import { ScanHistory } from '../models/ScanHistory.js';
import { isDbConnected } from '../config/database.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/scans
 * Saves a completed scan document to MongoDB Atlas
 * Binds scan to req.userId from verified session (never trusting client userId)
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const {
      scanId,
      productName,
      brand,
      category,
      mrp,
      netQuantity,
      manufacturer,
      manufacturingDate,
      expiryDate,
      batchNumber,
      consumerCare,
      ingredients,
      countryOfOrigin,
      licenseNumber,
      rawOCRText,
      groqStructuredJSON,
      ruleResults,
      complianceScore,
      overallStatus,
      reportData = null,
      readabilityResult = null,
      originalImageUrl = null,
      userName = null,
      userEmail = null,
      reportId = null,
    } = req.body;

    if (!scanId) {
      return res.status(400).json({
        success: false,
        error: 'Missing mandatory scanId.',
      });
    }

    if (complianceScore === undefined || complianceScore === null) {
      return res.status(400).json({
        success: false,
        error: 'Missing mandatory complianceScore.',
      });
    }

    // Check if MongoDB is connected
    if (!isDbConnected()) {
      console.warn(`[MongoDB Warning]: Database is not connected. Scan ${scanId} was not written to MongoDB.`);
      return res.status(503).json({
        success: false,
        error: 'Unable to save scan history. Your analysis is still available.',
      });
    }

    // Check for existing scanId to prevent duplicate insertions
    const existing = await Scan.findOne({ scanId });
    if (existing) {
      // Update any updated reportData or image if provided
      if (reportData && !existing.reportData) existing.reportData = reportData;
      if (originalImageUrl && !existing.originalImageUrl) existing.originalImageUrl = originalImageUrl;
      await existing.save();
      return res.status(200).json({
        success: true,
        scanId,
        message: 'Scan already saved in database.',
      });
    }

    // Map overall status to standard set if needed
    let statusFormatted = overallStatus || 'NEEDS_REVIEW';
    if (statusFormatted === 'Mostly Compliant') statusFormatted = 'COMPLIANT';
    else if (statusFormatted === 'Potential Non-Compliance') statusFormatted = 'POTENTIAL_NON_COMPLIANCE';
    else if (statusFormatted === 'Needs Review') statusFormatted = 'NEEDS_REVIEW';

    const newScan = new Scan({
      scanId,
      userId: userId || null,
      userName: userName || (req.user ? req.user.name : 'CompliScan User'),
      userEmail: userEmail || (req.user ? req.user.email : ''),
      originalImageUrl: originalImageUrl || null,
      reportId: reportId || null,
      productName: productName || 'Not detected',
      brand: brand || 'Not detected',
      category: category || 'Unknown',
      mrp: mrp || null,
      netQuantity: netQuantity || null,
      manufacturer: manufacturer || null,
      manufacturingDate: manufacturingDate || null,
      expiryDate: expiryDate || null,
      batchNumber: batchNumber || null,
      consumerCare: consumerCare || null,
      ingredients: ingredients || null,
      countryOfOrigin: countryOfOrigin || null,
      licenseNumber: licenseNumber || null,
      rawOCRText: rawOCRText || '',
      groqStructuredJSON: groqStructuredJSON || {},
      ruleResults: Array.isArray(ruleResults) ? ruleResults : [],
      complianceScore: Number(complianceScore),
      overallStatus: statusFormatted,
      reportData,
      readabilityResult,
    });

    await newScan.save();
    console.log(`[MongoDB Success]: Saved real scan document: ${scanId} ("${newScan.productName}")`);

    // Record in scan_history collection for activity & analytics tracking
    try {
      const historyEntry = new ScanHistory({
        scanId,
        sessionId: req.body.sessionId || null,
        scannedAt: new Date(),
        category: newScan.category,
        productName: newScan.productName,
        ocrSuccess: Boolean(newScan.rawOCRText && newScan.rawOCRText.length > 0),
        analysisSuccess: Boolean(newScan.groqStructuredJSON && Object.keys(newScan.groqStructuredJSON).length > 0),
        complianceScore: newScan.complianceScore,
        complianceStatus: statusFormatted,
      });
      await historyEntry.save();
    } catch (hErr) {
      console.warn('[ScanHistory warning]:', hErr.message);
    }

    return res.status(201).json({
      success: true,
      scanId,
      message: 'Scan saved successfully',
    });
  } catch (error) {
    console.error('[MongoDB Save Error]:', error.message);
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        scanId: req.body.scanId,
        message: 'Scan already saved in database.',
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Unable to save scan history. Your analysis is still available.',
    });
  }
});

/**
 * GET /api/scans
 * Retrieves real scan history list from MongoDB Atlas
 * Returns recent scans sorted by createdAt desc
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        scans: [],
        warning: 'MongoDB is disconnected.',
      });
    }

    const { limit = 50, category, status, search } = req.query;

    // Enforce User Ownership: User only retrieves their own records
    const query = { userId: req.userId };

    if (category && category !== 'all') {
      query.category = new RegExp(category, 'i');
    }
    if (status && status !== 'all') {
      query.overallStatus = new RegExp(status, 'i');
    }

    // Server-side fast case-insensitive search by Product Name, Brand, Category, or Scan ID
    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { productName: searchRegex },
        { brand: searchRegex },
        { scanId: searchRegex },
        { category: searchRegex },
      ];
    }

    const scans = await Scan.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select('scanId productName brand category complianceScore overallStatus createdAt originalImageUrl reportId readabilityResult complaintData')
      .lean();

    return res.status(200).json({
      success: true,
      count: scans.length,
      scans,
    });
  } catch (error) {
    console.error('[MongoDB Fetch Error]:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Unable to retrieve scan history.',
    });
  }
});

/**
 * POST /api/scans/:id/complaint
 * Direct 1-click complaint submission to Admin / Enforcement Dashboard
 * Attaches real user, scan, report, image, and status data without requiring a manual form
 */
router.post('/:id/complaint', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDbConnected()) {
      return res.status(503).json({ success: false, error: 'Database unavailable.' });
    }

    const scan = await Scan.findOne({ scanId: id });
    if (!scan) {
      return res.status(404).json({ success: false, error: 'Scan not found.' });
    }

    // Verify ownership
    if (scan.userId && scan.userId !== req.userId && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized to file a complaint for this scan.' });
    }

    const complaintData = {
      complaintId: `CMP-${Date.now()}-${scan.scanId.slice(-4).toUpperCase()}`,
      status: 'Submitted', // Submitted | Under Review | Investigation | Resolved | Rejected
      submittedAt: new Date(),
      userName: scan.userName || req.user?.name || 'CompliScan User',
      userEmail: scan.userEmail || req.user?.email || '',
      productName: scan.productName,
      category: scan.category,
      complianceScore: scan.complianceScore,
      overallStatus: scan.overallStatus,
      scanId: scan.scanId,
      reportId: scan.reportId,
      originalImageUrl: scan.originalImageUrl,
      ruleResultsCount: scan.ruleResults?.length || 0,
      adminPriority: scan.complianceScore < 60 || scan.overallStatus === 'NEEDS_REVIEW' ? 'HIGH' : 'NORMAL',
    };

    scan.complaintData = complaintData;
    await scan.save();

    console.log(`[Complaint Filed]: ${complaintData.complaintId} for scan ${scan.scanId} by ${complaintData.userEmail}`);

    return res.status(200).json({
      success: true,
      message: 'Complaint submitted directly to Enforcement Dashboard.',
      complaint: complaintData,
    });
  } catch (error) {
    console.error('[Complaint Submission Error]:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to submit complaint.' });
  }
});

/**
 * PATCH /api/scans/:id/edit
 * Saves reviewer / user edits for an editable report
 * Maintains original OCR and AI data intact
 */
router.patch('/:id/edit', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewerEdits } = req.body;

    if (!isDbConnected()) {
      return res.status(503).json({ success: false, error: 'Database unavailable.' });
    }

    const scan = await Scan.findOne({ scanId: id });
    if (!scan) {
      return res.status(404).json({ success: false, error: 'Scan not found.' });
    }

    // Verify ownership: only owner or admin can edit
    if (scan.userId && scan.userId !== req.userId && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized to edit this scan report.' });
    }

    scan.reviewerEdits = reviewerEdits;
    await scan.save();

    return res.status(200).json({
      success: true,
      message: 'Report edits saved successfully.',
      scan,
    });
  } catch (error) {
    console.error('[Scan Edit Save Error]:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to save report edits.' });
  }
});

/**
 * GET /api/scans/:id
 * Retrieves one complete saved scan document by scanId
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database unavailable.',
      });
    }

    const scan = await Scan.findOne({ scanId: id }).lean();
    if (!scan) {
      return res.status(404).json({
        success: false,
        error: `Scan with ID "${id}" was not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      scan,
    });
  } catch (error) {
    console.error('[MongoDB Lookup Error]:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Unable to retrieve scan details.',
    });
  }
});

/**
 * DELETE /api/scans/:id
 * Deletes a scan from history
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database unavailable.',
      });
    }

    const deleted = await Scan.findOneAndDelete({ scanId: id });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Scan not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Scan deleted successfully.',
    });
  } catch (error) {
    console.error('[MongoDB Delete Error]:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Unable to delete scan.',
    });
  }
});

export default router;
