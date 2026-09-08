import React from 'react';
import { motion } from 'framer-motion';

export const SIHBackgroundGlowBulb: React.FC = () => {
  return (
    <div className="absolute left-4 sm:left-10 lg:left-16 top-1/2 -translate-y-1/2 pointer-events-none z-0 flex items-center justify-center select-none">
      {/* Background Floating SIH Official Bulb Motif - Clearly Visible Watermark Style */}
      <motion.div
        animate={{
          y: [-12, 12, -12],
          x: [-6, 6, -6],
          rotate: [-2.5, 2.5, -2.5],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-[260px] sm:w-[320px] lg:w-[380px] h-[260px] sm:h-[320px] lg:h-[380px] flex items-center justify-center opacity-65 dark:opacity-45 filter blur-[0.6px]"
      >
        <img
          src="/assets/sih-official-bulb.jpg"
          alt="Smart India Hackathon Background Motif"
          className="w-full h-full object-contain rounded-3xl drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]"
        />
      </motion.div>
    </div>
  );
};
