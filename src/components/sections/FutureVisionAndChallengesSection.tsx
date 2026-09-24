import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, Rocket, Sparkles, CheckCircle2, ShieldAlert, 
  Target, Globe, Cpu, Database, Eye, Smartphone, Scale, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FutureVisionAndChallengesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'vision'>('challenges');

  const CHALLENGES = [
    {
      icon: Eye,
      title: "1. Deceptive Micro-Fonts & Shelf Distortion",
      severity: "High Criticality",
      desc: "Manufacturers deliberately print mandatory Unit Sale Price (USP) and consumer helpline numbers in 0.8mm fonts on shiny, reflective, or cylindrical surfaces (oil cans, spice sachets) where conventional OCR fails.",
      solution: "CompliScan AI's OpenCV adaptive binarization + Llama-3 Vision handles specular glare and curved perspective distortion in <1.2s."
    },
    {
      icon: Globe,
      title: "2. 22 Scheduled Indian Regional Scripts",
      severity: "National Diversity",
      desc: "Packaged goods across India carry multilingual declarations in Devanagari, Tamil, Telugu, Bengali, Gujarati, and Malayalam, requiring language-agnostic token alignment.",
      solution: "Multi-script Indic OCR dictionary pipeline with UTF-8 statutory schema normalization across all 22 official languages."
    },
    {
      icon: Scale,
      title: "3. Inter-Agency Jurisdiction Silos",
      severity: "Regulatory Friction",
      desc: "State Legal Metrology Controllers, FSSAI Food Safety Officers, and the National Consumer Helpline operate on separate databases with no unified inspection interoperability.",
      solution: "CompliScan AI's unified multi-agency hub creates a single immutable audit trail accessible by all state and central enforcement cells."
    },
    {
      icon: ShieldAlert,
      title: "4. Barcode Spoofing & Counterfeiting",
      severity: "Consumer Fraud",
      desc: "Counterfeit and grey-market products replicate legitimate barcodes while tampering with manufacturing dates and net weight quantities.",
      solution: "Direct 14-digit FoSCoS license validation and GS1 DataBar cloud checksum verification to detect fraudulent packaging replicas."
    }
  ];

  const VISION_POINTS = [
    {
      icon: Smartphone,
      quarter: "Q1 2027",
      title: "Citizen Mobile App with 1-Tap Fraud Grievance",
      desc: "Empowering 1.4 Billion consumers to snap any shelf package in a retail shop and instantly auto-file a Section 39 report to National Consumer Helpline (NCH) in 1 tap."
    },
    {
      icon: Database,
      quarter: "Q2 2027",
      title: "Automated Gazette Rule AI Synchronizer",
      desc: "Automated AI scraper monitoring the Gazette of India for new Ministry notifications, instantly compiling and updating the deterministic rule database in real time."
    },
    {
      icon: Cpu,
      quarter: "Q3 2027",
      title: "Quantized Edge AI for Offline Rural Mandis",
      desc: "Embedded offline AI engine on handheld POS terminals and smartphones enabling field officers to audit packages in remote rural haats with zero internet connectivity."
    },
    {
      icon: Target,
      quarter: "Q4 2027",
      title: "National E-Commerce AI Web Crawler",
      desc: "Automated compliance scanner monitoring millions of product listings across Amazon, Flipkart, Blinkit, and Zepto to detect mandatory online MRP/USP disclosure violations."
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-[#050911] border-t border-slate-200/80 dark:border-white/5 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-500/30 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>CHALLENGES & FUTURE ROADMAP • PROBLEM STATEMENT SIH26034</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight leading-tight">
            Key Industry Challenges & Future Vision
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Understanding the real-world complexities of Indian packaging enforcement and how CompliScan AI is engineered to scale across 1.4 Billion consumers.
          </p>

          {/* Interactive Switcher Tabs */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-inner mt-4">
            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'challenges'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <AlertTriangle size={16} />
              <span>Core Challenges (4)</span>
            </button>
            <button
              onClick={() => setActiveTab('vision')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'vision'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Rocket size={16} />
              <span>Future Vision & Scale (4)</span>
            </button>
          </div>
        </div>

        {/* Content Container */}
        {activeTab === 'challenges' ? (
          /* ================= CHALLENGES GRID ================= */
          <motion.div
            key="challenges"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {CHALLENGES.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900/80 p-6 sm:p-7 rounded-3xl border border-red-500/20 hover:border-red-500/40 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-500/30 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon size={24} />
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold px-3 py-1 rounded-full border border-red-200 dark:border-red-800">
                      {item.severity}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/20">
                  <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>CompliScan AI Solution:</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {item.solution}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          /* ================= FUTURE VISION TIMELINE ================= */
          <motion.div
            key="vision"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {VISION_POINTS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-emerald-500/20 hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon size={24} />
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {item.quarter}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Planned Milestone</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Bottom CTA Bar */}
        <div className="mt-14 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div>
            <h4 className="font-extrabold text-base text-white">Have a specific packaging compliance inquiry?</h4>
            <p className="text-xs text-slate-300">Test our deterministic rule engine on live packaged products today.</p>
          </div>
          <Link
            to="/scan"
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer whitespace-nowrap"
          >
            <span>Scan Product Now</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
};
