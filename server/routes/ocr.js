import express from 'express';
import multer from 'multer';
import { extractTextWithOCR } from '../services/ocrService.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure memory storage for uploaded images with 10MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only JPG, PNG, and WEBP images are supported.'));
    }
  },
});

/**
 * POST /api/ocr
 * Extracts text from product label image using OCR.Space
 * Protected with requireAuth
 */
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No product label image was received. Please select or capture an image.',
      });
    }

    const { buffer, mimetype, originalname } = req.file;
    const scanId = req.headers['x-scan-id'] || `scan_${Date.now()}`;

    console.log(`[OCR Start] scanId: ${scanId} | file: ${originalname} | type: ${mimetype} | size: ${buffer.length} bytes`);

    const result = await extractTextWithOCR(buffer, mimetype, originalname);

    console.log(`[OCR Success] scanId: ${scanId} | extracted text length: ${result.text?.length || 0}`);
    console.log(`[OCR Snippet] scanId: ${scanId} | "${result.text?.slice(0, 100).replace(/\n/g, ' ')}..."`);

    return res.status(200).json({
      success: true,
      scanId,
      text: result.text,
      ocrEngine: result.ocrEngine,
    });
  } catch (error) {
    console.error('[OCR Error]:', error.message);
    const statusCode = error.message.includes('rate limit') ? 429 : 500;
    return res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to process label with OCR.',
    });
  }
});

export default router;
