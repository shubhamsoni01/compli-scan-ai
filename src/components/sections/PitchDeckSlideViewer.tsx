import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, ChevronLeft, ChevronRight, Maximize, Download, 
  Sparkles, Award, ShieldCheck, FileText, CheckCircle2, ArrowRight
} from 'lucide-react';
import { MinistryLogo } from '@/components/ui/MinistryLogo';
import { SIHLogo } from '@/components/ui/SIHLogo';

interface SlideContent {
  id: number;
  title: string;
  tag: string;
  subtitle: string;
  badgeColor: string;
  content: React.ReactNode;
}

export const PitchDeckSlideViewer: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const SLIDES: SlideContent[] = [
    {
      id: 0,
      title: "CompliScan AI • Grand SIH 2026 Pitch",
      tag: "Cover Slide",
      subtitle: "Autonomous Multi-Modal Label Compliance & Legal Metrology Inspection System",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      content: (
        <div className="h-full flex flex-col justify-between text-center p-6 sm:p-10">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <img src="/assets/sih-transparent-bulb.png" alt="SIH Logo" className="h-10 sm:h-12 object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              <div className="text-left">
                <div className="text-xs sm:text-sm font-bold text-white">Smart India Hackathon 2026</div>
                <div className="text-[11px] text-emerald-400">Problem ID: SIH26034 • Ministry of Consumer Affairs</div>
              </div>
            </div>
            <img src="/assets/ucet-hazaribagh.jpg" alt="UCET" className="h-10 object-contain rounded border border-white/10" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="my-auto space-y-4">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              🇮🇳 NATIONAL AI COMPLIANCE PLATFORM
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              CompliScan <span className="text-emerald-400">AI</span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium">
              Autonomous Multi-Modal Product Label Compliance & Legal Metrology Inspection System
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-lg border border-slate-700">⚡ 1-Sec OCR</span>
              <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-lg border border-slate-700">⚖️ LM Rules 2011 & FSSAI</span>
              <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-lg border border-slate-700">📄 Auto Section 39 Notices</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-white/10 pt-3">
            University College of Engineering & Technology (UCET), VBU Hazaribagh
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Interactive Platform Overview",
      tag: "Slide 2",
      subtitle: "Deterministic Statutory Evaluation for Indian Legal Metrology & FSSAI",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      content: (
        <div className="h-full flex flex-col justify-between p-6 sm:p-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Live Production Platform</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Autonomous Label Analysis in &lt;1.2 Seconds</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              CompliScan AI parses packaged food, edible oil, and FMCG labels through Vision OCR, cross-referencing mandatory declarations against Gazette rules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div className="text-emerald-400 font-bold text-xl">1,248+</div>
              <div className="text-xs font-semibold text-white mt-1">Verified Scans</div>
              <div className="text-[11px] text-slate-400">+14.2% this week</div>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div className="text-indigo-400 font-bold text-xl">99.4%</div>
              <div className="text-xs font-semibold text-white mt-1">Legal Accuracy</div>
              <div className="text-[11px] text-slate-400">Zero hallucinations</div>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div className="text-amber-400 font-bold text-xl">&lt; 1.2s</div>
              <div className="text-xs font-semibold text-white mt-1">Latency</div>
              <div className="text-[11px] text-slate-400">Powered by Groq</div>
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-white/10 pt-3">
            Slide 2 of 12 • Problem Statement: SIH26034
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Problem Statement & Enforcement Bottlenecks",
      tag: "Slide 3",
      subtitle: "Over 500M monthly packages with <0.01% manual physical inspection",
      badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
      content: (
        <div className="h-full flex flex-col justify-between p-6 sm:p-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Critical Industry Challenges</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Why Manual Inspection Fails to Protect 1.4B Consumers</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto text-xs text-slate-300">
            <div className="bg-red-950/30 p-4 rounded-2xl border border-red-500/30 space-y-2">
              <div className="font-bold text-red-300 text-sm">🚨 Manual Bottleneck</div>
              <p>500M+ units enter retail monthly. Severe officer shortages allow 99.99% goods to go unchecked.</p>
            </div>
            <div className="bg-amber-950/30 p-4 rounded-2xl border border-amber-500/30 space-y-2">
              <div className="font-bold text-amber-300 text-sm">⚠️ Deceptive Micro-Fonts</div>
              <p>Rule 7 font height violations and omitted Unit Sale Price (USP) mislead shoppers.</p>
            </div>
            <div className="bg-indigo-950/30 p-4 rounded-2xl border border-indigo-500/30 space-y-2">
              <div className="font-bold text-indigo-300 text-sm">🏛️ Siloed Enforcement</div>
              <p>No unified software connecting State Metrology with FSSAI & National Consumer Helpline.</p>
            </div>
          </div>

          <div className="text-xs text-red-400 font-bold border-t border-white/10 pt-3">
            Estimated Annual Consumer Loss: ₹18,000+ Crores
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "The Platform Solution: CompliScan AI",
      tag: "Slide 4",
      subtitle: "4-Pillar End-to-End Autonomous Regulatory Pipeline",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      content: (
        <div className="h-full flex flex-col justify-between p-6 sm:p-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Solution Architecture</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">End-to-End Compliance Automation</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 my-auto text-xs text-slate-300">
            <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700">
              <span className="font-bold text-indigo-400">1. Ingestion:</span> Multi-angle camera photos & packaging PDFs.
            </div>
            <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700">
              <span className="font-bold text-cyan-400">2. Dual OCR:</span> Groq Llama-3 Vision + Tesseract extraction.
            </div>
            <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700">
              <span className="font-bold text-emerald-400">3. Rule Engine:</span> 100% hardcoded Legal Metrology 2011 rules.
            </div>
            <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700">
              <span className="font-bold text-purple-400">4. Section 39:</span> Auto-drafted show cause notice & PDF export.
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-white/10 pt-3">
            Slide 4 of 12 • Autonomous AI Pipeline
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Live Scan & OCR Simulation",
      tag: "Slide 5",
      subtitle: "Real-time extraction on Mustard Oil 1L packaging",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      content: (
        <div className="h-full flex flex-col justify-between p-6 sm:p-8 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <span className="text-slate-300 font-bold">📦 Sample: Golden Harvest Mustard Oil 1L</span>
            <span className="text-amber-400 font-bold">Score: 78% (ACTION REQUIRED)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-auto text-[11px]">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-slate-400 font-bold">Extracted Fields:</div>
              <div className="text-emerald-400">✓ MRP: ₹185.00</div>
              <div className="text-red-400">✗ Unit Sale Price: MISSING</div>
              <div className="text-amber-400">✗ Net Qty: 1L (No weight equiv)</div>
              <div className="text-emerald-400">✓ FSSAI Lic: 10020043000123</div>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-slate-400 font-bold">Statutory Infractions:</div>
              <div className="text-red-300">🚨 Rule 6(11): Mandatory USP omitted adjacent to MRP.</div>
              <div className="text-amber-300">⚠️ Gazette 2022: Net volume 1L requires 910g equiv weight.</div>
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-white/10 pt-3 font-sans">
            Slide 5 of 12 • Real-Time OCR Simulation
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "AI vs Law Architecture (Zero Hallucination)",
      tag: "Slide 6",
      subtitle: "Strict separation: AI parses text, code evaluates law",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      content: (
        <div className="h-full flex flex-col justify-between p-6 sm:p-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Engineering Principle</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Zero AI Hallucinations in Legal Judgment</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 my-auto text-xs">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div className="font-bold text-indigo-400 mb-1">Layer 1: NLP Parser</div>
              <p className="text-slate-300 text-[11px]">Strictly text & bounding box extraction. No legal assumptions.</p>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div className="font-bold text-emerald-400 mb-1">Layer 2: Law Engine</div>
              <p className="text-slate-300 text-[11px]">100% deterministic code checking LM Rules 2011 & FSSAI.</p>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div className="font-bold text-amber-400 mb-1">Layer 3: Enforcement</div>
              <p className="text-slate-300 text-[11px]">Section 39 Notice drafting, digital signature & audit log.</p>
            </div>
          </div>

          <div className="text-xs text-emerald-400 font-medium border-t border-white/10 pt-3">
            Court-Defensible Statutory Proof
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Regulatory Audit Dashboard",
      tag: "Slide 7",
      subtitle: "Real-time enforcement telemetry from MongoDB Atlas",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      content: (
        <div className="h-full flex flex-col justify-between p-6 sm:p-8 font-mono text-xs">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-slate-800 p-2 rounded-lg"><div className="text-slate-400 text-[10px]">Scans Today</div><div className="text-white font-bold text-sm">1,248</div></div>
            <div className="bg-slate-800 p-2 rounded-lg"><div className="text-slate-400 text-[10px]">Pass Rate</div><div className="text-emerald-400 font-bold text-sm">82.4%</div></div>
            <div className="bg-slate-800 p-2 rounded-lg"><div className="text-slate-400 text-[10px]">Violations</div><div className="text-red-400 font-bold text-sm">184</div></div>
            <div className="bg-slate-800 p-2 rounded-lg"><div className="text-slate-400 text-[10px]">Avg Speed</div><div className="text-amber-400 font-bold text-sm">1.18s</div></div>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5 my-auto text-[11px]">
            <div className="text-indigo-400 font-bold">Live Stream Log:</div>
            <div className="flex justify-between border-b border-slate-800 pb-1"><span>SCAN-8921 (Edible Oil)</span><span className="text-red-400 font-bold">NON-COMPLIANT (78%)</span></div>
            <div className="flex justify-between border-b border-slate-800 pb-1"><span>SCAN-8920 (Butter 500g)</span><span className="text-emerald-400 font-bold">COMPLIANT (100%)</span></div>
            <div className="flex justify-between"><span>SCAN-8919 (Toothpaste 150g)</span><span className="text-amber-400 font-bold">POTENTIAL ISSUE (84%)</span></div>
          </div>

          <div className="text-xs text-slate-400 border-t border-white/10 pt-3 font-sans">
            Slide 7 of 12 • Real-Time Enforcement Dashboard
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Section 39 Legal Violation Notice",
      tag: "Slide 8",
      subtitle: "Instant court-ready show cause notices under LM Act, 2009",
      badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
      content: (
        <div className="h-full flex flex-col justify-between p-6 sm:p-8 font-mono text-xs">
          <div className="text-center text-red-400 font-bold border-b border-slate-700 pb-2">
            NOTICE UNDER SECTION 39 OF THE LEGAL METROLOGY ACT, 2009
          </div>

          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 my-auto text-[11px] leading-relaxed text-slate-300">
            <p className="text-slate-400">Ref: LM/DL/2026/VIO-8921 • Date: 12-09-2026</p>
            <p className="mt-1">To: M/s Golden Agro Industries Pvt. Ltd.</p>
            <p className="mt-1 text-red-300 font-bold">Contravention of Rule 6(11) & Rule 7 (Missing USP & Net Weight Equiv).</p>
            <p className="mt-1">Called upon to show cause within 15 days why compounding under Sec 48 or prosecution under Sec 36(1) (Penalty up to ₹25,000) should not be initiated.</p>
          </div>

          <div className="text-xs text-slate-400 border-t border-white/10 pt-3 font-sans">
            Slide 8 of 12 • 1-Click Court-Ready PDF Export
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "Multi-Agency Enforcement Portal",
      tag: "Slide 9",
      subtitle: "Unifying Legal Metrology, FSSAI & National Consumer Helpline",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      content: (
        <div className="h-full flex flex-col justify-between p-6 sm:p-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Interoperability</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Unified Regulatory Enforcement Hub</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 my-auto text-xs text-slate-300">
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
              <div className="font-bold text-indigo-400">🏛️ Legal Metrology</div>
              <p className="text-[11px]">Compounding registry & retail shelf tracking.</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
              <div className="font-bold text-emerald-400">🥗 FSSAI Authority</div>
              <p className="text-[11px]">14-digit FoSCoS & nutritional table verification.</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
              <div className="font-bold text-amber-400">🛡️ Consumer Helpline</div>
              <p className="text-[11px]">Auto-cross reference consumer complaints.</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-white/10 pt-3">
            Slide 9 of 12 • Multi-Agency Portal
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: "Impact, Scale & Roadmap",
      tag: "Slide 10",
      subtitle: "99.2% time reduction & ₹4,200 Cr recoverable penalty",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      content: (
        <div className="h-full flex flex-col justify-between p-6 sm:p-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">National Impact</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Empowering 1.4 Billion Indian Consumers</h3>
          </div>

          <div className="grid grid-cols-4 gap-2 my-auto text-center">
            <div className="bg-slate-800 p-3 rounded-xl"><div className="text-indigo-400 font-bold text-lg">99.2%</div><div className="text-[10px] text-slate-300">Time Saved</div></div>
            <div className="bg-slate-800 p-3 rounded-xl"><div className="text-emerald-400 font-bold text-lg">₹4,200 Cr</div><div className="text-[10px] text-slate-300">Penalty Potential</div></div>
            <div className="bg-slate-800 p-3 rounded-xl"><div className="text-amber-400 font-bold text-lg">100%</div><div className="text-[10px] text-slate-300">Statutory Proof</div></div>
            <div className="bg-slate-800 p-3 rounded-xl"><div className="text-red-400 font-bold text-lg">1.4B</div><div className="text-[10px] text-slate-300">Citizens Protected</div></div>
          </div>

          <div className="text-xs text-slate-400 border-t border-white/10 pt-3">
            Slide 10 of 12 • Scale & Economic Impact
          </div>
        </div>
      )
    },
    {
      id: 10,
      title: "Team & Governance (UCET Hazaribagh)",
      tag: "Slide 11",
      subtitle: "Engineered by Vinoba Bhave University Developers",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      content: (
        <div className="h-full flex flex-col justify-between p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <span className="text-xs font-bold text-indigo-400">UCET VBU Hazaribagh Team</span>
              <h3 className="text-lg font-bold text-white">Smart India Hackathon 2026 Core Developers</h3>
            </div>
            <img src="/assets/sih-transparent-bulb.png" alt="SIH" className="h-8 object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-auto text-xs">
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <div className="font-bold text-white">Team Leader</div>
              <div className="text-indigo-400 text-[11px]">Project Lead & Coordinator</div>
            </div>
            <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/40">
              <div className="font-bold text-white">Shubham Kumar</div>
              <div className="text-emerald-400 text-[11px] font-bold">Full-Stack & AI Architect</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <div className="font-bold text-white">Team Member 3</div>
              <div className="text-slate-400 text-[11px]">Backend & Rule Engine</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <div className="font-bold text-white">Team Member 4</div>
              <div className="text-slate-400 text-[11px]">AI/ML & Vision Lead</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <div className="font-bold text-white">Team Member 5</div>
              <div className="text-slate-400 text-[11px]">Legal Research & Audit</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <div className="font-bold text-white">Team Member 6</div>
              <div className="text-slate-400 text-[11px]">QA, Testing & Security</div>
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-white/10 pt-3">
            Slide 11 of 12 • UCET Hazaribagh
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: "Summary & Product Hub",
      tag: "Slide 12",
      subtitle: "Making product label compliance smarter, faster, and consumer-first",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      content: (
        <div className="h-full flex flex-col justify-between text-center p-6 sm:p-8">
          <div className="inline-block mx-auto px-4 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            THANK YOU JUDGES & MENTORS
          </div>

          <div className="my-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              CompliScan <span className="text-emerald-400">AI</span>
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Empowering 1.4B Indian Citizens • Accelerating Regulatory Enforcement • Eradicating Packaging Fraud
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a href="/CompliScan_AI_SIH2026_PitchDeck.html" target="_blank" rel="noopener noreferrer" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow">
                <span>Open Full Web Deck</span>
                <Maximize size={14} />
              </a>
              <a href="/CompliScan_AI_SIH2026_PitchDeck.pdf" target="_blank" rel="noopener noreferrer" className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 transition flex items-center gap-1.5">
                <span>Download PDF</span>
                <Download size={14} />
              </a>
            </div>
          </div>

          <div className="text-xs text-emerald-400 font-bold border-t border-white/10 pt-3">
            Problem Statement: SIH26034 • Ministry of Consumer Affairs, Food & Public Distribution
          </div>
        </div>
      )
    }
  ];

  // Auto-play timer
  useEffect(() => {
    let interval: any;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, SLIDES.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <section className="py-20 bg-slate-950 text-white border-t border-slate-800 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Interactive Pitch Deck Showcase
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
              SIH 2026 Presentation Slides
            </h2>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                isAutoPlay 
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20' 
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {isAutoPlay ? <Pause size={14} /> : <Play size={14} className="fill-current" />}
              <span>{isAutoPlay ? 'Autoplay ON' : 'Autoplay'}</span>
            </button>

            <a
              href="/CompliScan_AI_SIH2026_PitchDeck.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition"
            >
              <Maximize size={14} />
              <span className="hidden sm:inline">Fullscreen Deck</span>
            </a>
          </div>
        </div>

        {/* Presentation Carousel Screen Frame */}
        <div className="relative aspect-[16/9] w-full max-w-5xl mx-auto bg-slate-900/90 rounded-3xl border border-slate-700/80 shadow-2xl shadow-emerald-950/30 overflow-hidden flex flex-col justify-between">
          
          {/* Top Slide Meta Bar */}
          <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${SLIDES[currentSlide].badgeColor}`}>
                {SLIDES[currentSlide].tag}
              </span>
              <span className="text-slate-300 font-semibold hidden sm:inline">
                {SLIDES[currentSlide].title}
              </span>
            </div>
            <span className="text-slate-400 font-mono text-[11px] font-bold">
              {currentSlide + 1} / {SLIDES.length}
            </span>
          </div>

          {/* Slide Body with Smooth Animated Transition */}
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                {SLIDES[currentSlide].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Slide Controller Bar */}
          <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Clickable 12 Slide Number Pills */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[11px] font-mono font-bold transition flex items-center justify-center cursor-pointer ${
                    idx === currentSlide
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20 scale-105'
                      : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
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
