import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Scan, 
  Sparkles, FileWarning, Scale, Building2, Flame,
  ShieldAlert, RefreshCw, Eye, Zap, Award
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface ScenarioItem {
  id: string;
  badgeType: 'safe' | 'violation' | 'metrology';
  modeTitle: string;
  deptName: string;
  deptIcon: string;
  productName: string;
  category: string;
  emoji: string;
  packetColor1: string;
  packetColor2: string;
  packetColor3: string;
  mrp: string;
  fssai: string;
  expiry: string;
  vegStatus: 'veg' | 'non-veg' | 'missing';
  problemCaught?: string;
  ruleCitation: string;
  actionSummary: string;
  statusHeadline: string;
}

const SCENARIOS: ScenarioItem[] = [
  {
    id: 'fssai_problem',
    badgeType: 'violation',
    modeTitle: '🚨 Food Safety Dept (Problem Caught)',
    deptName: 'FSSAI Enforcement & Audit',
    deptIcon: '🏛️',
    productName: 'Chilli Crunchies (Adulterated)',
    category: 'Packaged Snacks',
    emoji: '🌶️',
    packetColor1: '#dc2626',
    packetColor2: '#991b1b',
    packetColor3: '#450a0a',
    mrp: '₹ 20.00 (Overprinted)',
    fssai: 'INVALID / NOT FOUND',
    expiry: 'NO EXPIRY / SMUDGED',
    vegStatus: 'missing',
    problemCaught: 'Missing FSSAI Lic & Hidden Expiry Date',
    ruleCitation: 'FSS (Packaging & Labelling) Reg. 2.2.2',
    actionSummary: 'Auto-Report Generated for Food Safety Officer (FSO)',
    statusHeadline: 'VIOLATION DETECTED: UNSAFE FOOD LABEL',
  },
  {
    id: 'kid_safe',
    badgeType: 'safe',
    modeTitle: '👦 Kid & Citizen Safe Scan',
    deptName: 'Consumer Protection Portal',
    deptIcon: '🛡️',
    productName: 'Nutri-Gold Whole Wheat Puffs',
    category: 'Healthy Snacking for Kids',
    emoji: '🌾',
    packetColor1: '#f59e0b',
    packetColor2: '#d97706',
    packetColor3: '#78350f',
    mrp: '₹ 15.00 (Standardized)',
    fssai: '10012011000168 (Active)',
    expiry: 'Best Before: 12 Nov 2026',
    vegStatus: 'veg',
    ruleCitation: 'Legal Metrology PCR 2011 & FSSAI 2020',
    actionSummary: '100% Certified Safe, Allergen Clear & Verified',
    statusHeadline: '100% VERIFIED: SAFE FOR CHILDREN & FAMILIES ✓',
  },
  {
    id: 'metrology_problem',
    badgeType: 'metrology',
    modeTitle: '⚖️ Legal Metrology Price & Net Wt Audit',
    deptName: 'Dept of Consumer Affairs',
    deptIcon: '🇮🇳',
    productName: 'Pure Gold Refined Mustard Oil',
    category: 'Edible Oils & Fats',
    emoji: '🛢️',
    packetColor1: '#eab308',
    packetColor2: '#ca8a04',
    packetColor3: '#713f12',
    mrp: '₹ 180.00 (USP Missing)',
    fssai: '10019022004512 (Active)',
    expiry: 'Best Before: 05 Jan 2027',
    vegStatus: 'veg',
    problemCaught: 'Unit Sale Price (USP) font below 2mm minimum',
    ruleCitation: 'Legal Metrology (Packaged Commodities) Rule 6(1)',
    actionSummary: 'Label Non-Compliance Notice Dispatched to Packer',
    statusHeadline: 'LEGAL METROLOGY NON-COMPLIANCE DETECTED',
  },
];

