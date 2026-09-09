import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, CheckCircle2, ShieldCheck, ShieldAlert, 
  ArrowLeftRight, Sparkles, Scale, Info
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const FakeVsRealComparisonSection: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  return (
    <section className="py-20 bg-slate-900/90 dark:bg-[#060a14] border-t border-slate-800 relative overflow-hidden text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-3 backdrop-blur-md">
            <Scale size={14} />
            <span>Interactive X-Ray Inspection Lens</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight mb-4">
            Spot the Violation: <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-400 to-emerald-400">Fake vs. Genuine Label</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Drag the interactive slider below to see how CompliScan AI instantly detects hidden non-compliances, missing licenses, and deceptive labelling.
          </p>
        </div>

        {/* Interactive Comparison Card Container */}
        <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl p-4 sm:p-8">
          {/* Top Comparison Header Bar */}
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2 text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span>NON-COMPLIANT / FAKE LABEL (4 VIOLATIONS)</span>
            </div>

            <div className="flex items-center gap-1 text-slate-400 font-mono text-xs hidden sm:flex">
              <ArrowLeftRight size={14} className="text-cyan-400 animate-pulse" />
              <span>DRAG SLIDER TO INSPECT</span>
            </div>

            <div className="flex items-center gap-2 text-emerald-400">
              <span>100% STATUTORY COMPLIANT</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          {/* Interactive Split Viewport */}
          <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-slate-800 bg-[#070c18] select-none">
            {/* 1. Left Layer: Non-Compliant / Fake Label */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between bg-gradient-to-br from-red-950/40 via-slate-950 to-slate-900/90 text-left">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-red-950 border border-red-500/50 text-red-300 font-mono text-xs font-bold flex items-center gap-1.5">
                  <ShieldAlert size={14} />
                  FAILS FSSAI & LEGAL METROLOGY
                </span>
                <span className="text-2xl">🌶️</span>
              </div>

              {/* Fake Declarations Display */}
              <div className="space-y-3 font-mono text-xs sm:text-sm my-auto">
                <div 
                  onMouseEnter={() => setActiveHighlight('fake-fssai')}
                  onMouseLeave={() => setActiveHighlight(null)}
                  className={cn(
                    "p-2.5 rounded-xl border transition-all cursor-pointer",
                    activeHighlight === 'fake-fssai'
                      ? "bg-red-950/80 border-red-400 scale-[1.02]"
                      : "bg-red-950/30 border-red-900/60 hover:border-red-500/60"
                  )}
                >
                  <div className="flex items-center justify-between text-red-400 font-bold">
                    <span>FSSAI License: 10293847 (8 digits)</span>
                    <span className="text-[10px] bg-red-900 text-red-200 px-1.5 py-0.2 rounded">❌ INVALID LENGTH</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Mandatory 14 digits missing under FSSAI Reg. 2.2.2</p>
                </div>

                <div 
                  onMouseEnter={() => setActiveHighlight('fake-mrp')}
                  onMouseLeave={() => setActiveHighlight(null)}
                  className={cn(
                    "p-2.5 rounded-xl border transition-all cursor-pointer",
                    activeHighlight === 'fake-mrp'
                      ? "bg-red-950/80 border-red-400 scale-[1.02]"
                      : "bg-red-950/30 border-red-900/60 hover:border-red-500/60"
                  )}
                >
                  <div className="flex items-center justify-between text-red-400 font-bold">
                    <span>MRP: ₹ 40.00 (No USP Declared)</span>
                    <span className="text-[10px] bg-red-900 text-red-200 px-1.5 py-0.2 rounded">❌ LM VIOLATION</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Unit Sale Price (e.g. ₹0.40/g) mandatory under PCR 2011</p>
                </div>

                <div 
                  onMouseEnter={() => setActiveHighlight('fake-veg')}
                  onMouseLeave={() => setActiveHighlight(null)}
                  className={cn(
                    "p-2.5 rounded-xl border transition-all cursor-pointer",
                    activeHighlight === 'fake-veg'
                      ? "bg-red-950/80 border-red-400 scale-[1.02]"
                      : "bg-red-950/30 border-red-900/60 hover:border-red-500/60"
                  )}
                >
                  <div className="flex items-center justify-between text-red-400 font-bold">
                    <span>Vegetarian Logo: Not Present</span>
                    <span className="text-[10px] bg-red-900 text-red-200 px-1.5 py-0.2 rounded">❌ MISSING SYMBOL</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Green circle inside square mandatory on front of pack</p>
                </div>
              </div>

              <div className="text-[10px] text-red-400 font-mono">
                🚨 Penalty: Seizure under Section 38 & Legal Metrology Fine
              </div>
            </div>

            {/* 2. Right Layer: 100% Genuine Compliant Label (Clipped by Slider) */}
            <div 
              className="absolute inset-0 p-6 flex flex-col justify-between bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-900/90 text-left"
              style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
            >
              <div className="flex items-center justify-between">
                <span className="ml-auto px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  100% STATUTORY COMPLIANT
                </span>
              </div>

              {/* Genuine Declarations Display */}
              <div className="space-y-3 font-mono text-xs sm:text-sm my-auto pl-4">
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/60">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>FSSAI Lic: 10012011000168 (14-Digit)</span>
                    <span className="text-[10px] bg-emerald-900 text-emerald-200 px-1.5 py-0.2 rounded">✓ VERIFIED ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">Matched with FSSAI National FoSCoS Database</p>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/60">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>MRP: ₹ 15.00 (USP: ₹ 0.21 / g)</span>
                    <span className="text-[10px] bg-emerald-900 text-emerald-200 px-1.5 py-0.2 rounded">✓ STANDARD FORMAT</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">Font size &gt; 3mm & compliant with Legal Metrology</p>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/60">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>Green Veg Mark & Allergen Declared</span>
                    <span className="text-[10px] bg-emerald-900 text-emerald-200 px-1.5 py-0.2 rounded">✓ 100% CLEAR</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">High contrast ratio & zero misleading claims</p>
                </div>
              </div>

              <div className="text-[10px] text-emerald-400 font-mono ml-auto">
                🛡️ Verified by CompliScan AI • Instant Shelf Clearance
              </div>
            </div>

            {/* Slider Dividing Vertical Line & Handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-white to-cyan-400 cursor-ew-resize z-30 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cyan-500 border-2 border-white shadow-xl flex items-center justify-center text-slate-950 font-bold text-xs">
                <ArrowLeftRight size={14} />
              </div>
            </div>

            {/* Hidden Interactive Range Input for Dragging */}
            <input
              type="range"
              min="5"
              max="95"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
            />
          </div>

          {/* Bottom Callout */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-cyan-400 shrink-0" />
              <span>CompliScan AI automates 22+ checks in seconds with zero manual inspection errors.</span>
            </div>
            <span className="font-mono text-emerald-400 font-bold">
              SIH Problem Statement: SIH26034
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FakeVsRealComparisonSection;
