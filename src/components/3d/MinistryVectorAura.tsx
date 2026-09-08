import React from 'react';
import { motion } from 'framer-motion';

/**
 * Vibrant Colourful Ministry of Consumer Affairs & Ashok Stambh Background Aura
 * Features Indian Tricolour (Saffron, White, Emerald, Ashok Blue) luminous radiance and authentic emblem.
 */
export const MinistryVectorAura: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute right-0 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 pointer-events-none z-0 select-none overflow-visible flex items-center justify-center ${className}`}>
      
      {/* 1. Multi-Color Luminous Mesh Glows (Saffron + Emerald + Cyan + Gold) */}
      <div className="absolute -top-12 -right-8 w-72 h-72 bg-gradient-to-br from-orange-500/35 via-amber-500/25 to-transparent rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-8 w-72 h-72 bg-gradient-to-tr from-emerald-500/35 via-teal-500/25 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />

      {/* 2. Floating Animated Geometric Sunburst & Ashok Chakra Rings */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute w-[360px] sm:w-[440px] lg:w-[480px] h-[360px] sm:h-[440px] lg:h-[480px] opacity-25 dark:opacity-30"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
          {/* Saffron & Emerald Concentric Dashed Rings */}
          <circle cx="100" cy="100" r="90" stroke="#FF9933" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="100" cy="100" r="78" stroke="#00D26A" strokeWidth="1.2" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="66" stroke="#38BDF8" strokeWidth="1.5" />

          {/* 24-Spoke National Chakra Rays */}
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={100 + 66 * Math.cos((i * 15 * Math.PI) / 180)}
              y2={100 + 66 * Math.sin((i * 15 * Math.PI) / 180)}
              stroke="#38BDF8"
              strokeWidth="0.8"
            />
          ))}
        </svg>
      </motion.div>

      {/* 3. Floating Authentic Official Emblem with Golden & Saffron Radiance */}
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
        className="relative z-10 w-[280px] sm:w-[360px] lg:w-[420px] h-[300px] sm:h-[380px] lg:h-[440px] flex items-center justify-center opacity-65 dark:opacity-60 drop-shadow-[0_0_40px_rgba(245,158,11,0.5)]"
      >
        {/* Real Official Emblem with Colorful Gold/Amber Filter Tint */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src="/assets/ministry-of-consumer-affairs.jpg"
            alt="Official Ministry of Consumer Affairs Emblem"
            className="w-full h-full object-contain filter invert contrast-150 brightness-125 sepia-[0.3] hue-rotate-[15deg] mix-blend-screen pointer-events-none select-none"
          />
          {/* Subtle Golden Color Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 via-amber-500/20 to-orange-500/30 mix-blend-color pointer-events-none rounded-full" />
        </div>
      </motion.div>
    </div>
  );
};
