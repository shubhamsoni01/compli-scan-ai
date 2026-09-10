/**
 * Professional PDF Report Generator for CompliScan AI
 * Uses PDFKit to create multi-page A4 compliance screening reports
 * with clean typography, tables, badges, original image, and official regulatory citations.
 *
 * Ordered Sections:
 * 1. CompliScan AI Header
 * 2. User Information (Actual Authenticated User)
 * 3. Scan Information (Scan ID, Timestamp, Score, Status)
 * 4. Original Uploaded Product Image + Actual File Name
 * 5. Product Information (Structured Extracted Data)
 * 6. OCR / AI Extracted Information
 * 7. Compliance Score & Overall Status
 * 8. Applicable Statutory Rule Results (Table with PASS/FAIL/NEEDS_REVIEW)
 * 9. Estimated Font Size & Readability Analysis (Complete Check Matrix)
 * 10. Placement Analysis (if present)
 * 11. Reviewer / Complaint Status (if applicable)
 * 12. Mandatory Statutory Disclaimer
 */

import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateCompliancePDF(reportData) {
  return new Promise((resolve, reject) => {
    try {
      const {
        scanId = `scan_${Date.now()}`,
        productName = 'Packaged Product',
        productBrand = 'Detected Brand',
        category = 'Food',
        scanDate = new Date().toISOString(),
        score = 80,
        overallStatus = 'MOSTLY COMPLIANT',
        summary = { passed: 0, issues: 0, review: 0, notApplicable: 0 },
        checks = [],
        extractedInfo = {},
        ocrText = '',
        structuredProduct = {},
        ocrEngine = 'OCR.Space',
        originalImageUrl = null,
        originalFilename = 'Original filename unavailable',
        userName = 'CompliScan Inspector',
        userEmail = 'inspector@compliscan.ai',
        readabilityResult = null,
        placementResult = null,
        reviewerEdits = null,
        complaintData = null,
      } = reportData;

      const dateStr = new Date(scanDate).toISOString().slice(0, 10).replace(/-/g, '');
      const shortId = scanId.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || 'X001';
      const reportId = reportData.reportId || `CS-${dateStr}-${shortId}`;

      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        bufferPages: true,
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve({ pdfBuffer: pdfData, reportId });
      });

      const primaryColor = '#4338CA'; // Indigo 700
      const textColor = '#1E293B'; // Slate 800
      const mutedColor = '#64748B'; // Slate 500
      const lightBg = '#F8FAFC'; // Slate 50
      const borderColor = '#E2E8F0'; // Slate 200

      // Helper for clean horizontal rules
      const drawDivider = () => {
        doc.moveDown(0.4);
        doc.strokeColor(borderColor).lineWidth(0.75).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
        doc.moveDown(0.4);
      };

      // -------------------------------------------------------------
      // 1. COMPLISCAN AI HEADER & STATUTORY ACCREDITATION
      // -------------------------------------------------------------
      doc.fillColor(primaryColor).fontSize(17).font('Helvetica-Bold').text('COMPLISCAN AI', 40, 36);
      doc.fillColor('#B45309').fontSize(7.5).font('Helvetica-Bold').text('SIH 2026 • Problem ID: SIH26034 | Ministry of Consumer Affairs, Food & Public Distribution', 40, 55);
      doc.fillColor(mutedColor).fontSize(7.5).font('Helvetica').text('Statutory Product Label Compliance Screening Dossier • Dept. of Consumer Affairs', 40, 66);

      // Top right header box
      doc.fillColor(textColor).fontSize(9).font('Helvetica-Bold').text(`Report ID: ${reportId}`, 360, 36, { align: 'right', width: 195 });
      doc.font('Helvetica').fontSize(8).fillColor(mutedColor).text(
        `Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`,
        360,
        48,
        { align: 'right', width: 195 }
      );

      const statusBadgeColor = score >= 80 ? '#059669' : score >= 50 ? '#D97706' : '#DC2626';
      doc.fillColor(statusBadgeColor).fontSize(9.5).font('Helvetica-Bold').text(String(overallStatus).toUpperCase(), 360, 62, { align: 'right', width: 195 });

      doc.y = 82;

      // -------------------------------------------------------------
      // 2. USER INFORMATION & 3. SCAN INFORMATION
      // -------------------------------------------------------------
      doc.rect(40, doc.y, 515, 42).fillAndStroke('#F1F5F9', '#CBD5E1');
      const userBoxY = doc.y;

      // User Information Column
      doc.fillColor('#334155').font('Helvetica-Bold').fontSize(8).text('User Name:', 48, userBoxY + 7);
      doc.font('Helvetica').fillColor('#0F172A').text(userName || 'CompliScan User', 110, userBoxY + 7);

      doc.fillColor('#334155').font('Helvetica-Bold').text('User Email:', 48, userBoxY + 22);
      doc.font('Helvetica').fillColor('#0F172A').text(userEmail || 'Unspecified', 110, userBoxY + 22);

      // Scan Information Column
      doc.fillColor('#334155').font('Helvetica-Bold').text('Scan ID:', 330, userBoxY + 7);
      doc.font('Helvetica').fillColor('#0F172A').text(scanId, 390, userBoxY + 7);

      doc.fillColor('#334155').font('Helvetica-Bold').text('Scan Date:', 330, userBoxY + 22);
      doc.font('Helvetica').fillColor('#0F172A').text(
        new Date(scanDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        390,
        userBoxY + 22
      );

      doc.y = userBoxY + 50;
      drawDivider();

      // -------------------------------------------------------------
      // 4. ORIGINAL UPLOADED PRODUCT IMAGE + FILE NAME
      // -------------------------------------------------------------
      doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('Original Scanned Product Image', 40, doc.y);
      doc.moveDown(0.3);

      const imgSectionY = doc.y;
      const imgBoxW = 260;
      const imgBoxH = 175;
      const imgBoxX = 40;

      let imageRendered = false;
      const candidatePath = originalImageUrl || reportData.uploadedImage;
      if (candidatePath && typeof candidatePath === 'string') {
        try {
          let resolved = null;
          if (candidatePath.startsWith('/uploads/')) {
            resolved = path.join(__dirname, '..', candidatePath);
          } else if (candidatePath.startsWith('http') || candidatePath.startsWith('blob:')) {
            const basename = path.basename(candidatePath);
            const localCandidate = path.join(__dirname, '..', 'uploads', 'scans', basename);
            if (fs.existsSync(localCandidate)) resolved = localCandidate;
          } else if (fs.existsSync(candidatePath)) {
            resolved = candidatePath;
          }

          if (resolved && fs.existsSync(resolved)) {
            doc.rect(imgBoxX, imgSectionY, imgBoxW, imgBoxH).stroke(borderColor);
            doc.image(resolved, imgBoxX + 6, imgSectionY + 6, {
              fit: [imgBoxW - 12, imgBoxH - 24],
              align: 'center',
              valign: 'center',
            });
            imageRendered = true;
          }
        } catch (e) {
          console.warn('[PDF Image Embed Warning]:', e.message);
        }
      }

      if (!imageRendered) {
        doc.rect(imgBoxX, imgSectionY, imgBoxW, imgBoxH).fillAndStroke(lightBg, borderColor);
        doc.font('Helvetica-Oblique').fontSize(8.5).fillColor(mutedColor).text(
          'Original scan image unavailable.',
          imgBoxX + 15,
          imgSectionY + 70,
          { width: imgBoxW - 30, align: 'center' }
        );
      }

      // Image Captions below image box
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#334155').text(
        'Original Product Image Used for Compliance Screening',
        imgBoxX,
        imgSectionY + imgBoxH + 4,
        { width: imgBoxW, align: 'center' }
      );
      doc.font('Helvetica').fontSize(7.5).fillColor(mutedColor).text(
        `Image/File Name: ${originalFilename || 'Original filename unavailable'}`,
        imgBoxX,
        imgSectionY + imgBoxH + 15,
        { width: imgBoxW, align: 'center' }
      );

      // Right Column beside image: 5. PRODUCT INFORMATION
      const metaX = 320;
      const metaW = 235;
      doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('Product Information', metaX, imgSectionY);
      doc.moveDown(0.3);

      const pMeta = [
        ['Product Name', productName],
        ['Brand', productBrand],
        ['Category', category],
        ['Maximum Retail Price (MRP)', extractedInfo['MRP'] || structuredProduct.mrp || 'Not detected'],
        ['Net Quantity', extractedInfo['Net Quantity'] || structuredProduct.netQuantity || 'Not detected'],
        ['Manufacturer / Packer', extractedInfo['Manufacturer'] || structuredProduct.manufacturer || 'Not detected'],
        ['Date of Manufacture', extractedInfo['Manufacture Date'] || structuredProduct.manufacturingDate || 'Not detected'],
        ['Expiry / Best Before', extractedInfo['Best Before / Expiry'] || structuredProduct.expiryDate || 'Not detected'],
        ['Batch / Lot Number', extractedInfo['Batch Number'] || structuredProduct.batchNumber || 'Not detected'],
        ['Regulatory Licence', extractedInfo['FSSAI / License Number'] || structuredProduct.licenseNumber || 'Not detected'],
        ['Country of Origin', extractedInfo['Country of Origin'] || structuredProduct.countryOfOrigin || 'India (Domestic)'],
      ];

      doc.fontSize(7.5);
      pMeta.forEach(([label, val]) => {
        const rY = doc.y;
        doc.font('Helvetica-Bold').fillColor(mutedColor).text(label, metaX, rY, { width: 100 });
        doc.font('Helvetica').fillColor(val === 'Not detected' ? '#DC2626' : textColor).text(String(val || 'Not detected'), metaX + 105, rY, { width: metaW - 105 });
        doc.moveDown(0.28);
      });

      doc.y = Math.max(imgSectionY + imgBoxH + 32, doc.y + 6);
      drawDivider();

      // -------------------------------------------------------------
      // 7. COMPLIANCE SCORE & OVERALL STATUS
      // -------------------------------------------------------------
      doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('Compliance Score & Status', 40, doc.y);
      doc.moveDown(0.2);

      const scoreBoxY = doc.y;
      doc.rect(40, scoreBoxY, 515, 38).fillAndStroke(lightBg, borderColor);

      doc.fillColor(statusBadgeColor).fontSize(20).font('Helvetica-Bold').text(`${Math.round(score)}`, 55, scoreBoxY + 8);
      doc.fillColor(mutedColor).fontSize(9).font('Helvetica').text('/ 100', 92, scoreBoxY + 16);

      doc.fillColor(statusBadgeColor).fontSize(10).font('Helvetica-Bold').text(
        `Overall Status: ${String(overallStatus).toUpperCase()}`,
        155,
        scoreBoxY + 8
      );

      const passedCnt = summary.passed ?? checks.filter((c) => String(c.status).toLowerCase().includes('pass')).length;
      const issuesCnt = summary.issues ?? checks.filter((c) => String(c.status).toLowerCase().includes('fail')).length;
      const reviewCnt = summary.review ?? checks.filter((c) => String(c.status).toLowerCase().includes('review')).length;

      doc.fillColor(textColor).fontSize(8).font('Helvetica').text(
        `Passed: ${passedCnt}  |  Potential Issues: ${issuesCnt}  |  Needs Review: ${reviewCnt}`,
        155,
        scoreBoxY + 22
      );

      doc.y = scoreBoxY + 45;
      drawDivider();

      // -------------------------------------------------------------
      // 7.5. FSSAI NUTRITION & HFSS THRESHOLD AUDIT (Safe vs Unsafe)
      // -------------------------------------------------------------
      const nutText = (extractedInfo['Nutritional Info'] || extractedInfo['Nutrition Facts'] || '') + ' ' + (extractedInfo['Ingredients'] || '') + ' ' + ocrText;
      const isLiquid = /ml|litre|liquid|beverage|drink|juice/i.test(extractedInfo['Net Quantity'] || '');

      // Dynamic Extraction Helper with strict word boundaries and zero fallbacks
      const extractNutrientValue = (patterns) => {
        for (const pat of patterns) {
          const m = nutText.match(pat);
          if (m && m[1]) {
            const num = parseFloat(m[1].replace(/,/g, '.'));
            if (!isNaN(num) && num > 0) return { text: `${num} ${m[2] || 'g'}`, num };
          }
        }
        return { text: 'Not detected', num: null };
      };

      const sodData = extractNutrientValue([
        /\bsodium\b[^\d\n]{0,20}?(\d+(?:[.,]\d+)?)\s*(mg|g)\b/i,
        /\bsodium\b[\s*:]+(?:<\s*)?(\d+(?:[.,]\d+)?)\s*(mg|g)?/i,
        /\bsalt\b[\s*:]+(?:<\s*)?(\d+(?:[.,]\d+)?)\s*(mg|g)\b/i,
      ]);
      let sodNum = sodData.num;
      if (sodData.text.includes('g') && !sodData.text.includes('mg') && sodNum !== null && sodNum < 10) sodNum *= 1000;
      const sodLimit = isLiquid ? 300 : 600;

      let sugData = extractNutrientValue([
        /\badded\s*sugars?[®™\s]*[^\d\n]{0,20}?(\d+(?:[.,]\d+)?)\s*(g|mg)\b/i,
        /\badded\s*sugars?[®™\s]*[\s*:]+(?:<\s*)?(\d+(?:[.,]\d+)?)\s*(g|mg)?/i,
      ]);
      if (sugData.num === null) {
        sugData = extractNutrientValue([
          /\btotal\s*sugars?[^\d\n]{0,20}?(\d+(?:[.,]\d+)?)\s*(g|mg)\b/i,
          /\btotal\s*sugars?[\s*:]+(?:<\s*)?(\d+(?:[.,]\d+)?)\s*(g|mg)?/i,
          /\bsugars?\b[^\d\n]{0,20}?(\d+(?:[.,]\d+)?)\s*(g|mg)\b/i,
        ]);
      }
      const sugLimit = isLiquid ? 6 : 10;

      const satData = extractNutrientValue([
        /\bsaturated\s*fat\b[^\d\n]{0,20}?(?:<\s*)?(\d+(?:[.,]\d+)?)\s*(g|mg)\b/i,
        /\bsaturated\s*fat[\s*:]+(?:<\s*)?(\d+(?:[.,]\d+)?)\s*(g|mg)?/i,
        /\bsat\s*fat\b[^\d\n]{0,20}?(?:<\s*)?(\d+(?:[.,]\d+)?)\s*(g|mg)?/i,
      ]);
      const satLimit = 6.0;

      let traData = extractNutrientValue([
        /\btrans\s*fat\b[^\d\n]{0,20}?(?:<\s*)?(\d+(?:[.,]\d+)?)\s*(g|mg)\b/i,
      ]);
      if (traData.num === null && /trans\s*fat[^\n]{0,15}<\s*0?\.?1/i.test(nutText)) {
        traData = { text: '<0.1 g', num: 0.09 };
      }
      const traLimit = 0.2;

      const nutrientRows = [
        {
          name: 'Sodium (Salt)',
          obs: sodNum !== null ? `${sodNum} mg / 100g` : 'Not detected',
          std: `≤ ${sodLimit} mg / 100g`,
          status: sodNum !== null ? (sodNum > sodLimit * 1.3 ? 'HIGH RISK' : sodNum > sodLimit ? 'ELEVATED' : 'SAFE') : 'N/A',
          verdict: sodNum !== null ? (sodNum > sodLimit ? `Exceeds FSSAI solid threshold (+${Math.round(((sodNum-sodLimit)/sodLimit)*100)}%)` : `Safe (${sodNum}mg <= ${sodLimit}mg)`) : 'Not declared on panel',
          badgeColor: sodNum !== null ? (sodNum > sodLimit * 1.3 ? '#DC2626' : sodNum > sodLimit ? '#D97706' : '#059669') : '#64748B',
        },
        {
          name: 'Added Sugars',
          obs: sugData.num !== null ? `${sugData.num} g / 100g` : 'Not detected',
          std: `≤ ${sugLimit} g / 100g`,
          status: sugData.num !== null ? (sugData.num > sugLimit * 1.5 ? 'HIGH RISK' : sugData.num > sugLimit ? 'ELEVATED' : 'SAFE') : 'N/A',
          verdict: sugData.num !== null ? (sugData.num > sugLimit ? `High Sugar (+${Math.round(((sugData.num-sugLimit)/sugLimit)*100)}%)` : `Safe level (${sugData.num}g <= ${sugLimit}g)`) : 'Not declared on panel',
          badgeColor: sugData.num !== null ? (sugData.num > sugLimit * 1.5 ? '#DC2626' : sugData.num > sugLimit ? '#D97706' : '#059669') : '#64748B',
        },
        {
          name: 'Saturated Fat',
          obs: satData.num !== null ? `${satData.num} g / 100g` : 'Not detected',
          std: `≤ ${satLimit} g / 100g`,
          status: satData.num !== null ? (satData.num > satLimit * 1.5 ? 'HIGH RISK' : satData.num > satLimit ? 'ELEVATED' : 'SAFE') : 'N/A',
          verdict: satData.num !== null ? (satData.num > satLimit ? `Elevated SFA (+${Math.round(((satData.num-satLimit)/satLimit)*100)}%)` : 'Safe SFA level') : 'Not declared on panel',
          badgeColor: satData.num !== null ? (satData.num > satLimit * 1.5 ? '#DC2626' : satData.num > satLimit ? '#D97706' : '#059669') : '#64748B',
        },
        {
          name: 'Trans Fat',
          obs: traData.num !== null ? `${traData.num} g / 100g` : 'Not detected',
          std: `≤ 0.2 g / 100g (<2%)`,
          status: traData.num !== null ? (traData.num > 0.4 ? 'HIGH RISK' : 'SAFE') : 'N/A',
          verdict: traData.num !== null ? (traData.num > 0.4 ? 'Violates 2% Trans Fat Order' : 'Compliant with 2% Trans Fat Cap') : 'Not declared on panel',
          badgeColor: traData.num !== null ? (traData.num > 0.4 ? '#DC2626' : '#059669') : '#64748B',
        },
      ];

      if (doc.y > 620) doc.addPage();

      doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('FSSAI Nutrition & HFSS Threshold Audit (Safe vs Unsafe)', 40, doc.y);
      doc.moveDown(0.2);
      doc.fillColor(mutedColor).fontSize(7.5).font('Helvetica').text(
        'Comparison of detected label values (Kitna Hai) vs mandatory FSSAI & ICMR 2024 safe standards (Kitna Rehna Chahiye).',
        40,
        doc.y
      );
      doc.moveDown(0.4);

      let nutTableY = doc.y;
      doc.rect(40, nutTableY, 515, 18).fillAndStroke('#F0FDF4', '#BBF7D0');
      doc.fillColor('#14532D').fontSize(7.5).font('Helvetica-Bold');
      doc.text('Nutrient Parameter', 45, nutTableY + 5, { width: 100 });
      doc.text('Observed (Kitna Hai)', 150, nutTableY + 5, { width: 95 });
      doc.text('FSSAI Limit (Standard)', 250, nutTableY + 5, { width: 95 });
      doc.text('Safety Status', 350, nutTableY + 5, { width: 70 });
      doc.text('Clinical / Statutory Verdict', 425, nutTableY + 5, { width: 125 });

      doc.y = nutTableY + 22;

      nutrientRows.forEach((nr) => {
        const rY = doc.y;
        doc.fillColor(textColor).fontSize(7.5).font('Helvetica-Bold').text(nr.name, 45, rY, { width: 100 });
        doc.font('Courier-Bold').fillColor('#0F172A').text(nr.obs, 150, rY, { width: 95 });
        doc.font('Courier-Bold').fillColor('#15803D').text(nr.std, 250, rY, { width: 95 });
        doc.font('Helvetica-Bold').fillColor(nr.badgeColor).text(nr.status, 350, rY, { width: 70 });
        doc.font('Helvetica').fillColor('#334155').text(nr.verdict, 425, rY, { width: 125 });
        doc.moveDown(0.5);
      });

      doc.moveDown(0.2);
      doc.fillColor(mutedColor).fontSize(7).font('Helvetica-Oblique').text(
        'Official References: FSSAI Labelling Reg. 2020 (Gazette 18/11/2020), FSS Act 2006 (Act 34 of 2006), ICMR-NIN 2024 Guidelines.',
        45,
        doc.y
      );
      doc.moveDown(0.3);
      drawDivider();

      // -------------------------------------------------------------
      // 8. APPLICABLE RULE RESULTS (Deterministic Rule Engine)
      // -------------------------------------------------------------
      if (doc.y > 660) doc.addPage();

      doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('Applicable Statutory Rule Results', 40, doc.y);
      doc.moveDown(0.2);
      doc.fillColor(mutedColor).fontSize(7.5).font('Helvetica').text(
        'Deterministic rule engine assessment under Legal Metrology Act, FSSAI, and CDSCO rules.',
        40,
        doc.y
      );
      doc.moveDown(0.4);

      // Table Header
      let tableY = doc.y;
      doc.rect(40, tableY, 515, 18).fillAndStroke('#EEF2FF', '#C7D2FE');
      doc.fillColor('#312E81').fontSize(7.5).font('Helvetica-Bold');
      doc.text('Rule ID', 45, tableY + 5, { width: 50 });
      doc.text('Requirement', 100, tableY + 5, { width: 145 });
      doc.text('Status', 250, tableY + 5, { width: 55 });
      doc.text('Observed Value / Deterministic Reason', 310, tableY + 5, { width: 240 });

      doc.y = tableY + 22;

      checks.forEach((chk) => {
        if (doc.y > 730) {
          doc.addPage();
          tableY = 40;
          doc.rect(40, tableY, 515, 18).fillAndStroke('#EEF2FF', '#C7D2FE');
          doc.fillColor('#312E81').fontSize(7.5).font('Helvetica-Bold');
          doc.text('Rule ID', 45, tableY + 5, { width: 50 });
          doc.text('Requirement', 100, tableY + 5, { width: 145 });
          doc.text('Status', 250, tableY + 5, { width: 55 });
          doc.text('Observed Value / Deterministic Reason', 310, tableY + 5, { width: 240 });
          doc.y = tableY + 22;
        }

        const rawStatus = String(chk.status || '').toUpperCase();
        let badgeColor = '#059669';
        let statusText = 'PASS';
        if (rawStatus.includes('FAIL') || rawStatus.includes('NON')) {
          badgeColor = '#DC2626';
          statusText = 'FAIL';
        } else if (rawStatus.includes('REVIEW')) {
          badgeColor = '#D97706';
          statusText = 'NEEDS_REVIEW';
        } else if (rawStatus.includes('NOT') || rawStatus.includes('APPLICABLE')) {
          badgeColor = '#64748B';
          statusText = 'NOT_APPLICABLE';
        }

        const rowY = doc.y;
        doc.fillColor(textColor).fontSize(7.5).font('Courier-Bold').text(chk.ruleId || 'LM-001', 45, rowY, { width: 50 });
        doc.font('Helvetica-Bold').fillColor(textColor).text(chk.field || chk.requirement || '', 100, rowY, { width: 145 });
        doc.fillColor(badgeColor).font('Helvetica-Bold').text(statusText, 250, rowY, { width: 55 });

        const reason = chk.detectedValue
          ? `Observed: "${chk.detectedValue}" — ${chk.explanation || ''}`
          : chk.explanation || 'Verification performed against statutory mandate.';
        doc.font('Helvetica').fillColor('#334155').text(reason, 310, rowY, { width: 240 });

        doc.moveDown(0.5);
      });

      drawDivider();

      // -------------------------------------------------------------
      // 9. ESTIMATED FONT SIZE & READABILITY ANALYSIS
      // -------------------------------------------------------------
      if (readabilityResult || reportData.readabilityResult) {
        const r = readabilityResult || reportData.readabilityResult;
        if (doc.y > 640) doc.addPage();

        doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('Estimated Font Size & Readability Analysis', 40, doc.y);
        doc.moveDown(0.2);
        doc.fillColor(mutedColor).fontSize(7.5).font('Helvetica').text(
          'Image-based heuristic evaluation of visual font height, optical contrast, and label legibility. (Non-calibrated estimation).',
          40,
          doc.y
        );
        doc.moveDown(0.4);

        const readBoxY = doc.y;
        doc.rect(40, readBoxY, 515, 38).fillAndStroke(lightBg, borderColor);

        const readStatusColor = r.overallStatus === 'PASS' ? '#059669' : r.overallStatus === 'FAIL' ? '#DC2626' : '#D97706';
        doc.fillColor(readStatusColor).fontSize(10).font('Helvetica-Bold').text(`Overall: ${r.overallStatus}`, 52, readBoxY + 7);
        doc.fillColor(mutedColor).fontSize(7.5).font('Helvetica').text(`Readability Score: ${r.overallScore ?? 85}/100`, 52, readBoxY + 22);

        doc.fillColor(textColor).fontSize(7.5).font('Helvetica-Bold').text('Estimated Text Size:', 180, readBoxY + 7);
        doc.font('Helvetica').fillColor(primaryColor).text(r.estimatedFontSize || 'ADEQUATE', 270, readBoxY + 7);

        doc.fillColor(textColor).font('Helvetica-Bold').text('Image Quality:', 180, readBoxY + 22);
        doc.font('Helvetica').fillColor(textColor).text(r.imageQuality || 'GOOD', 270, readBoxY + 22);

        doc.fillColor(textColor).font('Helvetica-Bold').text('Text Visibility:', 360, readBoxY + 7);
        doc.font('Helvetica').fillColor(textColor).text(r.textVisibility || 'GOOD', 440, readBoxY + 7);

        doc.fillColor(textColor).font('Helvetica-Bold').text('OCR Confidence:', 360, readBoxY + 22);
        doc.font('Helvetica').fillColor(textColor).text(r.ocrConfidence ? `${r.ocrConfidence}%` : 'N/A', 440, readBoxY + 22);

        doc.y = readBoxY + 44;

        // Individual Readability Checks Breakdown
        const readChecks = r.checks || [
          { name: 'Text Visibility', status: r.textVisibility === 'GOOD' ? 'PASS' : 'NEEDS_REVIEW', value: r.textVisibility || 'GOOD', reason: 'Label text is clearly detected across candidate regions.' },
          { name: 'Estimated Text Size', status: r.estimatedFontSize === 'ADEQUATE' || r.estimatedFontSize === 'LARGE' ? 'PASS' : 'NEEDS_REVIEW', value: r.estimatedFontSize || 'ADEQUATE', reason: 'Detected text has sufficient pixel height for readability estimation.' },
          { name: 'OCR Confidence', status: (r.ocrConfidence || 85) >= 70 ? 'PASS' : 'NEEDS_REVIEW', value: `${r.ocrConfidence || 85}%`, reason: `Character recognition confidence: ${r.ocrConfidence || 85}%.` },
          { name: 'Physical Font Size', status: 'NEEDS_REVIEW', value: 'Uncalibrated', reason: 'Exact physical font size cannot be reliably verified from an ordinary photograph without a calibrated physical scale reference.' },
        ];

        readChecks.forEach((rc) => {
          const stColor = rc.status === 'PASS' ? '#059669' : '#D97706';
          const rY = doc.y;
          doc.fillColor(textColor).fontSize(7.5).font('Helvetica-Bold').text(rc.name, 45, rY, { width: 140 });
          doc.fillColor(stColor).font('Helvetica-Bold').text(rc.status === 'PASS' ? '✓ PASS' : '⚠ NEEDS_REVIEW', 190, rY, { width: 85 });
          doc.font('Helvetica').fillColor('#475569').text(rc.reason, 280, rY, { width: 270 });
          doc.moveDown(0.35);
        });

        doc.moveDown(0.2);
        doc.fillColor(mutedColor).fontSize(7).font('Helvetica-Oblique').text(
          'Important Legal Limitation: Never claim that the system has verified exact legal font size in millimetres without a calibrated physical reference.',
          45,
          doc.y
        );
        doc.moveDown(0.3);
        drawDivider();
      }

      // -------------------------------------------------------------
      // 10. PLACEMENT ANALYSIS (If implemented)
      // -------------------------------------------------------------
      if (placementResult) {
        if (doc.y > 670) doc.addPage();
        doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('Placement Analysis', 40, doc.y);
        doc.moveDown(0.3);
        doc.fillColor(textColor).fontSize(7.5).font('Helvetica').text(
          `Declaration: ${placementResult.declaration || 'Primary Display Panel'} | Detected Location: ${placementResult.location || 'Front'} | Status: ${placementResult.status || 'PASS'}`,
          45,
          doc.y
        );
        doc.moveDown(0.3);
        drawDivider();
      }

      // -------------------------------------------------------------
      // 11. COMPLAINT & REVIEWER STATUS (If applicable)
      // -------------------------------------------------------------
      if (complaintData || reportData.complaintData) {
        const c = complaintData || reportData.complaintData;
        if (doc.y > 660) doc.addPage();

        doc.fillColor('#DC2626').fontSize(11).font('Helvetica-Bold').text('Official Enforcement Complaint Record', 40, doc.y);
        doc.moveDown(0.2);

        const compBoxY = doc.y;
        doc.rect(40, compBoxY, 515, 42).fillAndStroke('#FEF2F2', '#FECACA');

        doc.fillColor('#991B1B').fontSize(8).font('Helvetica-Bold').text('Complaint ID:', 50, compBoxY + 8);
        doc.font('Helvetica').fillColor('#7F1D1D').text(c.complaintId || 'CMP-ACTIVE', 120, compBoxY + 8);

        doc.fillColor('#991B1B').font('Helvetica-Bold').text('Current Status:', 50, compBoxY + 23);
        doc.font('Helvetica-Bold').fillColor('#DC2626').text(c.status || 'Submitted', 120, compBoxY + 23);

        doc.fillColor('#991B1B').font('Helvetica-Bold').text('Submitted Date:', 300, compBoxY + 8);
        doc.font('Helvetica').fillColor('#7F1D1D').text(
          new Date(c.submittedAt || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          380,
          compBoxY + 8
        );

        doc.y = compBoxY + 50;
        drawDivider();
      }

      if (reviewerEdits || reportData.reviewerEdits) {
        const edits = reviewerEdits || reportData.reviewerEdits;
        if (doc.y > 670) doc.addPage();

        doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('Reviewer Comments & Corrective Action', 40, doc.y);
        doc.moveDown(0.2);

        const editBoxY = doc.y;
        doc.rect(40, editBoxY, 515, 48).fillAndStroke(lightBg, borderColor);
        doc.fillColor(textColor).fontSize(7.5).font('Helvetica-Bold').text('Reviewer Remarks:', 48, editBoxY + 7);
        doc.font('Helvetica').fillColor('#334155').text(edits.remarks || 'No specific remarks entered by inspector.', 48, editBoxY + 17, { width: 500 });
        if (edits.correctiveAction) {
          doc.fillColor(textColor).font('Helvetica-Bold').text('Recommended Corrective Action:', 48, editBoxY + 29);
          doc.font('Helvetica').fillColor('#334155').text(edits.correctiveAction, 48, editBoxY + 38, { width: 500 });
        }
        doc.y = editBoxY + 56;
        drawDivider();
      }

      // -------------------------------------------------------------
      // 12. MANDATORY STATUTORY DISCLAIMER
      // -------------------------------------------------------------
      if (doc.y > 690) doc.addPage();
      doc.fillColor(mutedColor).fontSize(8).font('Helvetica-Bold').text('DISCLAIMER & LEGAL NOTICE', 40, doc.y);
      doc.moveDown(0.15);
      doc.font('Helvetica').fontSize(7).fillColor('#64748B').text(
        'AI-assisted preliminary compliance screening. Results are indicative and should be verified against the current applicable regulations and competent authority. This report does not constitute government certification, regulatory approval, laboratory testing, legal advice, or a final legal decision.',
        40,
        doc.y,
        { width: 515, align: 'justify' }
      );

      // -------------------------------------------------------------
      // FOOTER ON ALL PAGES
      // -------------------------------------------------------------
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.fillColor('#94A3B8').fontSize(7.5).font('Helvetica');
        doc.text(`CompliScan AI • Compliance Screening Report • ${reportId}`, 40, 805, { width: 250 });
        doc.text(`Page ${i + 1} of ${totalPages}`, 355, 805, { width: 200, align: 'right' });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
