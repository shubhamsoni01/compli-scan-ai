import React, { useState } from 'react';
import { 
  HeartPulse, 
  ExternalLink, 
  CheckCircle2, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  type NutritionAuditReport, 
  type NutrientComparisonItem, 
  calculateNutritionAudit 
} from '@/data/complianceRules';

interface NutritionThresholdCardProps {
  extractedInfo?: Record<string, string | null>;
  category?: any;
  auditReport?: NutritionAuditReport;
}

export const NutritionThresholdCard: React.FC<NutritionThresholdCardProps> = ({
  extractedInfo = {},
  category = 'food',
  auditReport,
}) => {
  const [showAdditives, setShowAdditives] = useState(false);
  const [expandedNutrient, setExpandedNutrient] = useState<string | null>(null);

  // Always dynamically calculate from current extractedInfo & rawText to guarantee latest strict rule engine accuracy
  const report: NutritionAuditReport = calculateNutritionAudit(extractedInfo, category);

  const getStatusBadge = (status: NutrientComparisonItem['safetyStatus']) => {
    switch (status) {
      case 'SAFE':
        return <Badge variant="success" className="font-semibold">✓ SAFE (FSSAI Benchmark)</Badge>;
      case 'ELEVATED':
        return <Badge variant="warning" className="font-semibold">🟡 ELEVATED</Badge>;
      case 'HIGH_RISK':
        return <Badge variant="destructive" className="font-semibold">🔴 HIGH RISK (HFSS)</Badge>;
      default:
        return <Badge variant="outline">Not Specified</Badge>;
    }
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'A':
      case 'B':
        return <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-sm">INR Grade {grade} (Healthy)</span>;
      case 'C':
        return <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 text-sm">INR Grade {grade} (Moderate)</span>;
      default:
        return <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 font-bold border border-red-500/30 text-sm">INR Grade {grade} (High HFSS)</span>;
    }
  };

  return (
    <Card className="p-0 overflow-hidden border-indigo-100 dark:border-indigo-950/60 shadow-lg bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950">
      {/* Header Banner */}
      <div className="p-5 border-b border-indigo-100 dark:border-indigo-950 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
            <HeartPulse size={24} className="text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg tracking-tight text-white">
                FSSAI Nutrition & HFSS Threshold Audit
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Official Limits
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Quantitative comparison of detected label values vs mandatory FSSAI & ICMR 2024 ceilings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {getGradeBadge(report.overallHealthGrade)}
          <a
            href="https://www.fssai.gov.in/upload/uploadfiles/files/Gazette_Notification_Labelling_Display_18_11_2020.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white border border-white/15 transition-all shadow-sm"
          >
            <FileText size={13} />
            <span>FSSAI Gazette PDF ↗</span>
          </a>
        </div>
      </div>

      {/* Summary Alert */}
      <div className={`p-4 mx-5 my-4 rounded-xl border flex items-start gap-3 text-sm ${
        report.hfssStatus === 'HIGH_HFSS_ALERT'
          ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200'
          : report.hfssStatus === 'MODERATE_HFSS'
          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
          : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
      }`}>
        {report.hfssStatus === 'HIGH_HFSS_ALERT' ? (
          <ShieldAlert size={20} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        )}
        <div className="space-y-0.5">
          <span className="font-bold block">
            {report.hfssStatus === 'HIGH_HFSS_ALERT' ? 'HIGH HFSS RESTRICTION TRIGGERED' : 'FSSAI NUTRITIONAL COMPLIANCE ASSESSMENT'}
          </span>
          <p className="text-xs opacity-90">{report.summaryText}</p>
        </div>
      </div>

      {/* "Kitna Hai vs Kitna Rehna Chahiye" Table */}
      <div className="px-5 pb-5">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <th className="p-3.5 pl-4">Nutrient / Parameter</th>
                  <th className="p-3.5">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Observed Value</span>
                    <span className="block text-[10px] font-normal text-slate-500">(Kitna Hai)</span>
                  </th>
                  <th className="p-3.5">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">FSSAI Standard Limit</span>
                    <span className="block text-[10px] font-normal text-slate-500">(Kitna Rehna Chahiye)</span>
                  </th>
                  <th className="p-3.5">Safety Status</th>
                  <th className="p-3.5">Official Gazette Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {report.nutrients.map((n) => (
                  <React.Fragment key={n.key}>
                    <tr 
                      onClick={() => setExpandedNutrient(expandedNutrient === n.key ? null : n.key)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <td className="p-3.5 pl-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span>{n.name}</span>
                        {n.deviationPercent && n.deviationPercent > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                            +{n.deviationPercent}%
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono font-medium text-slate-800 dark:text-slate-200">
                        {n.observedValue}
                      </td>
                      <td className="p-3.5 font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                        {n.standardLimit}
                      </td>
                      <td className="p-3.5">
                        {getStatusBadge(n.safetyStatus)}
                      </td>
                      <td className="p-3.5">
                        <a
                          href={n.gazetteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium hover:underline"
                        >
                          <span>Official PDF</span>
                          <ExternalLink size={12} />
                        </a>
                      </td>
                    </tr>

                    {/* Expandable Explanation */}
                    {expandedNutrient === n.key && (
                      <tr className="bg-indigo-50/40 dark:bg-indigo-950/20">
                        <td colSpan={5} className="p-3.5 pl-6 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                          <p><strong>Clinical & Legal Verdict:</strong> {n.verdict}</p>
                          <p className="text-slate-500 dark:text-slate-400">
                            <strong>Legal Authority & Basis:</strong> {n.legalBasis}
                          </p>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Additives & INS Chemical Decoder Section Toggle */}
      {report.additives && report.additives.length > 0 && (
        <div className="px-5 pb-5">
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => setShowAdditives(!showAdditives)}
              className="w-full p-4 flex items-center justify-between text-left font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles size={18} className="text-indigo-500" />
                <span>Detected Additives & INS Codes ({report.additives.length})</span>
                <span className="text-[11px] font-normal text-slate-500">(MSG, Preservatives, Colors)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                <span>{showAdditives ? 'Hide Chemicals' : 'View Permissible Limits'}</span>
                {showAdditives ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            <AnimatePresence>
              {showAdditives && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-200 dark:border-slate-800"
                >
                  {report.additives.map((add, idx) => (
                    <div key={idx} className="p-4 space-y-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            {add.code}
                          </span>
                          <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{add.name}</span>
                          <span className="text-xs text-slate-500">({add.purpose})</span>
                        </div>
                        <Badge variant={add.fssaiStatus === 'PERMITTED' ? 'success' : 'warning'}>
                          {add.fssaiStatus}
                        </Badge>
                      </div>
                      {add.mandatoryWarning && (
                        <p className="text-xs text-amber-700 dark:text-amber-400 font-medium pl-2 border-l-2 border-amber-500">
                          ⚠️ {add.mandatoryWarning}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Schedule Ref: {add.gazetteRef}</span>
                        <a
                          href={add.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-500 hover:underline inline-flex items-center gap-1"
                        >
                          <span>FSSAI Additives Compendium PDF</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </Card>
  );
};
