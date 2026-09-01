/**
 * OCR.Space + Tesseract.js Hybrid OCR Service
 *
 * Tries primary cloud OCR (OCR.Space). If OCR.Space is overloaded (HTTP 502/429/E571/ENOBUFS),
 * it automatically falls back seamlessly to local Tesseract.js neural OCR without ever failing the user scan!
 */

import { createWorker } from 'tesseract.js';

let sharedWorker = null;

async function getTesseractWorker() {
  if (!sharedWorker) {
    sharedWorker = await createWorker('eng');
  }
  return sharedWorker;
}

/**
 * Extracts text using local Tesseract.js (Engine Fallback)
 */
async function extractWithTesseract(fileBuffer) {
  console.log('[Tesseract OCR Fallback] Processing label image with local neural OCR engine...');
  const worker = await getTesseractWorker();
  const ret = await worker.recognize(fileBuffer);
  
  const extractedText = ret.data.text ? ret.data.text.trim() : '';
  const lines = [];
  const words = [];

  if (ret.data.lines) {
    for (const l of ret.data.lines) {
      lines.push({
        text: l.text.trim(),
        height: l.bbox ? (l.bbox.y1 - l.bbox.y0) : 20,
        minTop: l.bbox ? l.bbox.y0 : 0,
      });
      if (l.words) {
        for (const w of l.words) {
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

  return {
    text: extractedText,
    ocrEngine: 'Tesseract Neural OCR (High Reliability Fallback)',
    lines,
    words,
    confidence: ret.data.confidence,
  };
}

export async function extractTextWithOCR(fileBuffer, mimeType, filename = 'label.jpg') {
  const apiKey = process.env.OCR_SPACE_API_KEY;

  // 1. Try OCR.Space first if API key is provided
  if (apiKey && apiKey.trim() !== '') {
    const ext = mimeType.includes('png')
      ? 'PNG'
      : mimeType.includes('webp')
      ? 'WEBP'
      : 'JPG';

    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: mimeType });
    formData.append('file', blob, filename || `label.${ext.toLowerCase()}`);
    formData.append('filetype', ext);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'true');
    formData.append('OCREngine', '1');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          apikey: apiKey.trim(),
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (!data.IsErroredOnProcessing && data.ParsedResults && data.ParsedResults.length > 0) {
          const extractedText = data.ParsedResults.map((r) => r.ParsedText).join('\n').trim();
          if (extractedText && extractedText.length > 10) {
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

            console.log(`[OCR.Space Success]: Extracted ${extractedText.length} chars`);
            return {
              text: extractedText,
              ocrEngine: 'OCR.Space (Engine 1)',
              lines,
              words,
            };
          }
        }
      } else {
        console.warn(`[OCR.Space Warning]: Status ${response.status} returned. Falling back to local Tesseract OCR.`);
      }
    } catch (ocrSpaceErr) {
      clearTimeout(timeoutId);
      console.warn(`[OCR.Space Notice]: ${ocrSpaceErr.message}. Seamlessly switching to local Tesseract OCR engine.`);
    }
  }

  // 2. Seamless Fallback: Tesseract.js
  try {
    const fallbackResult = await extractWithTesseract(fileBuffer);
    if (fallbackResult.text && fallbackResult.text.length > 0) {
      return fallbackResult;
    }
  } catch (tessErr) {
    console.error('[Tesseract Error]:', tessErr.message);
  }

  // If literally no text could be extracted by any engine
  throw new Error('No readable text detected on this label. Please provide a clearer, well-lit photo.');
}
