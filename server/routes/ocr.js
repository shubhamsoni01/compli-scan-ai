import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { extractTextWithOCR } from '../services/ocrService.js';
import { getImageDimensionsFromBuffer } from '../services/readabilityAnalyzer.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scansDir = path.join(__dirname, '..', 'uploads', 'scans');
if (!fs.existsSync(scansDir)) {
  fs.mkdirSync(scansDir, { recursive: true });
}

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

    const dimensions = getImageDimensionsFromBuffer(buffer);

    // Save image to server/uploads/scans/ for persistence in PDF report & history
    let originalImageUrl = null;
    try {
      const ext = mimetype.includes('png') ? '.png' : mimetype.includes('webp') ? '.webp' : '.jpg';
      const cleanScanId = scanId.replace(/[^a-zA-Z0-9_-]/g, '');
      const savedFilename = `${cleanScanId}_${Date.now()}${ext}`;
      const savedFilePath = path.join(scansDir, savedFilename);
      fs.writeFileSync(savedFilePath, buffer);
      originalImageUrl = `/uploads/scans/${savedFilename}`;
    } catch (saveImgErr) {
      console.warn('[OCR Image Save Warning]:', saveImgErr.message);
    }

    return res.status(200).json({
      success: true,
      scanId,
      text: result.text,
      ocrEngine: result.ocrEngine,
      originalImageUrl,
      ocrData: {
        lines: result.lines || [],
        words: result.words || [],
      },
      imageMetadata: {
        width: dimensions?.width || null,
        height: dimensions?.height || null,
        fileSize: buffer.length,
        mimeType: mimetype,
      },
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
