import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, ShieldCheck, Cpu, Layers, Sparkles, 
  Search, CheckCircle2, ArrowUpRight, Lock, Gauge
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AppleBentoShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'neural' | 'metrology' | 'security'>('neural');

  return (
    <section className="py-24 bg-[#030712] text-white relative overflow-hidden border-t border-white/5">
      {/* Apple-style Soft Ambient Radial Spotlights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Apple-style Super Sub-headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase bg-white/5 text-emerald-300 border border-white/10 backdrop-blur-xl mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Engineered for Perfection</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400"
          >
            Next-Gen Architecture. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Zero Compromise.
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Built like Apple hardware — precision OCR vision, mathematical deterministic rule engines, and instant PDF audit reports.
          </motion.p>
        </div>

        {/* Apple-style Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Large Featured Card (8 cols) - Dual-Engine Neural Vision */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="md:col-span-12 lg:col-span-8 rounded-3xl p-8 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-emerald-500/40 shadow-2xl transition-all"
          >
            {/* Glow accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all" />
            
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[320px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-emerald-400/80 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full">
                    HYBRID OCR V3.4
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-heading tracking-tight">
                  Dual-Engine Neural Label Scanner
                </h3>
                <p className="text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed mb-6">
                  Combines Google Gemini 2.5 Vision with Local Tesseract OCR. Flawlessly extracts 14-digit FSSAI licenses, microscopic ingredient tables, batch codes, and dual mass-volume declarations even from crumpled or curved packaging.
                </p>
              </div>

              {/* Apple-style Interactive Tech Spec Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                  <div className="text-xs text-slate-400">Latency</div>
                  <div className="text-lg font-extrabold text-emerald-400">0.8 sec</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                  <div className="text-xs text-slate-400">OCR Accuracy</div>
                  <div className="text-lg font-extrabold text-cyan-400">99.4%</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                  <div className="text-xs text-slate-400">Hallucination</div>
                  <div className="text-lg font-extrabold text-teal-400">0.00%</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                  <div className="text-xs text-slate-400">Categories</div>
                  <div className="text-lg font-extrabold text-white">5 Active</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bento Card 2: 4 cols - Speed & Realtime Radar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="md:col-span-6 lg:col-span-4 rounded-3xl p-8 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-cyan-500/40 shadow-2xl transition-all flex flex-col justify-between"
          >
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                <Gauge className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-heading tracking-tight">
                Deterministic Engine
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Pure rule-based compliance auditing. Zero guessing. Every rule is directly mapped to official gazette notifications (Legal Metrology 2011, FSSAI 2020).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Govt Gazette Aligned</span>
              </div>
              <span className="text-xs font-mono text-cyan-400">22+ Rules</span>
            </div>
          </motion.div>

          {/* Bento Card 3: 4 cols - Instant Export */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="md:col-span-6 lg:col-span-4 rounded-3xl p-8 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-emerald-500/40 shadow-2xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-heading tracking-tight">
                Automated PDF Audit Dossier
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Generates court-admissible audit reports with high-res label crop highlights, missing mandatory clauses, and correction recommendations.
              </p>
            </div>

            <Link 
              to="/scan" 
              className="inline-flex items-center justify-between w-full text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-3 border-t border-white/10 group/link"
            >
              <span>Test Report Generator</span>
              <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>

          {/* Bento Card 4: 8 cols - Multi-Framework Support with Interactive Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="md:col-span-12 lg:col-span-8 rounded-3xl p-8 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-teal-500/40 shadow-2xl transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-mono text-teal-400 uppercase tracking-wider">Multi-Regulatory Framework</span>
                <h3 className="text-2xl font-bold text-white font-heading tracking-tight mt-1">
                  Built for Indian Standard Compliances
                </h3>
              </div>

              {/* Apple-style Mini Pill Toggle */}
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
                {(['neural', 'metrology', 'security'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-teal-500 text-slate-950 font-semibold shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab === 'neural' ? 'FSSAI 2020' : tab === 'metrology' ? 'Legal Metrology' : 'CDSCO 2020'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-1">
                  <CheckCircle2 className="w-4 h-4" /> Veg / Non-Veg
                </div>
                <p className="text-xs text-slate-400">Green / Brown symbol geometric size & contrasting background ratio validation.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold mb-1">
                  <CheckCircle2 className="w-4 h-4" /> Font Size Rules
                </div>
                <p className="text-xs text-slate-400">Area of Principal Display Panel (PDP) vs minimum prescribed numeral height (1mm - 6mm).</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold mb-1">
                  <CheckCircle2 className="w-4 h-4" /> Allergen Alert
                </div>
                <p className="text-xs text-slate-400">Gluten, Soy, Milk, Nut statutory warnings in bold upper casing check.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
