import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, Sparkles, Scan, 
  Cpu, Award, Zap, Camera, Eye, AlertCircle 
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
  themeColor: {
    primary: string;
    border: string;
    glow: string;
    badgeBg: string;
    gradient: string;
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
    category: 'Packaged Food',
    title: 'ROYAL MASALA CRUNCH',
    subtitle: 'Roasted Multigrain Herb Crisps',
    brand: 'HERITAGE SPICE FOODS',
    themeColor: {
      primary: '#f59e0b',
      border: 'border-amber-500/40',
      glow: 'shadow-amber-500/20',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      gradient: 'from-red-950 via-slate-900 to-amber-950',
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
    statutoryStandard: 'Legal Metrology Rules 2011 & FSSAI 2020',
  },
  cosmetics: {
    id: 'cosmetics',
    tabLabel: 'Cosmetics',
    tabIcon: '🧴',
    category: 'Cosmetics & Personal Care',
    title: 'AURA RADIANCE ELIXIR',
    subtitle: 'Kumkumadi & Vitamin-C Facial Serum',
    brand: 'AURA BOTANICS DERMO',
    themeColor: {
      primary: '#10b981',
      border: 'border-emerald-500/40',
      glow: 'shadow-emerald-500/20',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      gradient: 'from-emerald-950 via-slate-900 to-teal-950',
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
    themeColor: {
      primary: '#eab308',
      border: 'border-yellow-500/40',
      glow: 'shadow-yellow-500/20',
      badgeBg: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
      gradient: 'from-amber-950 via-slate-900 to-yellow-950',
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

export const HeroAIScannerShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProductDemoType>('food');
  const product = PRODUCTS[activeTab];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none">
      {/* Category Tabs Toolbar */}
      <div className="z-30 mb-3.5 flex items-center gap-2 p-1.5 rounded-full bg-slate-900/90 dark:bg-slate-900/95 border border-emerald-500/30 shadow-2xl backdrop-blur-2xl">
        {(Object.keys(PRODUCTS) as ProductDemoType[]).map((type) => {
          const item = PRODUCTS[type];
          const isActive = activeTab === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setActiveTab(type)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer",
                isActive
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span>{item.tabIcon}</span>
              <span>{item.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Main Glassmorphic AI Scanner Viewport Card */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-[#070b12] border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 backdrop-blur-2xl p-4 sm:p-5">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Viewport Top Header & Telemetry Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-mono font-bold text-emerald-400 tracking-wider text-[11px]">
              LIVE AI OPTICAL AUDIT
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span className="hidden sm:inline">DUAL OCR ENGINE</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              60 FPS
            </span>
          </div>
        </div>

        {/* Central Product Scanner Window with Live Bounding Boxes & Laser */}
        <div className="relative my-3 rounded-2xl overflow-hidden border border-slate-700/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-5 shadow-inner">
          {/* Cyber Scanning Grid Lines */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* 
            -------------------------------------------------------------
            SMOOTH VERTICAL AI LASER BEAM SWEEP
            -------------------------------------------------------------
          */}
          <motion.div
            animate={{
              top: ['0%', '94%', '0%'],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute left-0 right-0 z-20 pointer-events-none"
          >
            {/* Laser Line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee]" />
            {/* Laser Ambient Glow Band */}
            <div className="h-8 -mt-4 w-full bg-gradient-to-b from-cyan-500/10 via-emerald-500/20 to-transparent blur-sm" />
          </motion.div>

          {/* 
            -------------------------------------------------------------
            AUTHENTIC PRODUCT LABEL PACKAGING CARD
            -------------------------------------------------------------
          */}
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "relative rounded-xl border p-4 sm:p-5 bg-gradient-to-b text-white overflow-hidden shadow-xl",
                product.themeColor.gradient,
                product.themeColor.border
              )}
            >
              {/* Corner Camera Viewfinder Brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

              {/* Product Header Row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-amber-300 font-bold uppercase block">
                    {product.brand}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black tracking-tight text-white font-heading mt-0.5">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">{product.subtitle}</p>
                </div>

                {/* Veg / Dermo Symbol */}
                <div className="relative group/tag">
                  {product.vegType === 'veg' ? (
                    <div className="w-6 h-6 border-2 border-green-500 flex items-center justify-center p-0.5 bg-slate-950/80 rounded-sm">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                  ) : (
                    <div className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-400 text-[10px] font-bold text-emerald-300">
                      DERMO-CARE
                    </div>
                  )}
                  {/* Bounding Box on Veg Symbol */}
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
              </div>

              {/* 
                -------------------------------------------------------------
                MANDATORY STATUTORY DECLARATION GRID WITH LIVE BOUNDING BOXES
                -------------------------------------------------------------
              */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                {/* 1. Net Quantity Bounding Box */}
                <div className="relative p-2 rounded-lg bg-slate-950/70 border border-cyan-500/50 group">
                  <span className="text-[9px] font-mono uppercase text-cyan-300 font-bold flex items-center justify-between">
                    <span>1. Net Quantity</span>
                    <span className="text-emerald-400">✓ PASS</span>
                  </span>
                  <p className="text-sm font-extrabold text-white mt-0.5">{product.netQty}</p>
                  <div className="absolute inset-0 border border-cyan-400 rounded-lg pointer-events-none opacity-40 animate-pulse" />
                </div>

                {/* 2. Maximum Retail Price (MRP) Bounding Box */}
                <div className="relative p-2 rounded-lg bg-slate-950/70 border border-emerald-500/50 group">
                  <span className="text-[9px] font-mono uppercase text-emerald-300 font-bold flex items-center justify-between">
                    <span>2. MRP (Taxes Incl.)</span>
                    <span className="text-emerald-400">✓ PASS</span>
                  </span>
                  <p className="text-sm font-extrabold text-emerald-400 mt-0.5">{product.mrp}</p>
                  <div className="absolute inset-0 border border-emerald-400 rounded-lg pointer-events-none opacity-40 animate-pulse" />
                </div>

                {/* 3. Batch Number & Dates */}
                <div className="relative p-2 rounded-lg bg-slate-950/70 border border-amber-500/50 group">
                  <span className="text-[9px] font-mono uppercase text-amber-300 font-bold flex items-center justify-between">
                    <span>3. Batch & Mfg</span>
                    <span className="text-emerald-400">✓ PASS</span>
                  </span>
                  <p className="text-[11px] font-mono font-bold text-white mt-0.5">{product.batch}</p>
                  <p className="text-[10px] text-slate-300">{product.mfg} • EXP {product.expiry}</p>
                  <div className="absolute inset-0 border border-amber-400 rounded-lg pointer-events-none opacity-30 animate-pulse" />
                </div>

                {/* 4. Licence Number */}
                <div className="relative p-2 rounded-lg bg-slate-950/70 border border-emerald-500/50 group">
                  <span className="text-[9px] font-mono uppercase text-emerald-300 font-bold flex items-center justify-between">
                    <span>4. {product.licenceLabel}</span>
                    <span className="text-emerald-400">✓ VALID</span>
                  </span>
                  <p className="text-[11px] font-mono font-bold text-white mt-0.5 truncate">{product.licence}</p>
                  <p className="text-[10px] text-emerald-400">Government Registered</p>
                  <div className="absolute inset-0 border border-emerald-400 rounded-lg pointer-events-none opacity-30 animate-pulse" />
                </div>
              </div>

              {/* Bottom Statutory Guarantee Stamp */}
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                <span className="font-mono text-slate-400 truncate">
                  Govt Standard: {product.statutoryStandard}
                </span>
                <span className="flex items-center gap-1 font-bold text-emerald-400 shrink-0 ml-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Compliant</span>
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Viewport Bottom HUD Bar */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Card 1: Compliance Score */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              {product.score}%
            </div>
            <div className="text-left leading-tight">
              <span className="text-[11px] font-bold text-white block">Audit Score</span>
              <span className="text-[9px] text-emerald-400 font-medium">Passed {product.passedCount}/15 Rules</span>
            </div>
          </div>

          {/* Card 2: Inference Speed */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
              <Zap size={16} />
            </div>
            <div className="text-left leading-tight">
              <span className="text-[11px] font-bold text-white block">0.8s Latency</span>
              <span className="text-[9px] text-cyan-400 font-medium">Instant OCR Parse</span>
            </div>
          </div>

          {/* Card 3: Deterministic Rule Engine */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
              <Award size={16} />
            </div>
            <div className="text-left leading-tight">
              <span className="text-[11px] font-bold text-white block">SIH 2026</span>
              <span className="text-[9px] text-amber-400 font-medium">SIH26034 Standard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAIScannerShowcase;
