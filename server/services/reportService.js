/**
 * Professional PDF Report Generator for CompliScan AI
 * Uses PDFKit to create multi-page A4 compliance screening reports
 * with clean typography, tables, badges, and official regulatory citations.
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
      } = reportData;

      const dateStr = new Date(scanDate).toISOString().slice(0, 10).replace(/-/g, '');
      const shortId = scanId.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || 'X001';
      const reportId = `CS-${dateStr}-${shortId}`;

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
        doc.moveDown(0.5);
        doc.strokeColor(borderColor).lineWidth(0.75).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
        doc.moveDown(0.5);
      };

      // -------------------------------------------------------------
      // HEADER
      // -------------------------------------------------------------
      doc.fillColor(primaryColor).fontSize(18).font('Helvetica-Bold').text('COMPLISCAN AI', 40, 40);
      doc.fillColor(mutedColor).fontSize(9).font('Helvetica').text('AI-Powered Product Label Compliance Screening', 40, 62);

      // Top right header box
      doc.fillColor(textColor).fontSize(9).font('Helvetica-Bold').text(`Report ID: ${reportId}`, 360, 40, { align: 'right', width: 195 });
      doc.font('Helvetica').fontSize(8).fillColor(mutedColor).text(`Generated: ${new Date(scanDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`, 360, 52, { align: 'right', width: 195 });

      const statusBadgeColor = score >= 80 ? '#059669' : score >= 50 ? '#D97706' : '#DC2626';
      doc.fillColor(statusBadgeColor).fontSize(10).font('Helvetica-Bold').text(overallStatus.toUpperCase(), 360, 65, { align: 'right', width: 195 });

      doc.y = 85;

      // User Information Strip
      const userName = reportData.userName || (reportData.user ? reportData.user.name : 'CompliScan Inspector');
      const userEmail = reportData.userEmail || (reportData.user ? reportData.user.email : 'inspector@compliscan.ai');
      doc.rect(40, doc.y, 515, 20).fillAndStroke('#F1F5F9', '#CBD5E1');
      doc.fillColor('#334155').font('Helvetica-Bold').fontSize(8).text('Inspector / User:', 48, doc.y + 5);
      doc.font('Helvetica').fillColor('#0F172A').text(`${userName} (${userEmail})`, 130, doc.y - 8);
      doc.font('Helvetica-Bold').fillColor('#475569').text(`Scan ID: ${scanId}`, 380, doc.y - 8, { align: 'right', width: 165 });

      doc.y = 114;
      drawDivider();

      // -------------------------------------------------------------
      // 1. PRODUCT SUMMARY & ORIGINAL SCANNED IMAGE
      // -------------------------------------------------------------
      doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('1. Product Information Summary & Scanned Label', 40, doc.y);
      doc.moveDown(0.4);

      const sectionStartY = doc.y;
      const leftColWidth = 320;
      const rightColX = 375;
      const rightColWidth = 180;

      // Product meta items on left column
      const metaItems = [
        ['Product Name', productName],
        ['Brand', productBrand],
        ['Category', category],
        ['Maximum Retail Price (MRP)', extractedInfo['MRP'] || structuredProduct.mrp || 'Not detected'],
        ['Net Quantity', extractedInfo['Net Quantity'] || structuredProduct.netQuantity || 'Not detected'],
        ['Manufacturer / Packer', extractedInfo['Manufacturer'] || structuredProduct.manufacturer || 'Not detected'],
        ['Date of Manufacture', extractedInfo['Manufacture Date'] || structuredProduct.manufacturingDate || 'Not detected'],
        ['Expiry / Best Before', extractedInfo['Best Before / Expiry'] || structuredProduct.expiryDate || 'Not detected'],
        ['Batch / Lot Number', extractedInfo['Batch Number'] || structuredProduct.batchNumber || 'Not detected'],
        ['Country of Origin', extractedInfo['Country of Origin'] || structuredProduct.countryOfOrigin || 'India (Domestic)'],
        ['Regulatory Licence (FSSAI/CDSCO)', extractedInfo['FSSAI / License Number'] || structuredProduct.licenseNumber || 'Not detected'],
      ];

      doc.fillColor(textColor).fontSize(8);
      metaItems.forEach(([label, val]) => {
        const rowY = doc.y;
        doc.font('Helvetica-Bold').fillColor(mutedColor).text(label, 45, rowY, { width: 140 });
        doc.font('Helvetica').fillColor(val === 'Not detected' ? '#DC2626' : textColor).text(String(val || 'Not detected'), 190, rowY, { width: 175 });
        doc.moveDown(0.32);
      });

      const metaEndY = doc.y;

      // Embed Original Scanned Product Image on right side of section 1
      let imageDrawn = false;
      const imagePath = reportData.originalImageUrl || reportData.uploadedImage;
      if (imagePath && typeof imagePath === 'string') {
        try {
          let resolvedImgPath = null;
          if (imagePath.startsWith('/uploads/')) {
            resolvedImgPath = path.join(__dirname, '..', imagePath);
          } else if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
            // Checked if exists on disk by filename
            const basename = path.basename(imagePath);
            const localCandidate = path.join(__dirname, '..', 'uploads', 'scans', basename);
            if (fs.existsSync(localCandidate)) {
              resolvedImgPath = localCandidate;
            }
          } else if (fs.existsSync(imagePath)) {
            resolvedImgPath = imagePath;
          }

          if (resolvedImgPath && fs.existsSync(resolvedImgPath)) {
            doc.rect(rightColX, sectionStartY, rightColWidth, 155).stroke(borderColor);
            doc.image(resolvedImgPath, rightColX + 5, sectionStartY + 5, {
              fit: [rightColWidth - 10, 130],
              align: 'center',
              valign: 'center',
            });
            doc.font('Helvetica-Oblique').fontSize(7).fillColor(mutedColor).text('Original Scanned Label', rightColX, sectionStartY + 140, { width: rightColWidth, align: 'center' });
            imageDrawn = true;
          }
        } catch (imgErr) {
          console.warn('[PDF Image Embed Warning]:', imgErr.message);
        }
      }

      if (!imageDrawn) {
        doc.rect(rightColX, sectionStartY, rightColWidth, 110).fillAndStroke(lightBg, borderColor);
        doc.font('Helvetica-Oblique').fontSize(8).fillColor(mutedColor).text('Original scan image unavailable or uploaded as memory blob.', rightColX + 10, sectionStartY + 45, { width: rightColWidth - 20, align: 'center' });
      }

      doc.y = Math.max(metaEndY, sectionStartY + 160);
      drawDivider();

      // -------------------------------------------------------------
      // 2. COMPLIANCE SCREENING SCORE
      // -------------------------------------------------------------
      doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('2. Label Compliance Screening Score', 40, doc.y);
      doc.moveDown(0.2);
      doc.fillColor(mutedColor).fontSize(8).font('Helvetica').text('AI-assisted preliminary screening score mathematically derived from deterministic statutory rules.', 40, doc.y);
      doc.moveDown(0.6);

      const scoreBoxY = doc.y;
      doc.rect(40, scoreBoxY, 515, 48).fillAndStroke(lightBg, borderColor);

      doc.fillColor(statusBadgeColor).fontSize(22).font('Helvetica-Bold').text(`${Math.round(score)}`, 60, scoreBoxY + 12);
      doc.fillColor(mutedColor).fontSize(10).font('Helvetica').text('/ 100', 95, scoreBoxY + 22);

      // Summary badges
      doc.fillColor('#059669').fontSize(9).font('Helvetica-Bold').text(`Passed: ${summary.passed}`, 180, scoreBoxY + 18);
      doc.fillColor('#DC2626').text(`Potential Issues: ${summary.issues}`, 265, scoreBoxY + 18);
      doc.fillColor('#D97706').text(`Needs Review: ${summary.review}`, 380, scoreBoxY + 18);
      doc.fillColor(mutedColor).text(`Not Applicable: ${summary.notApplicable}`, 470, scoreBoxY + 18);

      doc.y = scoreBoxY + 60;
      drawDivider();

      // -------------------------------------------------------------
      // 2B. ESTIMATED FONT SIZE & READABILITY ANALYSIS (SEPARATE LAYER)
      // -------------------------------------------------------------
      if (reportData.readabilityResult) {
        const r = reportData.readabilityResult;
        doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('3. Estimated Font Size & Readability Analysis', 40, doc.y);
        doc.moveDown(0.2);
        doc.fillColor(mutedColor).fontSize(8).font('Helvetica').text(
          'Image-based heuristic evaluation of visual font height, optical confidence, and label legibility. (Non-calibrated estimation).',
          40,
          doc.y
        );
        doc.moveDown(0.5);

        const readBoxY = doc.y;
        doc.rect(40, readBoxY, 515, 42).fillAndStroke(lightBg, borderColor);

        const readStatusColor = r.overallStatus === 'PASS' ? '#059669' : r.overallStatus === 'FAIL' ? '#DC2626' : '#D97706';
        doc.fillColor(readStatusColor).fontSize(11).font('Helvetica-Bold').text(`Overall: ${r.overallStatus}`, 55, readBoxY + 8);
        doc.fillColor(mutedColor).fontSize(8).font('Helvetica').text(`Readability Index: ${r.overallScore ?? 85}/100`, 55, readBoxY + 24);

        doc.fillColor(textColor).fontSize(8).font('Helvetica-Bold').text('Estimated Text Size:', 185, readBoxY + 8);
        doc.font('Helvetica').fillColor(primaryColor).text(r.estimatedFontSize || 'ADEQUATE', 280, readBoxY + 8);

        doc.fillColor(textColor).font('Helvetica-Bold').text('Image Quality:', 185, readBoxY + 24);
        doc.font('Helvetica').fillColor(textColor).text(r.imageQuality || 'GOOD', 280, readBoxY + 24);

        doc.fillColor(textColor).font('Helvetica-Bold').text('Text Visibility:', 365, readBoxY + 8);
        doc.font('Helvetica').fillColor(textColor).text(r.textVisibility || 'GOOD', 450, readBoxY + 8);

        doc.fillColor(textColor).font('Helvetica-Bold').text('OCR Confidence:', 365, readBoxY + 24);
        doc.font('Helvetica').fillColor(textColor).text(r.ocrConfidence ? `${r.ocrConfidence}%` : 'N/A', 450, readBoxY + 24);

        doc.y = readBoxY + 50;

        // Note on calibrated reference
        doc.fillColor(mutedColor).fontSize(7.5).font('Helvetica-Oblique').text(
          'Note: Exact legal printed font size in millimetres cannot be certified from uncalibrated photographs without a physical scale marker.',
          45,
          doc.y
        );
        doc.moveDown(0.4);
        drawDivider();
      }

      // -------------------------------------------------------------
      // 4. STATUTORY RULE SUMMARY TABLE
      // -------------------------------------------------------------
      if (doc.y > 660) doc.addPage();

      doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text(reportData.readabilityResult ? '4. Official Statutory Rule Findings' : '3. Official Statutory Rule Findings', 40, doc.y);
      doc.moveDown(0.3);
      doc.fillColor(mutedColor).fontSize(8).font('Helvetica').text('Every applicable declaration is evaluated deterministically against Legal Metrology Act, FSSAI, or CDSCO provisions.', 40, doc.y);
      doc.moveDown(0.6);

      // Table Header
      let tableY = doc.y;
      doc.rect(40, tableY, 515, 20).fillAndStroke('#EEF2FF', '#C7D2FE');
      doc.fillColor('#312E81').fontSize(8).font('Helvetica-Bold');
      doc.text('Rule ID', 45, tableY + 5, { width: 55 });
      doc.text('Requirement', 105, tableY + 5, { width: 140 });
      doc.text('Status', 250, tableY + 5, { width: 65 });
      doc.text('Observed Value / Deterministic Reason', 320, tableY + 5, { width: 230 });

      doc.y = tableY + 24;

      checks.forEach((chk, idx) => {
        if (doc.y > 730) {
          doc.addPage();
          // redraw mini header on next page
          tableY = 40;
          doc.rect(40, tableY, 515, 18).fillAndStroke('#EEF2FF', '#C7D2FE');
          doc.fillColor('#312E81').fontSize(8).font('Helvetica-Bold');
          doc.text('Rule ID', 45, tableY + 5, { width: 55 });
          doc.text('Requirement', 105, tableY + 5, { width: 140 });
          doc.text('Status', 250, tableY + 5, { width: 65 });
          doc.text('Observed Value / Deterministic Reason', 320, tableY + 5, { width: 230 });
          doc.y = tableY + 22;
        }

        const rowY = doc.y;
        const isAlt = idx % 2 === 1;
        if (isAlt) {
          doc.rect(40, rowY - 2, 515, 34).fill('#F8FAFC');
        }

        doc.fillColor('#4338CA').font('Helvetica-Bold').fontSize(8).text(chk.ruleId, 45, rowY, { width: 55 });
        doc.fillColor(textColor).font('Helvetica').fontSize(8).text(chk.field || chk.requirement, 105, rowY, { width: 140 });

        const st = String(chk.status).toLowerCase();
        const stColor = st === 'pass' || st === 'passed' ? '#059669' : st === 'fail' || st === 'failed' ? '#DC2626' : st.includes('review') ? '#D97706' : '#64748B';
        const stLabel = st === 'pass' || st === 'passed' ? 'PASS' : st === 'fail' || st === 'failed' ? 'FAIL' : st.includes('review') ? 'REVIEW' : 'N/A';

        doc.fillColor(stColor).font('Helvetica-Bold').fontSize(7.5).text(stLabel, 250, rowY, { width: 65 });

        const detailText = chk.detectedValue ? `"${chk.detectedValue}" — ${chk.explanation}` : chk.explanation;
        doc.fillColor(textColor).font('Helvetica').fontSize(7.5).text(detailText, 320, rowY, { width: 230 });

        doc.y = Math.max(doc.y, rowY + 32);
      });

      drawDivider();

      // -------------------------------------------------------------
      // 4. OFFICIAL REGULATORY REFERENCES
      // -------------------------------------------------------------
      if (doc.y > 670) doc.addPage();

      doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('4. Official Statutory References', 40, doc.y);
      doc.moveDown(0.4);

      const refs = [
        {
          authority: 'Department of Consumer Affairs, Government of India',
          title: 'Legal Metrology Act, 2009 & Legal Metrology (Packaged Commodities) Rules, 2011',
          url: 'https://consumeraffairs.nic.in/acts-and-rules/legal-metrology/the-legal-metrology-packaged-commodities-rules-2011',
        },
        {
          authority: 'Food Safety and Standards Authority of India (FSSAI)',
          title: 'Food Safety and Standards (Labelling and Display) Regulations, 2020 & Product Standards',
          url: 'https://www.fssai.gov.in/upload/uploadfiles/files/Compendium_Labelling_Display_23_09_2021.pdf',
        },
        {
          authority: 'Central Drugs Standard Control Organization (CDSCO)',
          title: 'Cosmetics Rules, 2020 & Bureau of Indian Standards (BIS)',
          url: 'https://cdsco.gov.in/opencms/export/sites/CDSCO_WEB/Pdf-documents/Cosmetics-Rules-2020.pdf',
        },
      ];

      refs.forEach((ref) => {
        doc.fillColor(textColor).fontSize(8.5).font('Helvetica-Bold').text(ref.authority, 45, doc.y);
        doc.fillColor(mutedColor).font('Helvetica').fontSize(8).text(ref.title, 45, doc.y + 1);
        doc.fillColor(primaryColor).fontSize(7.5).text(ref.url, 45, doc.y + 1, { link: ref.url, underline: true });
        doc.moveDown(0.5);
      });

      drawDivider();

      // -------------------------------------------------------------
      // 5. AI PIPELINE ARCHITECTURE & APPENDIX
      // -------------------------------------------------------------
      if (doc.y > 640) doc.addPage();

      doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('5. AI Processing Architecture & Verification', 40, doc.y);
      doc.moveDown(0.3);

      doc.fillColor(textColor).fontSize(8).font('Helvetica');
      doc.text('Pipeline Execution Sequence: Product Image → OCR.Space (Text Extraction) → Groq LLM (Strict Schema) → Deterministic Rule Engine', 45, doc.y);
      doc.moveDown(0.2);
      doc.fillColor(mutedColor).text(`OCR Engine: ${ocrEngine} | LLM Engine: Groq (${process.env.GROQ_MODEL || 'openai/gpt-oss-20b'}) | Rule Engine: CompliScan AI Deterministic Rules`, 45, doc.y);
      doc.moveDown(0.6);

      // Raw OCR Box
      doc.fillColor(textColor).fontSize(9).font('Helvetica-Bold').text('Appendix A: Raw OCR Text (OCR.Space)', 40, doc.y);
      doc.moveDown(0.2);
      const ocrY = doc.y;
      const snippet = ocrText.trim() ? ocrText.slice(0, 1200) : 'No raw OCR characters extracted.';
      doc.rect(40, ocrY, 515, 75).fillAndStroke(lightBg, borderColor);
      doc.fillColor('#334155').font('Courier').fontSize(7).text(snippet, 45, ocrY + 6, { width: 505, height: 63, ellipsis: true });
      doc.y = ocrY + 85;

      // Groq JSON Box
      if (doc.y > 670) doc.addPage();
      doc.fillColor(textColor).fontSize(9).font('Helvetica-Bold').text('Appendix B: Structured Product Data (Groq AI)', 40, doc.y);
      doc.moveDown(0.2);
      const jsonY = doc.y;
      const jsonSnippet = JSON.stringify(structuredProduct, null, 2);
      doc.rect(40, jsonY, 515, 95).fillAndStroke(lightBg, borderColor);
      doc.fillColor('#047857').font('Courier').fontSize(7).text(jsonSnippet, 45, jsonY + 6, { width: 505, height: 83, ellipsis: true });
      doc.y = jsonY + 105;

      // -------------------------------------------------------------
      // 5. REVIEWER NOTES & CORRECTIVE ACTIONS (EDITABLE LAYER)
      // -------------------------------------------------------------
      if (reportData.reviewerEdits) {
        const edits = reportData.reviewerEdits;
        if (doc.y > 670) doc.addPage();
        drawDivider();
        doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('5. Reviewer Notes & Corrective Actions', 40, doc.y);
        doc.moveDown(0.3);

        const editBoxY = doc.y;
        doc.rect(40, editBoxY, 515, 60).fillAndStroke(lightBg, borderColor);
        doc.fillColor(textColor).fontSize(8).font('Helvetica-Bold').text('Reviewer Remarks:', 48, editBoxY + 8);
        doc.font('Helvetica').fillColor('#334155').text(edits.remarks || 'No specific remarks entered by inspector.', 48, editBoxY + 20, { width: 500 });
        if (edits.correctiveAction) {
          doc.fillColor(textColor).font('Helvetica-Bold').text('Recommended Corrective Action:', 48, editBoxY + 36);
          doc.font('Helvetica').fillColor('#334155').text(edits.correctiveAction, 48, editBoxY + 48, { width: 500 });
        }
        doc.y = editBoxY + 70;
      }

      // -------------------------------------------------------------
      // 6. MANDATORY STATUTORY DISCLAIMER
      // -------------------------------------------------------------
      if (doc.y > 690) doc.addPage();
      drawDivider();
      doc.fillColor(mutedColor).fontSize(8).font('Helvetica-Bold').text('DISCLAIMER & LEGAL NOTICE', 40, doc.y);
      doc.font('Helvetica').fontSize(7).fillColor('#64748B').text(
        'This report provides an AI-assisted preliminary screening of visible product-label information against configured regulatory requirements. It does not constitute government certification, regulatory approval, laboratory testing, legal advice, or a final determination of compliance. Results should be verified against the current applicable regulations and competent authority.',
        40,
        doc.y + 2,
        { width: 515, align: 'justify' }
      );

      // -------------------------------------------------------------
      // FOOTER ON ALL PAGES
      // -------------------------------------------------------------
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.fillColor('#94A3B8').fontSize(7.5).font('Helvetica');
        doc.text(`CompliScan AI • Compliance Screening Report • ${reportId}`, 40, 800, { width: 250 });
        doc.text(`Page ${i + 1} of ${totalPages}`, 355, 800, { width: 200, align: 'right' });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
