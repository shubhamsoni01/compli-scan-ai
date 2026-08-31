import express from 'express';
import { generateCompliancePDF } from '../services/reportService.js';

const router = express.Router();

/**
 * POST /api/report
 * Generates an official, multi-page compliance screening PDF
 */
router.post('/', async (req, res) => {
  try {
    const reportPayload = req.body;

    if (!reportPayload || !reportPayload.productName) {
      return res.status(400).json({
        success: false,
        error: 'Incomplete compliance report data provided.',
      });
    }

    console.log(`[Report Generation Start] scanId: ${reportPayload.scanId || 'unknown'} | product: "${reportPayload.productName}"`);

    const { pdfBuffer, reportId } = await generateCompliancePDF(reportPayload);

    console.log(`[Report Generation Success] reportId: ${reportId} | PDF size: ${pdfBuffer.length} bytes`);

    // Clean safe filename
    const safeProdName = (reportPayload.productName || 'Product').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const filename = `CompliScan_Report_${safeProdName}_${reportId}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('X-Report-Id', reportId);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error('[Report Generation Error]:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Unable to generate the report. Please try again.',
    });
  }
});

export default router;
