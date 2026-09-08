import React from 'react';
import { motion } from 'framer-motion';

/**
 * Pure Vector-Crafted SIH Innovation Aura
 * High-vibrancy, 100% visible vector art positioned directly in the visible layer behind text.
 */
export const SIHVectorAura: React.FC = () => {
  return (
    <div className="absolute left-2 sm:left-10 lg:left-24 top-1/2 -translate-y-1/2 pointer-events-none z-0 select-none overflow-visible">
      {/* Ambient Glowing Aura */}
      <div className="absolute inset-0 -m-20 rounded-full bg-gradient-to-tr from-orange-500/25 via-indigo-600/20 to-emerald-500/25 blur-3xl" />

      <motion.div
        animate={{
          y: [-12, 12, -12],
          rotate: [-2, 2, -2],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-[300px] sm:w-[380px] lg:w-[480px] h-[300px] sm:h-[380px] lg:h-[480px] flex items-center justify-center opacity-65 dark:opacity-55"
      >
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full drop-shadow-[0_0_40px_rgba(249,115,22,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glowing Innovation Rays */}
          <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" className="text-orange-500/80 dark:text-orange-400/80">
            <line x1="150" y1="15" x2="150" y2="40" />
            <line x1="245" y1="55" x2="225" y2="75" />
            <line x1="285" y1="140" x2="255" y2="140" />
            <line x1="55" y1="55" x2="75" y2="75" />
            <line x1="15" y1="140" x2="45" y2="140" />
          </g>

          {/* Left Brain Hemisphere (Saffron Hardware Tech Circuit) */}
          <path
            d="M142 55 C115 55 90 75 90 102 C80 108 72 120 72 135 C72 150 82 162 95 168 C92 180 98 195 110 202 C122 208 135 208 142 210 Z"
            fill="url(#saffronGrad)"
          />
          {/* Circuit Traces */}
          <path d="M105 95 H130 V120 H115 V145 H135" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
          <circle cx="105" cy="95" r="4" fill="#FFFFFF" />
          <circle cx="115" cy="145" r="4" fill="#FFFFFF" />

          {/* Right Brain Hemisphere (Emerald Green Digital Matrix) */}
          <path
            d="M158 55 C185 55 210 75 210 102 C220 108 228 120 228 135 C228 150 218 162 205 168 C208 180 202 195 190 202 C178 208 165 208 158 210 Z"
            fill="url(#emeraldGrad)"
          />
          {/* Green Binary Matrix Code */}
          <text x="168" y="102" fill="#FFFFFF" fontSize="13" fontFamily="monospace" fontWeight="900" opacity="0.95">1010</text>
          <text x="168" y="128" fill="#FFFFFF" fontSize="13" fontFamily="monospace" fontWeight="900" opacity="0.95">0101</text>
          <text x="168" y="154" fill="#FFFFFF" fontSize="13" fontFamily="monospace" fontWeight="900" opacity="0.95">1100</text>

          {/* Bulb Base & Filament */}
          <path d="M125 218 H175 L168 238 H132 Z" fill="#6366F1" />
          <path d="M134 243 H166 L162 255 H138 Z" fill="#4F46E5" />
          <path d="M142 260 H158 L154 268 H146 Z" fill="#3730A3" />

          {/* Smart India Hackathon Text */}
          <text
            x="150"
            y="295"
            textAnchor="middle"
            fill="currentColor"
            className="text-slate-800 dark:text-slate-100 font-black tracking-[0.25em] text-[14px]"
          >
            SMART INDIA HACKATHON
          </text>

          {/* Color Gradients */}
          <defs>
            <linearGradient id="saffronGrad" x1="90" y1="55" x2="142" y2="210" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FB923C" />
              <stop offset="1" stopColor="#EA580C" />
            </linearGradient>
            <linearGradient id="emeraldGrad" x1="158" y1="55" x2="228" y2="210" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34D399" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};
