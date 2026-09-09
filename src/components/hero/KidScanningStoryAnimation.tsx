import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Sparkles, Scan, 
  Heart, ThumbsUp, Award, Star, Zap, ShieldAlert, Volume2, VolumeX,
  Flame, FileCheck, Scale, Eye
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
  score: number;
  grade: string;
  stampText: string;
  dataTokens: string[];
  nutritionNote: string;
  statusBadge: string;
  funFact: string;
  legalCitation: string;
}

const ITEMS: KidScanItem[] = [
  {
    id: 'snack_safe',
    name: 'Nutri-Crunch Masala Chips',
    status: 'safe',
    category: 'Healthy Snacking',
    emoji: '🍟',
    packetGradient: 'from-amber-500 via-orange-600 to-red-700',
    packetBorder: '#10b981',
    mrp: '₹ 15.00',
    fssai: 'LIC #10012011000168 (Valid)',
    expiry: 'EXP: 15 OCT 2026',
    vegStatus: 'veg',
    score: 98,
    grade: 'A+ VERIFIED',
    stampText: '★ FSSAI & METROLOGY APPROVED ★',
    dataTokens: ['FSSAI:OK', '₹15.00', 'EXP:2026', 'VEG:✓', 'TRANS:0g'],
    nutritionNote: 'Zero Trans-Fat • 100% Whole Wheat',
    statusBadge: '100% SAFE & COMPLIANT ✓',
    funFact: 'Kid is HAPPY! All 22+ standards certified.',
    legalCitation: 'FSSAI Sec 23 & LM PCR Rule 6(1)',
  },
  {
    id: 'cola_unsafe',
    name: 'Spicy Chomp (Adulterated)',
    status: 'unsafe',
    category: 'Hazardous Snack',
    emoji: '🌶️',
    packetGradient: 'from-red-600 via-rose-800 to-slate-900',
    packetBorder: '#ef4444',
    mrp: '₹ 35.00 (Overprinted)',
    fssai: 'FAKE / NOT FOUND ❌',
    expiry: 'EXPIRED 3 MONTHS AGO ⚠️',
    vegStatus: 'missing',
    score: 23,
    grade: 'F REJECTED',
    stampText: '★ VIOLATION DETECTED: REJECTED ★',
    dataTokens: ['NO_LIC!', 'EXP:FAIL', 'VEG:MISSING', 'ALLERGEN:!', 'OVER_MRP'],
    nutritionNote: 'High Adulteration • Unregistered Packer',
    statusBadge: '🚨 UNSAFE / FAKE PRODUCT!',
    funFact: 'Kid is ANGRY! Fake license & expired batch.',
    legalCitation: 'Non-compliant: FSS Packaging Reg. 2.2',
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
    expiry: 'EXP: 20 DEC 2026',
    vegStatus: 'veg',
    score: 96,
    grade: 'A+ VERIFIED',
    stampText: '★ GOVT OF INDIA CERTIFIED ★',
    dataTokens: ['PULP:100%', '₹25.00', 'SUGAR:STD', 'NO_COLOUR', 'FSSAI:OK'],
    nutritionNote: 'Real Fruit Pulp • No Artificial Color',
    statusBadge: 'HEALTHY & SAFE DRINK ✓',
    funFact: 'Kid is HAPPY! Pure healthy ingredients.',
    legalCitation: 'FSSAI Beverage Standards 2020',
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
    score: 18,
    grade: 'F REJECTED',
    stampText: '★ RECALLED: HAZARDOUS FOOD ★',
    dataTokens: ['TOXIC_COLOUR', 'NO_EXPIRY', 'NO_FSSAI', 'SYNTH_SWEET', 'ILLEGAL_MRP'],
    nutritionNote: 'Harmful Chemical Additives Detected',
    statusBadge: '🚨 REJECTED: HAZARDOUS FOOD!',
    funFact: 'Kid is ANGRY! Harmful additives & no expiry.',
    legalCitation: 'Seizure under FSS Act Section 38',
  },
];

