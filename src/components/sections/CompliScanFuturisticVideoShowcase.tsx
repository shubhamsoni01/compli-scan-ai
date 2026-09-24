import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, 
  Scan, AlertTriangle, ShieldCheck, FileText, Cpu, CheckCircle2, 
  Sparkles, Layers, Eye, Zap, RefreshCw, ChevronRight, Video, Flame
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface DemoModule {
  id: string;
  tabLabel: string;
  icon: any;
  title: string;
  badge: string;
  badgeColor: string;
  productName: string;
  productCategory: string;
  statutoryRule: string;
  description: string;
  whyNeeded: string;
  techStack: string[];
  detections: {
    label: string;
    value: string;
    status: 'PASS' | 'FAIL' | 'SCANNING';
    coords: { top: string; left: string; width: string; height: string };
    ruleRef: string;
  }[];
  overallStatus: 'VIOLATION DETECTED' | 'FULLY COMPLIANT' | 'CRITICAL NON-COMPLIANCE';
  penaltyAmount?: string;
  liveStats: {
    latency: string;
    accuracy: string;
    violationsCount: number;
    fps: string;
  };
}

const DEMO_MODULES: DemoModule[] = [
  {
    id: 'vision-ocr',
    tabLabel: 'AI Vision OCR Bounding Boxes',
    icon: Scan,
    title: 'AI-Powered Vision OCR & Multi-Field Detection',
    badge: 'Dual-Engine Computer Vision',
    badgeColor: 'from-cyan-500 to-blue-500',
    productName: 'Kachi Ghani Mustard Oil (1 Litre Pack)',
    productCategory: 'Edible Oils & Fats',
    statutoryRule: 'Legal Metrology (Packaged Commodities) Rules, 2011 • Rule 6(1)',
    description: 'AI camera feed live packaging se sabhi 8+ mandatory declarations ko extract karta hai. Glare, curvature aur wrinkled surface ko OpenCV se pre-process karke sub-second latency mein read karta hai.',
    whyNeeded: 'Manual inspection mein ghanton lagte hain aur chhota text chhoot jata hai. AI 1.2 second mein 100% accuracy se MRP, Batch, Dates aur FSSAI scan kar leta hai.',
    techStack: ['OpenCV Preprocessing', 'Llama-3.2 Vision', 'Tesseract OCR', 'Dual-Engine Pipeline', 'Python'],
    detections: [
      { label: 'MRP (Incl. All Taxes)', value: '₹185.00', status: 'PASS', coords: { top: '22%', left: '18%', width: '38%', height: '14%' }, ruleRef: 'Rule 6(1)(e)' },
      { label: 'Unit Sale Price (USP)', value: 'MISSING (No ₹/ml declared)', status: 'FAIL', coords: { top: '38%', left: '18%', width: '48%', height: '14%' }, ruleRef: 'Rule 6(11) Mandate' },
      { label: 'Net Quantity', value: '1 L (Equiv Mass Missing)', status: 'FAIL', coords: { top: '54%', left: '18%', width: '40%', height: '13%' }, ruleRef: 'Rule 13 Vol/Weight' },
      { label: 'FSSAI License No.', value: '10020043000123 (Valid)', status: 'PASS', coords: { top: '70%', left: '18%', width: '55%', height: '14%' }, ruleRef: 'FoSCoS 14-Digit' },
    ],
    overallStatus: 'VIOLATION DETECTED',
    penaltyAmount: '₹25,000 under Section 39',
    liveStats: { latency: '0.84s', accuracy: '99.4%', violationsCount: 2, fps: '42 FPS' }
  },
  {
    id: 'usp-violation',
    tabLabel: 'Unit Sale Price (USP) Check',
    icon: AlertTriangle,
    title: 'Rule 6(11) Unit Sale Price (₹/g or ₹/ml) Checker',
    badge: 'Consumer Protection Math',
    badgeColor: 'from-amber-500 to-rose-500',
    productName: 'Crunchy Choco Biscuit Family Pack (350g)',
    productCategory: 'Bakery & Confectionery',
    statutoryRule: 'Legal Metrology Rules, 2011 • Rule 6(11) Gazette Amendment',
    description: 'Har packaged commodity par MRP ke sath Unit Sale Price (e.g. ₹0.35/g ya ₹35/100g) hona mandatory hai taaki consumer easily compare kar sake.',
    whyNeeded: 'Companies often chhota pack mahanga bechti hain aur bada pack sasta hone ka deceptive claim karti hain. USP check aam naagrik ko price transparency deta hai.',
    techStack: ['Deterministic Math Engine', 'Zero Hallucination Rules', 'Regex Parser', 'Gazette Rule 6(11)'],
    detections: [
      { label: 'MRP Printed', value: '₹120.00', status: 'PASS', coords: { top: '24%', left: '20%', width: '35%', height: '13%' }, ruleRef: 'Rule 6(1)(e)' },
      { label: 'Net Weight Declared', value: '350 g', status: 'PASS', coords: { top: '40%', left: '20%', width: '32%', height: '13%' }, ruleRef: 'Rule 12 Standard Unit' },
      { label: 'Calculated Unit Price', value: '₹0.34 per g', status: 'PASS', coords: { top: '56%', left: '20%', width: '45%', height: '13%' }, ruleRef: 'AI Math Auto-Check' },
      { label: 'Physical Print On Pack', value: 'NOT FOUND ON FRONT/BACK', status: 'FAIL', coords: { top: '72%', left: '20%', width: '58%', height: '14%' }, ruleRef: 'Violation of Rule 6(11)' }
    ],
    overallStatus: 'CRITICAL NON-COMPLIANCE',
    penaltyAmount: '₹20,000 Show Cause Notice',
    liveStats: { latency: '0.41s', accuracy: '100%', violationsCount: 1, fps: '60 FPS' }
  },
  {
    id: 'font-ratio',
    tabLabel: 'Rule 7 Font-Height Ratio',
    icon: Cpu,
    title: 'Principal Display Panel (PDP) & Font Height Ratio',
    badge: 'Micro-Pixel Measurement',
    badgeColor: 'from-purple-500 to-indigo-500',
    productName: 'Herbal Fairness Face Cream (50g Tube)',
    productCategory: 'Cosmetics & Personal Care',
    statutoryRule: 'Legal Metrology (PC) Rules • Rule 7 Table-I & Table-II',
    description: 'Packaging surface area ke proportion mein mandatory declarations ka font size calculate karta hai. Agar area >100 cm² hai toh font ≥2.0mm hona lazmi hai.',
    whyNeeded: 'Brands consumer ki nazron se bachne ke liye fine-print mein warnings aur ingredients likhte hain. Ye algorithm unhe pakadta hai.',
    techStack: ['Computer Vision Aspect Ratio', 'PDP Area Integration', 'Pixel-to-Millimeter Mapping', 'Rule 7 Engine'],
    detections: [
      { label: 'PDP Surface Area', value: '142.5 cm²', status: 'PASS', coords: { top: '22%', left: '22%', width: '42%', height: '13%' }, ruleRef: 'Rule 7(1) Calc' },
      { label: 'Statutory Min Font Req.', value: '≥ 2.0 mm height', status: 'PASS', coords: { top: '38%', left: '22%', width: '48%', height: '13%' }, ruleRef: 'Table-I Spec' },
      { label: 'Actual Measured Font', value: '1.25 mm (FAILED ❌)', status: 'FAIL', coords: { top: '54%', left: '22%', width: '52%', height: '15%' }, ruleRef: '37.5% Below Minimum' },
      { label: 'Manufacturer Details', value: 'Printed (Compliant)', status: 'PASS', coords: { top: '72%', left: '22%', width: '50%', height: '13%' }, ruleRef: 'Rule 6(1)(a)' }
    ],
    overallStatus: 'VIOLATION DETECTED',
    penaltyAmount: '₹25,000 (Sub-Standard Font)',
    liveStats: { latency: '0.62s', accuracy: '98.8%', violationsCount: 1, fps: '48 FPS' }
  },
  {
    id: 'fssai-foscos',
    tabLabel: 'FSSAI License & FoSCoS Validator',
    icon: ShieldCheck,
    title: 'FSSAI 14-Digit License Checksum & Veg/Non-Veg Logo',
    badge: 'National FoSCoS Security',
    badgeColor: 'from-emerald-500 to-teal-500',
    productName: 'NutriPure Almond Milk Beverage (200ml)',
    productCategory: 'Dairy & Beverages',
    statutoryRule: 'FSSAI (Labelling and Display) Regulations, 2020',
    description: '14-digit FSSAI License checksum verify karta hai, manufacturer details check karta hai, aur Veg Green Dot / Non-Veg Brown Triangle symbol audit karta hai.',
    whyNeeded: 'Market mein fake FSSAI numbers aur wrong dietary symbols se health risk hota hai. Direct national portal lookup fraud roktata hai.',
    techStack: ['14-Digit Checksum Algorithm', 'FoSCoS API Gateway', 'Green Dot Shape Detector', 'FSSAI 2020 Rules'],
    detections: [
      { label: 'FSSAI Number Scan', value: '10018022007891', status: 'PASS', coords: { top: '24%', left: '18%', width: '45%', height: '13%' }, ruleRef: '14-Digit Checksum ✓' },
      { label: 'Veg/Non-Veg Symbol', value: 'Green Square + Dot', status: 'PASS', coords: { top: '40%', left: '18%', width: '48%', height: '13%' }, ruleRef: 'FSSAI Color Standard' },
      { label: 'Best Before / Exp Date', value: 'EXP: 12/2026 (Fresh)', status: 'PASS', coords: { top: '56%', left: '18%', width: '42%', height: '13%' }, ruleRef: 'Rule 6(1)(d)' },
      { label: 'Nutritional Facts Table', value: '100g Breakdown Present', status: 'PASS', coords: { top: '72%', left: '18%', width: '55%', height: '13%' }, ruleRef: 'FSSAI Schedule-I' }
    ],
    overallStatus: 'FULLY COMPLIANT',
    penaltyAmount: '₹0 • Safe For Market Sale',
    liveStats: { latency: '0.38s', accuracy: '99.9%', violationsCount: 0, fps: '60 FPS' }
  },
  {
    id: 'section-39-notice',
    tabLabel: 'Section 39 Legal Notice Gen',
    icon: FileText,
    title: 'Instant Section 39 Show Cause Notice & Challan Generator',
    badge: 'Enforcement Automation',
    badgeColor: 'from-red-500 to-amber-600',
    productName: 'Imported Protein Whey Isolate (1kg Tub)',
    productCategory: 'Nutraceuticals',
    statutoryRule: 'Legal Metrology Act, 2009 • Section 39 & Section 48 Compounding',
    description: 'Violation detect hote hi officer ke liye 1-second mein official court-ready Show Cause Notice PDF banata hai with cryptographic evidence hash aur auto-calculated penalty.',
    whyNeeded: 'Inspection officers ka ghanton ka paperwork aur manual typing khatam hota hai. Direct statutory penalty trigger hoti hai.',
    techStack: ['PDFKit Engine', 'Digital Signature (DSC)', 'Cryptographic Hash', 'Section 39 Legal Template', 'QR Dossier'],
    detections: [
      { label: 'Notice Reference No.', value: 'LM/MH/2026/VIO-4412', status: 'PASS', coords: { top: '22%', left: '20%', width: '50%', height: '13%' }, ruleRef: 'Official Case Dossier' },
      { label: 'Contravention Citing', value: 'Rule 6(11) & Section 39', status: 'FAIL', coords: { top: '38%', left: '20%', width: '54%', height: '14%' }, ruleRef: 'Charge Established' },
      { label: 'Compounding Penalty', value: '₹25,000 (1st Offence)', status: 'FAIL', coords: { top: '54%', left: '20%', width: '48%', height: '14%' }, ruleRef: 'Sec 48 Statutory Math' },
      { label: 'Digital Legal Signature', value: 'Verified Controller DSC', status: 'PASS', coords: { top: '70%', left: '20%', width: '52%', height: '13%' }, ruleRef: 'Aadhaar e-Sign' }
    ],
    overallStatus: 'VIOLATION DETECTED',
    penaltyAmount: '₹25,000 Demand Notice Generated',
    liveStats: { latency: '0.95s', accuracy: '100%', violationsCount: 2, fps: '40 FPS' }
  }
];

export const CompliScanFuturisticVideoShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('vision-ocr');
  const [viewMode, setViewMode] = useState<'simulation' | 'video'>('simulation');
  const [isScanningActive, setIsScanningActive] = useState<boolean>(true);
  const [scanLaserPos, setScanLaserPos] = useState<number>(10);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentModule = DEMO_MODULES.find(m => m.id === activeTab) || DEMO_MODULES[0];

  // Laser scanner animation loop in simulation mode
  useEffect(() => {
    if (viewMode !== 'simulation' || !isScanningActive) return;
    const interval = setInterval(() => {
      setScanLaserPos(prev => (prev >= 85 ? 15 : prev + 1.5));
    }, 50);
    return () => clearInterval(interval);
  }, [viewMode, isScanningActive]);

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (isPlayingVideo) {
      videoRef.current.pause();
      setIsPlayingVideo(false);
    } else {
      videoRef.current.play();
      setIsPlayingVideo(true);
    }
  };

  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-b border-emerald-500/20">
      {/* Background Futuristic Cyber Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-4 shadow-lg shadow-emerald-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles size={14} className="text-amber-400" />
            <span>LIVE AI DETECTION & VIDEO SHOWCASE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight mb-4 text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text">
            See How CompliScan AI Detects Every Packaging Violation
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Switch between modules below to watch the live laser-vision detection stream or the full SIH 2026 pitch video walkthrough.
          </p>
        </div>

        {/* Top Feature Switcher Tabs (Just like SIH 2024 Reference, but with high-end glassmorphism) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {DEMO_MODULES.map((module) => {
            const Icon = module.icon;
            const isActive = activeTab === module.id;
            return (
              <button
                key={module.id}
                onClick={() => {
                  setActiveTab(module.id);
                  setIsScanningActive(true);
                }}
                className={cn(
                  'flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 border',
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 border-emerald-400 shadow-xl shadow-emerald-500/25 scale-105'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-white/10 hover:border-emerald-500/40 hover:text-white'
                )}
              >
                <Icon size={16} className={isActive ? 'text-slate-950' : 'text-emerald-400'} />
                <span>{module.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Mode Toggle Switcher: [ ⚡ Live Interactive Cyber HUD ] vs [ 🎬 Full HD SIH Walkthrough Video ] */}
        <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-900/90 border border-white/10 rounded-2xl p-3 mb-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              DISPLAY ENGINE:
            </span>
            <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setViewMode('simulation')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  viewMode === 'simulation'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <Zap size={14} />
                <span>Live AI Cyber-HUD Simulator</span>
              </button>
              <button
                onClick={() => setViewMode('video')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  viewMode === 'video'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <Video size={14} />
                <span>SIH Demo Video (/sih.mp4)</span>
              </button>
            </div>
          </div>

          {/* Live Stream Telemetry Pills */}
          <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold">{currentModule.liveStats.fps}</span>
            </div>
            <div className="hidden sm:block text-slate-500">|</div>
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-slate-400">Latency:</span>
              <span className="text-cyan-400 font-bold">{currentModule.liveStats.latency}</span>
            </div>
            <div className="text-slate-500">|</div>
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Accuracy:</span>
              <span className="text-amber-400 font-bold">{currentModule.liveStats.accuracy}</span>
            </div>
          </div>
        </div>

        {/* Center Main Stage (Ultra-Clean Video & Live HUD Screen) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left / Center 8-Cols: Interactive Live Viewport */}
          <div className="lg:col-span-8 flex flex-col">
            <Card className="relative flex-1 min-h-[440px] sm:min-h-[500px] rounded-3xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950 shadow-2xl shadow-emerald-500/10 p-0 flex flex-col">
              
              {/* Top Viewport Status Bar */}
              <div className="px-5 py-3 bg-slate-900/90 border-b border-white/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  </div>
                  <span className="text-slate-300 font-bold ml-2">
                    {viewMode === 'simulation' ? `[FEED-01] ${currentModule.productName}` : 'CompliScan AI • Walkthrough Video'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'px-2.5 py-0.5 rounded-full font-bold text-[11px]',
                    currentModule.overallStatus === 'FULLY COMPLIANT'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  )}>
                    {currentModule.overallStatus}
                  </span>
                </div>
              </div>

              {/* Viewport Content */}
              <div className="relative flex-1 bg-gradient-to-b from-[#060c16] via-[#050911] to-[#04070d] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                
                {/* VIDEO MODE */}
                {viewMode === 'video' ? (
                  <div className="relative w-full h-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center group">
                    <video
                      ref={videoRef}
                      src="/sih.mp4"
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-cover"
                      onPlay={() => setIsPlayingVideo(true)}
                      onPause={() => setIsPlayingVideo(false)}
                    />
                    
                    {/* Big Overlay Play button */}
                    {!isPlayingVideo && (
                      <div 
                        onClick={toggleVideoPlayback}
                        className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center cursor-pointer group-hover:bg-black/40 transition-all"
                      >
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/50 hover:scale-110 transition-transform">
                          <Play size={34} className="translate-x-0.5 fill-current" />
                        </div>
                        <span className="mt-3 text-xs font-mono font-bold uppercase tracking-widest text-white bg-slate-900/80 px-4 py-1.5 rounded-full border border-white/20">
                          Click To Play Full Video
                        </span>
                      </div>
                    )}

                    {/* Floating Video Controls */}
                    <div className="absolute bottom-3 left-3 right-3 px-4 py-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-3">
                        <button onClick={toggleVideoPlayback} className="text-emerald-400 hover:text-emerald-300">
                          {isPlayingVideo ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        <button onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.muted = !isMuted;
                            setIsMuted(!isMuted);
                          }
                        }} className="text-slate-300 hover:text-white">
                          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <span className="text-[11px] font-mono text-slate-400">SIH 2026 Walkthrough</span>
                      </div>
                      <button 
                        onClick={() => {
                          if (videoRef.current) {
                            if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
                          }
                        }} 
                        className="text-slate-400 hover:text-white"
                      >
                        <Maximize2 size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  
                  /* SIMULATION MODE: Interactive Cyber HUD Packaging Scanner */
                  <div className="relative w-full max-w-lg aspect-4/3 sm:aspect-16/10 rounded-2xl border border-cyan-500/30 bg-slate-900/80 shadow-2xl overflow-hidden flex items-center justify-center p-4">
                    
                    {/* Background Product Mockup Graphic */}
                    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl border border-white/10 p-5 flex flex-col justify-between overflow-hidden">
                      
                      {/* Product Header inside mockup */}
                      <div className="flex items-start justify-between border-b border-white/10 pb-3">
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                            TEST SAMPLE #0{DEMO_MODULES.findIndex(m => m.id === activeTab) + 1}
                          </span>
                          <h4 className="text-base font-bold text-white leading-snug">{currentModule.productName}</h4>
                          <span className="text-[11px] text-slate-400">{currentModule.productCategory}</span>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                          AI
                        </div>
                      </div>

                      {/* Mockup Body with Dynamic Bounding Boxes */}
                      <div className="relative flex-1 my-3">
                        {currentModule.detections.map((det, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                            style={{
                              position: 'absolute',
                              top: det.coords.top,
                              left: det.coords.left,
                              width: det.coords.width,
                              height: det.coords.height,
                            }}
                            className={cn(
                              'rounded-lg border-2 p-1.5 flex items-center justify-between text-xs font-mono transition-all backdrop-blur-xs',
                              det.status === 'PASS'
                                ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                                : 'border-red-500 bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.35)] animate-pulse'
                            )}
                          >
                            {/* Corner Tech Crosshairs */}
                            <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-current" />
                            <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-current" />

                            <div className="truncate pr-1">
                              <span className="block text-[9px] text-slate-300 font-bold truncate">{det.label}</span>
                              <span className={cn('text-[11px] font-black truncate block', det.status === 'PASS' ? 'text-emerald-300' : 'text-red-300')}>
                                {det.value}
                              </span>
                            </div>

                            <span className={cn(
                              'text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0',
                              det.status === 'PASS' ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'
                            )}>
                              {det.status}
                            </span>
                          </motion.div>
                        ))}

                        {/* Moving Laser Sweep Line */}
                        <motion.div
                          style={{ top: `${scanLaserPos}%` }}
                          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] z-20 pointer-events-none"
                        >
                          <span className="absolute right-2 -top-2.5 text-[9px] font-mono text-cyan-300 bg-slate-950 px-1.5 py-0.2 rounded border border-cyan-500/40">
                            SCANNING • {Math.round(scanLaserPos)}%
                          </span>
                        </motion.div>
                      </div>

                      {/* Mockup Footer */}
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>GAZETTE AUDIT: {currentModule.detections.filter(d => d.status === 'PASS').length}/{currentModule.detections.length} PASSED</span>
                        <span className={currentModule.overallStatus === 'FULLY COMPLIANT' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {currentModule.penaltyAmount || 'ZERO PENALTY'}
                        </span>
                      </div>
                    </div>

                    {/* HUD Viewfinder Grid Borders */}
                    <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-emerald-400 pointer-events-none" />
                    <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-emerald-400 pointer-events-none" />
                    <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-emerald-400 pointer-events-none" />
                    <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-emerald-400 pointer-events-none" />
                  </div>
                )}
              </div>

              {/* Bottom Interactive Trigger Bar */}
              <div className="px-5 py-3 bg-slate-900 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsScanningActive(!isScanningActive)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 border border-white/10"
                  >
                    <RefreshCw size={12} className={isScanningActive ? 'animate-spin' : ''} />
                    <span>{isScanningActive ? 'Pause Laser' : 'Resume Laser'}</span>
                  </button>
                  <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                    Module ID: <code className="text-emerald-400">{currentModule.id}</code>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Need this in official report?</span>
                  <a
                    href="/scan"
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs flex items-center gap-1 hover:brightness-110 shadow-md"
                  >
                    <span>Try Real Product Scan</span>
                    <ChevronRight size={14} />
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* Right 4-Cols: Deep Description & Tech Stack Cards (Just like reference site, but detailed) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            
            {/* Description Card */}
            <Card className="p-5 bg-slate-900/90 border border-white/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <currentModule.icon size={16} />
                </span>
                <h3 className="text-base font-bold text-white font-heading">{currentModule.title}</h3>
              </div>

              <div className="mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
                  🏛️ STATUTORY REGULATION:
                </span>
                <p className="text-xs text-slate-300 font-semibold bg-slate-950/80 p-2.5 rounded-xl border border-white/5">
                  {currentModule.statutoryRule}
                </p>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                <div>
                  <strong className="text-white block mb-0.5">🔍 How It Works:</strong>
                  <p className="text-slate-400">{currentModule.description}</p>
                </div>
                <div>
                  <strong className="text-white block mb-0.5">🎯 Why It Is Needed:</strong>
                  <p className="text-slate-400">{currentModule.whyNeeded}</p>
                </div>
              </div>
            </Card>

            {/* Technologies Used Badges */}
            <Card className="p-5 bg-slate-900/90 border border-white/10 rounded-2xl">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-3 flex items-center gap-1.5">
                <Cpu size={14} />
                <span>TECHNOLOGIES & ALGORITHMS USED:</span>
              </span>
              
              <div className="flex flex-wrap gap-2">
                {currentModule.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-950 text-emerald-300 border border-emerald-500/30 shadow-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>

            {/* Quick Summary / Status */}
            <Card className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">ENFORCEMENT ACTION:</span>
                <span className="text-xs font-bold text-white">{currentModule.penaltyAmount || 'Market Cleared'}</span>
              </div>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 size={18} />
              </span>
            </Card>
          </div>
        </div>

      </div>
    </section>
  );
};
