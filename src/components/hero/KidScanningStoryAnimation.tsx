import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Sparkles, Scan, 
  Heart, ThumbsUp, Award, Star, Zap, ShieldAlert, Frown, Smile
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface KidScanItem {
  id: string;
  name: string;
  status: 'safe' | 'unsafe';
  category: string;
  emoji: string;
  packetGradient: string;
  packetBorder: string;
  mrp: string;
  fssai: string;
  expiry: string;
  vegStatus: 'veg' | 'missing';
  nutritionNote: string;
  statusBadge: string;
  funFact: string;
}

const ITEMS: KidScanItem[] = [
  {
    id: 'snack_safe',
    name: 'Nutri-Crunch Masala Chips',
    status: 'safe',
    category: 'Healthy Snacks',
    emoji: '🍟',
    packetGradient: 'from-amber-500 via-orange-600 to-red-700',
    packetBorder: '#10b981',
    mrp: '₹ 15.00',
    fssai: 'LIC #10012011000168 (Valid)',
    expiry: 'Best Before: 15 Oct 2026',
    vegStatus: 'veg',
    nutritionNote: 'Zero Trans-Fat • 100% Whole Wheat',
    statusBadge: '100% SAFE & COMPLIANT ✓',
    funFact: 'Kid is HAPPY! Healthy & Certified Safe.',
  },
  {
    id: 'cola_unsafe',
    name: 'Spicy Chomp (Fake / Unsafe)',
    status: 'unsafe',
    category: 'Adulterated Snack',
    emoji: '🌶️',
    packetGradient: 'from-red-600 via-rose-800 to-slate-900',
    packetBorder: '#ef4444',
    mrp: '₹ 30.00 (Overprinted)',
    fssai: 'FAKE / NOT FOUND ❌',
    expiry: 'EXPIRED 3 MONTHS AGO ⚠️',
    vegStatus: 'missing',
    nutritionNote: 'High Adulteration • Missing Veg Mark',
    statusBadge: '🚨 UNSAFE / FAKE PRODUCT!',
    funFact: 'Kid is ANGRY! Fake license & expired batch.',
  },
  {
    id: 'juice_safe',
    name: 'Pure Mango Super Juice',
    status: 'safe',
    category: 'Fruit Beverage',
    emoji: '🧃',
    packetGradient: 'from-yellow-400 via-amber-500 to-orange-600',
    packetBorder: '#10b981',
    mrp: '₹ 25.00',
    fssai: 'LIC #10819003000452 (Valid)',
    expiry: 'Best Before: 20 Dec 2026',
    vegStatus: 'veg',
    nutritionNote: 'Real Fruit Pulp • No Artificial Colors',
    statusBadge: 'HEALTHY & SAFE DRINK ✓',
    funFact: 'Kid is HAPPY! Pure ingredients approved.',
  },
  {
    id: 'candy_unsafe',
    name: 'Sugar Pop Toxic Candy',
    status: 'unsafe',
    category: 'Harmful Sweets',
    emoji: '🍬',
    packetGradient: 'from-purple-800 via-red-800 to-black',
    packetBorder: '#ef4444',
    mrp: '₹ 20.00 (Illegal MRP)',
    fssai: 'UNREGISTERED SELLER ❌',
    expiry: 'NO EXPIRY DATE ON PACK ⚠️',
    vegStatus: 'missing',
    nutritionNote: 'Harmful Chemical Additives Detected',
    statusBadge: '🚨 REJECTED: HAZARDOUS FOOD!',
    funFact: 'Kid is ANGRY! Harmful additives & no expiry.',
  },
];

