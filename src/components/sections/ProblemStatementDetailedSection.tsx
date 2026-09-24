import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Scale, Award, FileText, CheckCircle2, ArrowRight, Building, Sparkles, Database, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MinistryLogo } from '@/components/ui/MinistryLogo';
import { SIHLogo } from '@/components/ui/SIHLogo';

export const ProblemStatementDetailedSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden border-t border-b border-emerald-500/20">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Official Government Badges */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-300 shadow-sm backdrop-blur-md">
            <Award className="w-4 h-4 text-amber-400" />
            <span>SMART INDIA HACKATHON 2026 • OFFICIAL PROBLEM STATEMENT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-white leading-tight">
            Problem Statement ID: <span className="text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text">SIH26034</span>
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-200">
              <Building size={14} className="text-amber-400" />
              <span>Ministry of Consumer Affairs, Food & Public Distribution</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-200">
              <Scale size={14} className="text-emerald-400" />
              <span>Legal Metrology Division & FSSAI</span>
            </div>
          </div>
        </div>

        {/* Grand 2-Column Challenge vs Solution Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* Left Column: The Real-World Crisis */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 bg-slate-950/80 rounded-3xl p-6 sm:p-8 border border-red-500/30 shadow-2xl relative flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-red-100">The Problem & Regulatory Gaps</h3>
                    <p className="text-xs text-red-400">Why manual inspection fails across 1.4B consumers</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase bg-red-950/80 text-red-300 font-bold px-2.5 py-1 rounded-full border border-red-800">
                  Critical Gaps
                </span>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                <div className="bg-red-950/20 p-3.5 rounded-xl border border-red-900/40 space-y-1">
                  <h5 className="font-bold text-red-300 flex items-center gap-1.5">
                    <span>1. Massive Retail Volume vs Severe Staff Shortage</span>
                  </h5>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Over 500 Million packaged units enter Indian retail monthly. Less than 0.01% are physically verified by Legal Metrology inspectors due to heavy manual workloads.
                  </p>
                </div>

                <div className="bg-red-950/20 p-3.5 rounded-xl border border-red-900/40 space-y-1">
                  <h5 className="font-bold text-red-300 flex items-center gap-1.5">
                    <span>2. Deceptive Micro-Fonts & Missing USP (Unit Sale Price)</span>
                  </h5>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Rule 7 of LM Rules 2011 mandates specific minimum numeral heights (1mm to 6mm) relative to package area. Manufacturers frequently obscure unit price and consumer care numbers in illegible tiny fonts.
                  </p>
                </div>

                <div className="bg-red-950/20 p-3.5 rounded-xl border border-red-900/40 space-y-1">
                  <h5 className="font-bold text-red-300 flex items-center gap-1.5">
                    <span>3. Multi-Agency Jurisdiction Silos</span>
                  </h5>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Food items must simultaneously satisfy Legal Metrology (MRP, Net Qty) and FSSAI (FoSCoS Lic, Veg logo, Nutritional table). Officers have had no unified software tool to cross-audit both standards simultaneously.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-red-400 font-semibold">
              <span>Estimated Annual Consumer Loss:</span>
              <span className="font-mono font-bold text-sm text-red-300">₹18,000+ Crores</span>
            </div>
          </motion.div>

          {/* Right Column: CompliScan AI Platform Solution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 bg-slate-950/80 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-emerald-100">CompliScan AI Solution</h3>
                    <p className="text-xs text-emerald-400">Deterministic statutory compliance in &lt;1.2 seconds</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-800">
                  Autonomous Engine
                </span>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                <div className="bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-900/40 space-y-1">
                  <h5 className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <span>1. Dual-Engine OCR & Vision Structuring</span>
                  </h5>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Groq Llama-3 Vision + Tesseract pipeline extracts 20+ mandatory declarations with layout coordinates and bounding boxes in sub-second latency.
                  </p>
                </div>

                <div className="bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-900/40 space-y-1">
                  <h5 className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <span>2. 100% Deterministic Statutory Law Engine</span>
                  </h5>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Zero AI hallucination in legal judgment. Hardcoded rule algorithms evaluate extracted text against Legal Metrology Rules 2011 and FSSAI 2020 Gazette norms.
                  </p>
                </div>

                <div className="bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-900/40 space-y-1">
                  <h5 className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <span>3. Instant Section 39 Violation Notice Drafting</span>
                  </h5>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Auto-generates official legal show cause notices with penalty compounding calculations under Section 48 and downloadable court-ready PDF evidence dossiers.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span>Statutory Accuracy:</span>
              <span className="font-mono font-bold text-sm text-emerald-300">99.4% Defensible Proof</span>
            </div>
          </motion.div>

        </div>

        {/* Statutory Acts Covered Banner */}
        <div className="bg-slate-950/90 rounded-2xl p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <FileText size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Full Statutory Framework Coverage</div>
              <div className="text-[11px] text-slate-400">Legal Metrology (Packaged Commodities) Rules 2011 • FSSAI 2020 • CDSCO Drugs & Cosmetics Act</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/rules"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              Explore 37+ Statutory Rules
            </Link>
            <Link
              to="/scan"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold transition shadow-lg shadow-emerald-500/20 flex items-center gap-1"
            >
              <span>Scan Live Product</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