export const KidScanningStoryAnimation: React.FC = () => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stage, setStage] = useState<'aim' | 'scanning' | 'detect' | 'verdict'>('aim');
  const [isPaused, setIsPaused] = useState(false);

  const cur = SCENARIOS[scenarioIndex];

  // Continuous animation cycle with automatic progression across stages & scenarios
  useEffect(() => {
    if (isPaused) return;

    let t1: any, t2: any, t3: any, t4: any;

    setStage('aim');

    t1 = setTimeout(() => {
      setStage('scanning');
    }, 1200);

    t2 = setTimeout(() => {
      setStage('detect');
    }, 3200);

    t3 = setTimeout(() => {
      setStage('verdict');
    }, 5000);

    t4 = setTimeout(() => {
      setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
    }, 8500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [scenarioIndex, isPaused]);

  return (
    <div 
      className="w-full max-w-xl mx-auto flex flex-col items-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 
        -------------------------------------------------------------
        1. TOP SCENARIO SWITCHER TABS (DEPT AUDIT vs KID SCAN)
        -------------------------------------------------------------
      */}
      <div className="z-30 mb-3 w-full flex items-center justify-between gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 dark:bg-slate-900/95 border border-slate-700/60 shadow-xl backdrop-blur-xl">
        {SCENARIOS.map((sc, idx) => (
          <button
            key={sc.id}
            onClick={() => {
              setScenarioIndex(idx);
              setStage('aim');
            }}
            className={cn(
              "flex-1 py-1.5 px-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center",
              scenarioIndex === idx
                ? sc.badgeType === 'safe'
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]"
                  : sc.badgeType === 'violation'
                  ? "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-500/25 scale-[1.02]"
                  : "bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg shadow-amber-500/25 scale-[1.02]"
                : "text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800/80"
            )}
          >
            <span>{sc.deptIcon}</span>
            <span className="truncate">
              {idx === 0 ? 'FSSAI Problem' : idx === 1 ? 'Kid Safe Scan' : 'LM Dept Audit'}
            </span>
          </button>
        ))}
      </div>

      {/* 
        -------------------------------------------------------------
        2. LIVE TELEMETRY STAGE STATUS BAR
        -------------------------------------------------------------
      */}
      <div className="z-20 mb-2 w-full flex items-center justify-between px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              cur.badgeType === 'safe' ? 'bg-emerald-400' : 'bg-red-400'
            )} />
            <span className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              cur.badgeType === 'safe' ? 'bg-emerald-500' : 'bg-red-500'
            )} />
          </span>
          <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-white">
            {stage === 'aim' && '📡 Initializing AI Vision Target...'}
            {stage === 'scanning' && '⚡ Scanning Label Micro-Declarations...'}
            {stage === 'detect' && '🔍 Validating FSSAI / Legal Metrology Rules...'}
            {stage === 'verdict' && (cur.badgeType === 'safe' ? '🛡️ Compliance Verdict: Passed' : '🚨 Compliance Verdict: Violation Flagged')}
          </span>
        </div>

        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
          {cur.deptName}
        </span>
      </div>

      {/* 
        -------------------------------------------------------------
        3. MAIN INTERACTIVE SVG & HOLOGRAPHIC SCAN CANVAS
        -------------------------------------------------------------
      */}
      <div className={cn(
        "relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/95 via-[#0a0f1d] to-[#040711] border shadow-2xl backdrop-blur-2xl p-4 sm:p-5 flex flex-col justify-between transition-colors duration-500",
        cur.badgeType === 'safe'
          ? "border-emerald-500/30 shadow-emerald-500/10"
          : cur.badgeType === 'violation'
          ? "border-red-500/40 shadow-red-500/15"
          : "border-amber-500/30 shadow-amber-500/10"
      )}>
        {/* Dynamic Glow Auroras */}
        <div className={cn(
          "absolute top-1/4 left-1/4 w-60 h-60 rounded-full blur-3xl pointer-events-none -z-10 transition-all duration-700",
          cur.badgeType === 'safe' ? "bg-emerald-500/15" : "bg-red-500/20"
        )} />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* 
          -------------------------------------------------------------
          ANIMATED SVG STAGE (PACKET + LASER + CHARACTER + HUD)
          -------------------------------------------------------------
        */}
        <div className="relative w-full h-[270px] sm:h-[290px] flex items-center justify-center">
          <svg
            viewBox="0 0 520 320"
            className="w-full h-full max-w-[500px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 
              ---------------------------------------------------------
              A. SUSPECT/SAMPLE PRODUCT PACKET (LEFT SIDE)
              ---------------------------------------------------------
            */}
            <g transform="translate(60, 65)">
              <motion.g
                animate={{
                  y: [-3, 3, -3],
                  rotate: [-0.8, 0.8, -0.8],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Outer Glow on Packet */}
                <rect
                  x="-2"
                  y="-2"
                  width="124"
                  height="164"
                  rx="16"
                  fill="none"
                  stroke={cur.badgeType === 'safe' ? '#10b981' : cur.badgeType === 'violation' ? '#ef4444' : '#f59e0b'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity={stage === 'detect' || stage === 'verdict' ? 0.9 : 0.4}
                />

                {/* Packet Main Shell */}
                <rect
                  x="0"
                  y="0"
                  width="120"
                  height="160"
                  rx="14"
                  fill={`url(#pkgGrad_${cur.id})`}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  filter="drop-shadow(0 14px 28px rgba(0,0,0,0.6))"
                />

                {/* Packet Top Seal with Crimp Pattern */}
                <rect x="0" y="0" width="120" height="16" rx="3" fill="#0f172a" opacity="0.45" />
                {[15, 30, 45, 60, 75, 90, 105].map((pos) => (
                  <line key={pos} x1={pos} y1="2" x2={pos} y2="14" stroke="#ffffff" strokeWidth="1.2" opacity="0.5" />
                ))}

                {/* Packet Bottom Seal */}
                <rect x="0" y="146" width="120" height="14" rx="3" fill="#0f172a" opacity="0.45" />

                {/* Packet Brand & Name Banner */}
                <text x="60" y="34" fill="#fef08a" fontSize="7.5" fontFamily="sans-serif" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                  {cur.id === 'fssai_problem' ? '⚠️ UNVERIFIED BRAND' : 'PREMIUM ASSURED'}
                </text>
                <text x="60" y="47" fill="#ffffff" fontSize="8.5" fontFamily="sans-serif" fontWeight="800" textAnchor="middle">
                  {cur.productName.split(' ')[0]} {cur.productName.split(' ')[1]}
                </text>

                {/* Product Center Emblem */}
                <circle cx="60" cy="78" r="21" fill="rgba(0,0,0,0.35)" />
                <text x="60" y="86" fontSize="22" textAnchor="middle">
                  {cur.emoji}
                </text>

                {/* Veg / Non-Veg / Missing Dot */}
                {cur.vegStatus === 'veg' ? (
                  <g transform="translate(94, 22)">
                    <rect x="0" y="0" width="14" height="14" stroke="#22c55e" strokeWidth="1.5" fill="#ffffff" rx="2" />
                    <circle cx="7" cy="7" r="3.5" fill="#22c55e" />
                  </g>
                ) : cur.vegStatus === 'missing' ? (
                  // Missing Logo Warning Box (Food Safety Violation)
                  <g transform="translate(90, 20)">
                    <rect x="0" y="0" width="22" height="16" stroke="#ef4444" strokeWidth="1.5" fill="#450a0a" rx="2" strokeDasharray="2 2" />
                    <text x="11" y="11" fill="#fca5a5" fontSize="7" fontWeight="bold" textAnchor="middle">MISSING</text>
                  </g>
                ) : null}

                {/* Nutrition & Declarations On-Pouch Micro Table */}
                <rect x="8" y="108" width="104" height="32" rx="4" fill="rgba(2,6,23,0.75)" stroke="#334155" strokeWidth="0.8" />
                
                {/* MRP Row */}
                <text x="12" y="119" fill="#93c5fd" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
                  MRP {cur.mrp}
                </text>

                {/* FSSAI Row */}
                <text 
                  x="12" 
                  y="128" 
                  fill={cur.fssai.includes('INVALID') ? '#f87171' : '#86efac'} 
                  fontSize="6.2" 
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  FSSAI: {cur.fssai}
                </text>

                {/* Expiry Row */}
                <text 
                  x="12" 
                  y="136" 
                  fill={cur.expiry.includes('NO EXPIRY') ? '#f87171' : '#cbd5e1'} 
                  fontSize="5.8" 
                  fontFamily="monospace"
                >
                  {cur.expiry}
                </text>

                {/* 
                  Live Target Bounding Boxes Over Detected Violation Areas
                */}
                {(stage === 'detect' || stage === 'verdict') && cur.badgeType === 'violation' && (
                  <g>
                    {/* Red Bounding Box on FSSAI License */}
                    <rect x="6" y="121" width="108" height="18" fill="rgba(239,68,68,0.25)" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="60" y="133" fill="#fecaca" fontSize="7" fontWeight="900" textAnchor="middle" filter="drop-shadow(0 0 2px #000)">
                      ⚠️ FSSAI UNLICENSED
                    </text>
                  </g>
                )}

                {(stage === 'detect' || stage === 'verdict') && cur.badgeType === 'metrology' && (
                  <g>
                    {/* Amber Bounding Box on MRP */}
                    <rect x="6" y="110" width="108" height="12" fill="rgba(245,158,11,0.25)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="60" y="119" fill="#fef08a" fontSize="6.5" fontWeight="900" textAnchor="middle">
                      ⚠️ USP FONT &lt; 2mm
                    </text>
                  </g>
                )}
              </motion.g>
            </g>

            {/* 
              ---------------------------------------------------------
              B. AI LASER CONE & HOLO-SCAN SWEEP (CENTER)
              ---------------------------------------------------------
            */}
            {(stage === 'scanning' || stage === 'detect') && (
              <g>
                {/* 3D Scanning Laser Cone */}
                <polygon
                  points="285,145 185,75 185,225"
                  fill="url(#holoConeGrad)"
                  opacity="0.6"
                />

                {/* Vertical Laser Sweep Bar */}
                <motion.line
                  x1="185"
                  y1="75"
                  x2="185"
                  y2="225"
                  stroke={cur.badgeType === 'safe' ? '#38bdf8' : '#f43f5e'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 10px #38bdf8)"
                  animate={{
                    x1: [185, 60, 185],
                    x2: [185, 60, 185],
                  }}
                  transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Floating OCR Telemetry Particles */}
                <g opacity="0.85">
                  <circle cx="165" cy="115" r="3" fill="#38bdf8" className="animate-ping" />
                  <circle cx="125" cy="180" r="2.5" fill="#34d399" className="animate-ping" />
                  <circle cx="100" cy="130" r="2" fill="#f59e0b" className="animate-ping" />
                </g>
              </g>
            )}

            {/* 
              ---------------------------------------------------------
              C. THE CHARACTER (KID / FOOD SAFETY INSPECTOR) (RIGHT SIDE)
              ---------------------------------------------------------
            */}
            <g transform="translate(280, 45)">
              {/* Character Torso */}
              <path
                d="M 65 160 C 35 160 15 180 10 235 L 145 235 C 140 180 120 160 90 160 Z"
                fill={cur.id === 'fssai_problem' ? "url(#inspectorGrad)" : "url(#kidGrad)"}
              />

              {/* Inspector Badge or Hoodie Graphic */}
              {cur.id === 'fssai_problem' ? (
                // Food Safety Officer Emblem
                <g transform="translate(95, 175)">
                  <rect x="0" y="0" width="26" height="18" rx="3" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1" />
                  <text x="13" y="12" fill="#fbbf24" fontSize="7" fontWeight="bold" textAnchor="middle">FSO</text>
                </g>
              ) : (
                // Kid's Sporty Emblem
                <g transform="translate(95, 180)">
                  <circle cx="6" cy="6" r="6" fill="#10b981" />
                  <path d="M 4 6 L 6 8 L 9 4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              )}

              {/* Character Head */}
              <circle cx="77" cy="95" r="38" fill="#fed7aa" />

              {/* Hair */}
              <path
                d="M 37 90 C 35 50 65 38 80 38 C 105 38 123 52 120 90 C 113 72 95 68 80 68 C 63 68 47 75 37 90 Z"
                fill={cur.id === 'fssai_problem' ? "#1e293b" : "#374151"}
              />
              <path d="M 45 74 Q 60 58 75 74 Q 90 60 105 76 Q 90 68 75 68 Q 60 68 45 74 Z" fill="#111827" />

              {/* Eyes Expression */}
              {stage === 'verdict' && cur.badgeType === 'safe' ? (
                // Happy joyful eyes
                <g stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
                  <path d="M 57 95 Q 63 88 69 95" />
                  <path d="M 83 95 Q 89 88 95 95" />
                </g>
              ) : stage === 'verdict' && cur.badgeType === 'violation' ? (
                // Serious, vigilant inspector eyes
                <g fill="#1f2937">
                  <circle cx="63" cy="94" r="4" />
                  <circle cx="89" cy="94" r="4" />
                  <path d="M 55 86 L 69 90" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 97 86 L 83 90" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              ) : (
                // Attentive focus eyes
                <g fill="#1f2937">
                  <circle cx="63" cy="93" r="4.5" />
                  <circle cx="89" cy="93" r="4.5" />
                  <circle cx="61.5" cy="91.5" r="1.5" fill="#ffffff" />
                  <circle cx="87.5" cy="91.5" r="1.5" fill="#ffffff" />
                </g>
              )}

              {/* Blush */}
              <circle cx="53" cy="103" r="5" fill="#fb7185" opacity="0.4" />
              <circle cx="99" cy="103" r="5" fill="#fb7185" opacity="0.4" />

              {/* Mouth */}
              {stage === 'verdict' && cur.badgeType === 'safe' ? (
                // Joyful smile :D
                <path d="M 65 108 Q 76 126 87 108 Z" fill="#dc2626" stroke="#1f2937" strokeWidth="2" />
              ) : stage === 'verdict' && cur.badgeType === 'violation' ? (
                // Strict / Focused Inspector Mouth
                <line x1="68" y1="112" x2="84" y2="112" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
              ) : (
                // Confident pleasant smile
                <path d="M 68 110 Q 76 116 84 110" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
              )}

              {/* Arm reaching out holding phone */}
              <path d="M 25 180 Q -5 160 15 140" stroke="#fed7aa" strokeWidth="12" strokeLinecap="round" />

              {/* Smartphone Device */}
              <g transform="translate(-6, 110) rotate(-6)">
                {/* Phone Body */}
                <rect
                  x="0"
                  y="0"
                  width="50"
                  height="90"
                  rx="10"
                  fill="#0f172a"
                  stroke={cur.badgeType === 'safe' ? '#38bdf8' : '#ef4444'}
                  strokeWidth="2.5"
                  filter="drop-shadow(0 8px 18px rgba(0,0,0,0.7))"
                />

                {/* Phone Screen */}
                <rect x="3" y="4" width="44" height="82" rx="7" fill="#020617" />

                {/* Phone Screen Interface based on State */}
                {stage === 'verdict' ? (
                  cur.badgeType === 'safe' ? (
                    // Green Verified Shield on Phone Screen
                    <g transform="translate(14, 28)">
                      <circle cx="11" cy="11" r="11" fill="#10b981" />
                      <path d="M 7 11 L 10 14 L 16 8" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  ) : (
                    // Red Warning Alert on Phone Screen
                    <g transform="translate(14, 28)">
                      <circle cx="11" cy="11" r="11" fill="#ef4444" />
                      <text x="11" y="16" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">!</text>
                    </g>
                  )
                ) : (
                  // Active OCR Reticle & Sweep
                  <g transform="translate(7, 20)">
                    <rect x="0" y="0" width="30" height="44" rx="3" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="0" y1="22" x2="30" y2="22" stroke="#34d399" strokeWidth="1.5" />
                  </g>
                )}

                {/* Camera Lens */}
                <circle cx="8" cy="8" r="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                <circle cx="8" cy="8" r="1" fill="#34d399" />
              </g>

              {/* Hands */}
              <circle cx="7" cy="165" r="7" fill="#fed7aa" />
              <circle cx="38" cy="170" r="7" fill="#fed7aa" />
            </g>

            {/* 
              ---------------------------------------------------------
              D. POP-UP VERDICT BANNER / SHIELD (STAGE: VERDICT)
              ---------------------------------------------------------
            */}
            {stage === 'verdict' && (
              <g transform="translate(170, 15)">
                {cur.badgeType === 'safe' ? (
                  // GREEN VICTORY SHIELD (SAFE FOOD)
                  <g filter="drop-shadow(0 0 16px rgba(16,185,129,0.85))">
                    <path
                      d="M 90 10 L 140 30 L 140 85 C 140 120 115 145 90 155 C 65 145 40 120 40 85 L 40 30 Z"
                      fill="url(#shieldGradGreen)"
                      stroke="#fde047"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 68 80 L 82 95 L 114 60"
                      stroke="#ffffff"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Celebration Confetti */}
                    <circle cx="20" cy="35" r="4" fill="#fbbf24" className="animate-ping" />
                    <circle cx="160" cy="45" r="4.5" fill="#34d399" className="animate-bounce" />
                    <circle cx="145" cy="120" r="3" fill="#38bdf8" className="animate-pulse" />

                    {/* Verdict Pill */}
                    <g transform="translate(5, 142)">
                      <rect x="0" y="0" width="170" height="26" rx="13" fill="#022c22" stroke="#34d399" strokeWidth="1.5" />
                      <text x="85" y="17" fill="#6ee7b7" fontSize="8.5" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
                        ✓ 100% SAFE & COMPLIANT
                      </text>
                    </g>
                  </g>
                ) : (
                  // RED AUDIT ALERT SHIELD (FOOD SAFETY / LM VIOLATION CAUGHT)
                  <g filter="drop-shadow(0 0 20px rgba(239,68,68,0.9))">
                    <path
                      d="M 90 10 L 140 30 L 140 85 C 140 120 115 145 90 155 C 65 145 40 120 40 85 L 40 30 Z"
                      fill="url(#shieldGradRed)"
                      stroke="#fca5a5"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />
                    {/* Exclamation Mark */}
                    <path
                      d="M 90 55 L 90 90 M 90 105 L 90 110"
                      stroke="#ffffff"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />

                    {/* Warning Sparkles */}
                    <circle cx="20" cy="40" r="4" fill="#ef4444" className="animate-ping" />
                    <circle cx="160" cy="50" r="4.5" fill="#f59e0b" className="animate-pulse" />

                    {/* Violation Pill */}
                    <g transform="translate(0, 142)">
                      <rect x="0" y="0" width="180" height="26" rx="13" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
                      <text x="90" y="17" fill="#fca5a5" fontSize="8" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
                        🚨 VIOLATION CAUGHT & FLAGGED
                      </text>
                    </g>
                  </g>
                )}
              </g>
            )}

            {/* Gradient Definitions */}
            <defs>
              {/* Product Gradients */}
              {SCENARIOS.map((sc) => (
                <linearGradient key={sc.id} id={`pkgGrad_${sc.id}`} x1="0" y1="0" x2="120" y2="160" gradientUnits="userSpaceOnUse">
                  <stop stopColor={sc.packetColor1} />
                  <stop offset="0.5" stopColor={sc.packetColor2} />
                  <stop offset="1" stopColor={sc.packetColor3} />
                </linearGradient>
              ))}

              {/* Scanning Cone */}
              <linearGradient id="holoConeGrad" x1="285" y1="145" x2="185" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" stopOpacity="0.5" />
                <stop offset="1" stopColor="#34d399" stopOpacity="0.05" />
              </linearGradient>

              {/* Character Costumes */}
              <linearGradient id="kidGrad" x1="10" y1="160" x2="145" y2="235" gradientUnits="userSpaceOnUse">
                <stop stopColor="#065f46" />
                <stop offset="0.5" stopColor="#047857" />
                <stop offset="1" stopColor="#064e3b" />
              </linearGradient>

              <linearGradient id="inspectorGrad" x1="10" y1="160" x2="145" y2="235" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1e3a8a" />
                <stop offset="0.5" stopColor="#1e40af" />
                <stop offset="1" stopColor="#172554" />
              </linearGradient>

              {/* Shields */}
              <linearGradient id="shieldGradGreen" x1="40" y1="10" x2="140" y2="155" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10b981" />
                <stop offset="0.6" stopColor="#059669" />
                <stop offset="1" stopColor="#047857" />
              </linearGradient>

              <linearGradient id="shieldGradRed" x1="40" y1="10" x2="140" y2="155" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ef4444" />
                <stop offset="0.6" stopColor="#dc2626" />
                <stop offset="1" stopColor="#991b1b" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 
          -------------------------------------------------------------
          4. BOTTOM REAL-TIME DEPARTMENT INTELLIGENCE CARD
          -------------------------------------------------------------
        */}
        <div className={cn(
          "mt-2 p-3 rounded-2xl border transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs",
          cur.badgeType === 'safe'
            ? "bg-slate-900/90 border-emerald-500/30"
            : cur.badgeType === 'violation'
            ? "bg-red-950/40 border-red-500/40"
            : "bg-amber-950/40 border-amber-500/40"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border",
              cur.badgeType === 'safe'
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : cur.badgeType === 'violation'
                ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
            )}>
              {cur.badgeType === 'safe' ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white block">
                  {cur.productName}
                </span>
                <span className={cn(
                  "text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase",
                  cur.badgeType === 'safe' ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40" : "bg-red-950 text-red-300 border border-red-500/40"
                )}>
                  {cur.category}
                </span>
              </div>

              <span className={cn(
                "text-[10px] font-semibold mt-0.5 block",
                cur.badgeType === 'safe' ? "text-emerald-400" : "text-red-400"
              )}>
                {cur.problemCaught ? `⚠️ Problem: ${cur.problemCaught}` : cur.actionSummary}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-1.5 sm:pt-0 border-slate-800">
            <span className="text-[10px] text-slate-300 font-mono block font-semibold">
              {cur.ruleCitation}
            </span>
            <p className="text-[9px] text-slate-400 mt-0.5">
              SIH Problem Statement Solver
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidScanningStoryAnimation;
