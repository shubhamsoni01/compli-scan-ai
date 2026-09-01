import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, Eye, Minus, Download, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { mockComplianceResult } from '@/data/complianceRules';
import { getCachedScanResult } from '@/services/scanService';
import { formatDate } from '@/utils/formatters';
import { AIProcessingDetails } from '@/components/scan/AIProcessingDetails';
import { generateReportPDF } from '@/services/api';
import { ComplianceReportPreview } from '@/components/report/ComplianceReportPreview';
import { ReadabilityCard } from '@/components/scan/ReadabilityCard';
import { EditReportModal } from '@/components/report/EditReportModal';
import { FileText, Loader2, Edit3 } from 'lucide-react';

export default function ComplianceResultPage() {
  const navigate = useNavigate();
  const { scanId, id } = useParams<{ scanId?: string; id?: string }>();
  const activeId = scanId || id;

  const currentResult = activeId ? getCachedScanResult(activeId) : null;
  // If explicitly requesting a mock record (e.g. scan_001 from history) or fallback
  const resolvedResult = currentResult || (activeId === 'scan_001' ? mockComplianceResult : currentResult || mockComplianceResult);
  const score = useAnimatedCounter(resolvedResult.score);

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Edit Report Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Report generation state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportPdfBlob, setReportPdfBlob] = useState<Blob | null>(null);
  const [reportFilename, setReportFilename] = useState('');
  const [reportError, setReportError] = useState<string | null>(null);

  const toggleRow = (ruleId: string) => {
    setExpandedRow(expandedRow === ruleId ? null : ruleId);
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    setReportError(null);
    setIsPreviewOpen(true);

    try {
      const { blob, filename } = await generateReportPDF(resolvedResult);
      setReportPdfBlob(blob);
      setReportFilename(filename);
    } catch (err: any) {
      console.error('Report generation error:', err);
      setReportError(err.message || 'Unable to generate the report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!reportPdfBlob) return;
    const url = URL.createObjectURL(reportPdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = reportFilename || `CompliScan_Report_${resolvedResult.productName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2 h-auto rounded-full">
          <ArrowLeft size={24} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Compliance Result</h1>
            <Badge variant="outline">{resolvedResult.category}</Badge>
            {(resolvedResult as any).ocrEngine && (
              <span className="text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 font-medium">
                Live OCR & AI
              </span>
            )}
            <span className="font-mono text-xs text-slate-400">ID: {resolvedResult.scanId}</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {resolvedResult.productName} • Scanned {formatDate(resolvedResult.scanDate)}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        {/* Score Section */}
        <Card className="flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-sm border-gray-100 dark:border-gray-800">
          <ProgressRing progress={score} size="lg" />
          <div>
            <h3 className="text-2xl font-bold">{Math.round(score)}%</h3>
            <p className={cn(
              "font-medium mt-1",
              score >= 80 ? "text-emerald-600 dark:text-emerald-400" : score >= 50 ? "text-amber-600 dark:text-amber-500" : "text-red-600 dark:text-red-400"
            )}>
              {resolvedResult.overallStatus}
            </p>
          </div>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center gap-3 bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/50">
            <div className="p-2.5 bg-green-100 dark:bg-green-900/50 rounded-full text-green-600 dark:text-green-400">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">{resolvedResult.summary?.passed ?? 0}</p>
              <p className="text-xs font-medium text-green-600 dark:text-green-400">Passed</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3 bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/50">
            <div className="p-2.5 bg-red-100 dark:bg-red-900/50 rounded-full text-red-600 dark:text-red-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-red-700 dark:text-red-300">{resolvedResult.summary?.issues ?? 0}</p>
              <p className="text-xs font-medium text-red-600 dark:text-red-400">Potential Issues</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3 bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/50">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-900/50 rounded-full text-amber-600 dark:text-amber-400">
              <Eye size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{resolvedResult.summary?.review ?? 0}</p>
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Needs Review</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800">
            <div className="p-2.5 bg-gray-200 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400">
              <Minus size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-700 dark:text-gray-300">{resolvedResult.summary?.notApplicable ?? 0}</p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Not Applicable</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-amber-600 dark:text-amber-500 mt-1 shrink-0" />
          <div>
            <h4 className="font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wide">
              {resolvedResult.overallStatus}
            </h4>
            <p className="text-amber-800 dark:text-amber-500/80 text-sm mt-1">
              {resolvedResult.statusDescription}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link to={`/result/${resolvedResult.scanId}/detail`}>
            <Button variant="outline">View Detailed Inspection</Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-700"
          >
            <Edit3 size={16} />
            <span>Edit Report</span>
          </Button>
          <Button 
            onClick={handleGenerateReport} 
            disabled={isGeneratingReport}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-sm font-semibold"
          >
            {isGeneratingReport ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Generating Report...</span>
              </>
            ) : (
              <>
                <FileText size={18} />
                <span>Generate Compliance Report</span>
              </>
            )}
          </Button>
          <Button variant="ghost" className="px-3" title="Share Report"><Share2 size={18} /></Button>
        </div>
      </div>

      {/* Report Generation Error Alert if any */}
      {reportError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center justify-between">
          <span>{reportError}</span>
          <Button size="sm" variant="ghost" onClick={handleGenerateReport} className="h-7 text-xs text-red-700 dark:text-red-300 underline">
            Try Again
          </Button>
        </div>
      )}

      {/* Estimated Font Size & Readability Analysis Layer (Non-calibrated heuristic assessment) */}
      {resolvedResult.readabilityResult && (
        <ReadabilityCard data={resolvedResult.readabilityResult} />
      )}

      {/* Rule Checklist */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">Applicable Official Rules ({resolvedResult.checks.length})</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Deterministic evaluation against Legal Metrology & FSSAI / CDSCO standards
            </p>
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Click rule to inspect source</span>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {resolvedResult.checks.map((check) => (
            <div key={check.ruleId} className="flex flex-col">
              <div 
                className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                onClick={() => toggleRow(check.ruleId)}
              >
                <StatusIndicator status={check.status === 'passed' ? 'passed' : check.status === 'failed' ? 'failed' : 'warning'} />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">{check.ruleId}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{check.field}</span>
                    </div>
                  </div>
                  <span className={cn(
                    "text-sm truncate",
                    !check.detectedValue ? "text-red-500 dark:text-red-400 italic" : "text-gray-600 dark:text-gray-400"
                  )}>{check.detectedValue || 'Not detected'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={
                    check.status === 'passed' ? 'success' : 
                    check.status === 'failed' ? 'destructive' : 
                    check.status === 'not-applicable' ? 'outline' : 'warning'
                  }>
                    {check.status === 'passed' ? '✓ PASS' : check.status === 'failed' ? '✕ FAIL' : check.status === 'review' ? '⚠ NEEDS REVIEW' : '— NOT APPLICABLE'}
                  </Badge>
                  {expandedRow === check.ruleId ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
              </div>
              
              <AnimatePresence>
                {expandedRow === check.ruleId && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-gray-50 dark:bg-gray-800/30"
                  >
                    <div className="p-4 pl-[3.25rem] text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800 space-y-2">
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Requirement: </span>
                        <span>{check.requirement}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Deterministic Reason: </span>
                        <span>{check.explanation}</span>
                      </div>
                      <div className="pt-1 flex items-center justify-between text-xs text-gray-400">
                        <span>Official Source: <strong className="text-gray-600 dark:text-gray-300">{check.legalReference}</strong></span>
                        <span className="text-[11px] text-indigo-500 font-mono">Government of India</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Card>

      {/* Mandatory Statutory Screening Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-gray-900/80 border border-slate-200 dark:border-gray-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
        <p className="font-semibold text-slate-800 dark:text-slate-200">
          AI-assisted preliminary compliance screening
        </p>
        <p>
          Results are indicative and should be verified against current applicable statutory regulations and competent authorities (Department of Consumer Affairs, FSSAI, CDSCO). This system provides automated character and label inspection, not formal legal certification.
        </p>
      </div>

      {/* AI Processing Details (Scan Intelligence) */}
      <AIProcessingDetails
        scanId={resolvedResult.scanId}
        image={(resolvedResult as any).uploadedImage}
        ocrText={(resolvedResult as any).ocrText}
        groqData={(resolvedResult as any).structuredProduct}
        ocrEngine={(resolvedResult as any).ocrEngine}
      />

      {/* Premium Compliance Report Preview Modal */}
      <ComplianceReportPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        reportData={resolvedResult}
        pdfBlob={reportPdfBlob}
        pdfFilename={reportFilename}
        isGenerating={isGeneratingReport}
        onDownload={handleDownloadPDF}
      />

      {/* Editable Report Modal */}
      <EditReportModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        reportData={resolvedResult}
      />
    </div>
  );
}
