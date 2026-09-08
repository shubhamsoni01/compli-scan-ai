import React from 'react';
import { motion } from 'framer-motion';

/**
 * Official Ministry of Consumer Affairs & Ashok Stambh Emblem Watermark Aura
 * Uses the authentic official Government of India emblem with clean blend-mode (no cartoon vectors, no white box).
 */
export const MinistryVectorAura: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute right-0 sm:right-6 lg:right-12 top-1/2 -translate-y-1/2 pointer-events-none z-0 select-none overflow-hidden flex items-center justify-center ${className}`}>
      {/* Soft Luminous Ambient Glow */}
      <div className="absolute inset-0 -m-12 rounded-full bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-emerald-500/15 blur-3xl pointer-events-none" />

      {/* Floating Real Official Emblem Container */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          scale: [0.99, 1.01, 0.99],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-[280px] sm:w-[360px] lg:w-[420px] h-[300px] sm:h-[380px] lg:h-[440px] flex items-center justify-center opacity-40 dark:opacity-35"
      >
        {/* Real Official Emblem with invert & screen blend to eliminate white box and keep 100% authentic linework */}
        <img
          src="/assets/ministry-of-consumer-affairs.jpg"
          alt="Official Ministry of Consumer Affairs Emblem"
          className="w-full h-full object-contain filter invert contrast-125 brightness-110 mix-blend-screen pointer-events-none select-none"
        />
      </motion.div>
    </div>
  );
};
