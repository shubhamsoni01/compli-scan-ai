import React from 'react';
import { motion } from 'framer-motion';

/**
 * Futuristic AI Scanning Shield & Holographic Camera Reticle Aura
 * Sits directly behind the hero title "Scan. Verify. Comply."
 * Represents optical packaging label inspection, legal metrology audit, and certified compliance.
 */
export const SIHVectorAura: React.FC = () => {
  return (
    <div className="absolute left-0 sm:left-6 lg:left-14 top-1/2 -translate-y-1/2 pointer-events-none z-0 select-none overflow-visible">
      {/* Ambient Glowing Aura Orbs */}
      <div className="absolute inset-0 -m-24 rounded-full bg-gradient-to-tr from-emerald-500/20 via-cyan-500/15 to-amber-500/15 blur-3xl" />

      <motion.div
        animate={{
          y: [-8, 8, -8],
          scale: [0.99, 1.02, 0.99],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-[320px] sm:w-[420px] lg:w-[500px] h-[320px] sm:h-[420px] lg:h-[500px] flex items-center justify-center opacity-70 dark:opacity-60"
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-[0_0_35px_rgba(16,185,129,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 
            -------------------------------------------------------------
            1. ROTATING OUTER RADAR & TELEMETRY RINGS
            -------------------------------------------------------------
          */}
          {/* Slow Clockwise Rotating Dashed Ring */}
          <g className="origin-center animate-[spin_40s_linear_infinite]">
            <circle
              cx="200"
              cy="200"
              r="175"
              stroke="url(#cyanRingGrad)"
              strokeWidth="1.5"
              strokeDasharray="6 10"
              opacity="0.6"
            />
            {/* Degree Ticks */}
            <line x1="200" y1="20" x2="200" y2="30" stroke="#34d399" strokeWidth="2" opacity="0.8" />
            <line x1="200" y1="370" x2="200" y2="380" stroke="#34d399" strokeWidth="2" opacity="0.8" />
            <line x1="20" y1="200" x2="30" y2="200" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
            <line x1="370" y1="200" x2="380" y2="200" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
          </g>

          {/* Counter-Clockwise Inner Telemetry Ring */}
          <g className="origin-center animate-[spin_28s_linear_infinite_reverse]">
            <circle
              cx="200"
              cy="200"
              r="145"
              stroke="url(#emeraldRingGrad)"
              strokeWidth="1.2"
              strokeDasharray="18 30"
              opacity="0.5"
            />
          </g>

          {/* 
            -------------------------------------------------------------
            2. OPTICAL CAMERA VIEWFINDER CORNERS [  ]
            -------------------------------------------------------------
          */}
          {/* Top-Left Corner Bracket */}
          <path d="M 60 110 L 60 70 L 100 70" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="60" cy="70" r="3" fill="#34d399" />

          {/* Top-Right Corner Bracket */}
          <path d="M 300 70 L 340 70 L 340 110" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="340" cy="70" r="3" fill="#34d399" />

          {/* Bottom-Left Corner Bracket */}
          <path d="M 60 290 L 60 330 L 100 330" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="60" cy="330" r="3" fill="#34d399" />

          {/* Bottom-Right Corner Bracket */}
          <path d="M 300 330 L 340 330 L 340 290" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="340" cy="330" r="3" fill="#34d399" />

          {/* Center Optical Crosshairs */}
          <line x1="80" y1="200" x2="110" y2="200" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
          <line x1="290" y1="200" x2="320" y2="200" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
          <line x1="200" y1="80" x2="200" y2="105" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
          <line x1="200" y1="295" x2="200" y2="320" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />

          {/* 
            -------------------------------------------------------------
            3. MAIN FUTURISTIC SHIELD OF COMPLIANCE
            -------------------------------------------------------------
          */}
          {/* Outer Shield Glow Geometry */}
          <path
            d="M 200 65 L 285 105 L 285 215 C 285 275 240 318 200 335 C 160 318 115 275 115 215 L 115 105 Z"
            fill="url(#shieldBackdropGrad)"
            stroke="url(#shieldBorderGrad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Inset Shield */}
          <path
            d="M 200 82 L 268 115 L 268 210 C 268 258 232 295 200 310 C 168 295 132 258 132 210 L 132 115 Z"
            fill="url(#innerShieldGrad)"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Scanning Grid Horizontal Laser Traces Inside Shield */}
          <line x1="140" y1="140" x2="260" y2="140" stroke="#34d399" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
          <line x1="135" y1="170" x2="265" y2="170" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />
          <line x1="140" y1="200" x2="260" y2="200" stroke="#34d399" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
          <line x1="150" y1="230" x2="250" y2="230" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />
          <line x1="165" y1="260" x2="235" y2="260" stroke="#34d399" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />

          {/* Circuit / Neural Nodes inside Shield */}
          <circle cx="160" cy="140" r="3.5" fill="#34d399" />
          <circle cx="240" cy="140" r="3.5" fill="#38bdf8" />
          <circle cx="150" cy="200" r="3.5" fill="#f59e0b" />
          <circle cx="250" cy="200" r="3.5" fill="#34d399" />
          <circle cx="200" cy="260" r="4" fill="#38bdf8" />

          {/* 
            -------------------------------------------------------------
            4. CENTER VERIFICATION CHECKMARK ICON
            -------------------------------------------------------------
          */}
          {/* Glowing Checkmark Path */}
          <path
            d="M 165 195 L 190 220 L 245 160"
            stroke="#ffffff"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="drop-shadow(0 0 8px rgba(52, 211, 153, 0.9))"
          />

          {/* 
            -------------------------------------------------------------
            5. HUD TELEMETRY LABELS
            -------------------------------------------------------------
          */}
          {/* Top Label */}
          <text
            x="200"
            y="52"
            textAnchor="middle"
            fill="#34d399"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="800"
            letterSpacing="2px"
            opacity="0.9"
          >
            AI OPTICAL COMPLIANCE INSPECTION
          </text>

          {/* Bottom Label */}
          <text
            x="200"
            y="360"
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="9.5"
            fontFamily="monospace"
            fontWeight="800"
            letterSpacing="2.5px"
            opacity="0.9"
          >
            LEGAL METROLOGY • FSSAI • CDSCO
          </text>

          {/* 
            -------------------------------------------------------------
            6. COLOR GRADIENTS & FILTERS
            -------------------------------------------------------------
          */}
          <defs>
            <linearGradient id="shieldBackdropGrad" x1="200" y1="65" x2="200" y2="335" gradientUnits="userSpaceOnUse">
              <stop stopColor="#064e3b" stopOpacity="0.45" />
              <stop offset="0.5" stopColor="#0f172a" stopOpacity="0.65" />
              <stop offset="1" stopColor="#022c22" stopOpacity="0.5" />
            </linearGradient>

            <linearGradient id="innerShieldGrad" x1="200" y1="82" x2="200" y2="310" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="0.7" stopColor="#06b6d4" stopOpacity="0.08" />
              <stop offset="1" stopColor="#0f172a" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="shieldBorderGrad" x1="115" y1="65" x2="285" y2="335" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f59e0b" />
              <stop offset="0.3" stopColor="#10b981" />
              <stop offset="0.7" stopColor="#06b6d4" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>

            <linearGradient id="cyanRingGrad" x1="25" y1="25" x2="375" y2="375" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#34d399" stopOpacity="0.3" />
              <stop offset="1" stopColor="#f59e0b" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="emeraldRingGrad" x1="55" y1="55" x2="345" y2="345" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="1" stopColor="#10b981" stopOpacity="0.7" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};

export default SIHVectorAura;
