/**
 * OCR.Space Service
 * Sends product label image buffers/base64 to OCR.Space API securely without exposing API keys to the browser.
 */

export async function extractTextWithOCR(fileBuffer, mimeType, filename = 'label.jpg') {
  const apiKey = process.env.OCR_SPACE_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    console.error('[OCR Error] OCR_SPACE_API_KEY is not defined in environment variables.');
    throw new Error('OCR service is not configured on the server. Please check server environment settings.');
  }

  // Determine file extension for OCR.Space
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
  formData.append('isOverlayRequired', 'false');
  formData.append('OCREngine', '1'); // OCREngine 1 is standard & universally supported on free keys
  formData.append('detectOrientation', 'true');
  formData.append('scale', 'true');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

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

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error(`[OCR.Space ${response.status}]:`, errText);
      if (response.status === 429) {
        throw new Error('OCR rate limit reached. Please wait a moment and try again.');
      }
      throw new Error(`OCR provider returned status ${response.status}`);
    }

    const data = await response.json();

    if (data.IsErroredOnProcessing) {
      const errorMsg = Array.isArray(data.ErrorMessage) ? data.ErrorMessage.join(', ') : data.ErrorMessage || 'Failed to process image';
      console.error('[OCR Error Detail]:', errorMsg);
      throw new Error('Unable to parse the label image. Please upload a clearer, well-lit photo.');
    }

    const parsedResults = data.ParsedResults;
    if (!parsedResults || !parsedResults.length) {
      throw new Error('No text could be detected on the product label.');
    }

    const extractedText = parsedResults.map((r) => r.ParsedText).join('\n').trim();

    if (!extractedText) {
      throw new Error('No readable text detected on this label. Please provide a clearer photo.');
    }

    return {
      text: extractedText,
      ocrEngine: 'OCR.Space (Engine 2)',
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('OCR request timed out. Please verify your connection or try a smaller image.');
    }
    throw err;
  }
}
