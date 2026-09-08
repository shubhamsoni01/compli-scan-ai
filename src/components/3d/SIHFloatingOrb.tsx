import React from 'react';
import { motion } from 'framer-motion';

export const SIHFloatingOrb: React.FC = () => {
  return (
    <div className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
      {/* Outer Glowing Orbital Ring with continuous 360 rotation */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative w-[300px] sm:w-[360px] md:w-[420px] h-[300px] sm:h-[360px] md:h-[420px] rounded-full border border-orange-500/30 dark:border-orange-500/40 shadow-[0_0_60px_rgba(249,115,22,0.2)] flex items-center justify-center pointer-events-none"
      >
        {/* Revolving Satellites with Vivid Tricolor Glows */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_16px_#EA580C]" />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_16px_#10B981]" />
        <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-indigo-500 shadow-[0_0_14px_#6366F1]" />
        <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_14px_#22D3EE]" />
      </motion.div>

      {/* Floating Center SIH Official Emblem */}
      <motion.div
        animate={{
          y: [-12, 12, -12],
          rotate: [-2, 2, -2],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[200px] sm:w-[240px] md:w-[280px] h-[200px] sm:h-[240px] md:h-[280px] rounded-3xl overflow-hidden p-3 bg-slate-900/90 dark:bg-slate-950/95 border-2 border-orange-500/50 dark:border-indigo-500/50 shadow-2xl shadow-orange-500/20 backdrop-blur-xl flex flex-col items-center justify-center pointer-events-auto group hover:scale-105 transition-transform duration-300"
      >
        {/* Top Mini Pill */}
        <div className="mb-2 px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-[10px] sm:text-xs font-bold text-orange-400 tracking-wider uppercase">
          SIH 2026 Innovation
        </div>
        
        {/* Official Bulb Image */}
        <img
          src="/assets/sih-official-bulb.jpg"
          alt="Smart India Hackathon Official Logo"
          className="w-full h-full object-contain rounded-2xl filter drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]"
        />
      </motion.div>
    </div>
  );
};
