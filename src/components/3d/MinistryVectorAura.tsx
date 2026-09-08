import React from 'react';
import { motion } from 'framer-motion';

/**
 * Pure Vector-Crafted Ministry of Consumer Affairs & Ashok Stambh Emblem Aura
 * High-vibrancy, 100% visible vector art with floating animation and glowing backdrop.
 */
export const MinistryVectorAura: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute right-2 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 pointer-events-none z-0 select-none overflow-visible ${className}`}>
      {/* Ambient Glowing Halo */}
      <div className="absolute inset-0 -m-16 rounded-full bg-gradient-to-tr from-amber-500/20 via-emerald-500/15 to-cyan-500/20 blur-3xl" />

      <motion.div
        animate={{
          y: [-8, 8, -8],
          rotate: [-1, 1, -1],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-[280px] sm:w-[340px] lg:w-[400px] h-[300px] sm:h-[360px] lg:h-[420px] flex items-center justify-center opacity-75 dark:opacity-65"
      >
        <svg
          viewBox="0 0 300 340"
          className="w-full h-full drop-shadow-[0_0_35px_rgba(245,158,11,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Sunburst Radiance */}
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-amber-400/60 dark:text-amber-300/60">
            <line x1="150" y1="10" x2="150" y2="28" />
            <line x1="235" y1="45" x2="220" y2="60" />
            <line x1="270" y1="120" x2="250" y2="120" />
            <line x1="65" y1="45" x2="80" y2="60" />
            <line x1="30" y1="120" x2="50" y2="120" />
          </g>

          {/* ========================================================
              LION CAPITAL OF ASHOKA (EMBLEM OF INDIA)
             ======================================================== */}
          
          {/* Central Lion Head */}
          <path
            d="M130 50 Q150 35 170 50 Q180 70 172 95 Q150 105 128 95 Q120 70 130 50 Z"
            fill="url(#goldGrad)"
            stroke="#FDE68A"
            strokeWidth="1.5"
          />
          {/* Center Mane & Muzzle */}
          <circle cx="150" cy="72" r="5" fill="#78350F" />
          <path d="M142 80 Q150 86 158 80" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M140 64 Q144 60 148 64 M152 64 Q156 60 160 64" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Left Lion Head (Profile) */}
          <path
            d="M100 60 Q120 48 132 65 Q135 90 120 102 Q98 100 95 80 Q95 68 100 60 Z"
            fill="url(#goldGradDark)"
            stroke="#FDE68A"
            strokeWidth="1.5"
          />
          <circle cx="108" cy="76" r="3.5" fill="#78350F" />
          <path d="M102 86 Q110 90 116 85" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Right Lion Head (Profile) */}
          <path
            d="M200 60 Q180 48 168 65 Q165 90 180 102 Q202 100 205 80 Q205 68 200 60 Z"
            fill="url(#goldGradDark)"
            stroke="#FDE68A"
            strokeWidth="1.5"
          />
          <circle cx="192" cy="76" r="3.5" fill="#78350F" />
          <path d="M198 86 Q190 90 184 85" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Lion Chest & Pillar Bodies */}
          <path
            d="M105 102 L115 155 Q150 165 185 155 L195 102 Q150 115 105 102 Z"
            fill="url(#goldGrad)"
            stroke="#FDE68A"
            strokeWidth="1.5"
          />
          {/* Muscular Chest Definition Lines */}
          <path d="M135 110 Q150 125 165 110" stroke="#B45309" strokeWidth="1.5" fill="none" />
          <path d="M140 130 Q150 145 160 130" stroke="#B45309" strokeWidth="1.5" fill="none" />

          {/* Base Pedestal (Abacus) */}
          <rect x="85" y="158" width="130" height="32" rx="6" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
          
          {/* Central Ashoka Chakra in Pedestal */}
          <circle cx="150" cy="174" r="12" stroke="#38BDF8" strokeWidth="1.5" fill="#0F172A" />
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={i}
              x1="150"
              y1="174"
              x2={150 + 11 * Math.cos((i * 22.5 * Math.PI) / 180)}
              y2={174 + 11 * Math.sin((i * 22.5 * Math.PI) / 180)}
              stroke="#38BDF8"
              strokeWidth="0.8"
            />
          ))}
          <circle cx="150" cy="174" r="2.5" fill="#F59E0B" />

          {/* Decorative Bull & Horse Silhouettes on Pedestal */}
          <path d="M96 172 Q105 166 114 176" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M186 176 Q195 166 204 172" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Bell-shaped Lotus Base */}
          <path d="M100 190 Q150 205 200 190 L208 202 Q150 216 92 202 Z" fill="#D97706" />

          {/* ========================================================
              OFFICIAL GOVERNMENT & MINISTRY TYPOGRAPHY
             ======================================================== */}
          
          {/* 1. सत्यमेव जयते (Satyamev Jayate) */}
          <text
            x="150"
            y="235"
            textAnchor="middle"
            fill="#FBBF24"
            fontWeight="bold"
            fontSize="15"
            letterSpacing="2"
            fontFamily="serif, 'Noto Sans Devanagari', sans-serif"
          >
            सत्यमेव जयते
          </text>

          {/* 2. GOVERNMENT OF INDIA */}
          <text
            x="150"
            y="262"
            textAnchor="middle"
            fill="#FFFFFF"
            fontWeight="900"
            fontSize="14"
            letterSpacing="3"
            fontFamily="system-ui, sans-serif"
          >
            GOVERNMENT OF INDIA
          </text>

          {/* 3. MINISTRY OF CONSUMER AFFAIRS */}
          <text
            x="150"
            y="288"
            textAnchor="middle"
            fill="url(#saffronGrad)"
            fontWeight="800"
            fontSize="12"
            letterSpacing="1"
            fontFamily="system-ui, sans-serif"
          >
            MINISTRY OF CONSUMER AFFAIRS
          </text>

          {/* 4. FOOD & PUBLIC DISTRIBUTION */}
          <text
            x="150"
            y="308"
            textAnchor="middle"
            fill="#34D399"
            fontWeight="700"
            fontSize="10"
            letterSpacing="2"
            fontFamily="system-ui, sans-serif"
          >
            FOOD & PUBLIC DISTRIBUTION
          </text>

          {/* Gradients */}
          <defs>
            <linearGradient id="goldGrad" x1="120" y1="40" x2="180" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE047" />
              <stop offset="0.6" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="goldGradDark" x1="90" y1="50" x2="210" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBBF24" />
              <stop offset="1" stopColor="#B45309" />
            </linearGradient>

            <linearGradient id="saffronGrad" x1="50" y1="270" x2="250" y2="290" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDBA74" />
              <stop offset="1" stopColor="#FB923C" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};
