import React from 'react';
import { motion } from 'framer-motion';

/**
 * High-Tech AI Scanning Shield & Viewfinder Hologram for Right-Side 3D Showcase
 * Sits directly behind the 3D Product Scanner
 */
export const ComplianceScanAura: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-visible select-none">
      {/* Ambient Glowing Aura */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-emerald-500/25 via-teal-500/20 to-cyan-500/25 blur-3xl" />

      <motion.div
        animate={{
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-full h-full max-w-[420px] max-h-[420px] flex items-center justify-center opacity-60 dark:opacity-50"
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Rotating Outer Radar Ring */}
          <g className="origin-center animate-[spin_40s_linear_infinite]">
            <circle
              cx="200"
              cy="200"
              r="175"
              stroke="url(#auraCyanRing)"
              strokeWidth="1.5"
              strokeDasharray="6 12"
              opacity="0.6"
            />
            <line x1="200" y1="20" x2="200" y2="30" stroke="#34d399" strokeWidth="2" opacity="0.8" />
            <line x1="200" y1="370" x2="200" y2="380" stroke="#34d399" strokeWidth="2" opacity="0.8" />
            <line x1="20" y1="200" x2="30" y2="200" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
            <line x1="370" y1="200" x2="380" y2="200" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
          </g>

          {/* Reverse Rotating Inner Ring */}
          <g className="origin-center animate-[spin_25s_linear_infinite_reverse]">
            <circle
              cx="200"
              cy="200"
              r="145"
              stroke="url(#auraEmeraldRing)"
              strokeWidth="1.2"
              strokeDasharray="16 28"
              opacity="0.45"
            />
          </g>

          {/* Optical Viewfinder Corner Brackets */}
          <path d="M 60 110 L 60 70 L 100 70" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 300 70 L 340 70 L 340 110" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 60 290 L 60 330 L 100 330" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 300 330 L 340 330 L 340 290" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Center Holographic Shield of Compliance */}
          <path
            d="M 200 70 L 280 108 L 280 215 C 280 270 238 312 200 330 C 162 312 120 270 120 215 L 120 108 Z"
            fill="url(#auraShieldBg)"
            stroke="url(#auraShieldBorder)"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Scanning Grid lines */}
          <line x1="140" y1="140" x2="260" y2="140" stroke="#34d399" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
          <line x1="135" y1="175" x2="265" y2="175" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 6" opacity="0.45" />
          <line x1="140" y1="210" x2="260" y2="210" stroke="#34d399" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
          <line x1="150" y1="245" x2="250" y2="245" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 6" opacity="0.45" />

          {/* Verified Checkmark */}
          <path
            d="M 170 195 L 192 218 L 240 165"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="drop-shadow(0 0 6px rgba(52, 211, 153, 0.8))"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="auraShieldBg" x1="200" y1="70" x2="200" y2="330" gradientUnits="userSpaceOnUse">
              <stop stopColor="#064e3b" stopOpacity="0.35" />
              <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.5" />
              <stop offset="1" stopColor="#022c22" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="auraShieldBorder" x1="120" y1="70" x2="280" y2="330" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f59e0b" />
              <stop offset="0.3" stopColor="#10b981" />
              <stop offset="0.7" stopColor="#06b6d4" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>

            <linearGradient id="auraCyanRing" x1="25" y1="25" x2="375" y2="375" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#34d399" stopOpacity="0.3" />
              <stop offset="1" stopColor="#f59e0b" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="auraEmeraldRing" x1="55" y1="55" x2="345" y2="345" gradientUnits="userSpaceOnUse">
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

export default ComplianceScanAura;
