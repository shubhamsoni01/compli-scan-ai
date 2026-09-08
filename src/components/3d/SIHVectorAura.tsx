import React from 'react';
import { motion } from 'framer-motion';

/**
 * Pure Vector-Crafted SIH Innovation Aura
 * No external images, no square boxes, no JPEG artifacts.
 * 100% resolution-independent, buttery-smooth GPU animated backdrop.
 */
export const SIHVectorAura: React.FC = () => {
  return (
    <div className="absolute left-[-20px] sm:left-[20px] lg:left-[40px] top-1/2 -translate-y-1/2 pointer-events-none -z-10 select-none overflow-visible">
      {/* Ambient Multi-Color Gradient Mesh Glow */}
      <div className="absolute inset-0 -m-16 rounded-full bg-gradient-to-tr from-orange-500/15 via-indigo-600/10 to-emerald-500/15 blur-3xl" />

      <motion.div
        animate={{
          y: [-8, 8, -8],
          rotate: [-1.5, 1.5, -1.5],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-[280px] sm:w-[360px] lg:w-[440px] h-[280px] sm:h-[360px] lg:h-[440px] flex items-center justify-center opacity-25 dark:opacity-20 filter blur-[1px]"
      >
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Outer Glowing Innovation Rays */}
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-orange-400/40 dark:text-orange-400/30">
            <line x1="150" y1="20" x2="150" y2="40" />
            <line x1="240" y1="60" x2="225" y2="75" />
            <line x1="275" y1="140" x2="255" y2="140" />
            <line x1="60" y1="60" x2="75" y2="75" />
            <line x1="25" y1="140" x2="45" y2="140" />
          </g>

          {/* Left Brain Hemisphere (Orange / Saffron Tech Circuit) */}
          <path
            d="M142 55 C115 55 90 75 90 102 C80 108 72 120 72 135 C72 150 82 162 95 168 C92 180 98 195 110 202 C122 208 135 208 142 210 Z"
            fill="url(#saffronGrad)"
            opacity="0.9"
          />
          {/* Saffron Circuit Traces */}
          <path d="M110 90 H130 V115 H115 V140 H135" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <circle cx="110" cy="90" r="3" fill="#FFFFFF" opacity="0.8" />
          <circle cx="115" cy="140" r="3" fill="#FFFFFF" opacity="0.8" />

          {/* Right Brain Hemisphere (Emerald Green Digital Matrix) */}
          <path
            d="M158 55 C185 55 210 75 210 102 C220 108 228 120 228 135 C228 150 218 162 205 168 C208 180 202 195 190 202 C178 208 165 208 158 210 Z"
            fill="url(#emeraldGrad)"
            opacity="0.9"
          />
          {/* Green Binary Code Details */}
          <text x="168" y="100" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold" opacity="0.7">1010</text>
          <text x="168" y="125" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold" opacity="0.7">0101</text>
          <text x="168" y="150" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold" opacity="0.7">1100</text>

          {/* Bulb Base & Filament */}
          <path d="M125 218 H175 L168 238 H132 Z" fill="#6366F1" opacity="0.8" />
          <path d="M134 243 H166 L162 255 H138 Z" fill="#4F46E5" opacity="0.7" />
          <path d="M142 260 H158 L154 268 H146 Z" fill="#3730A3" opacity="0.6" />

          {/* Subtle Watermark SIH Text */}
          <text
            x="150"
            y="295"
            textAnchor="middle"
            fill="currentColor"
            className="text-slate-700 dark:text-slate-300 font-extrabold tracking-[0.2em] text-[13px]"
          >
            SMART INDIA HACKATHON
          </text>

          {/* Color Gradients */}
          <defs>
            <linearGradient id="saffronGrad" x1="90" y1="55" x2="142" y2="210" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9933" />
              <stop offset="1" stopColor="#EA580C" />
            </linearGradient>
            <linearGradient id="emeraldGrad" x1="158" y1="55" x2="228" y2="210" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10B981" />
              <stop offset="1" stopColor="#047857" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};
