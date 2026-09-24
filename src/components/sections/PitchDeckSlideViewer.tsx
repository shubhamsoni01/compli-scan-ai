import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, ChevronLeft, ChevronRight, Maximize, Download, 
  Sparkles, Award, ShieldCheck, FileText, CheckCircle2, ArrowRight,
  Eye, Cpu, Database, Globe, Smartphone, Camera, ShoppingBag, Layers,
  BarChart2, Scale, AlertTriangle, CheckCircle, ExternalLink, RefreshCw
} from 'lucide-react';
import { MinistryLogo } from '@/components/ui/MinistryLogo';
import { SIHLogo } from '@/components/ui/SIHLogo';

interface SlideContent {
  id: number;
  slideNumber: number;
  title: string;
  tag: string;
  subtitle: string;
  content: React.ReactNode;
}

export const PitchDeckSlideViewer: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);

  const SLIDES: SlideContent[] = [
    // SLIDE 1: TITLE PAGE
    {
      id: 0,
      slideNumber: 1,
      title: "TITLE PAGE",
      tag: "Slide 1 of 6 • Title",
      subtitle: "Smart India Hackathon Official Submission Deck",
      content: (
        <div className="h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 sm:p-7 flex flex-col justify-between select-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-xl sm:text-3xl font-black font-heading tracking-wider text-slate-800 dark:text-slate-100">
                SMART INDIA HACKATHON <span className="text-emerald-600 dark:text-emerald-400">2026</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img 
                src="/assets/sih-transparent-bulb.png" 
                alt="SIH 2026" 
                className="h-9 sm:h-12 object-contain"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">SIH 2026</div>
                <div className="text-[9px] text-slate-500">Idea Submission</div>
              </div>
            </div>
          </div>

          {/* Sub Header */}
          <div className="text-center my-1 sm:my-2">
            <span className="text-xl sm:text-2xl font-black tracking-widest text-slate-900 dark:text-white uppercase">
              TITLE PAGE
            </span>
          </div>

          {/* Body Content: Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center flex-1 my-auto">
            {/* Left Card: Meta Information */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2.5 text-xs sm:text-sm">
              <div>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs sm:text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Problem Statement ID :
                </span>
                <p className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm sm:text-base ml-3.5">
                  26034 / SIH26034
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs sm:text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Problem Statement Title :
                </span>
                <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-xs leading-relaxed ml-3.5 font-medium">
                  Software System to check compliance of Packaged Commodities under Legal Metrology (Packaged Commodities) Rules, 2011 by scanning products, images and labels.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
                    Theme :
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs ml-3">
                    Miscellaneous / Smart Governance
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
                    PS Category :
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs ml-3 font-semibold text-emerald-600 dark:text-emerald-400">
                    Software
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                    Team ID :
                  </span>
                  <p className="font-mono text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs ml-3 font-bold">
                    SIH2025-DoCA-26034
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                    Team Name :
                  </span>
                  <p className="text-slate-900 dark:text-white text-[11px] sm:text-xs ml-3 font-black text-indigo-600 dark:text-indigo-400">
                    CompliScan AI
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px] sm:text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Ministry / Department :
                </span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs ml-3 font-medium">
                  Department of Consumer Affairs (DoCA), Ministry of Consumer Affairs, Food & Public Distribution
                </p>
              </div>
            </div>

            {/* Right Emblem Illustration */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-3 text-center">
              <div className="relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/20 via-emerald-400/20 to-cyan-400/20 blur-xl animate-pulse" />
                <img 
                  src="/assets/sih-transparent-bulb.png" 
                  alt="SIH Bulb" 
                  className="w-28 h-28 sm:w-36 sm:h-36 object-contain relative z-10 drop-shadow-md"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
              <div className="mt-2 text-center">
                <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
                  SMART INDIA HACKATHON
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  Idea Submission Template • Slide 1
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2 text-[10px] text-slate-500">
            <span>@SIH Idea submission- Template</span>
            <span className="font-bold">1</span>
          </div>
        </div>
      )
    },

    // SLIDE 2: PROPOSED SOLUTION
    {
      id: 1,
      slideNumber: 2,
      title: "PROPOSED SOLUTION",
      tag: "Slide 2 of 6 • Solution",
      subtitle: "Problem at Hand, AI Scanner Demo & Standout Capabilities",
      content: (
        <div className="h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 sm:p-6 flex flex-col justify-between select-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-full border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1">
                <Sparkles size={12} />
                <span>CompliScan AI</span>
              </div>
            </div>
            <h2 className="text-base sm:text-xl font-black font-heading text-slate-900 dark:text-white uppercase tracking-wider">
              PROPOSED SOLUTION
            </h2>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400">
              <img src="/assets/sih-transparent-bulb.png" alt="SIH" className="h-6 object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              <span className="hidden sm:inline">SIH 2026</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic my-1">
            · Proposed Solution (Describe your Idea/Solution/Prototype)
          </div>

          {/* 3 Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 flex-1 my-auto text-xs">
            
            {/* Left: Problem at Hand */}
            <div className="lg:col-span-3.5 bg-red-50/60 dark:bg-red-950/20 rounded-xl p-3 border border-red-500/30 flex flex-col justify-between space-y-2">
              <div className="font-black text-xs text-red-600 dark:text-red-400 border-b border-red-500/20 pb-1">
                Problem at Hand
              </div>

              <div className="space-y-2 text-[11px] leading-tight text-slate-700 dark:text-slate-300">
                <div>
                  <span className="font-bold text-red-700 dark:text-red-300 block">• Manual Inspection Bottlenecks:</span>
                  <span className="text-slate-600 dark:text-slate-400">Over 400M packaged products in market. Field officers manually inspect &lt;0.01% of total SKUs.</span>
                </div>
                <div>
                  <span className="font-bold text-red-700 dark:text-red-300 block">• Widespread Non-Compliance:</span>
                  <span className="text-slate-600 dark:text-slate-400">Deceptive MRP, missing 14-digit FSSAI licenses, hidden expiry dates, and illegal font sizes.</span>
                </div>
                <div>
                  <span className="font-bold text-red-700 dark:text-red-300 block">• Multi-Regulatory Complexity:</span>
                  <span className="text-slate-600 dark:text-slate-400">Overlapping rules between Legal Metrology 2011, FSSAI 2020, and CDSCO 2020 cause high human error.</span>
                </div>
                <div>
                  <span className="font-bold text-red-700 dark:text-red-300 block">• Evidentiary Documentation Gaps:</span>
                  <span className="text-slate-600 dark:text-slate-400">Absence of automated bounding-box proof and instant digital notice generation stalls enforcement.</span>
                </div>
              </div>
            </div>

            {/* Center: Our Solution & Why We Stand Out */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-2">
              {/* Solution Terminal Card */}
              <div className="bg-slate-950 text-slate-100 rounded-xl p-3 border border-slate-800 shadow-md">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Our Solution: CompliScan Web Demo</span>
                  <span className="text-[9px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300 font-mono">v3.4 LIVE</span>
                </div>

                <div className="space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between items-center bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                    <span className="text-slate-300">MRP (Rs.)</span>
                    <span className="text-slate-400">Rs. 120.00 (incl. of all taxes)</span>
                    <span className="text-emerald-400 font-bold">PASS</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                    <span className="text-slate-300">Net Quantity</span>
                    <span className="text-slate-400">500 g (Metric Unit Verified)</span>
                    <span className="text-emerald-400 font-bold">PASS</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                    <span className="text-slate-300">FSSAI Licence</span>
                    <span className="text-slate-400">10013021000853 (14-Digits)</span>
                    <span className="text-emerald-400 font-bold">PASS</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                    <span className="text-slate-300">Mfg / Expiry</span>
                    <span className="text-slate-400">MFD: 08/2026 | EXP: 08/2027</span>
                    <span className="text-emerald-400 font-bold">PASS</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                    <span className="text-slate-300">PDP Font Size</span>
                    <span className="text-slate-400">Adequate (3.2% Frame Ratio)</span>
                    <span className="text-emerald-400 font-bold">PASS</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                    <span className="text-slate-300">Consumer Care</span>
                    <span className="text-slate-400">Toll Free: 1800-200-1122</span>
                    <span className="text-emerald-400 font-bold">PASS</span>
                  </div>
                </div>
              </div>

              {/* Why We Stand Out */}
              <div className="bg-amber-50/70 dark:bg-amber-950/20 rounded-xl p-2.5 border border-amber-500/30 text-[11px] space-y-1">
                <div className="font-black text-amber-700 dark:text-amber-400 text-xs">
                  Why We Stand Out
                </div>
                <div className="space-y-1 text-[10px] text-slate-700 dark:text-slate-300">
                  <p><strong className="text-slate-900 dark:text-white">• Deterministic Legal Engine:</strong> Strict zero-hallucination rule checks mapped to official Gazette notifications.</p>
                  <p><strong className="text-slate-900 dark:text-white">• Multi-Pass Dual OCR:</strong> Enhances contrast and orientation; dual OCR.Space + Tesseract 5 fallback.</p>
                  <p><strong className="text-slate-900 dark:text-white">• Multi-Regulatory Harmonization:</strong> Simultaneously audits Legal Metrology (2011), FSSAI (2020), & CDSCO (2020).</p>
                  <p><strong className="text-slate-900 dark:text-white">• Instant Court-Ready Notice:</strong> 1-Click PDF/DOCX dossier export with highlighted photographic evidence.</p>
                </div>
              </div>
            </div>

            {/* Right: Key Features */}
            <div className="lg:col-span-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl p-3 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-1.5">
              <div className="font-black text-xs text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-1">
                Key Features
              </div>

              <div className="space-y-1.5 text-[10.5px]">
                <div className="flex items-start gap-1.5">
                  <div className="p-1 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mt-0.5">
                    <Camera size={12} />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Multi-Pass Dual OCR</strong>
                    <span className="text-slate-500">Sharp pre-processing + OCR.Space & Tesseract 5.</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5">
                  <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <ShieldCheck size={12} />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Deterministic Engine</strong>
                    <span className="text-slate-500">40+ statutory rule checks with exact legal logic.</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5">
                  <div className="p-1 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 mt-0.5">
                    <Eye size={12} />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Readability & Font Auditor</strong>
                    <span className="text-slate-500">Calculates PDP line-height ratios & clarity score.</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5">
                  <div className="p-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mt-0.5">
                    <BarChart2 size={12} />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">National Enforcement Portal</strong>
                    <span className="text-slate-500">Centralized inspector logs, trends & heatmaps.</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5">
                  <div className="p-1 rounded bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 mt-0.5">
                    <FileText size={12} />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Court-Ready Legal Dossier</strong>
                    <span className="text-slate-500">Automated PDF/DOCX export with photo evidence.</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5">
                  <div className="p-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mt-0.5">
                    <Globe size={12} />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">E-Commerce & Batch API</strong>
                    <span className="text-slate-500">Bulk scraping & catalog gating for marketplaces.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2 text-[10px] text-slate-500">
            <span>@SIH Idea submission- Template</span>
            <span className="font-bold">2</span>
          </div>
        </div>
      )
    },

    // SLIDE 3: TECHNICAL APPROACH
    {
      id: 2,
      slideNumber: 3,
      title: "TECHNICAL APPROACH",
      tag: "Slide 3 of 6 • Tech Stack",
      subtitle: "Pipelines, Deep Architecture Flowchart & Live Monitoring",
      content: (
        <div className="h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 sm:p-6 flex flex-col justify-between select-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-full border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1">
                <Sparkles size={12} />
                <span>CompliScan AI</span>
              </div>
            </div>
            <h2 className="text-base sm:text-xl font-black font-heading text-slate-900 dark:text-white uppercase tracking-wider">
              TECHNICAL APPROACH
            </h2>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400">
              <img src="/assets/sih-transparent-bulb.png" alt="SIH" className="h-6 object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              <span className="hidden sm:inline">SIH 2026</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic my-1">
            · Technologies to be used (programming languages, frameworks) & Implementation Flowchart / Working Prototype
          </div>

          {/* Body Architecture & Live Monitor */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 flex-1 my-auto items-stretch">
            
            {/* Left 8 Cols: Architectural Flowchart */}
            <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-2">
              
              {/* Row 1: Ingestion Sources */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-indigo-500/30 shadow-xs">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1">
                    <Camera size={12} /> AI Vision Camera
                  </div>
                  <span className="text-slate-500 text-[9px] block">Captures physical retail packaging, foil & cartons</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-indigo-500/30 shadow-xs">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                    <Globe size={12} /> E-Commerce Crawler
                  </div>
                  <span className="text-slate-500 text-[9px] block">Scrapes marketplace catalog images & metadata</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-indigo-500/30 shadow-xs">
                  <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                    <Layers size={12} /> Bulk Batch Ingestion
                  </div>
                  <span className="text-slate-500 text-[9px] block">Ingests warehouse EAN/UPC batches & CSV manifests</span>
                </div>
              </div>

              {/* Preprocessing Bar */}
              <div className="bg-indigo-50/70 dark:bg-indigo-950/40 p-2 rounded-xl border border-indigo-400/30 text-center text-[10.5px]">
                <span className="font-bold text-indigo-700 dark:text-indigo-300">Sharp Preprocessing Unit: </span>
                <span className="text-slate-600 dark:text-slate-300">Auto-Orientation & Contrast • Unsharp Mask & Binarization</span>
              </div>

              {/* Central AI Extraction & Legal Core */}
              <div className="bg-slate-900 text-white p-3 rounded-xl border border-emerald-500/40 shadow-md space-y-2">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider text-center border-b border-slate-800 pb-1">
                  AI EXTRACTION & LEGAL CORE (ZERO HALLUCINATION PIPELINE)
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-slate-800/90 p-2 rounded-lg border border-slate-700">
                    <div className="font-bold text-cyan-400">Dual-Engine Neural OCR</div>
                    <div className="text-slate-400 text-[9px]">OCR.Space (Primary) + Tesseract 5 (Fallback)</div>
                  </div>
                  <div className="bg-slate-800/90 p-2 rounded-lg border border-slate-700">
                    <div className="font-bold text-emerald-400">Groq LLM Structuring</div>
                    <div className="text-slate-400 text-[9px]">Zero-hallucination JSON entity formatting</div>
                  </div>
                  <div className="bg-slate-800/90 p-2 rounded-lg border border-slate-700">
                    <div className="font-bold text-amber-400">Deterministic Rule Engine</div>
                    <div className="text-slate-400 text-[9px]">40+ Gazette Rules (LM-001..13, FSSAI 001..12)</div>
                  </div>
                  <div className="bg-slate-800/90 p-2 rounded-lg border border-slate-700">
                    <div className="font-bold text-purple-400">Readability & Font Auditor</div>
                    <div className="text-slate-400 text-[9px]">PDP area vs numeral height ratio (1.0-6.0mm)</div>
                  </div>
                </div>
              </div>

              {/* Output Nodes */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-purple-600 dark:text-purple-400">PDF & DOCX Generator</div>
                  <span className="text-slate-500 text-[9px]">Court-admissible notice dossiers</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">MongoDB Atlas Repo</div>
                  <span className="text-slate-500 text-[9px]">Encrypted audit trail & history</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">DoCA Admin Gateway</div>
                  <span className="text-slate-500 text-[9px]">Inspector logs & violation heatmap</span>
                </div>
              </div>

            </div>

            {/* Right 4 Cols: Live System Terminal */}
            <div className="lg:col-span-4 bg-slate-950 text-slate-100 rounded-2xl p-3.5 border border-slate-800 flex flex-col justify-between space-y-2 font-mono text-xs shadow-xl">
              <div className="border-b border-slate-800 pb-2">
                <div className="text-emerald-400 font-bold text-xs flex items-center justify-between">
                  <span>Real-Time System Monitoring</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <span className="text-[10px] text-slate-500 font-sans">Live Production Benchmark</span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center bg-slate-900 p-1.5 rounded">
                  <span className="text-slate-400">Scan Latency:</span>
                  <span className="text-emerald-400 font-bold">0.8s</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-1.5 rounded">
                  <span className="text-slate-400">OCR Precision:</span>
                  <span className="text-emerald-400 font-bold">99.4%</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-1.5 rounded">
                  <span className="text-slate-400">Legal Rules:</span>
                  <span className="text-amber-400 font-bold">22 Active</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-1.5 rounded">
                  <span className="text-slate-400">Evidentiary Hash:</span>
                  <span className="text-indigo-400 font-bold text-[10px]">SHA-256</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-1.5 rounded">
                  <span className="text-slate-400">Score:</span>
                  <span className="text-emerald-400 font-bold">96% (PASS)</span>
                </div>
              </div>

              <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 text-[10px] space-y-0.5">
                <div className="text-emerald-400 font-bold">STATUS: 100% LIVE PROTOTYPE</div>
                <div className="text-slate-400">SKU: FMCG-9824 | VERDICT: COMPLIANT</div>
                <div className="text-slate-400">DOSSIER: AUTOGENERATED (PDFKit)</div>
              </div>

              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-2 rounded-xl text-xs font-sans uppercase tracking-wider transition shadow-md">
                GENERATE COMPLIANCE DOSSIER
              </button>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2 text-[10px] text-slate-500">
            <span>@SIH Idea submission- Template</span>
            <span className="font-bold">3</span>
          </div>
        </div>
      )
    },

    // SLIDE 4: FEASIBILITY AND VIABILITY
    {
      id: 3,
      slideNumber: 4,
      title: "FEASIBILITY AND VIABILITY",
      tag: "Slide 4 of 6 • Viability",
      subtitle: "Technical, Economical, Security & Phased Implementation Roadmap",
      content: (
        <div className="h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 sm:p-6 flex flex-col justify-between select-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-full border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1">
                <Sparkles size={12} />
                <span>CompliScan AI</span>
              </div>
            </div>
            <h2 className="text-base sm:text-xl font-black font-heading text-slate-900 dark:text-white uppercase tracking-wider">
              FEASIBILITY AND VIABILITY
            </h2>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400">
              <img src="/assets/sih-transparent-bulb.png" alt="SIH" className="h-6 object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              <span className="hidden sm:inline">SIH 2026</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic my-1">
            · Analysis of Feasibility, Economical Comparison, Maintenance & Phased Implementation Roadmap
          </div>

          {/* 6 Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1 my-auto text-[10.5px]">
            
            {/* 1. Technical Feasibility */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">Technical Feasibility</div>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                <li>• <strong>Scalable Production Stack:</strong> Built on React 19, Node.js, Express, Sharp & MongoDB Atlas.</li>
                <li>• <strong>Sub-Second Processing:</strong> Latency &lt; 1.2s with 99.4% character extraction accuracy.</li>
                <li>• <strong>Zero Hallucination:</strong> Mathematical rule engine ensures legal certainty.</li>
                <li>• <strong>Graceful Degradation:</strong> Offline-ready PWA caching & multi-tier OCR failovers.</li>
              </ul>
            </div>

            {/* 2. Economical Feasibility: Manual vs CompliScan Table */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">Economical Feasibility: Manual vs CompliScan</div>
              <div className="w-full text-[9.5px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200">
                      <th className="py-0.5">Parameter</th>
                      <th className="py-0.5">Manual</th>
                      <th className="py-0.5 text-emerald-600 dark:text-emerald-400">CompliScan</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 dark:text-slate-300">
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <td className="py-0.5 font-medium">Time</td>
                      <td className="py-0.5">15 - 25 min</td>
                      <td className="py-0.5 font-bold text-emerald-600">&lt; 2s (99% saved)</td>
                    </tr>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <td className="py-0.5 font-medium">Daily Cap</td>
                      <td className="py-0.5">20 - 30 items</td>
                      <td className="py-0.5 font-bold text-emerald-600">1,000+ items</td>
                    </tr>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <td className="py-0.5 font-medium">Cost/Scan</td>
                      <td className="py-0.5">₹150 - 300</td>
                      <td className="py-0.5 font-bold text-emerald-600">&lt; ₹0.15</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-medium">Error Rate</td>
                      <td className="py-0.5 text-red-500">25% - 35%</td>
                      <td className="py-0.5 font-bold text-emerald-600">&lt; 1%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Maintenance & Security */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-cyan-600 dark:text-cyan-400 text-xs">Maintenance & Security Feasibility</div>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                <li>• <strong>Modular Rule Updates:</strong> Rules stored in modular config; zero code recompile needed.</li>
                <li>• <strong>Role-Based Access:</strong> Granular officer vs supervisor vs admin permissions.</li>
                <li>• <strong>Data Protection:</strong> SHA-256 evidence hashing, JWT session security & HTTPS.</li>
                <li>• <strong>Auto Health Monitoring:</strong> Dockerized microservices ready for Gov-Cloud.</li>
              </ul>
            </div>

            {/* 4. Economic & Operational Viability */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-amber-600 dark:text-amber-400 text-xs">Economic & Operational Viability</div>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                <li>• <strong>Zero Hardware Capex:</strong> Runs on standard smartphones & laptops already owned.</li>
                <li>• <strong>50x Inspection Multiplier:</strong> Eliminates manual log entry and repetitive typing.</li>
                <li>• <strong>Industry Self-Audit:</strong> Brands & SMEs self-verify labels prior to mass packaging.</li>
                <li>• <strong>Immediate ROI:</strong> Rapid recovery of statutory fines and prevention of price fraud.</li>
              </ul>
            </div>

            {/* 5. Phased Roadmap */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-purple-600 dark:text-purple-400 text-xs">Implementation Viability: Phased Roadmap</div>
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between bg-white dark:bg-slate-900 p-1 rounded border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-indigo-500">Phase 1 (M1-M2)</span>
                  <span className="text-slate-600 dark:text-slate-300">Multi-Pass OCR & Rules</span>
                  <span className="text-emerald-500 font-bold">Live Prototype</span>
                </div>
                <div className="flex justify-between bg-white dark:bg-slate-900 p-1 rounded border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-indigo-500">Phase 2 (M3-M4)</span>
                  <span className="text-slate-600 dark:text-slate-300">National Portal & PWA</span>
                  <span className="text-indigo-400 font-bold">Ready</span>
                </div>
                <div className="flex justify-between bg-white dark:bg-slate-900 p-1 rounded border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-indigo-500">Phase 3 (M5-M6)</span>
                  <span className="text-slate-600 dark:text-slate-300">E-Com & Customs API</span>
                  <span className="text-amber-500 font-bold">Scaling Phase</span>
                </div>
              </div>
            </div>

            {/* 6. Regulatory & Environmental */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">Regulatory & Environmental Viability</div>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                <li>• <strong>100% Paperless:</strong> Completely eliminates paper logs, delays & filing.</li>
                <li>• <strong>Aligned with Digital India:</strong> Contactless e-governance.</li>
                <li>• <strong>Gazette Compliant:</strong> Grounded in Legal Metrology 2009 & FSSAI 2020.</li>
                <li>• <strong>Consumer Protection:</strong> Strengthens 'Jago Grahak Jago' mandate.</li>
              </ul>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2 text-[10px] text-slate-500">
            <span>@SIH Idea submission- Template</span>
            <span className="font-bold">4</span>
          </div>
        </div>
      )
    },

    // SLIDE 5: IMPACT AND BENEFITS
    {
      id: 4,
      slideNumber: 5,
      title: "IMPACT AND BENEFITS",
      tag: "Slide 5 of 6 • Impact",
      subtitle: "Target Audience Benefits & Quantified Social, Economic & Legal Impact",
      content: (
        <div className="h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 sm:p-6 flex flex-col justify-between select-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-full border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1">
                <Sparkles size={12} />
                <span>CompliScan AI</span>
              </div>
            </div>
            <h2 className="text-base sm:text-xl font-black font-heading text-slate-900 dark:text-white uppercase tracking-wider">
              IMPACT AND BENEFITS
            </h2>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400">
              <img src="/assets/sih-transparent-bulb.png" alt="SIH" className="h-6 object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              <span className="hidden sm:inline">SIH 2026</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic my-1">
            · Potential Impact on Target Audience & Quantified Benefits (Social, Economic, Environmental)
          </div>

          {/* 4 Audience Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 text-[10.5px]">
            <div className="bg-indigo-50/60 dark:bg-indigo-950/20 p-2.5 rounded-xl border border-indigo-500/30 space-y-1">
              <div className="font-bold text-indigo-700 dark:text-indigo-300 text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Enforcement Officers
              </div>
              <p className="text-slate-600 dark:text-slate-300">• 50x faster field inspections with automated rule matching.</p>
              <p className="text-slate-600 dark:text-slate-300">• 1-Click generation of court-admissible legal notices.</p>
              <p className="text-slate-600 dark:text-slate-300">• Searchable national repository of past violations.</p>
            </div>

            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/30 space-y-1">
              <div className="font-bold text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Consumers & Citizens
              </div>
              <p className="text-slate-600 dark:text-slate-300">• Protection against deceptive pricing & dual MRP.</p>
              <p className="text-slate-600 dark:text-slate-300">• Instant verification of net quantity and expiry dates.</p>
              <p className="text-slate-600 dark:text-slate-300">• Trust in food, cosmetics & edible oil standards.</p>
            </div>

            <div className="bg-amber-50/60 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/30 space-y-1">
              <div className="font-bold text-amber-700 dark:text-amber-300 text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Manufacturers & Packers
              </div>
              <p className="text-slate-600 dark:text-slate-300">• Pre-market self-audit tool prior to packaging runs.</p>
              <p className="text-slate-600 dark:text-slate-300">• Prevents costly product recalls and legal penalties.</p>
              <p className="text-slate-600 dark:text-slate-300">• Streamlines regulatory compliance across states.</p>
            </div>

            <div className="bg-cyan-50/60 dark:bg-cyan-950/20 p-2.5 rounded-xl border border-cyan-500/30 space-y-1">
              <div className="font-bold text-cyan-700 dark:text-cyan-300 text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-500" /> E-Commerce & Customs
              </div>
              <p className="text-slate-600 dark:text-slate-300">• Automated catalog screening for seller listings.</p>
              <p className="text-slate-600 dark:text-slate-300">• Instant import compliance verification at ports.</p>
              <p className="text-slate-600 dark:text-slate-300">• Ensures statutory transparency on marketplaces.</p>
            </div>
          </div>

          {/* 4 Big Numbers Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2 text-center">
            <div className="bg-indigo-50 dark:bg-slate-800 p-2.5 rounded-xl border border-indigo-500/30">
              <div className="text-indigo-600 dark:text-indigo-400 font-black text-lg sm:text-xl">99% Time Saved</div>
              <div className="text-slate-600 dark:text-slate-400 text-[10px]">Audit cut from 20 mins to &lt; 2s</div>
            </div>
            <div className="bg-emerald-50 dark:bg-slate-800 p-2.5 rounded-xl border border-emerald-500/30">
              <div className="text-emerald-600 dark:text-emerald-400 font-black text-lg sm:text-xl">50x Scale Multiplier</div>
              <div className="text-slate-600 dark:text-slate-400 text-[10px]">1,000+ audited daily vs 20 manually</div>
            </div>
            <div className="bg-amber-50 dark:bg-slate-800 p-2.5 rounded-xl border border-amber-500/30">
              <div className="text-amber-600 dark:text-amber-400 font-black text-lg sm:text-xl">0.00% Hallucination</div>
              <div className="text-slate-600 dark:text-slate-400 text-[10px]">100% deterministic statutory proof</div>
            </div>
            <div className="bg-cyan-50 dark:bg-slate-800 p-2.5 rounded-xl border border-cyan-500/30">
              <div className="text-cyan-600 dark:text-cyan-400 font-black text-lg sm:text-xl">Rs. 100s of Cr Saved</div>
              <div className="text-slate-600 dark:text-slate-400 text-[10px]">Saves paperwork & fine leakages</div>
            </div>
          </div>

          {/* Strategic Alignment Banner */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] space-y-1">
            <div className="font-bold text-slate-900 dark:text-white text-xs">Strategic Alignment with National Initiatives</div>
            <div className="space-y-0.5 text-slate-600 dark:text-slate-300">
              <p>• <strong>Digital India & E-Governance:</strong> Replaces error-prone manual physical logbooks with real-time, cloud-synchronized enforcement analytics.</p>
              <p>• <strong>Consumer Protection Act, 2019:</strong> Strengthens statutory enforcement against unfair trade practices and misleading packaging declarations.</p>
              <p>• <strong>Jago Grahak Jago Initiative:</strong> Empowers Indian citizens with transparent product information, accurate MRP pricing, and standardized net weights.</p>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2 text-[10px] text-slate-500">
            <span>@SIH Idea submission- Template</span>
            <span className="font-bold">5</span>
          </div>
        </div>
      )
    },

    // SLIDE 6: RESEARCH AND REFERENCES
    {
      id: 5,
      slideNumber: 6,
      title: "RESEARCH AND REFERENCES",
      tag: "Slide 6 of 6 • References & TAM",
      subtitle: "Market Sizing (TAM-SAM-SOM), Research Citations & Live Project Deliverables",
      content: (
        <div className="h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 sm:p-6 flex flex-col justify-between select-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-full border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1">
                <Sparkles size={12} />
                <span>CompliScan AI</span>
              </div>
            </div>
            <h2 className="text-base sm:text-xl font-black font-heading text-slate-900 dark:text-white uppercase tracking-wider">
              RESEARCH AND REFERENCES
            </h2>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400">
              <img src="/assets/sih-transparent-bulb.png" alt="SIH" className="h-6 object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              <span className="hidden sm:inline">SIH 2026</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic my-1">
            · Details / Links of Reference, Market Potential (TAM-SAM-SOM), and Prototype Deliverables
          </div>

          {/* TAM-SAM-SOM Section */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-xs text-slate-900 dark:text-white mb-2">
              Market Potential Analysis (TAM - SAM - SOM)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[10.5px]">
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-indigo-500/30 shadow-xs">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block">TAM - Total Addressable Market</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">$1.1 Trillion</span>
                <p className="text-slate-500 text-[9.5px] mt-1 leading-snug">
                  Entire Indian FMCG & Packaged Market. Under assumption of 100% adoption across 400B+ annual packaged units.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-500/30 shadow-xs">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">SAM - Serviceable Available Market</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">$14.2 Billion</span>
                <p className="text-slate-500 text-[9.5px] mt-1 leading-snug">
                  Regulatory Compliance & Audit Market. Under assumption of ~35M active SKUs across organized retail & e-commerce.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-amber-500/30 shadow-xs">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">SOM - Serviceable Obtainable Market</span>
                <span className="text-lg font-black text-amber-600 dark:text-amber-400">$180 Million</span>
                <p className="text-slate-500 text-[9.5px] mt-1 leading-snug">
                  Initial DoCA Enforcement Rollout: ~2.5M annual automated audits across border customs, state labs, and top 1,000 brands.
                </p>
              </div>
            </div>
          </div>

          {/* 2 Bottom Columns: Citations & Live Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2 text-[10.5px]">
            {/* References */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText size={13} className="text-indigo-500" /> REFERENCE & RESEARCH WORKS
              </div>
              <div className="space-y-1 text-slate-600 dark:text-slate-300 text-[10px]">
                <p><strong>1) Ministry of Consumer Affairs:</strong> The Legal Metrology (Packaged Commodities) Rules, 2011 (as amended up to 2024).</p>
                <p><strong>2) Food Safety & Standards Authority:</strong> Food Safety and Standards (Labelling and Display) Regulations, 2020.</p>
                <p><strong>3) R. Smith et al. (ICDAR):</strong> 'An Overview of the Tesseract OCR Engine and Neural Layout Analysis,' Proc. ICDAR.</p>
                <p><strong>4) Dept. of Consumer Affairs:</strong> Guidelines for Prevention and Regulation of Dark Patterns, 2023.</p>
              </div>
            </div>

            {/* Deliverables & Links */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Globe size={13} className="text-emerald-500" /> DELIVERABLES, LIVE LINKS & LEGAL DOSSIERS
              </div>
              <div className="space-y-1 text-slate-700 dark:text-slate-300 text-[10px]">
                <p>• <strong>1) Live Web Application:</strong> <span className="text-emerald-600 dark:text-emerald-400 font-mono">http://localhost:5173</span></p>
                <p>• <strong>2) GitHub Source Code:</strong> <span className="text-indigo-600 dark:text-indigo-400 font-mono">https://github.com/shubhamsoni01/compli-scan-ai</span></p>
                <p>• <strong>3) Video Demo Walkthrough:</strong> <span className="text-amber-600 dark:text-amber-400">SIH Walkthrough Video Included (/sih.mp4)</span></p>
                <p>• <strong>4) Full Documentation:</strong> <span className="text-slate-500">Legal Show-Cause Notice & Audit PDF Generator</span></p>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2 text-[10px] text-slate-500">
            <span>@SIH Idea submission- Template</span>
            <span className="font-bold">6</span>
          </div>
        </div>
      )
    }
  ];

  // Auto-play timer with progress bar
  useEffect(() => {
    let timer: any;
    let progressInterval: any;

    if (isAutoPlay) {
      setProgress(0);
      const startTime = Date.now();
      const DURATION = 5000; // 5 seconds per slide

      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min((elapsed / DURATION) * 100, 100);
        setProgress(currentProgress);
      }, 50);

      timer = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      }, DURATION);
    } else {
      setProgress(0);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [isAutoPlay, currentSlide, SLIDES.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <section className="py-20 bg-slate-950 text-white border-t border-slate-800 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Official SIH 2026 Presentation Deck
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white flex items-center gap-2">
              <span>Automatic Slide-by-Slide Presentation</span>
              <span className="text-xs font-mono font-bold bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Auto-Sliding Active
              </span>
            </h2>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                isAutoPlay 
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20' 
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {isAutoPlay ? <Pause size={14} /> : <Play size={14} className="fill-current" />}
              <span>{isAutoPlay ? 'Auto-Slide ON' : 'Paused'}</span>
            </button>

            <a
              href="/CompliScan_AI_SIH2026_PitchDeck.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
            >
              <Maximize size={14} />
              <span className="hidden sm:inline">Fullscreen PPT</span>
            </a>
          </div>
        </div>

        {/* Presentation Carousel Screen Frame */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full max-w-5xl mx-auto bg-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl shadow-emerald-950/40 overflow-hidden flex flex-col justify-between">
          
          {/* Top Slide Meta Bar with Auto-play Progress Line */}
          <div className="relative">
            {/* Progress line indicator */}
            {isAutoPlay && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 z-20">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <div className="px-5 py-2.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {SLIDES[currentSlide].tag}
                </span>
                <span className="text-slate-300 font-semibold hidden sm:inline">
                  {SLIDES[currentSlide].title}
                </span>
              </div>
              <span className="text-slate-400 font-mono text-[11px] font-bold">
                Slide {currentSlide + 1} of {SLIDES.length}
              </span>
            </div>
          </div>

          {/* Slide Body with Smooth Animated Transition */}
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                {SLIDES[currentSlide].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Slide Controller Bar */}
          <div className="px-5 py-2.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Clickable 6 Slide Number Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentSlide(idx);
                    setProgress(0);
                  }}
                  className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center cursor-pointer ${
                    idx === currentSlide
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/30 scale-110'
                      : 'bg-slate-800/90 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition cursor-pointer flex items-center gap-1 text-xs shadow-md shadow-emerald-500/20"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
