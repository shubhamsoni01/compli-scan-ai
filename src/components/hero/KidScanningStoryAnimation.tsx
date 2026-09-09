import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, Sparkles, Scan, 
  Heart, ThumbsUp, Award, Star, Zap
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface KidScanItem {
  id: string;
  name: string;
  category: string;
  emoji: string;
  packetColor: string;
  packetGradient: string;
  mrp: string;
  fssai: string;
  nutritionNote: string;
  statusBadge: string;
  funFact: string;
}

const ITEMS: KidScanItem[] = [
  {
    id: 'snack',
    name: 'Nutri-Crunch Masala Chips',
    category: 'Healthy Snacking',
    emoji: '🍟',
    packetColor: '#f59e0b',
    packetGradient: 'from-amber-500 via-orange-600 to-red-700',
    mrp: '₹ 15.00',
    fssai: '10012011000168',
    nutritionNote: 'Zero Trans-Fat • 100% Whole Wheat',
    statusBadge: '100% SAFE & COMPLIANT ✓',
    funFact: 'FSSAI Green Veg & Legal Metrology Verified!',
  },
  {
    id: 'juice',
    name: 'Pure Mango Super Juice',
    category: 'Fruit Beverage',
    emoji: '🧃',
    packetColor: '#eab308',
    packetGradient: 'from-yellow-400 via-amber-500 to-orange-600',
    mrp: '₹ 25.00',
    fssai: '10819003000452',
    nutritionNote: 'Real Fruit Pulp • No Artificial Color',
    statusBadge: 'HEALTHY & SAFE DRINK ✓',
    funFact: 'Sugar Limits within Recommended Standard!',
  },
  {
    id: 'biscuit',
    name: 'Choco-Milky Power Cookies',
    category: 'Bakery & Biscuits',
    emoji: '🍪',
    packetColor: '#8b5cf6',
    packetGradient: 'from-indigo-600 via-purple-600 to-pink-600',
    mrp: '₹ 20.00',
    fssai: '10026022001489',
    nutritionNote: 'Fortified with Calcium & Vitamin D',
    statusBadge: 'NUTRITION APPROVED ✓',
    funFact: 'Best Before Date & Batch Verified!',
  },
];

