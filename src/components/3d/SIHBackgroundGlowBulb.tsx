import React from 'react';
import { motion } from 'framer-motion';

export const SIHBackgroundGlowBulb: React.FC = () => {
  return (
    <div className="absolute left-0 sm:left-4 lg:left-12 top-1/2 -translate-y-1/2 pointer-events-none -z-10 flex items-center justify-center select-none">
      {/* Outer 360 Rotating Glowing Ambient Orbit */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative w-[360px] sm:w-[440px] lg:w-[500px] h-[360px] sm:h-[440px] lg:h-[500px] rounded-full border border-orange-500/25 dark:border-indigo-500/30 shadow-[0_0_100px_rgba(249,115,22,0.2)] flex items-center justify-center"
      >
        {/* Glowing Satellites */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_18px_#FB923C]" />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_18px_#34D399]" />
        <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-indigo-500 shadow-[0_0_15px_#818CF8]" />
      </motion.div>

      {/* Floating SIH Official Bulb - Rich Opacity with Soft Aesthetic Blur */}
      <motion.div
        animate={{
          y: [-14, 14, -14],
          x: [-8, 8, -8],
          rotate: [-3.5, 3.5, -3.5],
          scale: [0.97, 1.03, 0.97]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[240px] sm:w-[300px] lg:w-[360px] h-[240px] sm:h-[300px] lg:h-[360px] flex items-center justify-center opacity-60 dark:opacity-55 filter blur-[0.8px] transition-all duration-500"
      >
        <img
          src="/assets/sih-official-bulb.jpg"
          alt="Smart India Hackathon Background Motif"
          className="w-full h-full object-contain rounded-3xl drop-shadow-[0_0_40px_rgba(249,115,22,0.45)]"
        />
      </motion.div>
    </div>
  );
};