export const KidScanningStoryAnimation: React.FC = () => {
  const [itemIndex, setItemIndex] = useState(0);
  const [stage, setStage] = useState<'aim' | 'scanning' | 'extract' | 'celebrate'>('aim');

  const currentItem = ITEMS[itemIndex];
  const isSafe = currentItem.status === 'safe';

  // Story cycle: Aim (1.1s) -> Scan Laser (1.7s) -> Extract Data (1.5s) -> Verdict/Celebrate (3.2s) -> Next Item
  useEffect(() => {
    let t1: any, t2: any, t3: any, t4: any;

    setStage('aim');

    t1 = setTimeout(() => {
      setStage('scanning');
    }, 1100);

    t2 = setTimeout(() => {
      setStage('extract');
    }, 2800);

    t3 = setTimeout(() => {
      setStage('celebrate');
    }, 4300);

    t4 = setTimeout(() => {
      setItemIndex((prev) => (prev + 1) % ITEMS.length);
    }, 7800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [itemIndex]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none">
      {/* Top Story Subtitle Pill */}
      <div className={cn(
        "z-30 mb-3 flex items-center justify-between w-full max-w-md px-4 py-2 rounded-full shadow-xl backdrop-blur-xl text-xs transition-colors duration-500",
        isSafe
          ? "bg-slate-900/90 border border-emerald-500/40"
          : "bg-slate-900/90 border border-red-500/50"
      )}>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              isSafe ? "bg-emerald-400" : "bg-red-400"
            )}></span>
            <span className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              isSafe ? "bg-emerald-500" : "bg-red-500"
            )}></span>
          </span>
          <span className="font-semibold text-white text-[11px] sm:text-xs">
            {stage === 'aim' && '👦 Kid scans product packet with phone...'}
            {stage === 'scanning' && '⚡ AI Camera reads label declarations...'}
            {stage === 'extract' && '🔍 Checking FSSAI, Expiry & MRP details...'}
            {stage === 'celebrate' && (
              isSafe 
                ? '🛡️ SAFE PRODUCT: Kid is Happy! 😊' 
                : '🚨 UNSAFE PRODUCT: Kid is Angry! 😡'
            )}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setItemIndex(idx);
                setStage('aim');
              }}
              className={cn(
                "w-6 h-6 rounded-full text-xs flex items-center justify-center transition-all cursor-pointer",
                itemIndex === idx
                  ? item.status === 'safe'
                    ? "bg-emerald-500 text-slate-950 scale-110 shadow-md ring-1 ring-emerald-300"
                    : "bg-red-500 text-white scale-110 shadow-md ring-1 ring-red-300"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              )}
            >
              {item.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Main Glassmorphic Animated Scene Container */}
      <div className={cn(
        "relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-[#070b12] border shadow-2xl backdrop-blur-2xl p-4 sm:p-6 min-h-[380px] flex flex-col justify-between transition-colors duration-500",
        isSafe
          ? "border-emerald-500/30 shadow-emerald-500/15"
          : "border-red-500/40 shadow-red-500/20"
      )}>
        {/* Ambient Glowing Aura */}
        <div className={cn(
          "absolute top-1/3 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none -z-10 transition-all duration-700",
          isSafe ? "bg-emerald-500/15" : "bg-red-500/20"
        )} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* 
          -------------------------------------------------------------
          ANIMATED ILLUSTRATION: KID HOLDING PHONE SCANNING A PACKET
          -------------------------------------------------------------
        */}
        <div className="relative w-full h-[260px] sm:h-[280px] flex items-center justify-center">
          <svg
            viewBox="0 0 500 320"
            className="w-full h-full max-w-[480px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 
              -------------------------------------------------------------
              1. THE PACKET / SNACK ITEM (LEFT-CENTER)
              -------------------------------------------------------------
            */}
            <g transform="translate(65, 80)">
              {/* Packet Floating Motion */}
              <motion.g
                animate={{
                  y: [-4, 4, -4],
                  rotate: [-1, 1, -1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Packet Body */}
                <rect
                  x="0"
                  y="0"
                  width="110"
                  height="150"
                  rx="14"
                  fill={`url(#packetGrad_${currentItem.id})`}
                  stroke={isSafe ? "#ffffff" : "#f87171"}
                  strokeWidth="2"
                  filter="drop-shadow(0 12px 25px rgba(0,0,0,0.5))"
                />

                {/* Packet Top Crimp */}
                <rect x="0" y="0" width="110" height="14" rx="3" fill="#1c1917" opacity="0.4" />
                <line x1="15" y1="2" x2="15" y2="12" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
                <line x1="35" y1="2" x2="35" y2="12" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
                <line x1="55" y1="2" x2="55" y2="12" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
                <line x1="75" y1="2" x2="75" y2="12" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
                <line x1="95" y1="2" x2="95" y2="12" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />

                {/* Packet Bottom Crimp */}
                <rect x="0" y="136" width="110" height="14" rx="3" fill="#1c1917" opacity="0.4" />

                {/* Packet Brand & Name Text */}
                <text x="55" y="34" fill="#fef08a" fontSize="7.5" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
                  {isSafe ? 'PREMIUM QUALITY' : '⚠️ UNVERIFIED BRAND'}
                </text>
                <text x="55" y="48" fill="#ffffff" fontSize="8.5" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
                  {currentItem.name.split(' ')[0]} {currentItem.name.split(' ')[1]}
                </text>

                {/* Packet Center Icon */}
                <circle cx="55" cy="78" r="20" fill="rgba(0,0,0,0.35)" />
                <text x="55" y="85" fontSize="20" textAnchor="middle">
                  {currentItem.emoji}
                </text>

                {/* FSSAI Green Veg Dot or Missing Dot */}
                {currentItem.vegStatus === 'veg' ? (
                  <g transform="translate(85, 20)">
                    <rect x="0" y="0" width="14" height="14" stroke="#22c55e" strokeWidth="1.5" fill="#ffffff" rx="2" />
                    <circle cx="7" cy="7" r="3.5" fill="#22c55e" />
                  </g>
                ) : (
                  <g transform="translate(82, 18)">
                    <rect x="0" y="0" width="20" height="16" stroke="#ef4444" strokeWidth="1.5" fill="#450a0a" rx="2" strokeDasharray="2 2" />
                    <text x="10" y="11" fill="#fca5a5" fontSize="6.5" fontWeight="bold" textAnchor="middle">MISSING</text>
                  </g>
                )}

                {/* Declarations Micro Table on Packet */}
                <rect x="8" y="104" width="94" height="28" rx="4" fill="rgba(0,0,0,0.65)" stroke="#334155" strokeWidth="0.8" />
                <text x="12" y="114" fill="#67e8f9" fontSize="6" fontFamily="monospace" fontWeight="bold">
                  MRP {currentItem.mrp}
                </text>
                <text 
                  x="12" 
                  y="122" 
                  fill={isSafe ? '#a7f3d0' : '#f87171'} 
                  fontSize="5.5" 
                  fontFamily="monospace" 
                  fontWeight="bold"
                >
                  {currentItem.fssai}
                </text>
                <text 
                  x="12" 
                  y="129" 
                  fill={isSafe ? '#cbd5e1' : '#fca5a5'} 
                  fontSize="5.2" 
                  fontFamily="monospace"
                >
                  {currentItem.expiry}
                </text>

                {/* Scanning Target Box Around Packet */}
                {(stage === 'scanning' || stage === 'extract') && (
                  <g>
                    {/* Viewfinder Target Corners */}
                    <path d="M -6 12 L -6 -6 L 12 -6" stroke={isSafe ? "#34d399" : "#f87171"} strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 98 -6 L 116 -6 L 116 12" stroke={isSafe ? "#34d399" : "#f87171"} strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M -6 138 L -6 156 L 12 156" stroke={isSafe ? "#34d399" : "#f87171"} strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 98 156 L 116 156 L 116 138" stroke={isSafe ? "#34d399" : "#f87171"} strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                )}
              </motion.g>
            </g>

            {/* 
              -------------------------------------------------------------
              2. HOLOGRAPHIC SCANNING CONE & LASER BEAM
              -------------------------------------------------------------
            */}
            {(stage === 'scanning' || stage === 'extract') && (
              <g>
                {/* Holographic Light Cone from Phone Camera to Packet */}
                <polygon
                  points="270,140 175,90 175,225"
                  fill={isSafe ? "url(#scanConeGrad)" : "url(#scanConeRedGrad)"}
                  opacity="0.55"
                />

                {/* Vertical Laser Sweep Line */}
                <motion.line
                  x1="175"
                  y1="90"
                  x2="175"
                  y2="230"
                  stroke={isSafe ? "#38bdf8" : "#f43f5e"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 8px #38bdf8)"
                  animate={{
                    x1: [175, 65, 175],
                    x2: [175, 65, 175],
                  }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Scanning Sparks / Data Bits */}
                <circle cx="160" cy="110" r="2.5" fill={isSafe ? "#34d399" : "#ef4444"} className="animate-ping" />
                <circle cx="130" cy="190" r="3" fill="#38bdf8" className="animate-ping" />
                <circle cx="110" cy="140" r="2" fill="#fbbf24" className="animate-ping" />
              </g>
            )}

            {/* 
              -------------------------------------------------------------
              3. THE ANIMATED CHARACTER (KID) (RIGHT)
              -------------------------------------------------------------
            */}
            <g transform="translate(260, 50)">
              {/* Kid's Body (Stylish Hoodie) */}
              <path
                d="M 60 160 C 30 160 10 180 5 230 L 140 230 C 135 180 115 160 85 160 Z"
                fill={isSafe ? "url(#hoodieGrad)" : "url(#hoodieRedGrad)"}
              />
              {/* Hoodie Zipper & Logo */}
              <line x1="72" y1="160" x2="72" y2="230" stroke={isSafe ? "#059669" : "#991b1b"} strokeWidth="2.5" />
              <circle cx="95" cy="180" r="5" fill={isSafe ? "#34d399" : "#f87171"} />

              {/* Kid's Head / Face */}
              <circle cx="72" cy="95" r="38" fill="#fed7aa" />

              {/* Kid's Hair (Cool haircut with volume) */}
              <path
                d="M 32 90 C 30 50 60 40 75 40 C 100 40 118 55 115 90 C 108 72 90 70 75 70 C 58 70 42 75 32 90 Z"
                fill="#374151"
              />
              {/* Front hair fringe */}
              <path d="M 40 75 Q 55 60 70 75 Q 85 62 100 78 Q 85 70 70 70 Q 55 70 40 75 Z" fill="#1f2937" />

              {/* 
                KID'S FACIAL EXPRESSION:
                - If SAFE + CELEBRATE => HAPPY (^_^)
                - If UNSAFE + CELEBRATE => ANGRY (>_< / Sharp Eyes + Angry Eyebrows + Angry Vein)
                - Normal scan => Attentive
              */}
              {stage === 'celebrate' ? (
                isSafe ? (
                  // HAPPY CELEBRATION EYES ^_^
                  <g stroke="#1f2937" strokeWidth="3.2" strokeLinecap="round">
                    <path d="M 52 95 Q 58 87 64 95" />
                    <path d="M 78 95 Q 84 87 90 95" />
                  </g>
                ) : (
                  // ANGRY REACTION EYES & EYEBROWS >:(
                  <g>
                    {/* Sharp Angry Slanted Eyebrows angled inward */}
                    <path d="M 46 84 L 66 90" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M 96 84 L 76 90" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" />
                    
                    {/* Angry Sharp Eyes */}
                    <circle cx="58" cy="96" r="4.5" fill="#1f2937" />
                    <circle cx="84" cy="96" r="4.5" fill="#1f2937" />
                    <circle cx="56.5" cy="94.5" r="1.2" fill="#ffffff" />
                    <circle cx="82.5" cy="94.5" r="1.2" fill="#ffffff" />

                    {/* Anime Anger Vein 💢 / Steam Mark above head */}
                    <g transform="translate(100, 42) scale(0.85)">
                      <path d="M 0 5 L 14 5 M 7 -2 L 7 12 M 1 -1 L 13 11 M 13 -1 L 1 11" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                    </g>
                  </g>
                )
              ) : (
                // Focus / attentive scanning eyes
                <g fill="#1f2937">
                  <circle cx="58" cy="93" r="4.5" />
                  <circle cx="84" cy="93" r="4.5" />
                  <circle cx="56.5" cy="91.5" r="1.5" fill="#ffffff" />
                  <circle cx="82.5" cy="91.5" r="1.5" fill="#ffffff" />
                </g>
              )}

              {/* Blush / Emotion Marks */}
              {isSafe ? (
                // Cheerful Pink Blush
                <g>
                  <circle cx="48" cy="103" r="5" fill="#fb7185" opacity="0.5" />
                  <circle cx="94" cy="103" r="5" fill="#fb7185" opacity="0.5" />
                </g>
              ) : (
                // Angry Flushed Cheeks
                <g>
                  <circle cx="48" cy="103" r="5" fill="#ef4444" opacity="0.6" />
                  <circle cx="94" cy="103" r="5" fill="#ef4444" opacity="0.6" />
                </g>
              )}

              {/* Kid's Smile or Angry Mouth */}
              {stage === 'celebrate' ? (
                isSafe ? (
                  // Big Happy Open Smile with teeth :D
                  <path d="M 60 108 Q 71 126 82 108 Z" fill="#dc2626" stroke="#1f2937" strokeWidth="2" />
                ) : (
                  // ANGRY DOWNWARD POUT / FROWN >:(
                  <path d="M 62 118 Q 71 108 80 118" stroke="#b91c1c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                )
              ) : (
                // Confident pleasant smile :)
                <path d="M 63 110 Q 71 117 79 110" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
              )}

              {/* 
                -------------------------------------------------------------
                4. SMARTPHONE HELD IN KID'S HANDS
                -------------------------------------------------------------
              */}
              {/* Kid's Left Arm reaching forward */}
              <path d="M 20 180 Q -10 160 10 140" stroke="#fed7aa" strokeWidth="12" strokeLinecap="round" />

              {/* The Smartphone */}
              <g transform="translate(-10, 110) rotate(-6)">
                {/* Phone Body */}
                <rect
                  x="0"
                  y="0"
                  width="48"
                  height="86"
                  rx="10"
                  fill="#0f172a"
                  stroke={isSafe ? "#38bdf8" : "#ef4444"}
                  strokeWidth="2.5"
                  filter="drop-shadow(0 8px 16px rgba(0,0,0,0.6))"
                />

                {/* Phone Screen Glass */}
                <rect x="3" y="4" width="42" height="78" rx="7" fill="#020617" />

                {/* Phone Screen Interface Graphics */}
                {stage === 'celebrate' ? (
                  isSafe ? (
                    // Screen shows Green Shield Check
                    <g transform="translate(12, 28)">
                      <circle cx="12" cy="12" r="10" fill="#10b981" />
                      <path d="M 8 12 L 11 15 L 17 9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  ) : (
                    // Screen shows Red Alert Exclamation
                    <g transform="translate(12, 28)">
                      <circle cx="12" cy="12" r="10" fill="#ef4444" />
                      <text x="12" y="17" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">!</text>
                    </g>
                  )
                ) : (
                  // Screen shows Camera reticle and laser sweep
                  <g transform="translate(6, 18)">
                    <rect x="0" y="0" width="30" height="42" rx="3" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="0" y1="20" x2="30" y2="20" stroke="#38bdf8" strokeWidth="1.5" />
                  </g>
                )}

                {/* Phone Camera Lens on Back */}
                <circle cx="8" cy="8" r="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                <circle cx="8" cy="8" r="1" fill="#34d399" />
              </g>

              {/* Kid's Right Hand holding phone */}
              <circle cx="3" cy="165" r="7" fill="#fed7aa" />
              <circle cx="34" cy="170" r="7" fill="#fed7aa" />
            </g>

            {/* 
              -------------------------------------------------------------
              5. FLOATING VERDICT POP-UP SHIELD (STAGE: CELEBRATE)
              -------------------------------------------------------------
            */}
            {stage === 'celebrate' && (
              <g transform="translate(160, 20)">
                {isSafe ? (
                  // GREEN HAPPY VICTORY SHIELD
                  <g filter="drop-shadow(0 0 16px rgba(16,185,129,0.85))">
                    <path
                      d="M 90 10 L 140 30 L 140 85 C 140 120 115 145 90 155 C 65 145 40 120 40 85 L 40 30 Z"
                      fill="url(#shieldGrad)"
                      stroke="#fde047"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />

                    {/* Shield Checkmark Icon */}
                    <path
                      d="M 68 80 L 82 95 L 114 60"
                      stroke="#ffffff"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Floating Stars & Confetti */}
                    <circle cx="25" cy="40" r="4" fill="#fbbf24" className="animate-ping" />
                    <circle cx="155" cy="50" r="5" fill="#34d399" className="animate-bounce" />
                    <circle cx="140" cy="115" r="3.5" fill="#f43f5e" className="animate-pulse" />
                    <circle cx="35" cy="100" r="3" fill="#38bdf8" className="animate-ping" />

                    {/* Floating Result Banner */}
                    <g transform="translate(10, 140)">
                      <rect x="0" y="0" width="160" height="26" rx="13" fill="#022c22" stroke="#34d399" strokeWidth="1.5" />
                      <text x="80" y="17" fill="#6ee7b7" fontSize="8.5" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
                        ✓ 100% SAFE (HAPPY! 😊)
                      </text>
                    </g>
                  </g>
                ) : (
                  // RED ANGRY WARNING SHIELD
                  <g filter="drop-shadow(0 0 18px rgba(239,68,68,0.9))">
                    <path
                      d="M 90 10 L 140 30 L 140 85 C 140 120 115 145 90 155 C 65 145 40 120 40 85 L 40 30 Z"
                      fill="url(#shieldRedGrad)"
                      stroke="#fca5a5"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />

                    {/* Shield Exclamation Warning Icon */}
                    <path
                      d="M 90 55 L 90 90 M 90 105 L 90 110"
                      stroke="#ffffff"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />

                    {/* Warning Sparks */}
                    <circle cx="25" cy="40" r="4" fill="#ef4444" className="animate-ping" />
                    <circle cx="155" cy="50" r="5" fill="#f59e0b" className="animate-pulse" />
                    <circle cx="35" cy="100" r="3.5" fill="#dc2626" className="animate-ping" />

                    {/* Floating Result Banner */}
                    <g transform="translate(5, 140)">
                      <rect x="0" y="0" width="170" height="26" rx="13" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
                      <text x="85" y="17" fill="#fca5a5" fontSize="8" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
                        🚨 UNSAFE / FAKE (ANGRY! 😡)
                      </text>
                    </g>
                  </g>
                )}
              </g>
            )}

            {/* SVG Color Gradients */}
            <defs>
              {/* Dynamic Product Gradients */}
              <linearGradient id="packetGrad_snack_safe" x1="0" y1="0" x2="110" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f59e0b" />
                <stop offset="0.5" stopColor="#ea580c" />
                <stop offset="1" stopColor="#b91c1c" />
              </linearGradient>

              <linearGradient id="packetGrad_cola_unsafe" x1="0" y1="0" x2="110" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#dc2626" />
                <stop offset="0.5" stopColor="#991b1b" />
                <stop offset="1" stopColor="#450a0a" />
              </linearGradient>

              <linearGradient id="packetGrad_juice_safe" x1="0" y1="0" x2="110" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#facc15" />
                <stop offset="0.5" stopColor="#f59e0b" />
                <stop offset="1" stopColor="#d97706" />
              </linearGradient>

              <linearGradient id="packetGrad_candy_unsafe" x1="0" y1="0" x2="110" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7e22ce" />
                <stop offset="0.5" stopColor="#991b1b" />
                <stop offset="1" stopColor="#18181b" />
              </linearGradient>

              {/* Scanning Cones */}
              <linearGradient id="scanConeGrad" x1="270" y1="140" x2="175" y2="160" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="1" stopColor="#34d399" stopOpacity="0.05" />
              </linearGradient>

              <linearGradient id="scanConeRedGrad" x1="270" y1="140" x2="175" y2="160" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f87171" stopOpacity="0.5" />
                <stop offset="1" stopColor="#ef4444" stopOpacity="0.05" />
              </linearGradient>

              {/* Hoodie Gradients */}
              <linearGradient id="hoodieGrad" x1="5" y1="160" x2="140" y2="230" gradientUnits="userSpaceOnUse">
                <stop stopColor="#065f46" />
                <stop offset="0.5" stopColor="#047857" />
                <stop offset="1" stopColor="#064e3b" />
              </linearGradient>

              <linearGradient id="hoodieRedGrad" x1="5" y1="160" x2="140" y2="230" gradientUnits="userSpaceOnUse">
                <stop stopColor="#991b1b" />
                <stop offset="0.5" stopColor="#7f1d1d" />
                <stop offset="1" stopColor="#450a0a" />
              </linearGradient>

              {/* Shields */}
              <linearGradient id="shieldGrad" x1="40" y1="10" x2="140" y2="155" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10b981" />
                <stop offset="0.6" stopColor="#059669" />
                <stop offset="1" stopColor="#047857" />
              </linearGradient>

              <linearGradient id="shieldRedGrad" x1="40" y1="10" x2="140" y2="155" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ef4444" />
                <stop offset="0.6" stopColor="#dc2626" />
                <stop offset="1" stopColor="#991b1b" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 
          -------------------------------------------------------------
          BOTTOM VERIFIED DETAILS CARD
          -------------------------------------------------------------
        */}
        <div className={cn(
          "mt-2 p-3 rounded-2xl border flex items-center justify-between text-xs transition-colors duration-500",
          isSafe
            ? "bg-slate-900/90 border-emerald-500/30"
            : "bg-red-950/40 border-red-500/40"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border",
              isSafe
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
            )}>
              {isSafe ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div>
              <span className="text-xs font-extrabold text-white block">
                {currentItem.name}
              </span>
              <span className={cn(
                "text-[10px] font-semibold",
                isSafe ? "text-emerald-400" : "text-red-400"
              )}>
                {currentItem.funFact}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border",
              isSafe
                ? "bg-emerald-950 text-emerald-300 border-emerald-500/30"
                : "bg-red-950 text-red-300 border-red-500/40"
            )}>
              {currentItem.mrp}
            </span>
            <p className="text-[9px] text-slate-400 mt-0.5">
              {isSafe ? 'Compliant' : 'Non-Compliant'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidScanningStoryAnimation;
