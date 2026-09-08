import React from 'react';
import { motion } from 'framer-motion';

export const SIHBackgroundGlowBulb: React.FC = () => {
  return (
    <div className="absolute left-0 sm:left-6 lg:left-14 top-1/2 -translate-y-1/2 pointer-events-none -z-10 flex items-center justify-center select-none">
      {/* Ambient Glowing Neon Light Halo directly behind the Brain Bulb */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-orange-500/20 via-indigo-500/15 to-emerald-500/20 blur-3xl -z-10 pointer-events-none" />

      {/* Floating 100% Transparent Isolated SIH Bulb & Text */}
      <motion.div
        animate={{
          y: [-12, 12, -12],
          rotate: [-2, 2, -2],
          scale: [0.97, 1.03, 0.97]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-[280px] sm:w-[360px] lg:w-[420px] h-[280px] sm:h-[360px] lg:h-[420px] flex items-center justify-center opacity-40 dark:opacity-30 filter drop-shadow-[0_0_35px_rgba(249,115,22,0.4)]"
      >
        <img
          src="/assets/sih-transparent-bulb.png"
          alt="Smart India Hackathon Transparent Emblem"
          className="w-full h-full object-contain filter contrast-125"
        />
      </motion.div>
    </div>
  );
};