// Web Audio API Synthesizer for zero-dependency realistic sci-fi sound effects
const playAudioEffect = (type: 'flash' | 'scan' | 'safe' | 'unsafe') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (type === 'flash') {
      // Camera Shutter Snap & Flash Click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'scan') {
      // Futuristic Holographic Radar Laser Sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(920, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'safe') {
      // Happy Melodic Victory Chime (C5 -> E5 -> G5 -> C6)
      const playNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };
      playNote(523.25, 0, 0.18); // C5
      playNote(659.25, 0.1, 0.22); // E5
      playNote(783.99, 0.2, 0.3); // G5
      playNote(1046.50, 0.32, 0.5); // C6
    } else if (type === 'unsafe') {
      // Low Warning Alert Buzzer (Double Alert Sawtooth Pulse)
      const playBuzz = (start: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime + start);
        osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + start + 0.2);
        gain.gain.setValueAtTime(0.22, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + 0.2);
      };
      playBuzz(0);
      playBuzz(0.24);
    }
  } catch (e) {
    // AudioContext blocked or unsupported
  }
};

export const KidScanningStoryAnimation: React.FC = () => {
  const [itemIndex, setItemIndex] = useState(0);
  const [stage, setStage] = useState<'aim' | 'flash' | 'scanning' | 'extract' | 'verdict'>('aim');
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentItem = ITEMS[itemIndex];
  const isSafe = currentItem.status === 'safe';

  // Trigger sounds on stage changes when sound is enabled
  const triggerAudio = (type: 'flash' | 'scan' | 'safe' | 'unsafe') => {
    if (soundEnabled) {
      playAudioEffect(type);
    }
  };

  // Story Cycle: Aim (1.0s) -> Flash Pulse (0.4s) -> Cyber Scan & Data Stream (2.0s) -> Extract (1.4s) -> Verdict & Stamp (3.5s) -> Next
  useEffect(() => {
    if (isPaused) return;

    let t0: any, t1: any, t2: any, t3: any, t4: any;

    setStage('aim');

    t0 = setTimeout(() => {
      setStage('flash');
      triggerAudio('flash');
    }, 1000);

    t1 = setTimeout(() => {
      setStage('scanning');
      triggerAudio('scan');
    }, 1400);

    t2 = setTimeout(() => {
      setStage('extract');
    }, 3400);

    t3 = setTimeout(() => {
      setStage('verdict');
      triggerAudio(isSafe ? 'safe' : 'unsafe');
    }, 4800);

    t4 = setTimeout(() => {
      setItemIndex((prev) => (prev + 1) % ITEMS.length);
    }, 8400);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [itemIndex, isPaused, soundEnabled, isSafe]);

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      playAudioEffect('flash'); // Preview chirp on enable
    }
  };

  return (
    <div 
      className="w-full max-w-xl mx-auto flex flex-col items-center select-none cursor-pointer"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={() => {
        // User interaction unlocks browser audio policy
        if (soundEnabled) {
          playAudioEffect('scan');
        }
      }}
    >
      {/* 
        -------------------------------------------------------------
        1. TOP SCENARIO SELECTOR & SOUND TOGGLE
        -------------------------------------------------------------
      */}
      <div className={cn(
        "z-30 mb-3 flex items-center justify-between w-full max-w-md px-3.5 py-2 rounded-2xl shadow-xl backdrop-blur-xl text-xs transition-all duration-500",
        isSafe
          ? "bg-slate-900/90 border border-emerald-500/40 shadow-emerald-500/10"
          : "bg-slate-900/90 border border-red-500/50 shadow-red-500/15"
      )}>
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              isSafe ? "bg-emerald-400" : "bg-red-400"
            )}></span>
            <span className={cn(
              "relative inline-flex rounded-full h-2.5 w-2.5",
              isSafe ? "bg-emerald-500" : "bg-red-500"
            )}></span>
          </span>
          <span className="font-semibold text-white text-[11px] sm:text-xs tracking-tight">
            {stage === 'aim' && '👦 Targeting product label with smartphone...'}
            {stage === 'flash' && '📸 Camera Aperture Lock & Flash Capture...'}
            {stage === 'scanning' && '⚡ AI Streaming Holographic Data Stream...'}
            {stage === 'extract' && '🔍 Parsing 22+ Mandatory Legal Metrology Rules...'}
            {stage === 'verdict' && (
              isSafe 
                ? '🛡️ 100% SAFE: Official Stamp Approved! (Kid: 😊)' 
                : '🚨 VIOLATION: Non-Compliance Flagged! (Kid: 😡)'
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                setItemIndex(idx);
                setStage('aim');
                if (soundEnabled) playAudioEffect('scan');
              }}
              className={cn(
                "w-7 h-7 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer font-bold",
                itemIndex === idx
                  ? item.status === 'safe'
                    ? "bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300"
                    : "bg-red-500 text-white scale-110 shadow-lg shadow-red-500/30 ring-2 ring-red-300"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              )}
              title={item.name}
            >
              {item.emoji}
            </button>
          ))}

          {/* Sound / Visual FX Interactive Toggle */}
          <button
            onClick={handleToggleSound}
            className={cn(
              "px-2 py-1 rounded-xl text-[10px] font-bold border flex items-center gap-1 transition-all ml-1 cursor-pointer",
              soundEnabled
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white"
            )}
            title={soundEnabled ? "Click to Mute Sound" : "Click to Enable Audio FX"}
          >
            {soundEnabled ? (
              <>
                <Volume2 size={13} className="text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline font-mono">SOUND ON</span>
              </>
            ) : (
              <>
                <VolumeX size={13} />
                <span className="hidden sm:inline font-mono">MUTED</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 
        -------------------------------------------------------------
        2. MAIN GLASSMORPHIC CYBER HUD CANVA
        -------------------------------------------------------------
      */}
      <div className={cn(
        "relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/95 via-[#080d1a] to-[#03060f] border shadow-2xl backdrop-blur-2xl p-4 sm:p-6 min-h-[400px] flex flex-col justify-between transition-colors duration-500",
        isSafe
          ? "border-emerald-500/30 shadow-emerald-500/15"
          : "border-red-500/40 shadow-red-500/20"
      )}>
        {/* Dynamic Glow Auroras */}
        <div className={cn(
          "absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none -z-10 transition-all duration-700",
          isSafe ? "bg-emerald-500/15" : "bg-red-500/20"
        )} />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* 
          -------------------------------------------------------------
          TOP CYBER HUD: SCORE GAUGE (LEFT) & MINISTRY REACTION (RIGHT)
          -------------------------------------------------------------
        */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between gap-2 pointer-events-none">
          {/* Left: Radial Score Gauge */}
          <div className="flex items-center gap-2.5 bg-slate-950/85 border border-slate-800 px-3 py-1.5 rounded-2xl backdrop-blur-md shadow-lg pointer-events-auto">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="3.5" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke={isSafe ? '#10b981' : '#ef4444'}
                  strokeWidth="3.5"
                  strokeDasharray="88"
                  strokeDashoffset={stage === 'aim' ? 88 : 88 - (88 * currentItem.score) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  filter={isSafe ? "drop-shadow(0 0 4px #10b981)" : "drop-shadow(0 0 4px #ef4444)"}
                />
              </svg>
              <span className={cn(
                "absolute font-mono font-black text-[10px]",
                isSafe ? "text-emerald-400" : "text-red-400"
              )}>
                {stage === 'aim' ? '--' : `${currentItem.score}%`}
              </span>
            </div>

            <div className="hidden sm:block">
              <span className="text-[8px] font-mono uppercase text-slate-400 block tracking-wider">
                COMPLIANCE
              </span>
              <span className={cn(
                "text-[9px] font-black tracking-wide px-1.5 py-0.2 rounded inline-block font-mono",
                isSafe ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30" : "bg-red-950 text-red-300 border border-red-500/30"
              )}>
                {stage === 'aim' ? 'SCANNING...' : currentItem.grade}
              </span>
            </div>
          </div>

          {/* Right: Ministry of Consumer Affairs Live Reaction Badge (Happy vs Angry) */}
          <motion.div 
            key={currentItem.id + stage}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-2xl border backdrop-blur-md shadow-lg pointer-events-auto transition-colors duration-500",
              isSafe
                ? "bg-slate-950/90 border-emerald-500/40 shadow-emerald-500/10"
                : "bg-slate-950/90 border-red-500/50 shadow-red-500/15"
            )}
          >
            {/* Indian Tricolor Strip & Ashoka Emblem */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-1 h-7 rounded-full overflow-hidden flex flex-col">
                <div className="flex-1 bg-[#FF9933]" />
                <div className="flex-1 bg-[#FFFFFF]" />
                <div className="flex-1 bg-[#138808]" />
              </div>
              <img
                src="/assets/ministry-emblem-transparent-gold.png"
                alt="Ministry of Consumer Affairs"
                className="h-6 w-auto object-contain drop-shadow-sm"
                onError={(e) => {
                  // Fallback to text emoji if img not found
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-extrabold uppercase tracking-wider text-amber-400">
                  GOVT. OF INDIA
                </span>
                <span className={cn(
                  "text-[8px] font-mono px-1 py-0.2 rounded font-bold uppercase",
                  isSafe ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30" : "bg-red-950 text-red-300 border border-red-500/30"
                )}>
                  {isSafe ? "HAPPY 😊" : "ANGRY 😡"}
                </span>
              </div>
              <span className="text-[10px] font-bold text-white tracking-tight leading-tight">
                Ministry of Consumer Affairs
              </span>
              <span className={cn(
                "text-[8.5px] font-semibold leading-tight",
                isSafe ? "text-emerald-400" : "text-red-400"
              )}>
                {isSafe 
                  ? "✓ Approved: 100% Compliant" 
                  : "🚨 Action: Non-Compliance Notice Issued!"}
              </span>
            </div>
          </motion.div>
        </div>

        {/* 
          -------------------------------------------------------------
          CAMERA FLASH PULSE EFFECT (ON STAGE: FLASH)
          -------------------------------------------------------------
        */}
        {stage === 'flash' && (
          <div className="absolute inset-0 bg-white/25 z-40 pointer-events-none animate-ping rounded-3xl" />
        )}

        {/* 
          -------------------------------------------------------------
          ANIMATED SVG STAGE (PACKET + FLYING DATA + KID + STAMP)
          -------------------------------------------------------------
        */}
        <div className="relative w-full h-[280px] sm:h-[300px] flex items-center justify-center mt-8 sm:mt-6">
          <svg
            viewBox="0 0 520 320"
            className="w-full h-full max-w-[500px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 
              ---------------------------------------------------------
              A. SUSPECT PRODUCT PACKET (LEFT SIDE)
              ---------------------------------------------------------
            */}
            <g transform="translate(60, 60)">
              <motion.g
                animate={{
                  y: [-3, 3, -3],
                  rotate: [-0.8, 0.8, -0.8],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Packet Glow Boundary */}
                <rect
                  x="-2"
                  y="-2"
                  width="124"
                  height="164"
                  rx="16"
                  fill="none"
                  stroke={isSafe ? '#10b981' : '#ef4444'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity={stage === 'extract' || stage === 'verdict' ? 0.9 : 0.4}
                />

                {/* Packet Main Body */}
                <rect
                  x="0"
                  y="0"
                  width="120"
                  height="160"
                  rx="14"
                  fill={`url(#pkgGrad_${currentItem.id})`}
                  stroke={isSafe ? "#ffffff" : "#f87171"}
                  strokeWidth="1.5"
                  filter="drop-shadow(0 14px 28px rgba(0,0,0,0.6))"
                />

                {/* Top Seal & Crimps */}
                <rect x="0" y="0" width="120" height="16" rx="3" fill="#0f172a" opacity="0.45" />
                {[15, 30, 45, 60, 75, 90, 105].map((pos) => (
                  <line key={pos} x1={pos} y1="2" x2={pos} y2="14" stroke="#ffffff" strokeWidth="1.2" opacity="0.5" />
                ))}

                {/* Bottom Seal */}
                <rect x="0" y="146" width="120" height="14" rx="3" fill="#0f172a" opacity="0.45" />

                {/* Brand & Name */}
                <text x="60" y="32" fill="#fef08a" fontSize="7.5" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
                  {isSafe ? 'PREMIUM ASSURED' : '⚠️ UNVERIFIED BRAND'}
                </text>
                <text x="60" y="46" fill="#ffffff" fontSize="8.5" fontFamily="sans-serif" fontWeight="800" textAnchor="middle">
                  {currentItem.name.split(' ')[0]} {currentItem.name.split(' ')[1]}
                </text>

                {/* Center Graphic */}
                <circle cx="60" cy="76" r="21" fill="rgba(0,0,0,0.35)" />
                <text x="60" y="84" fontSize="22" textAnchor="middle">
                  {currentItem.emoji}
                </text>

                {/* Veg / Non-Veg / Missing Dot */}
                {currentItem.vegStatus === 'veg' ? (
                  <g transform="translate(94, 18)">
                    <rect x="0" y="0" width="14" height="14" stroke="#22c55e" strokeWidth="1.5" fill="#ffffff" rx="2" />
                    <circle cx="7" cy="7" r="3.5" fill="#22c55e" />
                  </g>
                ) : (
                  <g transform="translate(90, 16)">
                    <rect x="0" y="0" width="22" height="16" stroke="#ef4444" strokeWidth="1.5" fill="#450a0a" rx="2" strokeDasharray="2 2" />
                    <text x="11" y="11" fill="#fca5a5" fontSize="6.5" fontWeight="bold" textAnchor="middle">MISSING</text>
                  </g>
                )}

                {/* Nutrition & Declarations On-Pouch Micro Table */}
                <rect x="8" y="104" width="104" height="34" rx="4" fill="rgba(2,6,23,0.75)" stroke="#334155" strokeWidth="0.8" />
                <text x="12" y="115" fill="#93c5fd" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
                  MRP {currentItem.mrp}
                </text>
                <text 
                  x="12" 
                  y="124" 
                  fill={isSafe ? '#86efac' : '#f87171'} 
                  fontSize="6.2" 
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  FSSAI: {currentItem.fssai.split(' ')[0]} {currentItem.fssai.split(' ')[1]}
                </text>
                <text 
                  x="12" 
                  y="133" 
                  fill={isSafe ? '#cbd5e1' : '#fca5a5'} 
                  fontSize="5.8" 
                  fontFamily="monospace"
                >
                  {currentItem.expiry}
                </text>

                {/* Viewfinder Reticle Corners during scanning */}
                {(stage === 'scanning' || stage === 'extract') && (
                  <g>
                    <path d="M -6 12 L -6 -6 L 12 -6" stroke={isSafe ? "#34d399" : "#f87171"} strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 108 -6 L 126 -6 L 126 12" stroke={isSafe ? "#34d399" : "#f87171"} strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M -6 148 L -6 166 L 12 166" stroke={isSafe ? "#34d399" : "#f87171"} strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 108 166 L 126 166 L 126 148" stroke={isSafe ? "#34d399" : "#f87171"} strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                )}
              </motion.g>
            </g>

            {/* 
              ---------------------------------------------------------
              B. HOLOGRAPHIC LASER BEAM & FLYING DATA STREAM PARTICLES
              ---------------------------------------------------------
            */}
            {(stage === 'scanning' || stage === 'extract') && (
              <g>
                {/* 3D Holographic Cone */}
                <polygon
                  points="285,145 185,75 185,225"
                  fill={isSafe ? "url(#holoConeGrad)" : "url(#holoConeRedGrad)"}
                  opacity="0.6"
                />

                {/* Vertical Laser Sweep Line */}
                <motion.line
                  x1="185"
                  y1="75"
                  x2="185"
                  y2="225"
                  stroke={isSafe ? '#38bdf8' : '#f43f5e'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 10px #38bdf8)"
                  animate={{
                    x1: [185, 60, 185],
                    x2: [185, 60, 185],
                  }}
                  transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Flying OCR Data Streams (Floating Token Badges Arcing to Phone) */}
                {currentItem.dataTokens.map((tok, idx) => (
                  <motion.g
                    key={tok}
                    initial={{ x: 140, y: 90 + idx * 25, opacity: 0, scale: 0.6 }}
                    animate={{ 
                      x: [140, 210, 275], 
                      y: [90 + idx * 25, 120 + (idx % 2 === 0 ? -15 : 15), 145],
                      opacity: [0, 1, 0],
                      scale: [0.7, 1, 0.4]
                    }}
                    transition={{ 
                      duration: 1.8, 
                      repeat: Infinity, 
                      delay: idx * 0.35, 
                      ease: 'easeInOut' 
                    }}
                  >
                    <rect x="0" y="0" width="48" height="14" rx="3" fill="#020617" stroke={isSafe ? '#34d399' : '#ef4444'} strokeWidth="1" />
                    <text x="24" y="10" fill={isSafe ? '#6ee7b7' : '#fca5a5'} fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                      {tok}
                    </text>
                  </motion.g>
                ))}
              </g>
            )}

            {/* 
              ---------------------------------------------------------
              C. THE ANIMATED CHARACTER (KID) (RIGHT SIDE)
              ---------------------------------------------------------
            */}
            <g transform="translate(280, 45)">
              {/* Hoodie Body */}
              <path
                d="M 65 160 C 35 160 15 180 10 235 L 145 235 C 140 180 120 160 90 160 Z"
                fill={isSafe ? "url(#kidGrad)" : "url(#kidRedGrad)"}
              />
              {/* Zipper & Accent */}
              <line x1="77" y1="160" x2="77" y2="235" stroke={isSafe ? "#059669" : "#991b1b"} strokeWidth="2.5" />
              <circle cx="100" cy="180" r="5" fill={isSafe ? "#34d399" : "#f87171"} />

              {/* Head */}
              <circle cx="77" cy="95" r="38" fill="#fed7aa" />

              {/* Hair */}
              <path
                d="M 37 90 C 35 50 65 38 80 38 C 105 38 123 52 120 90 C 113 72 95 68 80 68 C 63 68 47 75 37 90 Z"
                fill="#374151"
              />
              <path d="M 45 74 Q 60 58 75 74 Q 90 60 105 76 Q 90 68 75 68 Q 60 68 45 74 Z" fill="#111827" />

              {/* 
                EXPRESSIONS:
                - VERDICT & SAFE => HAPPY (Joy smile, squint eyes ^_^)
                - VERDICT & UNSAFE => ANGRY (>:( sharp slanted brows, frown, steam vein 💢)
              */}
              {stage === 'verdict' ? (
                isSafe ? (
                  // HAPPY JOYFUL CELEBRATION EYES ^_^
                  <g stroke="#1f2937" strokeWidth="3.2" strokeLinecap="round">
                    <path d="M 57 95 Q 63 87 69 95" />
                    <path d="M 83 95 Q 89 87 95 95" />
                  </g>
                ) : (
                  // ANGRY SLANTED EYEBROWS & EYES >:(
                  <g>
                    {/* Furrowed angry eyebrows */}
                    <path d="M 51 83 L 71 89" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M 101 83 L 81 89" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" />
                    
                    {/* Sharp indignant eyes */}
                    <circle cx="63" cy="95" r="4.5" fill="#1f2937" />
                    <circle cx="89" cy="95" r="4.5" fill="#1f2937" />
                    <circle cx="61.5" cy="93.5" r="1.2" fill="#ffffff" />
                    <circle cx="87.5" cy="93.5" r="1.2" fill="#ffffff" />

                    {/* Anime Anger Vein 💢 / Shockwave mark */}
                    <g transform="translate(105, 42) scale(0.85)">
                      <path d="M 0 5 L 14 5 M 7 -2 L 7 12 M 1 -1 L 13 11 M 13 -1 L 1 11" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                    </g>
                  </g>
                )
              ) : (
                // Attentive focus eyes
                <g fill="#1f2937">
                  <circle cx="63" cy="93" r="4.5" />
                  <circle cx="89" cy="93" r="4.5" />
                  <circle cx="61.5" cy="91.5" r="1.5" fill="#ffffff" />
                  <circle cx="87.5" cy="91.5" r="1.5" fill="#ffffff" />
                </g>
              )}

              {/* Cheeks Emotion */}
              {isSafe ? (
                <g>
                  <circle cx="53" cy="103" r="5" fill="#fb7185" opacity="0.5" />
                  <circle cx="99" cy="103" r="5" fill="#fb7185" opacity="0.5" />
                </g>
              ) : (
                <g>
                  <circle cx="53" cy="103" r="5" fill="#ef4444" opacity="0.65" />
                  <circle cx="99" cy="103" r="5" fill="#ef4444" opacity="0.65" />
                </g>
              )}

              {/* Mouth */}
              {stage === 'verdict' ? (
                isSafe ? (
                  // Big Happy Smile :D
                  <path d="M 65 108 Q 76 126 87 108 Z" fill="#dc2626" stroke="#1f2937" strokeWidth="2" />
                ) : (
                  // ANGRY DOWNWARD FROWN >:(
                  <path d="M 67 118 Q 76 108 85 118" stroke="#b91c1c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                )
              ) : (
                // Pleasant smile
                <path d="M 68 110 Q 76 116 84 110" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
              )}

              {/* Left Arm holding phone */}
              <path d="M 25 180 Q -5 160 15 140" stroke="#fed7aa" strokeWidth="12" strokeLinecap="round" />

              {/* Smartphone Body */}
              <g transform="translate(-6, 110) rotate(-6)">
                <rect
                  x="0"
                  y="0"
                  width="50"
                  height="90"
                  rx="10"
                  fill="#0f172a"
                  stroke={isSafe ? "#38bdf8" : "#ef4444"}
                  strokeWidth="2.5"
                  filter="drop-shadow(0 8px 18px rgba(0,0,0,0.7))"
                />

                {/* Phone Glass */}
                <rect x="3" y="4" width="44" height="82" rx="7" fill="#020617" />

                {/* Phone Screen Graphic */}
                {stage === 'verdict' ? (
                  isSafe ? (
                    // Green Verified Shield on Screen
                    <g transform="translate(14, 28)">
                      <circle cx="11" cy="11" r="11" fill="#10b981" />
                      <path d="M 7 11 L 10 14 L 16 8" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  ) : (
                    // Red Warning Exclamation on Screen
                    <g transform="translate(14, 28)">
                      <circle cx="11" cy="11" r="11" fill="#ef4444" />
                      <text x="11" y="16" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">!</text>
                    </g>
                  )
                ) : (
                  // Active OCR Reticle & Scanner Sweep
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
              D. OFFICIAL GOVT FSSAI RUBBER STAMP & VERDICT SHIELD
              ---------------------------------------------------------
            */}
            {stage === 'verdict' && (
              <g transform="translate(170, 20)">
                {isSafe ? (
                  // GREEN SAFE VERDICT + OFFICIAL CIRCULAR STAMP
                  <motion.g
                    initial={{ scale: 2, rotate: -25, opacity: 0 }}
                    animate={{ scale: 1, rotate: -6, opacity: 1 }}
                    transition={{ type: 'spring', damping: 14, stiffness: 200 }}
                  >
                    {/* Glowing Shield */}
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
                    </g>

                    {/* Official Rubber Stamp Ring */}
                    <g transform="translate(90, 85)">
                      <circle cx="0" cy="0" r="42" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="3 2" />
                      <circle cx="0" cy="0" r="38" fill="none" stroke="#34d399" strokeWidth="1.5" />
                      <text x="0" y="-26" fill="#6ee7b7" fontSize="5.5" fontFamily="monospace" fontWeight="900" textAnchor="middle">
                        ★ GOVT OF INDIA • FSSAI ★
                      </text>
                      <text x="0" y="32" fill="#6ee7b7" fontSize="5.5" fontFamily="monospace" fontWeight="900" textAnchor="middle">
                        100% LEGAL COMPLIANT
                      </text>
                    </g>

                    {/* Confetti */}
                    <circle cx="20" cy="35" r="4" fill="#fbbf24" className="animate-ping" />
                    <circle cx="160" cy="45" r="4.5" fill="#34d399" className="animate-bounce" />
                    <circle cx="145" cy="120" r="3" fill="#38bdf8" className="animate-pulse" />

                    {/* Bottom Pill */}
                    <g transform="translate(5, 142)">
                      <rect x="0" y="0" width="170" height="26" rx="13" fill="#022c22" stroke="#34d399" strokeWidth="1.5" />
                      <text x="85" y="17" fill="#6ee7b7" fontSize="8.5" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
                        ✓ 100% SAFE (HAPPY! 😊)
                      </text>
                    </g>
                  </motion.g>
                ) : (
                  // RED NON-COMPLIANCE VERDICT + REJECTED STAMP
                  <motion.g
                    initial={{ scale: 2, rotate: 25, opacity: 0 }}
                    animate={{ scale: 1, rotate: 6, opacity: 1 }}
                    transition={{ type: 'spring', damping: 14, stiffness: 200 }}
                  >
                    {/* Glowing Warning Shield */}
                    <g filter="drop-shadow(0 0 20px rgba(239,68,68,0.9))">
                      <path
                        d="M 90 10 L 140 30 L 140 85 C 140 120 115 145 90 155 C 65 145 40 120 40 85 L 40 30 Z"
                        fill="url(#shieldGradRed)"
                        stroke="#fca5a5"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M 90 55 L 90 90 M 90 105 L 90 110"
                        stroke="#ffffff"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* Official Rubber Stamp Ring */}
                    <g transform="translate(90, 85)">
                      <circle cx="0" cy="0" r="42" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeDasharray="3 2" />
                      <circle cx="0" cy="0" r="38" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                      <text x="0" y="-26" fill="#fca5a5" fontSize="5.5" fontFamily="monospace" fontWeight="900" textAnchor="middle">
                        ★ REJECTED • FSO NOTICE ★
                      </text>
                      <text x="0" y="32" fill="#fca5a5" fontSize="5.5" fontFamily="monospace" fontWeight="900" textAnchor="middle">
                        NON-COMPLIANT VIOLATION
                      </text>
                    </g>

                    {/* Warning Sparkles */}
                    <circle cx="20" cy="40" r="4" fill="#ef4444" className="animate-ping" />
                    <circle cx="160" cy="50" r="4.5" fill="#f59e0b" className="animate-pulse" />

                    {/* Bottom Pill */}
                    <g transform="translate(0, 142)">
                      <rect x="0" y="0" width="180" height="26" rx="13" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
                      <text x="90" y="17" fill="#fca5a5" fontSize="8" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
                        🚨 UNSAFE / FAKE (ANGRY! 😡)
                      </text>
                    </g>
                  </motion.g>
                )}
              </g>
            )}

            {/* Gradient Definitions */}
            <defs>
              {ITEMS.map((item) => (
                <linearGradient key={item.id} id={`pkgGrad_${item.id}`} x1="0" y1="0" x2="120" y2="160" gradientUnits="userSpaceOnUse">
                  <stop stopColor={item.status === 'safe' ? '#f59e0b' : '#dc2626'} />
                  <stop offset="0.5" stopColor={item.status === 'safe' ? '#ea580c' : '#991b1b'} />
                  <stop offset="1" stopColor={item.status === 'safe' ? '#b91c1c' : '#450a0a'} />
                </linearGradient>
              ))}

              <linearGradient id="holoConeGrad" x1="285" y1="145" x2="185" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" stopOpacity="0.5" />
                <stop offset="1" stopColor="#34d399" stopOpacity="0.05" />
              </linearGradient>

              <linearGradient id="holoConeRedGrad" x1="285" y1="145" x2="185" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f87171" stopOpacity="0.5" />
                <stop offset="1" stopColor="#ef4444" stopOpacity="0.05" />
              </linearGradient>

              <linearGradient id="kidGrad" x1="10" y1="160" x2="145" y2="235" gradientUnits="userSpaceOnUse">
                <stop stopColor="#065f46" />
                <stop offset="0.5" stopColor="#047857" />
                <stop offset="1" stopColor="#064e3b" />
              </linearGradient>

              <linearGradient id="kidRedGrad" x1="10" y1="160" x2="145" y2="235" gradientUnits="userSpaceOnUse">
                <stop stopColor="#991b1b" />
                <stop offset="0.5" stopColor="#7f1d1d" />
                <stop offset="1" stopColor="#450a0a" />
              </linearGradient>

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
          3. BOTTOM REAL-TIME DEPARTMENT INTELLIGENCE CARD
          -------------------------------------------------------------
        */}
        <div className={cn(
          "mt-2 p-3 rounded-2xl border transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs",
          isSafe
            ? "bg-slate-900/90 border-emerald-500/30 shadow-lg shadow-emerald-500/10"
            : "bg-red-950/40 border-red-500/40 shadow-lg shadow-red-500/10"
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
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white block">
                  {currentItem.name}
                </span>
                <span className={cn(
                  "text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase",
                  isSafe ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40" : "bg-red-950 text-red-300 border border-red-500/40"
                )}>
                  {currentItem.category}
                </span>
              </div>

              <span className={cn(
                "text-[10px] font-semibold mt-0.5 block",
                isSafe ? "text-emerald-400" : "text-red-400"
              )}>
                {currentItem.funFact}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-1.5 sm:pt-0 border-slate-800">
            <span className="text-[10px] text-slate-300 font-mono block font-semibold">
              {currentItem.legalCitation}
            </span>
            <p className="text-[9px] text-slate-400 mt-0.5">
              SIH Problem Statement Solver
            </p>
          </div>
        </div>

        {/* 
          -------------------------------------------------------------
          4. INTERACTIVE CLICK-TO-TEST SAMPLE SELECTOR (SIH DEMO BAR)
          -------------------------------------------------------------
        */}
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 animate-pulse text-xs">🎮</span>
              <span className="text-[11px] font-bold text-slate-300 tracking-wide uppercase">
                Interactive Test Console: <span className="text-emerald-400 font-normal">Click any sample to test</span>
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {isPaused ? "MANUAL" : "AUTO-CYCLE"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {ITEMS.map((item, idx) => {
              const active = idx === itemIndex;
              const safe = item.status === 'safe';
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setItemIndex(idx);
                    setStage('aim');
                    triggerAudio(safe ? 'safe' : 'unsafe');
                  }}
                  className={cn(
                    "px-2 py-1.5 rounded-xl border text-left flex items-center gap-1.5 transition-all duration-300 group cursor-pointer",
                    active
                      ? safe
                        ? "bg-emerald-950/80 border-emerald-400 shadow-md shadow-emerald-500/20 scale-[1.03]"
                        : "bg-red-950/80 border-red-400 shadow-md shadow-red-500/20 scale-[1.03]"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60 text-slate-400"
                  )}
                >
                  <span className="text-base shrink-0 group-hover:scale-125 transition-transform">{item.emoji}</span>
                  <div className="overflow-hidden leading-tight">
                    <span className={cn(
                      "text-[10px] font-bold block truncate",
                      active ? "text-white" : "text-slate-300 group-hover:text-white"
                    )}>
                      {item.name.split(' ')[0]} {item.name.split(' ')[1] || ''}
                    </span>
                    <span className={cn(
                      "text-[8px] font-mono font-bold uppercase",
                      safe ? "text-emerald-400" : "text-red-400"
                    )}>
                      {safe ? "SAFE ✓" : "UNSAFE ✗"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidScanningStoryAnimation;
