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
      originalFilename = null,
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
      if (originalFilename && !existing.originalFilename) existing.originalFilename = originalFilename;
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
      originalFilename: originalFilename || 'Original filename unavailable',
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

    // Enforce User Ownership: Regular users retrieve only their own records;
    // Authorized Ministry Officers & Super Admins can audit all records across jurisdictions
    const isOfficer = req.user && (
      req.user.role === 'admin' || 
      req.user.role === 'super_admin' || 
      req.user.role === 'Ministry Enforcement Officer' ||
      req.user.email === 'sih@gmail.com'
    );
    const query = isOfficer ? {} : { userId: req.userId };

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
      .select('scanId productName brand category complianceScore overallStatus createdAt originalImageUrl originalFilename reportId readabilityResult complaintData enforcementData ruleResults')
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

/**
 * GET /api/scans/enforcement/cases
 * Returns all active enforcement actions, statutory show-cause notices, and citizen grievances
 */
router.get('/enforcement/cases', optionalAuth, async (_req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        cases: [],
        summary: { totalNotices: 0, activeInvestigations: 0, citizenComplaints: 0, resolved: 0, compoundingFines: 0 },
      });
    }

    // Find scans that either have enforcementData, complaintData, or are non-compliant
    const enforcementScans = await Scan.find({
      $or: [
        { enforcementData: { $ne: null } },
        { complaintData: { $ne: null } },
        { overallStatus: 'POTENTIAL_NON_COMPLIANCE' },
        { complianceScore: { $lt: 60 } },
      ],
    })
      .sort({ updatedAt: -1 })
      .limit(60)
      .select('scanId productName brand category complianceScore overallStatus createdAt originalImageUrl originalFilename reportId complaintData enforcementData ruleResults')
      .lean();

    const cases = enforcementScans.map((s) => {
      const enf = s.enforcementData || {};
      const cmp = s.complaintData || null;
      const isUrgent = s.complianceScore < 50 || Boolean(cmp);

      return {
        caseId: enf.caseId || `MCA-ENF-${s.scanId ? s.scanId.slice(-6).toUpperCase() : Date.now().toString().slice(-6)}`,
        scanId: s.scanId,
        productName: s.productName || 'Packaged Commodity',
        brand: s.brand || 'Unspecified Packer',
        category: s.category || 'General Goods',
        complianceScore: s.complianceScore,
        overallStatus: s.overallStatus,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt || s.createdAt,
        originalImageUrl: s.originalImageUrl,
        reportId: s.reportId,
        primaryViolation: enf.primaryViolation || (s.ruleResults?.find((r) => r.status === 'FAIL')?.title) || 'Statutory Declarations Omitted',
        regulatorySection: enf.regulatorySection || 'Legal Metrology Act Sec 36 / FSSAI Sec 51',
        status: enf.status || (cmp ? 'Under Review' : s.complianceScore < 60 ? 'Pending Notice' : 'Flagged'),
        severity: enf.severity || (isUrgent ? 'URGENT' : 'STANDARD'),
        officerAssigned: enf.officerAssigned || 'Legal Metrology Enforcement Cell',
        deadlineDaysRemaining: enf.deadlineDaysRemaining !== undefined ? enf.deadlineDaysRemaining : 14,
        compoundingFine: enf.compoundingFine || (s.complianceScore < 50 ? 25000 : 10000),
        noticeDispatchedAt: enf.noticeDispatchedAt || null,
        hearingDate: enf.hearingDate || null,
        actionHistory: enf.actionHistory || [
          {
            action: 'Automated Compliance Risk Flagged',
            timestamp: s.createdAt,
            officer: 'CompliScan AI Statutory Engine',
            note: 'Algorithmic inspection detected non-compliance with Packaged Commodities Rules.',
          },
        ],
        citizenComplaint: cmp,
      };
    });

    const summary = {
      totalNotices: cases.filter((c) => ['Notice Dispatched', 'Hearing Scheduled', 'Inspection Ordered'].includes(c.status)).length,
      activeInvestigations: cases.filter((c) => ['Under Review', 'Inspection Ordered', 'Hearing Scheduled'].includes(c.status)).length,
      citizenComplaints: cases.filter((c) => Boolean(c.citizenComplaint)).length,
      resolved: cases.filter((c) => ['Resolved', 'Compounded', 'Closed'].includes(c.status)).length,
      compoundingFines: cases.reduce((acc, c) => acc + (c.compoundingFine || 0), 0),
    };

    return res.status(200).json({
      success: true,
      cases,
      summary,
    });
  } catch (error) {
    console.error('[Enforcement Cases Fetch Error]:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch enforcement cases.' });
  }
});

/**
 * POST /api/scans/enforcement/action
 * Dispatches a statutory show-cause notice, schedules hearing, or orders inspection
 */
