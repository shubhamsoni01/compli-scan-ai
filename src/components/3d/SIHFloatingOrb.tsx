import React from 'react';
import { motion } from 'framer-motion';

export const SIHFloatingOrb: React.FC = () => {
  return (
    <div className="absolute right-4 top-1/4 -translate-y-1/2 pointer-events-none z-0 hidden lg:block opacity-40 hover:opacity-90 transition-opacity duration-700">
      {/* Outer Glowing Pulsing Ring */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          rotate: 360,
        }}
        transition={{
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 30, repeat: Infinity, ease: "linear" }
        }}
        className="relative w-72 h-72 rounded-full border border-indigo-500/20 bg-gradient-to-tr from-orange-500/5 via-indigo-500/5 to-emerald-500/5 backdrop-blur-[2px] p-6 shadow-[0_0_50px_rgba(99,102,241,0.15)] flex items-center justify-center"
      >
        {/* Revolving Orbit Satellite Dot */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-orange-400 shadow-[0_0_12px_#FB923C]" />
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34D399]" />
        
        {/* Inner Floating SIH Bulb Emblem */}
        <motion.div
          animate={{
            y: [-8, 8, -8],
            rotate: [-3, 3, -3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-44 h-44 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900/60 p-2 flex flex-col items-center justify-center backdrop-blur-md"
        >
          <img
            src="/assets/sih-official-bulb.jpg"
            alt="Smart India Hackathon Official Bulb"
            className="w-full h-full object-contain rounded-xl filter drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
