import React from 'react';
import { motion } from 'framer-motion';

export const SIHBackgroundGlowBulb: React.FC = () => {
  return (
    <div className="absolute left-2 sm:left-10 lg:left-20 top-1/2 -translate-y-1/2 pointer-events-none z-0 flex items-center justify-center select-none">
      {/* Soft Glowing Ambient Halo */}
      <div className="absolute w-80 h-80 rounded-full bg-orange-500/15 dark:bg-orange-500/20 blur-3xl -z-10 pointer-events-none" />

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
        className="w-[300px] sm:w-[380px] lg:w-[460px] h-[300px] sm:h-[380px] lg:h-[460px] flex items-center justify-center opacity-70 dark:opacity-55"
      >
        <img
          src="/assets/sih-transparent-bulb.png"
          alt="Smart India Hackathon Transparent Emblem"
          className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(249,115,22,0.5)]"
        />
      </motion.div>
    </div>
  );
};
