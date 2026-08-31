import React from 'react';
import { ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FallbackIllustrationProps {
  className?: string;
}

export const FallbackIllustration: React.FC<FallbackIllustrationProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-white/5 backdrop-blur-xl p-6",
        className
      )}
    >
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-radial from-indigo-500/10 dark:from-indigo-500/15 via-transparent to-transparent pointer-events-none" />

      {/* Futuristic Circular Platform visual */}
      <div className="absolute bottom-6 w-64 h-16 rounded-[100%] bg-gradient-to-b from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800 shadow-xl border border-indigo-400/30 flex items-center justify-center">
        <div className="w-52 h-11 rounded-[100%] border border-cyan-400/40 bg-indigo-950/40" />
      </div>

      {/* Realistic Product Pouch Illustration */}
      <div className="relative z-10 w-48 sm:w-56 h-72 sm:h-80 bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900 rounded-2xl shadow-2xl border border-indigo-400/30 p-4 flex flex-col justify-between transform -translate-y-4">
        {/* Heat seal top */}
        <div className="w-full h-3 border-b border-indigo-500/30 flex justify-between px-2">
          <div className="w-6 h-1.5 bg-slate-700 rounded-full mx-auto" />
        </div>

        {/* Brand & Title */}
        <div className="text-center mt-2">
          <span className="text-[9px] uppercase tracking-widest text-indigo-300 font-semibold block">
            Natural Artisanal Foods
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">
            CompliScan <span className="text-amber-400">Sample</span>
          </h3>
          <p className="text-[10px] text-slate-300">Roasted Multigrain Herb Crisp</p>
        </div>

        {/* Center Seal */}
        <div className="w-20 h-20 rounded-full mx-auto border border-amber-400/40 bg-indigo-800/30 flex flex-col items-center justify-center p-2 text-center">
          <ShieldCheck className="w-7 h-7 text-amber-400 mb-0.5" />
          <span className="text-[8px] font-bold text-white leading-tight">100% WHOLE GRAIN</span>
        </div>

        {/* Declarations Grid */}
        <div className="bg-slate-950/80 rounded-xl p-2.5 border border-white/10 text-[10px] text-slate-300 space-y-1">
          <div className="flex justify-between font-semibold">
            <span>Net Qty: <strong className="text-white">150 g</strong></span>
            <span>MRP: <strong className="text-emerald-400">₹75.00</strong></span>
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 pt-0.5 border-t border-white/5">
            <span>MFD: AUG 2026</span>
            <span>EXP: MAY 2027</span>
          </div>
        </div>
      </div>

      {/* Floating Holographic Badges */}
      <div className="absolute top-12 left-6 px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md border border-emerald-500/30 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 z-20">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        <span>MRP ₹75 ✓</span>
      </div>

      <div className="absolute top-20 right-6 px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md border border-indigo-500/30 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 z-20">
        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
        <span>Net Qty 150g ✓</span>
      </div>

      <div className="absolute bottom-16 left-6 px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md border border-indigo-500/30 text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 z-20">
        <ShieldCheck className="w-3.5 h-3.5 text-violet-500" />
        <span>Manufacturer ✓</span>
      </div>

      <div className="absolute bottom-12 right-6 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg border border-emerald-500/40 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 z-20">
        <Award className="w-4 h-4 text-emerald-500" />
        <span>Compliance 92%</span>
      </div>
    </div>
  );
};

export default FallbackIllustration;
