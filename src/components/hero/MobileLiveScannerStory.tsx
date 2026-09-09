import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, Sparkles, Scan, 
  Camera, Zap, Award, ArrowRight, Check, AlertTriangle
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface StoryProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  mrp: string;
  netQty: string;
  licence: string;
  expiry: string;
  score: number;
  icon: string;
  gradient: string;
  accentColor: string;
  certBadge: string;
  standardNote: string;
}

const STORY_PRODUCTS: StoryProduct[] = [
  {
    id: 'snack',
    name: 'Classic Masala Crunch',
    category: 'Snacks & Packaged Food',
    brand: 'DESI DELIGHTS',
    mrp: '₹ 20.00',
    netQty: '70 g',
    licence: '10012011000168',
    expiry: 'BEST BEFORE 6 MONTHS',
    score: 98,
    icon: '🍜',
    gradient: 'from-amber-600 via-red-600 to-amber-800',
    accentColor: '#f59e0b',
    certBadge: 'FSSAI & LM 2011 Passed',
    standardNote: 'Department of Consumer Affairs Compliant',
  },
  {
    id: 'juice',
    name: 'Pure Mango Nectar Juice',
    category: 'Beverages',
    brand: 'NATURE FRESH',
    mrp: '₹ 45.00',
    netQty: '250 ml',
    licence: '10819003000452',
    expiry: 'USE BY: NOV 2026',
    score: 96,
    icon: '🧃',
    gradient: 'from-yellow-500 via-orange-500 to-amber-700',
    accentColor: '#eab308',
    certBadge: 'Food Safety 2020 Validated',
    standardNote: 'FSSAI Labelling Standard Compliant',
  },
  {
    id: 'lotion',
    name: 'Herbal Dermo Care Lotion',
    category: 'Cosmetics',
    brand: 'AYUR BOTANICS',
    mrp: '₹ 199.00',
    netQty: '150 ml',
    licence: 'COS/HP/2026/089',
    expiry: 'EXP: 24 MONTHS',
    score: 99,
    icon: '🧴',
    gradient: 'from-emerald-600 via-teal-600 to-emerald-900',
    accentColor: '#10b981',
    certBadge: 'CDSCO & BIS Approved',
    standardNote: 'Cosmetics Rules 2020 Compliant',
  },
];

