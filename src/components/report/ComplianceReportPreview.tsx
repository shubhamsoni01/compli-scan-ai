import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Minus, 
  ExternalLink,
  ShieldAlert,
  Loader2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/utils/formatters';

interface ComplianceReportPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: any;
  pdfBlob: Blob | null;
  pdfFilename: string;
  isGenerating: boolean;
  onDownload: () => void;
}

export const ComplianceReportPreview: React.FC<ComplianceReportPreviewProps> = ({
  isOpen,
  onClose,
  reportData,
  pdfBlob,
  pdfFilename,
  isGenerating,
  onDownload,
}) => {
  if (!isOpen) return null;

  const dateStr = new Date(reportData.scanDate || Date.now()).toISOString().slice(0, 10).replace(/-/g, '');
  const shortId = (reportData.scanId || 'X001').replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase();
  const reportId = `CS-${dateStr}-${shortId}`;

  const score = Math.round(reportData.score ?? 80);
  const statusColor = score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : score >= 50 ? 'text-amber-600 dark:text-amber-500' : 'text-red-600 dark:text-red-400';
  const statusBadgeVariant = score >= 80 ? 'success' : score >= 50 ? 'warning' : 'destructive';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto"
        >
          {/* Modal Header Controls */}
          <div className="p-4 px-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/70 dark:bg-gray-950/40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-gray-900 dark:text-gray-100 text-base">
                  Official Compliance Screening Report
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Previewing generated assessment document for {reportData.productName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={onDownload}
                disabled={isGenerating || !pdfBlob}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-sm h-9 px-4 text-xs font-semibold"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Rendering PDF...</span>
                  </>
                ) : (
                  <>
                    <Download size={15} />
                    <span>Download PDF</span>
                  </>
                )}
              </Button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Close preview"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Document Body (Clean white paper style for professional demonstration) */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-slate-100/50 dark:bg-[#0b0f19]">
            <div className="bg-white text-slate-900 rounded-xl shadow-md border border-slate-200 p-8 sm:p-12 space-y-8 max-w-3xl mx-auto">
              {/* Document Letterhead */}
              <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-6 gap-4">
                <div>
                  <h1 className="font-heading font-black text-2xl tracking-tight text-indigo-800">
                    COMPLISCAN AI
                  </h1>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">
                    AI-Powered Product Label Compliance Screening
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">
                    Smart India Hackathon 2026 Innovation
                  </p>
                </div>
                <div className="text-left sm:text-right space-y-1">
                  <div className="inline-block bg-slate-100 px-3 py-1 rounded font-mono text-xs font-bold text-slate-700">
                    {reportId}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Generated: {new Date(reportData.scanDate || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                  </p>
                  <div className="pt-1">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {reportData.overallStatus?.toUpperCase() || 'SCREENING COMPLETE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* User & Scan Information Strip */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">User Name</span>
                  <span className="font-bold text-slate-800">{reportData.userName || reportData.user?.name || 'CompliScan User'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">User Email</span>
                  <span className="font-medium text-slate-700">{reportData.userEmail || reportData.user?.email || 'Unspecified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Scan ID</span>
                  <span className="font-mono text-slate-700">{reportData.scanId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Scan Date & Time</span>
                  <span className="text-slate-700">{new Date(reportData.scanDate || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                </div>
              </div>

              {/* Original Uploaded Product Image */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-100 pb-1">
                  Original Scanned Product Image
                </h2>
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  {reportData.originalImageUrl || reportData.uploadedImage ? (
                    <img
                      src={reportData.originalImageUrl || reportData.uploadedImage}
                      alt="Original Product Label"
                      className="max-h-60 max-w-full rounded-lg object-contain border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="text-xs text-slate-400 py-8 italic">
                      Original scan image unavailable.
                    </div>
                  )}
                  <p className="text-xs font-semibold text-slate-700 mt-2">
                    Original Product Image Used for Compliance Screening
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Image/File Name: {reportData.originalFilename || 'Original filename unavailable'}
                  </p>
                </div>
              </div>

              {/* 1. Product Summary */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-100 pb-1">
                  1. Product Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Product Name</span>
                    <span className="font-bold text-slate-800 text-sm">{reportData.productName || 'Not detected'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Brand</span>
                    <span className="font-bold text-slate-800">{reportData.productBrand || 'Not detected'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Category</span>
                    <span className="font-semibold text-slate-700">{reportData.category || 'General'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Maximum Retail Price (MRP)</span>
                    <span className="font-semibold text-slate-800">{reportData.extractedInfo?.['MRP'] || reportData.structuredProduct?.mrp || 'Not detected'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Net Quantity</span>
                    <span className="font-semibold text-slate-800">{reportData.extractedInfo?.['Net Quantity'] || reportData.structuredProduct?.netQuantity || 'Not detected'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Manufacturing Date</span>
                    <span className="font-semibold text-slate-800">{reportData.extractedInfo?.['Manufacture Date'] || reportData.structuredProduct?.manufacturingDate || 'Not detected'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Expiry / Best Before</span>
                    <span className="font-semibold text-slate-800">{reportData.extractedInfo?.['Best Before / Expiry'] || reportData.structuredProduct?.expiryDate || 'Not detected'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Batch Number</span>
                    <span className="font-semibold text-slate-800">{reportData.extractedInfo?.['Batch Number'] || reportData.structuredProduct?.batchNumber || 'Not detected'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Manufacturer / Packer Details</span>
                    <span className="text-slate-700">{reportData.extractedInfo?.['Manufacturer'] || reportData.structuredProduct?.manufacturer || 'Not detected'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Licence Number</span>
                    <span className="font-mono text-slate-800">{reportData.extractedInfo?.['FSSAI / License Number'] || reportData.structuredProduct?.licenseNumber || 'Not detected'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Country of Origin</span>
                    <span className="font-semibold text-slate-800">{reportData.extractedInfo?.['Country of Origin'] || reportData.structuredProduct?.countryOfOrigin || 'India'}</span>
                  </div>
                </div>
              </div>

              {/* 2. Compliance Score */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-100 pb-1">
                  2. Label Compliance Screening Score
                </h2>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-black text-indigo-700">{score}</div>
                    <div>
                      <div className="text-xs font-bold text-slate-700">/ 100</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">AI-assisted preliminary screening score</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs font-semibold">
                    <span className="text-emerald-700">✓ Passed: {reportData.summary?.passed ?? 0}</span>
                    <span className="text-red-700">✕ Potential Issues: {reportData.summary?.issues ?? 0}</span>
                    <span className="text-amber-700">⚠ Needs Review: {reportData.summary?.review ?? 0}</span>
                    <span className="text-slate-500">— Not Applicable: {reportData.summary?.notApplicable ?? 0}</span>
                  </div>
                </div>
              </div>

              {/* 3. Detailed Statutory Findings Table */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-100 pb-1">
                  3. Official Statutory Rule Findings ({reportData.checks?.length || 0})
                </h2>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-indigo-50/80 text-indigo-950 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 pl-3">Rule ID</th>
                        <th className="p-2.5">Requirement</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5 pr-3">Observed Value / Deterministic Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(reportData.checks || []).map((c: any, i: number) => {
                        const isPass = c.status === 'passed' || c.status === 'PASS';
                        const isFail = c.status === 'failed' || c.status === 'FAIL';
                        const isReview = c.status === 'review' || c.status === 'NEEDS_REVIEW';

                        return (
                          <tr key={i} className={i % 2 === 1 ? 'bg-slate-50/60' : ''}>
                            <td className="p-2.5 pl-3 font-mono font-bold text-indigo-700 whitespace-nowrap">{c.ruleId}</td>
                            <td className="p-2.5 font-medium text-slate-800">{c.field || c.requirement}</td>
                            <td className="p-2.5 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isPass ? 'bg-emerald-100 text-emerald-800' :
                                isFail ? 'bg-red-100 text-red-800' :
                                isReview ? 'bg-amber-100 text-amber-800' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {isPass ? 'PASS' : isFail ? 'FAIL' : isReview ? 'REVIEW' : 'N/A'}
                              </span>
                            </td>
                            <td className="p-2.5 pr-3 text-slate-600">
                              {c.detectedValue && <div className="font-semibold text-slate-800 mb-0.5">"{c.detectedValue}"</div>}
                              <div className="text-[11px] text-slate-500">{c.explanation}</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Official Regulatory Sources */}
              <div className="space-y-2 text-xs">
                <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-100 pb-1">
                  4. Official Regulatory References
                </h2>
                <div className="grid sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-bold text-slate-800">Legal Metrology Act, 2009</p>
                    <p className="text-[11px] text-slate-500 mt-1">Legal Metrology (Packaged Commodities) Rules, 2011</p>
                    <span className="text-[10px] text-indigo-600 font-medium block mt-1">Dept of Consumer Affairs</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-bold text-slate-800">FSSAI Labelling Regulations, 2020</p>
                    <p className="text-[11px] text-slate-500 mt-1">Food Safety and Standards Act, 2006</p>
                    <span className="text-[10px] text-indigo-600 font-medium block mt-1">FSSAI, Ministry of Health</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-bold text-slate-800">Cosmetics Rules, 2020</p>
                    <p className="text-[11px] text-slate-500 mt-1">Drugs and Cosmetics Act, 1940 & BIS standards</p>
                    <span className="text-[10px] text-indigo-600 font-medium block mt-1">CDSCO, Government of India</span>
                  </div>
                </div>
              </div>

              {/* 5. AI Processing Details */}
              <div className="space-y-2 text-xs">
                <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-100 pb-1">
                  5. AI Processing Pipeline Summary
                </h2>
                <p className="text-[11px] text-slate-600">
                  Pipeline Execution: Uploaded Image → OCR.Space Text Extraction → Groq LLM Structuring → CompliScan Deterministic Rule Engine
                </p>
                <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 pt-1 font-mono">
                  <span>OCR Engine: <strong>OCR.Space</strong></span>
                  <span>•</span>
                  <span>LLM Parser: <strong>Groq AI (openai/gpt-oss-20b)</strong></span>
                  <span>•</span>
                  <span>Rule Engine: <strong>CompliScan AI Official Rules</strong></span>
                </div>
              </div>

              {/* 6. Statutory Disclaimer */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
                <p className="font-bold uppercase tracking-wider text-[10px]">Disclaimer & Legal Notice</p>
                <p>
                  This report provides an AI-assisted preliminary screening of visible product-label information against configured regulatory requirements. It does not constitute government certification, regulatory approval, laboratory testing, legal advice, or a final determination of compliance. Results should be verified against the current applicable regulations and competent authority.
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 px-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/70 dark:bg-gray-950/40">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              Report File: {pdfFilename}
            </span>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose} className="h-9 px-4 text-xs">
                Close Preview
              </Button>
              <Button
                onClick={onDownload}
                disabled={isGenerating || !pdfBlob}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 h-9 px-4 text-xs font-semibold shadow-sm"
              >
                <Download size={14} />
                <span>Download PDF</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ComplianceReportPreview;
