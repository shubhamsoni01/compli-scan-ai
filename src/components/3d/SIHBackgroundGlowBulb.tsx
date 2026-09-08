import React from 'react';
import { motion } from 'framer-motion';

export const SIHBackgroundGlowBulb: React.FC = () => {
  return (
    <div className="absolute -left-10 md:left-4 top-1/2 -translate-y-1/2 w-[340px] sm:w-[440px] md:w-[500px] h-[340px] sm:h-[440px] md:h-[500px] pointer-events-none -z-10 flex items-center justify-center select-none overflow-visible">
      {/* 360 Rotating Glowing Ambient Orbit Ring */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 rounded-full border border-orange-500/20 dark:border-indigo-500/20 shadow-[0_0_80px_rgba(249,115,22,0.12)] flex items-center justify-center"
      >
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-orange-400/80 blur-[1px] shadow-[0_0_20px_#FB923C]" />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-400/80 blur-[1px] shadow-[0_0_20px_#34D399]" />
      </motion.div>

      {/* Floating, Motion-Moving Soft Blurred SIH Bulb Logo */}
      <motion.div
        animate={{
          y: [-16, 16, -16],
          x: [-10, 10, -10],
          rotate: [-4, 4, -4],
          scale: [0.95, 1.05, 0.95]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-72 sm:w-88 md:w-96 h-72 sm:h-88 md:h-96 flex items-center justify-center opacity-30 dark:opacity-25 filter blur-[1.5px] hover:blur-none transition-all duration-700"
      >
        <img
          src="/assets/sih-official-bulb.jpg"
          alt="Smart India Hackathon Background Motif"
          className="w-full h-full object-contain rounded-full mix-blend-multiply dark:mix-blend-screen drop-shadow-[0_0_40px_rgba(249,115,22,0.4)]"
        />
      </motion.div>
    </div>
  );
};
