/**
 * Professional DOCX Report Generator Service
 *
 * Generates an editable .docx report file with real scan data,
 * original user information, product declarations, rule evaluations,
 * readability diagnostics, reviewer remarks, and statutory disclaimers.
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  HeadingLevel,
  AlignmentType,
  ImageRun
} from 'docx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateComplianceDocx(reportData) {
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
    readabilityResult = null,
    reviewerEdits = null,
    originalImageUrl = null,
    userName = 'CompliScan User',
    userEmail = 'user@compliscan.ai',
  } = reportData;

  const dateStr = new Date(scanDate).toISOString().slice(0, 10).replace(/-/g, '');
  const shortId = scanId.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || 'X001';
  const reportId = `CS-${dateStr}-${shortId}`;

  // Build product summary rows
  const metaRows = [
    ['Product Name', productName],
    ['Brand', productBrand],
    ['Category', category],
    ['Maximum Retail Price (MRP)', extractedInfo['MRP'] || 'Not detected'],
    ['Net Quantity', extractedInfo['Net Quantity'] || 'Not detected'],
    ['Manufacturer / Packer', extractedInfo['Manufacturer'] || 'Not detected'],
    ['Date of Manufacture', extractedInfo['Manufacture Date'] || 'Not detected'],
    ['Expiry / Best Before', extractedInfo['Best Before / Expiry'] || 'Not detected'],
    ['Batch / Lot Number', extractedInfo['Batch Number'] || 'Not detected'],
    ['Regulatory Licence (FSSAI/CDSCO)', extractedInfo['FSSAI / License Number'] || 'Not detected'],
    ['Country of Origin', extractedInfo['Country of Origin'] || 'India (Domestic)'],
  ];

  const tableRows = metaRows.map(([label, val]) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20 })] })],
        }),
        new TableCell({
          width: { size: 65, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: String(val || 'Not detected'), size: 20 })] })],
        }),
      ],
    });
  });

  // Build Compliance Rules rows
  const ruleRows = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Rule ID', bold: true, size: 20 })] })] }),
        new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Requirement', bold: true, size: 20 })] })] }),
        new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Status', bold: true, size: 20 })] })] }),
        new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Observed / Reason', bold: true, size: 20 })] })] }),
      ],
    }),
    ...checks.map((chk) => {
      const st = String(chk.status).toUpperCase();
      return new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: chk.ruleId, bold: true, size: 18 })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: chk.field || chk.requirement, size: 18 })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: st.includes('PASS') ? 'PASS' : st.includes('FAIL') ? 'FAIL' : 'REVIEW', bold: true, size: 18 })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: chk.detectedValue ? `"${chk.detectedValue}" — ${chk.explanation}` : chk.explanation || '', size: 18 })] })] }),
        ],
      });
    }),
  ];

  // Try to load original image
  let imageParagraph = new Paragraph({
    children: [new TextRun({ text: '[Original scanned product image unavailable or in memory]', italics: true, size: 18 })],
  });

  if (originalImageUrl) {
    try {
      let localPath = null;
      if (originalImageUrl.startsWith('/uploads/')) {
        localPath = path.join(__dirname, '..', originalImageUrl);
      } else if (fs.existsSync(originalImageUrl)) {
        localPath = originalImageUrl;
      }

      if (localPath && fs.existsSync(localPath)) {
        const imageBuffer = fs.readFileSync(localPath);
        imageParagraph = new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ImageRun({
              data: imageBuffer,
              transformation: { width: 320, height: 240 },
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Original Scanned Product Label', italics: true, size: 16 })],
            }),
          ],
        });
      }
    } catch (e) {
      console.warn('[Docx Image Embed Error]:', e.message);
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({ text: 'COMPLISCAN AI — Editable Compliance Report', bold: true, color: '4338CA', size: 32 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'AI-assisted preliminary compliance screening (Editable Inspection Draft)', italics: true, size: 20 }),
            ],
          }),
          new Paragraph({ text: '' }),

          // User Information
          new Paragraph({
            children: [
              new TextRun({ text: 'Inspector / User: ', bold: true }),
              new TextRun({ text: `${userName} (${userEmail})` }),
              new TextRun({ text: '  |  ' }),
              new TextRun({ text: 'Report ID: ', bold: true }),
              new TextRun({ text: reportId }),
              new TextRun({ text: '  |  ' }),
              new TextRun({ text: 'Score: ', bold: true }),
              new TextRun({ text: `${Math.round(score)}/100 (${overallStatus})`, bold: true }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Original Scanned Image
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '1. Scanned Product Label Image', bold: true, size: 24 })],
          }),
          imageParagraph,
          new Paragraph({ text: '' }),

          // Product Information
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '2. Product Information Summary', bold: true, size: 24 })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          }),
          new Paragraph({ text: '' }),

          // Font Size & Readability
          ...(readabilityResult ? [
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [new TextRun({ text: '3. Estimated Font Size & Readability Analysis', bold: true, size: 24 })],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Overall Readability: ${readabilityResult.overallStatus}  |  Readability Score: ${readabilityResult.overallScore}/100\n`, bold: true }),
                new TextRun({ text: `Estimated Text Size: ${readabilityResult.estimatedFontSize}  |  Text Visibility: ${readabilityResult.textVisibility}  |  Image Quality: ${readabilityResult.imageQuality}\n` }),
                new TextRun({ text: 'Limitation Note: Exact physical font size in mm cannot be verified without a calibrated optical reference.\n', italics: true, color: '64748B' }),
              ],
            }),
            new Paragraph({ text: '' }),
          ] : []),

          // Compliance Results
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '4. Statutory Compliance Rule Evaluation', bold: true, size: 24 })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: ruleRows,
          }),
          new Paragraph({ text: '' }),

          // Reviewer Comments
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '5. Reviewer Comments & Corrective Action', bold: true, size: 24 })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Reviewer Remarks:\n', bold: true }),
              new TextRun({ text: reviewerEdits?.remarks || 'No remarks recorded yet.\n' }),
              new TextRun({ text: '\nCorrective Action:\n', bold: true }),
              new TextRun({ text: reviewerEdits?.correctiveAction || 'None specified.\n' }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Disclaimer
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: 'Disclaimer & Legal Notice', bold: true, size: 20 })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'This report provides an AI-assisted preliminary screening of visible product-label information against configured regulatory requirements. It does not constitute government certification, regulatory approval, laboratory testing, legal advice, or a final determination of compliance. Results are indicative and should be verified against the current applicable regulations and competent authority.',
                italics: true,
                size: 16,
                color: '64748B',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return { docxBuffer: buffer, reportId };
}
