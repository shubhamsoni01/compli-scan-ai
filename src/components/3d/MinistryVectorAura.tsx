import React from 'react';
import { motion } from 'framer-motion';

/**
 * Pure Vector-Crafted Ministry of Consumer Affairs & Ashok Stambh Emblem Aura
 * Ultra-high clarity, 100% visible vector art with floating animation and golden radiant glow.
 */
export const MinistryVectorAura: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute right-0 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 pointer-events-none z-0 select-none overflow-visible flex items-center justify-center ${className}`}>
      {/* Radiant Glowing Ambient Halo */}
      <div className="absolute inset-0 -m-20 rounded-full bg-gradient-to-tr from-amber-500/30 via-orange-500/20 to-emerald-500/25 blur-3xl" />

      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotate: [-1.5, 1.5, -1.5],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-[320px] sm:w-[420px] lg:w-[500px] h-[340px] sm:h-[440px] lg:h-[520px] flex items-center justify-center opacity-85 dark:opacity-75"
      >
        <svg
          viewBox="0 0 300 340"
          className="w-full h-full drop-shadow-[0_0_45px_rgba(245,158,11,0.45)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glowing Radiance Rays */}
          <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-amber-400/80 dark:text-amber-300/80">
            <line x1="150" y1="8" x2="150" y2="30" />
            <line x1="240" y1="42" x2="222" y2="60" />
            <line x1="280" y1="120" x2="255" y2="120" />
            <line x1="60" y1="42" x2="78" y2="60" />
            <line x1="20" y1="120" x2="45" y2="120" />
          </g>

          {/* ========================================================
              LION CAPITAL OF ASHOKA (EMBLEM OF INDIA)
             ======================================================== */}
          
          {/* Central Lion Head */}
          <path
            d="M128 48 Q150 32 172 48 Q182 70 174 96 Q150 106 126 96 Q118 70 128 48 Z"
            fill="url(#goldGrad)"
            stroke="#FEF08A"
            strokeWidth="2"
          />
          {/* Center Mane & Muzzle */}
          <circle cx="150" cy="72" r="5.5" fill="#78350F" />
          <path d="M142 80 Q150 87 158 80" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M139 63 Q144 58 149 63 M151 63 Q156 58 161 63" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" fill="none" />

          {/* Left Lion Head (Profile) */}
          <path
            d="M96 58 Q118 46 130 63 Q133 90 118 102 Q94 100 92 78 Q92 66 96 58 Z"
            fill="url(#goldGradDark)"
            stroke="#FEF08A"
            strokeWidth="2"
          />
          <circle cx="105" cy="75" r="4" fill="#78350F" />
          <path d="M99 85 Q107 90 114 84" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Right Lion Head (Profile) */}
          <path
            d="M204 58 Q182 46 170 63 Q167 90 182 102 Q206 100 208 78 Q208 66 204 58 Z"
            fill="url(#goldGradDark)"
            stroke="#FEF08A"
            strokeWidth="2"
          />
          <circle cx="195" cy="75" r="4" fill="#78350F" />
          <path d="M201 85 Q193 90 186 84" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Lion Chest & Pillar Bodies */}
          <path
            d="M102 102 L112 155 Q150 166 188 155 L198 102 Q150 116 102 102 Z"
            fill="url(#goldGrad)"
            stroke="#FEF08A"
            strokeWidth="2"
          />
          {/* Muscular Chest Definition Lines */}
          <path d="M132 110 Q150 126 168 110" stroke="#92400E" strokeWidth="2" fill="none" />
          <path d="M138 130 Q150 146 162 130" stroke="#92400E" strokeWidth="2" fill="none" />

          {/* Base Pedestal (Abacus) */}
          <rect x="80" y="158" width="140" height="34" rx="7" fill="#0F172A" stroke="#F59E0B" strokeWidth="2.5" />
          
          {/* Central Ashoka Chakra in Pedestal */}
          <circle cx="150" cy="175" r="13" stroke="#38BDF8" strokeWidth="2" fill="#020617" />
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={i}
              x1="150"
              y1="175"
              x2={150 + 12 * Math.cos((i * 22.5 * Math.PI) / 180)}
              y2={175 + 12 * Math.sin((i * 22.5 * Math.PI) / 180)}
              stroke="#38BDF8"
              strokeWidth="1.2"
            />
          ))}
          <circle cx="150" cy="175" r="3" fill="#F59E0B" />

          {/* Decorative Bull & Horse Silhouettes on Pedestal */}
          <path d="M92 174 Q102 166 112 178" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M188 178 Q198 166 208 174" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Bell-shaped Lotus Base */}
          <path d="M96 192 Q150 208 204 192 L212 205 Q150 220 88 205 Z" fill="#D97706" stroke="#FEF08A" strokeWidth="1" />

          {/* ========================================================
              OFFICIAL GOVERNMENT & MINISTRY TYPOGRAPHY
             ======================================================== */}
          
          {/* 1. सत्यमेव जयते (Satyamev Jayate) */}
          <text
            x="150"
            y="238"
            textAnchor="middle"
            fill="#FEF08A"
            fontWeight="bold"
            fontSize="16"
            letterSpacing="3"
            fontFamily="serif, 'Noto Sans Devanagari', sans-serif"
          >
            सत्यमेव जयते
          </text>

          {/* 2. GOVERNMENT OF INDIA */}
          <text
            x="150"
            y="266"
            textAnchor="middle"
            fill="#FFFFFF"
            fontWeight="900"
            fontSize="15"
            letterSpacing="3"
            fontFamily="system-ui, sans-serif"
          >
            GOVERNMENT OF INDIA
          </text>

          {/* 3. MINISTRY OF CONSUMER AFFAIRS */}
          <text
            x="150"
            y="292"
            textAnchor="middle"
            fill="url(#saffronGrad)"
            fontWeight="800"
            fontSize="13"
            letterSpacing="1.2"
            fontFamily="system-ui, sans-serif"
          >
            MINISTRY OF CONSUMER AFFAIRS
          </text>

          {/* 4. FOOD & PUBLIC DISTRIBUTION */}
          <text
            x="150"
            y="314"
            textAnchor="middle"
            fill="#34D399"
            fontWeight="800"
            fontSize="11"
            letterSpacing="2.5"
            fontFamily="system-ui, sans-serif"
          >
            FOOD & PUBLIC DISTRIBUTION
          </text>

          {/* Gradients */}
          <defs>
            <linearGradient id="goldGrad" x1="120" y1="40" x2="180" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF08A" />
              <stop offset="0.5" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="goldGradDark" x1="90" y1="50" x2="210" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE047" />
              <stop offset="1" stopColor="#B45309" />
            </linearGradient>

            <linearGradient id="saffronGrad" x1="50" y1="270" x2="250" y2="290" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FED7AA" />
              <stop offset="1" stopColor="#FB923C" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};
