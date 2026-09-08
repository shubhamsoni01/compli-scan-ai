import React from 'react';
import { motion } from 'framer-motion';

export const SIHBackgroundGlowBulb: React.FC = () => {
  return (
    <div className="absolute left-2 sm:left-6 lg:left-10 top-1/2 -translate-y-1/2 pointer-events-none -z-10 flex items-center justify-center select-none">
      {/* Gentle, Subtle Background Floating SIH Official Bulb Motif - No Rotating Circle */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          x: [-5, 5, -5],
          rotate: [-2, 2, -2],
          scale: [0.97, 1.03, 0.97]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-[220px] sm:w-[280px] lg:w-[330px] h-[220px] sm:h-[280px] lg:h-[330px] flex items-center justify-center opacity-30 dark:opacity-20 filter blur-[1.5px]"
      >
        <img
          src="/assets/sih-official-bulb.jpg"
          alt="Smart India Hackathon Background Motif"
          className="w-full h-full object-contain rounded-3xl mix-blend-multiply dark:mix-blend-screen drop-shadow-[0_0_35px_rgba(249,115,22,0.3)]"
        />
      </motion.div>
    </div>
  );
};