export const MobileLiveScannerStory: React.FC = () => {
  const [productIndex, setProductIndex] = useState(0);
  const [scanStage, setScanStage] = useState<'aiming' | 'scanning' | 'detecting' | 'result'>('aiming');

  const currentProduct = STORY_PRODUCTS[productIndex];

  // Story cycle: Aiming (1.2s) -> Scanning (1.6s) -> Detecting (1.4s) -> Result (2.8s) -> Next Product
  useEffect(() => {
    let t1: any, t2: any, t3: any, t4: any;

    setScanStage('aiming');

    t1 = setTimeout(() => {
      setScanStage('scanning');
    }, 1100);

    t2 = setTimeout(() => {
      setScanStage('detecting');
    }, 2700);

    t3 = setTimeout(() => {
      setScanStage('result');
    }, 4100);

    t4 = setTimeout(() => {
      setProductIndex((prev) => (prev + 1) % STORY_PRODUCTS.length);
    }, 7200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [productIndex]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none">
      {/* Top Interactive Story Progress Bar */}
      <div className="z-30 mb-3 flex items-center justify-between w-full max-w-md px-4 py-2 rounded-full bg-slate-900/90 dark:bg-slate-900/95 border border-emerald-500/30 shadow-xl backdrop-blur-xl text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white">
            {scanStage === 'aiming' && '1. Pointing Camera at Package...'}
            {scanStage === 'scanning' && '2. AI Laser Scanning Label...'}
            {scanStage === 'detecting' && '3. Extracting Statutory Fields...'}
            {scanStage === 'result' && '4. Instant Verified Result! 🎉'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {STORY_PRODUCTS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setProductIndex(idx)}
              className={cn(
                "w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-bold transition-all cursor-pointer",
                productIndex === idx
                  ? "bg-emerald-500 text-slate-950 scale-110 shadow-md shadow-emerald-500/30"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              )}
            >
              {p.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Main Glassmorphic Arena (Product + Smartphone Scanner) */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-[#070b12] border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 backdrop-blur-2xl p-4 sm:p-6">
        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 left-10 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center min-h-[360px]">
          {/* 
            -------------------------------------------------------------
            LEFT: THE PHYSICAL PRODUCT PACKAGE (Floating & Being Scanned)
            -------------------------------------------------------------
          */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProduct.id}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -15 }}
                transition={{ duration: 0.4 }}
                className={cn(
                  "relative w-40 sm:w-44 h-56 sm:h-60 rounded-2xl p-3 flex flex-col justify-between text-white shadow-2xl border border-white/20 overflow-hidden",
                  "bg-gradient-to-br",
                  currentProduct.gradient
                )}
                style={{
                  boxShadow: `0 20px 40px -10px ${currentProduct.accentColor}55`,
                }}
              >
                {/* Metallic Foil Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/30 pointer-events-none" />

                {/* Packaging Header */}
                <div className="relative z-10">
                  <span className="text-[9px] font-mono tracking-widest text-amber-200 font-black uppercase">
                    {currentProduct.brand}
                  </span>
                  <h4 className="text-sm font-black leading-tight mt-0.5 font-heading">
                    {currentProduct.name}
                  </h4>
                  <span className="text-[9px] text-white/80">{currentProduct.category}</span>
                </div>

                {/* Packaging Center Graphic */}
                <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2">
                  <span className="text-3xl filter drop-shadow-md">{currentProduct.icon}</span>
                  <span className="text-[8px] font-bold text-white/90 bg-black/40 px-2 py-0.5 rounded-full mt-1">
                    100% QUALITY GUARANTEE
                  </span>
                </div>

                {/* Mandatory Label Details on Product */}
                <div className="relative z-10 bg-black/50 backdrop-blur-sm rounded-lg p-1.5 text-[8px] space-y-0.5 border border-white/10">
                  <div className="flex justify-between font-bold">
                    <span className="text-amber-300">MRP: {currentProduct.mrp}</span>
                    <span className="text-cyan-300">NET: {currentProduct.netQty}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span className="truncate">LIC: {currentProduct.licence}</span>
                    <span className="text-green-400 font-bold">● VEG</span>
                  </div>
                </div>

                {/* Real-time Laser Line on Product (When in 'scanning' stage) */}
                {scanStage === 'scanning' && (
                  <motion.div
                    initial={{ top: '0%' }}
                    animate={{ top: '90%' }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 z-20 pointer-events-none"
                  >
                    <div className="h-[2px] w-full bg-cyan-300 shadow-[0_0_12px_#06b6d4]" />
                    <div className="h-6 -mt-3 w-full bg-cyan-400/20 blur-sm" />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Platform shadow */}
            <div className="w-32 h-3 rounded-full bg-emerald-500/20 blur-md mt-2" />
          </div>

          {/* 
            -------------------------------------------------------------
            CENTER: HOLOGRAPHIC SCAN RAYS (Connecting Phone to Product)
            -------------------------------------------------------------
          */}
          <div className="hidden sm:flex sm:col-span-1 items-center justify-center">
            <motion.div
              animate={{
                opacity: scanStage === 'scanning' || scanStage === 'detecting' ? [0.4, 1, 0.4] : 0.2,
                scale: scanStage === 'scanning' ? [0.9, 1.1, 0.9] : 1,
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-emerald-400 flex flex-col items-center"
            >
              <Zap size={20} className={scanStage === 'scanning' ? 'text-cyan-400 animate-pulse' : 'text-slate-600'} />
            </motion.div>
          </div>

          {/* 
            -------------------------------------------------------------
            RIGHT: THE SMARTPHONE CAMERA SCANNER & INSTANT RESULT SCREEN
            -------------------------------------------------------------
          */}
          <div className="sm:col-span-6 flex justify-center">
            {/* Realistic Smartphone Shell */}
            <div className="relative w-64 sm:w-68 h-[340px] rounded-[32px] bg-slate-950 border-[3.5px] border-slate-700 shadow-2xl p-2.5 flex flex-col justify-between overflow-hidden">
              {/* Dynamic Island / Speaker Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-30 flex items-center justify-end px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {/* Phone Screen Canvas */}
              <div className="relative w-full h-full rounded-[24px] bg-[#0b1120] overflow-hidden flex flex-col justify-between p-3 border border-white/5">
                {/* Camera Viewfinder Top Bar */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-3 relative z-10">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Camera size={11} />
                    <span>CompliScan Lens</span>
                  </span>
                  <span className="text-[9px] bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-300 border border-emerald-500/30">
                    AI VISION
                  </span>
                </div>

                {/* 
                  -------------------------------------------------------------
                  PHONE SCREEN CONTENT BASED ON SCAN STAGE
                  -------------------------------------------------------------
                */}
                <div className="relative flex-1 my-2 flex flex-col items-center justify-center">
                  {/* Camera Viewfinder Reticle Corners */}
                  <div className="absolute inset-1 pointer-events-none">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
                  </div>

                  {/* STAGE 1: AIMING / SCANNING */}
                  {(scanStage === 'aiming' || scanStage === 'scanning') && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center space-y-2 p-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                        <Scan size={22} className="animate-spin" style={{ animationDuration: '4s' }} />
                      </div>
                      <p className="text-[11px] font-bold text-white">Aligning Product Label</p>
                      <p className="text-[9px] text-slate-400">Capturing Legal Declarations...</p>
                    </motion.div>
                  )}

                  {/* STAGE 2: DETECTING BOUNDING BOXES */}
                  {scanStage === 'detecting' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full space-y-1.5 p-1"
                    >
                      <div className="text-[9px] font-mono font-bold text-cyan-300 text-center flex items-center justify-center gap-1">
                        <Sparkles size={10} className="text-cyan-400" />
                        <span>DETECTED DECLARATIONS</span>
                      </div>

                      <div className="p-1.5 rounded-lg bg-slate-900/90 border border-emerald-400/60 flex items-center justify-between text-[10px]">
                        <span className="text-slate-300">MRP Check:</span>
                        <span className="font-bold text-emerald-400">{currentProduct.mrp} ✓</span>
                      </div>

                      <div className="p-1.5 rounded-lg bg-slate-900/90 border border-cyan-400/60 flex items-center justify-between text-[10px]">
                        <span className="text-slate-300">Net Quantity:</span>
                        <span className="font-bold text-cyan-400">{currentProduct.netQty} ✓</span>
                      </div>

                      <div className="p-1.5 rounded-lg bg-slate-900/90 border border-amber-400/60 flex items-center justify-between text-[10px]">
                        <span className="text-slate-300">Licence Auth:</span>
                        <span className="font-bold text-amber-300">{currentProduct.licence} ✓</span>
                      </div>
                    </motion.div>
                  )}

                  {/* STAGE 3: RESULT SUCCESS POPUP */}
                  {scanStage === 'result' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="w-full p-2.5 rounded-2xl bg-gradient-to-b from-emerald-950/90 to-slate-900/95 border border-emerald-400 shadow-2xl text-center space-y-2 relative"
                    >
                      {/* Success Shield Glow */}
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-[0_0_20px_#10b981]">
                        <ShieldCheck size={22} className="stroke-[2.5]" />
                      </div>

                      <div>
                        <span className="text-[10px] font-black tracking-wider text-emerald-300 uppercase block">
                          100% COMPLIANT & SAFE
                        </span>
                        <h5 className="text-xs font-extrabold text-white">
                          Score: {currentProduct.score}/100 PASSED
                        </h5>
                      </div>

                      <div className="py-1 px-2 rounded-lg bg-black/40 text-[9px] text-slate-300 border border-emerald-500/30">
                        {currentProduct.certBadge}
                      </div>

                      <div className="text-[8px] font-mono text-emerald-400">
                        ✓ SIH26034 Statutory Verified
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Phone Bottom Navigation Bar */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 size={10} />
                    <span>Instant Audit</span>
                  </span>
                  <span className="font-mono text-amber-400">0.8s Response</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLiveScannerStory;
