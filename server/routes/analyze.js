import express from 'express';
import { structureProductWithGroq } from '../services/groqService.js';
import { evaluateCompliance } from '../services/ruleEngineService.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/analyze
 * Structures OCR text into product JSON using Groq
 * Protected with requireAuth
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const { ocrText, scanId = `scan_${Date.now()}` } = req.body;

    if (!ocrText || typeof ocrText !== 'string' || ocrText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No readable text was provided for product analysis.',
      });
    }

    console.log(`[Groq Start] scanId: ${scanId} | input text length: ${ocrText.length}`);
    console.log(`[Groq Input Snippet] scanId: ${scanId} | "${ocrText.slice(0, 100).replace(/\n/g, ' ')}..."`);

    const structuredData = await structureProductWithGroq(ocrText);

    console.log(`[Groq Success] scanId: ${scanId} | parsed product: "${structuredData.productName}" | category: "${structuredData.category}"`);

    // Deterministic Rule Engine Evaluation
    console.log(`[Rule Engine Start] scanId: ${scanId} | evaluating rules for category: ${structuredData.category}`);
    const complianceEvaluation = evaluateCompliance(structuredData, structuredData.category);
    console.log(`[Rule Engine Success] scanId: ${scanId} | score: ${complianceEvaluation.score}% | status: ${complianceEvaluation.overallStatus} | passed: ${complianceEvaluation.summary.passed} | issues: ${complianceEvaluation.summary.issues} | review: ${complianceEvaluation.summary.review} | NA: ${complianceEvaluation.summary.notApplicable}`);

    return res.status(200).json({
      success: true,
      scanId,
      data: structuredData,
      compliance: complianceEvaluation,
    });
  } catch (error) {
    console.error('[Groq Error]:', error.message);
    const statusCode = error.message.includes('rate limit') ? 429 : 500;
    return res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to structure product information.',
    });
  }
});

export default router;
