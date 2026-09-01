/**
 * Enhanced Multi-Pass OCR Service for CompliScan AI
 *
 * Implements:
 * 1. Image Preprocessing (orientation correction, contrast stretching, text sharpening via Sharp)
 * 2. Multi-Pass OCR:
 *    - PASS 1: High-fidelity OCR on enhanced image buffer
 *    - PASS 2: OCR on original raw buffer if PASS 1 missed key fields (MRP, Net Qty, Dates, Licences)
 * 3. Text Merging: Intelligently combines unique lines and declarations from both passes without duplicating lines
 * 4. OCR.Space primary with Tesseract.js fallback
 * 5. Full preserving of bounding words, lines, and confidence metrics
 */

import { createWorker } from 'tesseract.js';
import { preprocessImageForOCR } from './imagePreprocessor.js';

let sharedWorker = null;

async function getTesseractWorker() {
  if (!sharedWorker) {
    sharedWorker = await createWorker('eng');
  }
  return sharedWorker;
}

/**
 * Extracts text using local Tesseract.js Neural Engine
 */
async function runTesseractOCR(fileBuffer) {
  const worker = await getTesseractWorker();
  const ret = await worker.recognize(fileBuffer);

  const extractedText = ret.data.text ? ret.data.text.trim() : '';
  const lines = [];
  const words = [];

  if (ret.data.lines) {
    for (const l of ret.data.lines) {
      if (l.text && l.text.trim()) {
        lines.push({
          text: l.text.trim(),
          height: l.bbox ? (l.bbox.y1 - l.bbox.y0) : 20,
          minTop: l.bbox ? l.bbox.y0 : 0,
        });
      }
      if (l.words) {
        for (const w of l.words) {
          if (w.text && w.text.trim()) {
            words.push({
              wordText: w.text.trim(),
              left: w.bbox.x0,
              top: w.bbox.y0,
              height: w.bbox.y1 - w.bbox.y0,
              width: w.bbox.x1 - w.bbox.x0,
            });
          }
        }
      }
    }
  }

  return {
    text: extractedText,
    ocrEngine: 'Tesseract Neural OCR',
    lines,
    words,
    confidence: ret.data.confidence,
  };
}

/**
 * Executes a single OCR pass against OCR.Space API
 */