export const KidScanningStoryAnimation: React.FC = () => {
  const [itemIndex, setItemIndex] = useState(0);
  const [stage, setStage] = useState<'aim' | 'scanning' | 'extract' | 'celebrate'>('aim');

  const currentItem = ITEMS[itemIndex];

  // Story cycle: Aim (1.2s) -> Scan Laser (1.8s) -> Extract Data (1.5s) -> Celebrate (2.8s) -> Next
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
    }, 7300);

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
      <div className="z-30 mb-3 flex items-center justify-between w-full max-w-md px-4 py-2 rounded-full bg-slate-900/90 dark:bg-slate-900/95 border border-emerald-500/30 shadow-xl backdrop-blur-xl text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white text-[11px] sm:text-xs">
            {stage === 'aim' && '👦 Kid scans product packet with phone...'}
            {stage === 'scanning' && '⚡ AI Camera reads label declarations...'}
            {stage === 'extract' && '🔍 Checking FSSAI & MRP details...'}
            {stage === 'celebrate' && '🛡️ Verified: 100% Safe & Compliant!'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setItemIndex(idx)}
              className={cn(
                "w-6 h-6 rounded-full text-xs flex items-center justify-center transition-all cursor-pointer",
                itemIndex === idx
                  ? "bg-emerald-500 text-slate-950 scale-110 shadow-md"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              )}
            >
              {item.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Main Glassmorphic Animated Scene Container */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-[#070b12] border border-emerald-500/30 shadow-2xl shadow-emerald-500/15 backdrop-blur-2xl p-4 sm:p-6 min-h-[380px] flex flex-col justify-between">
        {/* Ambient Glowing Aura */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

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
                  fill="url(#packetGrad)"
                  stroke="#ffffff"
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
                <text x="55" y="36" fill="#fef08a" fontSize="8" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
                  CHOMP CRUNCH
                </text>
                <text x="55" y="50" fill="#ffffff" fontSize="9" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
                  MASALA CHIPS
                </text>

                {/* Packet Center Icon */}
                <circle cx="55" cy="80" r="20" fill="rgba(0,0,0,0.3)" />
                <text x="55" y="87" fontSize="20" textAnchor="middle">
                  {currentItem.emoji}
                </text>

                {/* FSSAI Green Veg Dot */}
                <rect x="85" y="24" width="14" height="14" stroke="#22c55e" strokeWidth="1.5" fill="#ffffff" rx="2" />
                <circle cx="92" cy="31" r="3.5" fill="#22c55e" />

                {/* Declarations Micro Table on Packet */}
                <rect x="10" y="106" width="90" height="24" rx="4" fill="rgba(0,0,0,0.5)" />
                <text x="14" y="116" fill="#67e8f9" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
                  MRP {currentItem.mrp}
                </text>
                <text x="58" y="116" fill="#a7f3d0" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
                  NET 70g
                </text>
                <text x="14" y="125" fill="#ffffff" fontSize="5.5" fontFamily="monospace">
                  FSSAI LIC #1001201100
                </text>

                {/* Scanning Target Box Around Packet */}
                {(stage === 'scanning' || stage === 'extract') && (
                  <g>
                    {/* Viewfinder Target Corners */}
                    <path d="M -6 12 L -6 -6 L 12 -6" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 98 -6 L 116 -6 L 116 12" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M -6 138 L -6 156 L 12 156" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 98 156 L 116 156 L 116 138" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
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
                  fill="url(#scanConeGrad)"
                  opacity="0.5"
                />

                {/* Vertical Laser Sweep Line */}
                <motion.line
                  x1="175"
                  y1="90"
                  x2="175"
                  y2="230"
                  stroke="#38bdf8"
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
                <circle cx="160" cy="110" r="2.5" fill="#34d399" className="animate-ping" />
                <circle cx="130" cy="190" r="3" fill="#38bdf8" className="animate-ping" />
                <circle cx="110" cy="140" r="2" fill="#fbbf24" className="animate-ping" />
              </g>
            )}

            {/* 
              -------------------------------------------------------------
              3. THE ANIMATED CHARACTER (KID / YOUNG CONSUMER) (RIGHT)
              -------------------------------------------------------------
            */}
            <g transform="translate(260, 50)">
              {/* Kid's Body (Stylish Hoodie) */}
              <path
                d="M 60 160 C 30 160 10 180 5 230 L 140 230 C 135 180 115 160 85 160 Z"
                fill="url(#hoodieGrad)"
              />
              {/* Hoodie Zipper & Logo */}
              <line x1="72" y1="160" x2="72" y2="230" stroke="#059669" strokeWidth="2.5" />
              <circle cx="95" cy="180" r="5" fill="#34d399" />

              {/* Kid's Head / Face */}
              <circle cx="72" cy="95" r="38" fill="#fed7aa" />

              {/* Kid's Hair (Cool haircut with volume) */}
              <path
                d="M 32 90 C 30 50 60 40 75 40 C 100 40 118 55 115 90 C 108 72 90 70 75 70 C 58 70 42 75 32 90 Z"
                fill="#374151"
              />
              {/* Front hair fringe */}
              <path d="M 40 75 Q 55 60 70 75 Q 85 62 100 78 Q 85 70 70 70 Q 55 70 40 75 Z" fill="#1f2937" />

              {/* Kid's Eyes */}
              {stage === 'celebrate' ? (
                // Happy squinted celebration eyes (Joy expression) ^_^
                <g stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
                  <path d="M 52 95 Q 58 88 64 95" />
                  <path d="M 78 95 Q 84 88 90 95" />
                </g>
              ) : (
                // Focus / attentive scanning eyes
                <g fill="#1f2937">
                  <circle cx="58" cy="93" r="4.5" />
                  <circle cx="84" cy="93" r="4.5" />
                  {/* Eye light reflections */}
                  <circle cx="56.5" cy="91.5" r="1.5" fill="#ffffff" />
                  <circle cx="82.5" cy="91.5" r="1.5" fill="#ffffff" />
                </g>
              )}

              {/* Cheerful Blush */}
              <circle cx="48" cy="103" r="5" fill="#fb7185" opacity="0.5" />
              <circle cx="94" cy="103" r="5" fill="#fb7185" opacity="0.5" />

              {/* Kid's Smile / Mouth */}
              {stage === 'celebrate' ? (
                // Big Happy Open Smile with teeth :D
                <path d="M 60 108 Q 71 126 82 108 Z" fill="#dc2626" stroke="#1f2937" strokeWidth="2" />
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
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  filter="drop-shadow(0 8px 16px rgba(0,0,0,0.6))"
                />

                {/* Phone Screen Glass */}
                <rect x="3" y="4" width="42" height="78" rx="7" fill="#020617" />

                {/* Phone Camera Viewfinder Screen Graphics */}
                {stage === 'celebrate' ? (
                  // Screen shows Green Shield
                  <g transform="translate(12, 28)">
                    <circle cx="12" cy="12" r="10" fill="#10b981" />
                    <path d="M 8 12 L 11 15 L 17 9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
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
              5. FLOATING CELEBRATION RESULT SHIELD (ON STAGE: CELEBRATE)
              -------------------------------------------------------------
            */}
            {stage === 'celebrate' && (
              <g transform="translate(160, 20)">
                {/* Result Shield Pop-up */}
                <g filter="drop-shadow(0 0 15px rgba(16,185,129,0.8))">
                  {/* Shield Graphic */}
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
                </g>

                {/* Floating Stars & Confetti */}
                <circle cx="25" cy="40" r="4" fill="#fbbf24" className="animate-ping" />
                <circle cx="155" cy="50" r="5" fill="#34d399" className="animate-bounce" />
                <circle cx="140" cy="115" r="3.5" fill="#f43f5e" className="animate-pulse" />
                <circle cx="35" cy="100" r="3" fill="#38bdf8" className="animate-ping" />

                {/* Floating Result Banner */}
                <g transform="translate(10, 140)">
                  <rect x="0" y="0" width="160" height="26" rx="13" fill="#022c22" stroke="#34d399" strokeWidth="1.5" />
                  <text x="80" y="17" fill="#6ee7b7" fontSize="9" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
                    ✓ 100% SAFE & COMPLIANT!
                  </text>
                </g>
              </g>
            )}

            {/* SVG Color Gradients */}
            <defs>
              <linearGradient id="packetGrad" x1="0" y1="0" x2="110" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f59e0b" />
                <stop offset="0.5" stopColor="#ea580c" />
                <stop offset="1" stopColor="#b91c1c" />
              </linearGradient>

              <linearGradient id="scanConeGrad" x1="270" y1="140" x2="175" y2="160" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="1" stopColor="#34d399" stopOpacity="0.05" />
              </linearGradient>

              <linearGradient id="hoodieGrad" x1="5" y1="160" x2="140" y2="230" gradientUnits="userSpaceOnUse">
                <stop stopColor="#065f46" />
                <stop offset="0.5" stopColor="#047857" />
                <stop offset="1" stopColor="#064e3b" />
              </linearGradient>

              <linearGradient id="shieldGrad" x1="40" y1="10" x2="140" y2="155" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10b981" />
                <stop offset="0.6" stopColor="#059669" />
                <stop offset="1" stopColor="#047857" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 
          -------------------------------------------------------------
          BOTTOM VERIFIED DETAILS CARD
          -------------------------------------------------------------
        */}
        <div className="mt-2 p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm shrink-0 border border-emerald-500/30">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="text-xs font-extrabold text-white block">
                {currentItem.name}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">
                {currentItem.nutritionNote}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono font-bold border border-emerald-500/30">
              {currentItem.mrp}
            </span>
            <p className="text-[9px] text-slate-400 mt-0.5">SIH26034 Tested</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidScanningStoryAnimation;
