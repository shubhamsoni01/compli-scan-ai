import React from 'react';
import { motion } from 'framer-motion';

export const SIHBackgroundGlowBulb: React.FC = () => {
  return (
    <div className="absolute -left-16 sm:-left-20 lg:-left-12 top-1/2 -translate-y-1/2 pointer-events-none -z-10 flex items-center justify-center select-none">
      {/* Outer 360 Rotating Glowing Ambient Orbit */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative w-[340px] sm:w-[420px] lg:w-[480px] h-[340px] sm:h-[420px] lg:h-[480px] rounded-full border border-orange-500/15 dark:border-indigo-500/20 shadow-[0_0_90px_rgba(249,115,22,0.15)] flex items-center justify-center"
      >
        {/* Soft Glowing Satellite Nodes */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-orange-400/90 shadow-[0_0_15px_#FB923C]" />
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-emerald-400/90 shadow-[0_0_15px_#34D399]" />
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-400/80 shadow-[0_0_12px_#818CF8]" />
      </motion.div>

      {/* Floating Soft-Blurred SIH Official Bulb Motif */}
      <motion.div
        animate={{
          y: [-12, 12, -12],
          x: [-6, 6, -6],
          rotate: [-3, 3, -3],
          scale: [0.96, 1.04, 0.96]
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[220px] sm:w-[280px] lg:w-[320px] h-[220px] sm:h-[280px] lg:h-[320px] flex items-center justify-center opacity-25 dark:opacity-20 filter blur-[2px] transition-all duration-700"
      >
        <img
          src="/assets/sih-official-bulb.jpg"
          alt="Smart India Hackathon Background Motif"
          className="w-full h-full object-contain rounded-full mix-blend-multiply dark:mix-blend-screen drop-shadow-[0_0_35px_rgba(249,115,22,0.35)]"
        />
      </motion.div>
    </div>
  );
};
