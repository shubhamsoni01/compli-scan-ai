import express from 'express';
import { WebsiteVisit } from '../models/WebsiteVisit.js';
import { ScanHistory } from '../models/ScanHistory.js';
import { Scan } from '../models/Scan.js';
import { isDbConnected } from '../config/database.js';

const router = express.Router();

/**
 * Helper to parse user agent for OS, browser, and device
 */
function parseUA(userAgent = '') {
  const ua = userAgent.toLowerCase();
  let deviceType = 'desktop';
  if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(ua)) {
    deviceType = 'mobile';
  } else if (/ipad|tablet|android(?!.*mobile)/i.test(ua)) {
    deviceType = 'tablet';
  }

  let browser = 'Unknown';
  if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';

  let operatingSystem = 'Unknown';
  if (/windows/i.test(ua)) operatingSystem = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) operatingSystem = 'macOS';
  else if (/android/i.test(ua)) operatingSystem = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) operatingSystem = 'iOS';
  else if (/linux/i.test(ua)) operatingSystem = 'Linux';

  return { deviceType, browser, operatingSystem };
}

/**
 * POST /api/stats/visit
 * Records a real user visit
 * Uses sessionId to avoid duplicate counts during the same session on repeat renders
 */
router.post('/visit', async (req, res) => {
  try {
    const { sessionId, page = '/' } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'sessionId is required' });
    }

    if (!isDbConnected()) {
      return res.status(200).json({ success: true, message: 'DB not connected, visit skipped' });
    }

    // Check if this sessionId already logged a visit in the last 15 minutes for this page to prevent spam on re-render
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const existingRecent = await WebsiteVisit.findOne({
      sessionId,
      page,
      visitedAt: { $gte: fifteenMinutesAgo },
    });

    if (existingRecent) {
      return res.status(200).json({ success: true, message: 'Visit already registered for this session window' });
    }

    const userAgent = req.headers['user-agent'] || '';
    const { deviceType, browser, operatingSystem } = parseUA(userAgent);

    const visit = new WebsiteVisit({
      sessionId,
      page,
      userAgent: userAgent.slice(0, 200),
      deviceType,
      browser,
      operatingSystem,
      visitedAt: new Date(),
    });

    await visit.save();

    return res.status(201).json({ success: true, message: 'Visit recorded' });
  } catch (error) {
    console.error('[Visit Track Error]:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to record visit' });
  }
});

/**
 * GET /api/stats
 * Computes REAL statistics aggregated from MongoDB Atlas collections:
 * website_visits, scan_history, and scans
 * Never returns fake/mock numbers. Returns 0 if no records exist.
 */
router.get('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
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
      });
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Visit metrics
    const totalVisits = await WebsiteVisit.countDocuments();
    const uniqueVisitorsResult = await WebsiteVisit.distinct('sessionId');
    const uniqueVisitors = uniqueVisitorsResult.length;

    const todayVisits = await WebsiteVisit.countDocuments({ visitedAt: { $gte: startOfToday } });
    const weekVisits = await WebsiteVisit.countDocuments({ visitedAt: { $gte: startOfWeek } });
    const monthVisits = await WebsiteVisit.countDocuments({ visitedAt: { $gte: startOfMonth } });

    // 2. Scan metrics (from scans collection)
    const totalScans = await Scan.countDocuments();
    const compliantProducts = await Scan.countDocuments({ overallStatus: 'COMPLIANT' });
    const nonCompliantProducts = await Scan.countDocuments({ overallStatus: 'POTENTIAL_NON_COMPLIANCE' });
    const needsReviewProducts = await Scan.countDocuments({ overallStatus: 'NEEDS_REVIEW' });

    // Count successful vs failed
    const successfulScans = totalScans;
    const failedScans = await ScanHistory.countDocuments({ ocrSuccess: false });

    // Real compliance rate
    const complianceRate = totalScans > 0 
      ? Number(((compliantProducts / totalScans) * 100).toFixed(1)) 
      : 0;

    // 3. Category distribution (real)
    const categoryAgg = await Scan.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoryDistribution = categoryAgg.map(item => ({
      name: item._id || 'Unknown',
      scans: item.count,
    }));

    // 4. Monthly scan volume (real)
    const monthlyAgg = await Scan.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          scans: { $sum: 1 },
          compliant: {
            $sum: { $cond: [{ $eq: ['$overallStatus', 'COMPLIANT'] }, 1, 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyScans = monthlyAgg.map(m => ({
      month: `${monthNames[(m._id.month - 1) || 0]} ${m._id.year}`,
      scans: m.scans,
      compliant: m.compliant,
    }));

    // 5. Common failed rules (real)
    const issuesAgg = await Scan.aggregate([
      { $unwind: '$ruleResults' },
      { $match: { 'ruleResults.status': { $in: ['FAIL', 'failed'] } } },
      { $group: { _id: '$ruleResults.title', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const commonIssues = issuesAgg.map(iss => ({
      issue: iss._id || 'Unspecified Requirement',
      count: iss.count,
    }));

    return res.status(200).json({
      totalVisits,
      uniqueVisitors,
      todayVisits,
      weekVisits,
      monthVisits,
      totalScans,
      successfulScans,
      failedScans,
      compliantProducts,
      nonCompliantProducts,
      needsReviewProducts,
      complianceRate,
      categoryDistribution,
      monthlyScans,
      commonIssues,
    });
  } catch (error) {
    console.error('[Stats Compute Error]:', error.message);
    return res.status(500).json({
      totalVisits: 0,
      uniqueVisitors: 0,
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
    });
  }
});

export default router;
