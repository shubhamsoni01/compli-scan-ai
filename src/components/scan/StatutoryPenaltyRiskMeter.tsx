import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertOctagon, Scale, DollarSign, Gavel, FileWarning, ArrowUpRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

interface StatutoryPenaltyRiskMeterProps {
  score?: number;
  failedCount?: number;
  checks?: any[];
  productName?: string;
  className?: string;
}

export const StatutoryPenaltyRiskMeter: React.FC<StatutoryPenaltyRiskMeterProps> = ({
  score = 82,
  failedCount = 0,
  checks = [],
  productName = 'Packaged Commodity',
  className,
}) => {
  // Compute risk tier & statutory liability
  const issues = failedCount > 0 ? failedCount : checks.filter(c => c.status === 'failed').length;

  let riskTier = 'LOW LEGAL RISK';
  let penaltyRange = '₹0 — ₹5,000';
  let penaltyDescription = 'Substantial statutory compliance. No immediate seizure risk.';
  let gaugePercentage = 15; // 0 to 100
  let badgeColor = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  let legalSections = ['Rule 6(1) Compliant', 'FSSAI Reg. 2020'];

  if (score < 50 || issues >= 4) {
    riskTier = 'CRITICAL ENFORCEMENT RISK';
    penaltyRange = '₹50,000 — ₹1,00,000 + Imprisonment / Seizure';
    penaltyDescription = 'Multiple core declarations missing. High probability of Section 36 prosecution under Legal Metrology Act 2009.';
    gaugePercentage = 92;
    badgeColor = 'bg-red-500/15 text-red-300 border-red-500/30';
    legalSections = ['Section 36(1) LM Act', 'Section 39 Compounding', 'FSSAI Act Sec 52'];
  } else if (score < 80 || issues >= 1) {
    riskTier = 'MODERATE STATUTORY RISK';
    penaltyRange = '₹25,000 (First Offence Notice)';
    penaltyDescription = 'Deficiencies in mandatory labelling declarations. Liable for statutory notice from Legal Metrology Inspector.';
    gaugePercentage = 58;
    badgeColor = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    legalSections = ['Rule 6(1) Notice', 'Section 36(1) LM Act'];
  }

  // Calculate angle for speedometer needle (-90deg to +90deg)
  const needleRotation = -90 + (gaugePercentage / 100) * 180;

  return (
    <Card className={cn('overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/80 p-6 shadow-2xl rounded-3xl', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-400">
            <Scale size={22} />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
              Statutory Financial Penalty & Legal Liability Meter
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                LM ACT 2009 SEC 36
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated fiscal liability evaluation based on Legal Metrology & FSSAI penalties
            </p>
          </div>
        </div>

        <Badge className={cn('text-xs font-bold px-3 py-1 uppercase tracking-wider', badgeColor)}>
          {riskTier}
        </Badge>
      </div>

      {/* Speedometer & Financial Liability Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-6">
        {/* Speedometer Gauge Visual (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-56 h-32 overflow-hidden flex items-end justify-center">
            {/* Semicircular Gauge Arc */}
            <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              {/* Background Track */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#1e293b"
                strokeWidth="18"
                strokeLinecap="round"
              />
              {/* Colored Gradient Track */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="18"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - gaugePercentage / 100)}
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Needle Pivot */}
            <motion.div
              initial={{ rotate: -90 }}
              animate={{ rotate: needleRotation }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute bottom-0 left-1/2 w-1.5 h-24 bg-gradient-to-t from-white via-amber-400 to-red-500 origin-bottom -translate-x-1/2 rounded-full shadow-lg z-10"
            />
            {/* Center Pivot Hub */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-white border-4 border-slate-900 shadow-xl z-20" />
          </div>

          {/* Speedometer Min/Max Labels */}
          <div className="w-56 flex justify-between text-[10px] font-mono text-slate-400 mt-2 px-2">
            <span className="text-emerald-400">₹0 (Safe)</span>
            <span className="text-amber-400">₹25,000</span>
            <span className="text-red-400">₹1,00,000+</span>
          </div>
        </div>

        {/* Financial Exposure Breakdown Details (7 cols) */}
        <div className="md:col-span-7 space-y-3.5">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Estimated Statutory Penalty</span>
              <span className="font-mono text-base font-extrabold text-amber-400">{penaltyRange}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {penaltyDescription}
            </p>
          </div>

          {/* Relevant Legal Sections */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Governing Acts:</span>
            {legalSections.map((sec, idx) => (
              <span
                key={idx}
                className="font-mono text-[11px] bg-slate-900 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/20 font-semibold"
              >
                {sec}
              </span>
            ))}
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 flex items-start gap-2">
            <Sparkles size={16} className="shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Judicial Notice:</strong> Section 36(1) mandates compounding fine of up to ₹25,000 for initial offences, compounding to ₹50,000 & potential 1-year imprisonment for repeat non-compliance.
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
