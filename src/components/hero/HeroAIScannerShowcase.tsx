import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, Sparkles, Scan, 
  Cpu, Award, Zap, Camera, Eye, ArrowRight, Pause, Play
} from 'lucide-react';
import { cn } from '@/utils/cn';

export type ProductDemoType = 'food' | 'cosmetics' | 'oil';

interface ProductData {
  id: ProductDemoType;
  tabLabel: string;
  tabIcon: string;
  category: string;
  title: string;
  subtitle: string;
  brand: string;
  tagline: string;
  theme: {
    primary: string;
    accent: string;
    gradient: string;
    glow: string;
    border: string;
    foilGrad: string;
    liquidColor?: string;
  };
  mrp: string;
  netQty: string;
  licence: string;
  licenceLabel: string;
  batch: string;
  mfg: string;
  expiry: string;
  vegType: 'veg' | 'non-veg' | 'dermo';
  score: number;
  passedCount: number;
  statutoryStandard: string;
}

const PRODUCTS: Record<ProductDemoType, ProductData> = {
  food: {
    id: 'food',
    tabLabel: 'Food Pouch',
    tabIcon: '🍜',
    category: 'Packaged Foods',
    title: 'ROYAL MASALA CRUNCH',
    subtitle: 'Roasted Multigrain Herb Crisp Snacking Pouch',
    brand: 'HERITAGE SPICE FOODS',
    tagline: '100% WHOLE GRAIN • ZERO CHOLESTEROL',
    theme: {
      primary: '#f59e0b',
      accent: '#ef4444',
      gradient: 'from-[#450a0a] via-[#7f1d1d] to-[#1c0406]',
      glow: 'rgba(239, 68, 68, 0.25)',
      border: 'border-amber-500/50',
      foilGrad: 'linear-gradient(135deg, rgba(251,191,36,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(239,68,68,0.2) 100%)',
    },
    mrp: '₹ 99.00',
    netQty: '200 g',
    licence: '10026022001489',
    licenceLabel: 'FSSAI Licence',
    batch: 'RMC-2026-X09',
    mfg: 'SEP 2026',
    expiry: 'JUN 2027',
    vegType: 'veg',
    score: 98,
    passedCount: 14,
    statutoryStandard: 'Legal Metrology 2011 & FSSAI 2020',
  },
  cosmetics: {
    id: 'cosmetics',
    tabLabel: 'Cosmetics',
    tabIcon: '🧴',
    category: 'Cosmetics & Personal Care',
    title: 'AURA RADIANCE ELIXIR',
    subtitle: 'Kumkumadi & Vitamin-C Radiance Facial Serum',
    brand: 'AURA BOTANICS DERMO',
    tagline: 'DERMATOLOGICALLY TESTED • CRUELTY FREE',
    theme: {
      primary: '#10b981',
      accent: '#ec4899',
      gradient: 'from-[#022c22] via-[#064e3b] to-[#021f18]',
      glow: 'rgba(16, 185, 129, 0.25)',
      border: 'border-emerald-500/50',
      foilGrad: 'linear-gradient(135deg, rgba(244,114,182,0.3) 0%, rgba(255,255,255,0.15) 50%, rgba(16,185,129,0.25) 100%)',
      liquidColor: '#059669',
    },
    mrp: '₹ 499.00',
    netQty: '100 ml',
    licence: 'COS/HP/2026/089',
    licenceLabel: 'CDSCO Licence',
    batch: 'AB-SERUM-2026-9',
    mfg: 'AUG 2026',
    expiry: '24 Months',
    vegType: 'dermo',
    score: 96,
    passedCount: 13,
    statutoryStandard: 'Cosmetics Rules 2020 & BIS Standards',
  },
  oil: {
    id: 'oil',
    tabLabel: 'Edible Oil',
    tabIcon: '🫒',
    category: 'Edible Oils & Fats',
    title: 'GOLDEN HARVEST SARSON',
    subtitle: '100% Pure Virgin Kachi Ghani Mustard Oil',
    brand: 'GOLDEN AGRO OILS',
    tagline: 'AGMARK GRADE-1 • NATURAL OMEGA-3',
    theme: {
      primary: '#eab308',
      accent: '#f97316',
      gradient: 'from-[#451a03] via-[#78350f] to-[#240e02]',
      glow: 'rgba(234, 179, 8, 0.25)',
      border: 'border-yellow-500/50',
      foilGrad: 'linear-gradient(135deg, rgba(254,240,138,0.35) 0%, rgba(255,255,255,0.15) 50%, rgba(217,119,6,0.25) 100%)',
    },
    mrp: '₹ 175.00',
    netQty: '1 Litre (910 g Mass Equiv)',
    licence: '10819003000452',
    licenceLabel: 'FSSAI & Agmark Grade-1',
    batch: 'GH-OIL-2026-M04',
    mfg: 'AUG 2026',
    expiry: 'AUG 2027',
    vegType: 'veg',
    score: 99,
    passedCount: 15,
    statutoryStandard: 'Legal Metrology (Dual Volume-Mass) 2022',
  },
};

