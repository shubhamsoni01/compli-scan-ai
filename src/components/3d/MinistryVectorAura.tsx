import React from 'react';
import { motion } from 'framer-motion';

/**
 * Pure 100% Vector Official Ashok Stambh & Ministry Aura
 * ZERO rectangular image box, ZERO background artifacts — ONLY the pure, clean, glowing emblem paths.
 */
export const MinistryVectorAura: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute right-0 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 pointer-events-none z-0 select-none overflow-visible flex items-center justify-center ${className}`}>
      
      {/* 1. Luminous Multi-Color Ambient Glow Halo (Saffron + Emerald + Cyan) */}
      <div className="absolute inset-0 -m-16 rounded-full bg-gradient-to-tr from-amber-500/25 via-orange-500/20 to-emerald-500/20 blur-3xl pointer-events-none" />

      {/* 2. Pure Floating Vector Emblem (Zero image file, Zero box) */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-[300px] sm:w-[380px] lg:w-[440px] h-[320px] sm:h-[400px] lg:h-[460px] flex items-center justify-center opacity-75 dark:opacity-70 drop-shadow-[0_0_35px_rgba(245,158,11,0.4)]"
      >
        <svg
          viewBox="0 0 320 360"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ========================================================
              VIBRANT INDIAN TRICOLOR ROTATING CHAKRA RINGS
             ======================================================== */}
          <g opacity="0.35">
            {/* Concentric Saffron & Emerald Rings */}
            <circle cx="160" cy="180" r="140" stroke="#FF9933" strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="160" cy="180" r="125" stroke="#10B981" strokeWidth="1.2" strokeDasharray="4 4" />
            <circle cx="160" cy="180" r="110" stroke="#06B6D4" strokeWidth="1.5" />
          </g>

          {/* ========================================================
              AUTHENTIC ASHOKA LION CAPITAL (PURE VECTOR SILHOUETTES)
             ======================================================== */}
          
          {/* Central Lion Mane & Head */}
          <path
            d="M136 45 C144 32 176 32 184 45 C196 68 190 98 180 115 C160 125 140 125 120 115 C110 98 124 68 136 45 Z"
            fill="url(#saffronGoldGrad)"
          />
          {/* Central Lion Ears & Details */}
          <path d="M138 48 Q144 38 150 48 M170 48 Q176 38 182 48" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="150" cy="74" r="4.5" fill="#78350F" />
          <circle cx="170" cy="74" r="4.5" fill="#78350F" />
          <path d="M148 90 Q160 98 172 90" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <path d="M160 78 L160 88" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />

          {/* Left Profile Lion */}
          <path
            d="M102 58 C122 45 140 60 144 80 C146 105 130 120 115 122 C95 120 88 95 92 78 C94 68 98 60 102 58 Z"
            fill="url(#saffronGoldDark)"
          />
          <circle cx="112" cy="80" r="4" fill="#78350F" />
          <path d="M104 94 Q114 98 122 92" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right Profile Lion */}
          <path
            d="M218 58 C198 45 180 60 176 80 C174 105 190 120 205 122 C225 120 232 95 228 78 C226 68 222 60 218 58 Z"
            fill="url(#saffronGoldDark)"
          />
          <circle cx="208" cy="80" r="4" fill="#78350F" />
          <path d="M216 94 Q206 98 198 92" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />

          {/* Lions' Powerful Chest & Forelegs Body */}
          <path
            d="M108 120 L120 180 Q160 192 200 180 L212 120 Q160 135 108 120 Z"
            fill="url(#saffronGoldGrad)"
            stroke="#FEF08A"
            strokeWidth="1.5"
          />
          {/* Muscular Texture Ribs */}
          <path d="M140 132 Q160 148 180 132" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
          <path d="M144 154 Q160 170 176 154" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />

          {/* Pedestal (Circular Abacus Platform) */}
          <rect x="85" y="182" width="150" height="36" rx="8" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
          
          {/* Center Ashoka Dharma Chakra */}
          <circle cx="160" cy="200" r="14" stroke="#38BDF8" strokeWidth="2" fill="#020617" />
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="160"
              y1="200"
              x2={160 + 13 * Math.cos((i * 15 * Math.PI) / 180)}
              y2={200 + 13 * Math.sin((i * 15 * Math.PI) / 180)}
              stroke="#38BDF8"
              strokeWidth="1"
            />
          ))}
          <circle cx="160" cy="200" r="3.5" fill="#F59E0B" />

          {/* Galloping Horse & Humped Bull Silhouettes on Pedestal */}
          <path d="M98 198 Q110 188 122 202" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
          <path d="M198 202 Q210 188 222 198" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />

          {/* Inverted Lotus Bell Base */}
          <path d="M102 220 Q160 236 218 220 L226 234 Q160 250 94 234 Z" fill="#D97706" />

          {/* ========================================================
              AUTHENTIC OFFICIAL TYPOGRAPHY (PURE VECTORS)
             ======================================================== */}
          
          {/* 1. सत्यमेव जयते (Satyamev Jayate) */}
          <text
            x="160"
            y="272"
            textAnchor="middle"
            fill="#FEF08A"
            fontWeight="900"
            fontSize="18"
            letterSpacing="4"
            fontFamily="serif, 'Noto Sans Devanagari', sans-serif"
          >
            सत्यमेव जयते
          </text>

          {/* 2. GOVERNMENT OF INDIA */}
          <text
            x="160"
            y="298"
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
            x="160"
            y="322"
            textAnchor="middle"
            fill="#FF9933"
            fontWeight="800"
            fontSize="13"
            letterSpacing="1.5"
            fontFamily="system-ui, sans-serif"
          >
            MINISTRY OF CONSUMER AFFAIRS
          </text>

          {/* 4. FOOD & PUBLIC DISTRIBUTION */}
          <text
            x="160"
            y="342"
            textAnchor="middle"
            fill="#10B981"
            fontWeight="800"
            fontSize="11"
            letterSpacing="2.5"
            fontFamily="system-ui, sans-serif"
          >
            FOOD & PUBLIC DISTRIBUTION
          </text>

          {/* Color Gradients */}
          <defs>
            <linearGradient id="saffronGoldGrad" x1="120" y1="35" x2="200" y2="190" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE047" />
              <stop offset="0.4" stopColor="#F59E0B" />
              <stop offset="0.8" stopColor="#EA580C" />
              <stop offset="1" stopColor="#C2410C" />
            </linearGradient>

            <linearGradient id="saffronGoldDark" x1="90" y1="45" x2="230" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBBF24" />
              <stop offset="0.6" stopColor="#D97706" />
              <stop offset="1" stopColor="#9A3412" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};