async function runOCRSpacePass(buffer, mimeType, filename, apiKey) {
  const ext = mimeType.includes('png') ? 'PNG' : mimeType.includes('webp') ? 'WEBP' : 'JPG';
  const formData = new FormData();
  const blob = new Blob([buffer], { type: mimeType });
  formData.append('file', blob, filename || `label.${ext.toLowerCase()}`);
  formData.append('filetype', ext);
  formData.append('language', 'eng');
  formData.append('isOverlayRequired', 'true');
  formData.append('OCREngine', '1');
  formData.append('detectOrientation', 'true');
  formData.append('scale', 'true');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 16000);

  try {
    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: { apikey: apiKey.trim() },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = await response.json();
    if (data.IsErroredOnProcessing || !data.ParsedResults || !data.ParsedResults.length) return null;

    const text = data.ParsedResults.map((r) => r.ParsedText).join('\n').trim();
    if (!text || text.length < 5) return null;

    const lines = [];
    const words = [];

    for (const r of data.ParsedResults) {
      const overlay = r.TextOverlay;
      if (overlay && Array.isArray(overlay.Lines)) {
        for (const line of overlay.Lines) {
          lines.push({
            text: line.LineText,
            height: line.MaxHeight || null,
            minTop: line.MinTop || null,
          });
          if (Array.isArray(line.Words)) {
            for (const w of line.Words) {
              words.push({
                wordText: w.WordText,
                left: w.Left,
                top: w.Top,
                height: w.Height,
                width: w.Width,
              });
            }
          }
        }
      }
    }

    return { text, ocrEngine: 'OCR.Space (Engine 1)', lines, words };
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Checks whether crucial mandatory label tokens were missed in the OCR result
 */
function isOCRResultMissingKeyDeclarations(text) {
  if (!text || text.length < 60) return true;
  const lower = text.toLowerCase();
  let hits = 0;
  if (lower.includes('mrp') || lower.includes('₹') || lower.includes('rs.')) hits++;
  if (lower.includes('net') || lower.includes('weight') || lower.includes('quantity') || lower.includes(' g') || lower.includes(' ml') || lower.includes(' kg')) hits++;
  if (lower.includes('mfg') || lower.includes('mfd') || lower.includes('exp') || lower.includes('best before') || lower.includes('batch')) hits++;
  if (lower.includes('fssai') || lower.includes('lic') || lower.includes('manufactured') || lower.includes('packed')) hits++;
  // If fewer than 2 mandatory indicators found, multi-pass is beneficial
  return hits < 3;
}

/**
 * Cleanly merges multi-pass OCR text lines to avoid duplicates while preserving new detections
 */
function mergeOCRTexts(pass1Text, pass2Text) {
  if (!pass1Text && !pass2Text) return '';
  if (!pass1Text) return pass2Text;
  if (!pass2Text) return pass1Text;

  const lines1 = pass1Text.split('\n').map((l) => l.trim()).filter(Boolean);
  const lines2 = pass2Text.split('\n').map((l) => l.trim()).filter(Boolean);

  const seen = new Set(lines1.map((l) => l.toLowerCase().replace(/[^a-z0-9]/g, '')));
  const merged = [...lines1];

  for (const l2 of lines2) {
    const norm = l2.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (norm.length > 2 && !seen.has(norm)) {
      seen.add(norm);
      merged.push(l2);
    }
  }

  return merged.join('\n');
}

/**
 * Main OCR Extraction function with image preprocessing and multi-pass support
 */
export async function extractTextWithOCR(fileBuffer, mimeType, filename = 'label.jpg') {
  const apiKey = process.env.OCR_SPACE_API_KEY;

  // STEP 1: Local Image Preprocessing (Enhance contrast, unsharp mask, orientation)
  let preprocessed = null;
  try {
    preprocessed = await preprocessImageForOCR(fileBuffer);
  } catch (err) {
    console.warn('[OCR Preprocessing]: Fallback to original buffer:', err.message);
  }

  const enhancedBuffer = preprocessed?.buffer || fileBuffer;
  const enhancedMime = preprocessed?.mimeType || mimeType;

  let pass1Result = null;

  // PASS 1: Attempt OCR with enhanced image
  if (apiKey && apiKey.trim()) {
    console.log('[Multi-Pass OCR] Pass 1: Testing enhanced image via OCR.Space...');
    pass1Result = await runOCRSpacePass(enhancedBuffer, enhancedMime, filename, apiKey);
  }

  if (!pass1Result) {
    console.log('[Multi-Pass OCR] Pass 1 Fallback: Testing enhanced image via Tesseract...');
    try {
      pass1Result = await runTesseractOCR(enhancedBuffer);
    } catch (e) {
      console.warn('[Multi-Pass OCR] Pass 1 Tesseract warning:', e.message);
    }
  }

  // PASS 2: If Pass 1 is missing key label declarations, run on original raw buffer
  let pass2Result = null;
  if (!pass1Result || isOCRResultMissingKeyDeclarations(pass1Result.text)) {
    console.log('[Multi-Pass OCR] Pass 2: Running second pass on original raw buffer to recover missing details...');
    if (apiKey && apiKey.trim()) {
      pass2Result = await runOCRSpacePass(fileBuffer, mimeType, filename, apiKey);
    }
    if (!pass2Result) {
      try {
        pass2Result = await runTesseractOCR(fileBuffer);
      } catch (e) {
        console.warn('[Multi-Pass OCR] Pass 2 Tesseract warning:', e.message);
      }
    }
  }

  // STEP 3: Merge results from both passes
  const primary = pass1Result || pass2Result;
  if (!primary || !primary.text || primary.text.trim().length === 0) {
    throw new Error('No readable text detected on this label. Please provide a clearer, well-lit photo.');
  }

  const combinedText = pass2Result ? mergeOCRTexts(pass1Result?.text, pass2Result.text) : primary.text;
  const mergedLines = [...(pass1Result?.lines || []), ...(pass2Result?.lines || [])];
  const mergedWords = [...(pass1Result?.words || []), ...(pass2Result?.words || [])];

  console.log(`[Multi-Pass OCR Complete] Extracted ${combinedText.length} characters using ${primary.ocrEngine}`);

  return {
    text: combinedText,
    ocrEngine: primary.ocrEngine,
    lines: mergedLines,
    words: mergedWords,
  };
}