const CATEGORY_KEYS: ProductDemoType[] = ['food', 'cosmetics', 'oil'];

export const HeroAIScannerShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProductDemoType>('food');
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);

  // 3D Parallax Tilt State
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const product = PRODUCTS[activeTab];

  // Auto-play category rotation timer
  useEffect(() => {
    if (!isAutoPlay) return;

    const intervalTime = 5500;
    const stepTime = 55;
    const stepIncrement = (stepTime / intervalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Switch to next category
          setActiveTab((curr) => {
            const nextIdx = (CATEGORY_KEYS.indexOf(curr) + 1) % CATEGORY_KEYS.length;
            return CATEGORY_KEYS[nextIdx];
          });
          return 0;
        }
        return prev + stepIncrement;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [isAutoPlay, activeTab]);

  // Handle 3D interactive cursor tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12; // Max 12 deg tilt
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos({ x: 50, y: 50 });
  };

  const handleManualSelect = (type: ProductDemoType) => {
    setActiveTab(type);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none">
      {/* 
        -------------------------------------------------------------
        1. CATEGORY SWITCHER WITH PROGRESS TIMERS
        -------------------------------------------------------------
      */}
      <div className="z-30 mb-4 flex items-center gap-2 p-1.5 rounded-full bg-slate-900/90 dark:bg-slate-900/95 border border-emerald-500/30 shadow-2xl backdrop-blur-2xl">
        {CATEGORY_KEYS.map((type) => {
          const item = PRODUCTS[type];
          const isActive = activeTab === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => handleManualSelect(type)}
              className={cn(
                "relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/30 scale-105"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span>{item.tabIcon}</span>
              <span>{item.tabLabel}</span>

              {/* Active Timer Progress Line */}
              {isActive && isAutoPlay && (
                <div 
                  className="absolute bottom-0 left-0 h-[2px] bg-slate-950/70 transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          );
        })}

        {/* Auto-Play Pause/Resume Button */}
        <button
          type="button"
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
          title={isAutoPlay ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
        >
          {isAutoPlay ? <Pause size={13} /> : <Play size={13} className="text-emerald-400" />}
        </button>
      </div>

      {/* 
        -------------------------------------------------------------
        2. 3D PARALLAX SCANNER CONTAINER
        -------------------------------------------------------------
      */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.12s ease-out',
        }}
        className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-[#070b12] border border-emerald-500/30 shadow-2xl shadow-emerald-500/15 backdrop-blur-2xl p-4 sm:p-5"
      >
        {/* Dynamic Interactive Glare Sheen following Mouse */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300 -z-10"
          style={{
            background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(52, 211, 153, 0.18), transparent 80%)`,
          }}
        />

        {/* Scanner HUD Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-mono font-bold text-emerald-400 tracking-wider text-[11px]">
              AI OPTICAL INSPECTION MATRIX
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span className="hidden sm:inline">LEGAL METROLOGY DIVISION</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold">
              SIH26034
            </span>
          </div>
        </div>

        {/* 
          -------------------------------------------------------------
          3. MAIN HIGH-RES PRODUCT PACKAGING WITH LASER & BOUNDING BOXES
          -------------------------------------------------------------
        */}
        <div className="relative my-3 rounded-2xl overflow-hidden border border-slate-700/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-5 shadow-inner min-h-[300px] flex items-center justify-center">
          {/* Cyber Scanning Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />

          {/* 
            -------------------------------------------------------------
            SMOOTH NEON CYBER LASER BEAM SWEEP
            -------------------------------------------------------------
          */}
          <motion.div
            animate={{
              top: ['0%', '95%', '0%'],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute left-0 right-0 z-30 pointer-events-none"
          >
            <div className="h-[2.5px] w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_15px_#06b6d4]" />
            <div className="h-10 -mt-5 w-full bg-gradient-to-b from-cyan-500/15 via-emerald-500/25 to-transparent blur-sm" />
          </motion.div>

          {/* 
            -------------------------------------------------------------
            PHOTOREALISTIC PRODUCT RENDER CARD
            -------------------------------------------------------------
          */}
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -10 }}
              transition={{ duration: 0.35 }}
              className={cn(
                "relative w-full rounded-2xl border p-4 sm:p-5 text-white overflow-hidden shadow-2xl backdrop-blur-sm",
                product.theme.gradient,
                product.theme.border
              )}
              style={{
                boxShadow: `0 20px 50px -10px ${product.theme.glow}`,
              }}
            >
              {/* Metallic Foil Sheen Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                style={{ background: product.theme.foilGrad }}
              />

              {/* Viewfinder Targeting Corner Markers */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

              {/* Packaging Header */}
              <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-amber-300 font-extrabold uppercase block">
                    {product.brand}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading mt-0.5">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-200 font-medium">{product.subtitle}</p>
                </div>

                {/* Statutory Certification Seal */}
                <div className="relative shrink-0 flex flex-col items-end">
                  {product.vegType === 'veg' ? (
                    <div className="w-7 h-7 border-2 border-green-400 flex items-center justify-center p-0.5 bg-slate-950/90 rounded shadow-md">
                      <div className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                    </div>
                  ) : (
                    <div className="px-2.5 py-1 rounded-md bg-emerald-950/90 border border-emerald-400 text-[10px] font-bold text-emerald-300 shadow-md">
                      DERMO-CARE
                    </div>
                  )}
                  <span className="text-[9px] font-mono text-emerald-400 font-bold mt-1">
                    ✓ DETECTED
                  </span>
                </div>
              </div>

              {/* Tagline Ribbon */}
              <div className="my-2 py-1 px-3 rounded-lg bg-black/40 border border-white/10 text-[11px] font-bold text-amber-200 text-center tracking-wide">
                {product.tagline}
              </div>

              {/* 
                -------------------------------------------------------------
                DYNAMIC LIVE BOUNDING BOXES (STATUTORY DECLARATION MATRIX)
                -------------------------------------------------------------
              */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs relative z-10">
                {/* 1. Net Quantity */}
                <div className="relative p-2.5 rounded-xl bg-slate-950/80 border border-cyan-400/60 shadow-md">
                  <div className="flex items-center justify-between text-[9px] font-mono uppercase text-cyan-300 font-bold">
                    <span>1. Net Quantity</span>
                    <span className="text-emerald-400 font-black">✓ PASS</span>
                  </div>
                  <p className="text-sm font-black text-white mt-1">{product.netQty}</p>
                  <div className="absolute inset-0 border-2 border-cyan-400/60 rounded-xl pointer-events-none animate-pulse" />
                </div>

                {/* 2. MRP (Maximum Retail Price) */}
                <div className="relative p-2.5 rounded-xl bg-slate-950/80 border border-emerald-400/60 shadow-md">
                  <div className="flex items-center justify-between text-[9px] font-mono uppercase text-emerald-300 font-bold">
                    <span>2. MRP (Taxes Incl.)</span>
                    <span className="text-emerald-400 font-black">✓ PASS</span>
                  </div>
                  <p className="text-sm font-black text-emerald-400 mt-1">{product.mrp}</p>
                  <div className="absolute inset-0 border-2 border-emerald-400/60 rounded-xl pointer-events-none animate-pulse" />
                </div>

                {/* 3. Batch Number & Mfg Date */}
                <div className="relative p-2.5 rounded-xl bg-slate-950/80 border border-amber-400/60 shadow-md">
                  <div className="flex items-center justify-between text-[9px] font-mono uppercase text-amber-300 font-bold">
                    <span>3. Batch & Dates</span>
                    <span className="text-emerald-400 font-black">✓ PASS</span>
                  </div>
                  <p className="text-[11px] font-mono font-bold text-white mt-0.5">{product.batch}</p>
                  <p className="text-[10px] text-slate-300">{product.mfg} • EXP {product.expiry}</p>
                  <div className="absolute inset-0 border-2 border-amber-400/60 rounded-xl pointer-events-none opacity-40 animate-pulse" />
                </div>

                {/* 4. Licence Number */}
                <div className="relative p-2.5 rounded-xl bg-slate-950/80 border border-emerald-400/60 shadow-md">
                  <div className="flex items-center justify-between text-[9px] font-mono uppercase text-emerald-300 font-bold">
                    <span>4. {product.licenceLabel}</span>
                    <span className="text-emerald-400 font-black">✓ VALID</span>
                  </div>
                  <p className="text-[11px] font-mono font-bold text-white mt-0.5 truncate">{product.licence}</p>
                  <p className="text-[10px] text-emerald-400">Govt. Verified</p>
                  <div className="absolute inset-0 border-2 border-emerald-400/60 rounded-xl pointer-events-none opacity-40 animate-pulse" />
                </div>
              </div>

              {/* Bottom Regulatory Bar */}
              <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[10px] text-slate-300">
                <span className="font-mono text-slate-300 truncate">
                  Rule Standard: {product.statutoryStandard}
                </span>
                <span className="flex items-center gap-1 font-extrabold text-emerald-300 shrink-0 ml-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Deterministic</span>
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 
          -------------------------------------------------------------
          4. BOTTOM TELEMETRY STATS CARDS
          -------------------------------------------------------------
        */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {/* Card 1: Compliance Score */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm shrink-0 border border-emerald-500/30">
              {product.score}%
            </div>
            <div className="text-left leading-tight">
              <span className="text-xs font-bold text-white block">Audit Score</span>
              <span className="text-[10px] text-emerald-400 font-medium">Passed {product.passedCount}/15 Rules</span>
            </div>
          </div>

          {/* Card 2: Latency */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 border border-cyan-500/30">
              <Zap size={18} />
            </div>
            <div className="text-left leading-tight">
              <span className="text-xs font-bold text-white block">0.8s Inference</span>
              <span className="text-[10px] text-cyan-400 font-medium">Fast AI Pipeline</span>
            </div>
          </div>

          {/* Card 3: Hackathon Problem */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 border border-amber-500/30">
              <Award size={18} />
            </div>
            <div className="text-left leading-tight">
              <span className="text-xs font-bold text-white block">SIH 2026</span>
              <span className="text-[10px] text-amber-400 font-medium">Govt. Innovation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAIScannerShowcase;
