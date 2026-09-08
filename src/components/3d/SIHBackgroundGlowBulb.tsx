import React from 'react';
import { motion } from 'framer-motion';

export const SIHBackgroundGlowBulb: React.FC = () => {
  return (
    <div className="absolute left-2 sm:left-6 lg:left-14 top-1/2 -translate-y-1/2 pointer-events-none z-0 flex items-center justify-center select-none">
      {/* Outer 360 Rotating Glowing Ambient Orbit */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative w-[340px] sm:w-[400px] lg:w-[460px] h-[340px] sm:h-[400px] lg:h-[460px] rounded-full border-2 border-dashed border-orange-400/40 dark:border-indigo-400/50 shadow-[0_0_80px_rgba(249,115,22,0.3)] flex items-center justify-center"
      >
        {/* Glowing Satellites */}
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-orange-500 shadow-[0_0_20px_#FB923C]" />
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-emerald-500 shadow-[0_0_20px_#34D399]" />
        <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_18px_#818CF8]" />
      </motion.div>

      {/* Floating SIH Official Bulb - 100% Solid & Clear with Soft Depth Blur behind */}
      <motion.div
        animate={{
          y: [-15, 15, -15],
          x: [-6, 6, -6],
          rotate: [-3, 3, -3],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[220px] sm:w-[270px] lg:w-[320px] h-[220px] sm:h-[270px] lg:h-[320px] flex items-center justify-center rounded-3xl p-3 bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm border border-orange-500/30 dark:border-indigo-500/40 shadow-2xl shadow-orange-500/20"
      >
        <img
          src="/assets/sih-official-bulb.jpg"
          alt="Smart India Hackathon Official Bulb"
          className="w-full h-full object-contain rounded-2xl drop-shadow-[0_0_25px_rgba(249,115,22,0.4)]"
        />
      </motion.div>
    </div>
  );
};