router.post('/enforcement/action', optionalAuth, async (req, res) => {
  try {
    const { scanId, actionType, primaryViolation, regulatorySection, officerNotes, officerName, compoundingFine, hearingDate } = req.body;

    if (!scanId) {
      return res.status(400).json({ success: false, error: 'Missing mandatory scanId' });
    }

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Action simulated (offline mode).',
        enforcementData: {
          caseId: `MCA-ENF-${scanId.slice(-6).toUpperCase()}`,
          status: actionType === 'NOTICE' ? 'Notice Dispatched' : actionType === 'INSPECTION' ? 'Inspection Ordered' : 'Resolved',
          updatedAt: new Date().toISOString(),
        },
      });
    }

    const scan = await Scan.findOne({ scanId });
    if (!scan) {
      return res.status(404).json({ success: false, error: `Scan ${scanId} not found` });
    }

    const currentEnf = scan.enforcementData || {};
    const newCaseId = currentEnf.caseId || `MCA-ENF-${scan.scanId.slice(-6).toUpperCase()}`;

    let newStatus = 'Notice Dispatched';
    if (actionType === 'INSPECTION') newStatus = 'Inspection Ordered';
    else if (actionType === 'HEARING') newStatus = 'Hearing Scheduled';
    else if (actionType === 'COMPOUND') newStatus = 'Compounded';
    else if (actionType === 'RESOLVE') newStatus = 'Resolved';

    const history = currentEnf.actionHistory || [];
    history.unshift({
      action: actionType || 'Notice Dispatched',
      timestamp: new Date().toISOString(),
      officer: officerName || req.user?.name || 'Super Admin (National Governance)',
      note: officerNotes || `Official action recorded under ${regulatorySection || 'Legal Metrology Rules 2011'}.`,
    });

    const updatedEnforcement = {
      ...currentEnf,
      caseId: newCaseId,
      status: newStatus,
      primaryViolation: primaryViolation || currentEnf.primaryViolation || 'Packaged Commodity Labelling Infringement',
      regulatorySection: regulatorySection || currentEnf.regulatorySection || 'Section 38, Legal Metrology Act',
      officerAssigned: officerName || req.user?.name || currentEnf.officerAssigned || 'Legal Metrology Enforcement Cell',
      compoundingFine: compoundingFine !== undefined ? Number(compoundingFine) : currentEnf.compoundingFine || 25000,
      hearingDate: hearingDate || currentEnf.hearingDate || null,
      noticeDispatchedAt: new Date().toISOString(),
      deadlineDaysRemaining: 15,
      actionHistory: history,
    };

    scan.enforcementData = updatedEnforcement;
    await scan.save();

    console.log(`[Enforcement Action]: ${newStatus} applied to scan ${scanId} by ${updatedEnforcement.officerAssigned}`);

    return res.status(200).json({
      success: true,
      message: `Enforcement action "${newStatus}" recorded successfully.`,
      enforcementData: updatedEnforcement,
    });
  } catch (error) {
    console.error('[Enforcement Action Error]:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to record enforcement action.' });
  }
});

/**
 * PATCH /api/scans/enforcement/cases/:caseId
 * Updates case status, compounding penalty, or resolution notes
 */
router.patch('/enforcement/cases/:caseId', optionalAuth, async (req, res) => {
  try {
    const { caseId } = req.params;
    const { status, officerNotes, officerName, compoundingFine } = req.body;

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Status updated (offline mode).',
        caseId,
        status,
      });
    }

    const scan = await Scan.findOne({
      $or: [{ 'enforcementData.caseId': caseId }, { scanId: caseId }],
    });

    if (!scan) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    const enf = scan.enforcementData || {};
    enf.status = status || enf.status;
    if (compoundingFine !== undefined) enf.compoundingFine = Number(compoundingFine);

    const history = enf.actionHistory || [];
    history.unshift({
      action: `Status changed to: ${status}`,
      timestamp: new Date().toISOString(),
      officer: officerName || req.user?.name || 'Authorized Officer',
      note: officerNotes || `Status updated to ${status}.`,
    });
    enf.actionHistory = history;

    scan.enforcementData = enf;
    await scan.save();

    return res.status(200).json({
      success: true,
      message: `Case ${caseId} status updated to ${status}.`,
      enforcementData: enf,
    });
  } catch (error) {
    console.error('[Case Update Error]:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to update enforcement case.' });
  }
});

/**
 * PATCH /api/scans/:id/complaint
 * Allows enforcement officers to update the status of a citizen grievance
 */
router.patch('/:id/complaint', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!isDbConnected()) {
      return res.status(200).json({ success: true, message: 'Complaint status updated (offline mode).' });
    }

    const scan = await Scan.findOne({ scanId: id });
    if (!scan || !scan.complaintData) {
      return res.status(404).json({ success: false, error: 'Complaint not found on this scan.' });
    }

    scan.complaintData.status = status || scan.complaintData.status;
    if (adminNotes) scan.complaintData.adminNotes = adminNotes;
    scan.complaintData.updatedAt = new Date();

    scan.markModified('complaintData');
    await scan.save();

    return res.status(200).json({
      success: true,
      message: `Grievance status updated to "${status}".`,
      complaint: scan.complaintData,
    });
  } catch (error) {
    console.error('[Complaint Update Error]:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to update complaint status.' });
  }
});

export default router;
