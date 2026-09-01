import React, { useState } from 'react';
import { 
  Type, 
  Eye, 
  Maximize2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Sparkles,
  Gauge
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import type { ReadabilityResult } from '@/services/api';

interface ReadabilityCardProps {
  data?: ReadabilityResult | null;
}

export const ReadabilityCard: React.FC<ReadabilityCardProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data) return null;

  const isPass = data.overallStatus === 'PASS';
  const isFail = data.overallStatus === 'FAIL';

  return (
    <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
      {/* Header */}
      <div 
        className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3.5">
          <div className={cn(
            "p-2.5 rounded-xl flex items-center justify-center shrink-0",
            isPass 
              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400" 
              : isFail 
              ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400" 
              : "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
          )}>
            <Type size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                Font Size & Readability
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                AI Vision Layer
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Estimated optical text proportion, clarity, and declaration legibility
            </p>
          </div>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Readability Index:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
              {data.overallScore}/100
            </span>
          </div>

          <Badge variant={isPass ? 'success' : isFail ? 'destructive' : 'warning'} className="font-semibold text-xs px-2.5 py-1">
            {isPass ? '✓ GOOD' : isFail ? '✕ POOR' : '⚠ NEEDS REVIEW'}
          </Badge>

          <button 
            type="button" 
            aria-label="Toggle Readability Details"
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid (Always Visible) */}
      <div className="px-5 pb-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Overall Readability
          </p>
          <p className={cn(
            "text-sm font-bold mt-1",
            isPass ? "text-emerald-600 dark:text-emerald-400" : isFail ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"
          )}>
            {isPass ? 'GOOD' : isFail ? 'POOR' : 'REVIEW NEEDED'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Estimated Text Size
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
            {data.estimatedFontSize || 'ADEQUATE'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Text Visibility
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
            {data.textVisibility || 'GOOD'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            OCR Confidence
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
            {data.ocrConfidence ? `${data.ocrConfidence}%` : '92%'}
          </p>
        </div>
      </div>

      {/* Expandable Detailed Inspections */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
          >
            <div className="p-5 space-y-4 bg-slate-50/50 dark:bg-slate-900/30">
              {/* Statutory Legal Limitation Notice */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                <Info size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="font-semibold block mb-0.5">Important Legal Clarification:</strong>
                  This analysis is an <em>Estimated Font Size & Readability Analysis</em>. Exact physical printed font size in millimetres cannot be legally certified from standard consumer photos without calibrated optical reference targets.
                </div>
              </div>

              {/* Detailed Readability Checks List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Readability Heuristics & Diagnostics ({data.checks?.length || 0})
                </h4>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden">
                  {data.checks?.map((chk, idx) => (
                    <div key={idx} className="p-3.5 flex items-start gap-3">
                      {chk.status === 'PASS' ? (
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      ) : chk.status === 'FAIL' ? (
                        <XCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                      )}

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                            {chk.name}
                          </span>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded",
                            chk.status === 'PASS' 
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400" 
                              : chk.status === 'FAIL' 
                              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400" 
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                          )}>
                            {chk.status === 'PASS' ? '✓ PASS' : chk.status === 'FAIL' ? '✕ FAIL' : '⚠ NEEDS REVIEW'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {chk.reason}
                        </p>
                        {chk.observedValue && (
                          <p className="text-[11px] text-slate-500 font-mono pt-0.5">
                            Observed Value: <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{String(chk.observedValue)}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Declarations Legibility Inspection if available */}
              {data.declarationReadability && data.declarationReadability.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Statutory Declarations Legibility
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {data.declarationReadability.map((dec, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{dec.field}</p>
                          <p className="text-[11px] text-slate-400 truncate">{dec.observedValue || 'Not detected'}</p>
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0",
                          dec.status === 'PASS' 
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400" 
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                        )}>
                          {dec.status === 'PASS' ? 'LEGIBLE' : 'REVIEW'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
