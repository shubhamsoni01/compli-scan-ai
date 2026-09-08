import React from 'react';
import { motion } from 'framer-motion';

/**
 * Authentic Official Ministry of Consumer Affairs & Ashok Stambh Emblem Aura
 * Uses the exact 100% official emblem with transparent alpha channel (no cartoon, no box).
 */
export const MinistryVectorAura: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute right-0 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 pointer-events-none z-0 select-none overflow-visible flex items-center justify-center ${className}`}>
      
      {/* 1. Radiant Multi-Color Ambient Glow (Saffron + Gold + Emerald) */}
      <div className="absolute inset-0 -m-16 rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-emerald-500/15 blur-3xl pointer-events-none" />

      {/* 2. Floating Authentic Official Emblem (100% Pure Transparent Alpha) */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
          scale: [0.99, 1.01, 0.99],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-[280px] sm:w-[360px] lg:w-[420px] h-[300px] sm:h-[380px] lg:h-[440px] flex items-center justify-center opacity-60 dark:opacity-55 drop-shadow-[0_0_35px_rgba(245,158,11,0.4)]"
      >
        <img
          src="/assets/ministry-emblem-transparent-gold.png"
          alt="Official Ministry of Consumer Affairs, Food & Public Distribution Emblem"
          className="w-full h-full object-contain pointer-events-none select-none"
        />
      </motion.div>
    </div>
  );
};
