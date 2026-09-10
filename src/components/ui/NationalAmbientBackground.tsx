import React from 'react';
import { cn } from '@/utils/cn';

interface NationalAmbientBackgroundProps {
  className?: string;
  showChakra?: boolean;
  showWatermarkText?: boolean;
}

export const NationalAmbientBackground: React.FC<NationalAmbientBackgroundProps> = ({
  className,
  showChakra = true,
  showWatermarkText = true,
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'fixed inset-0 pointer-events-none z-0 overflow-hidden select-none',
        className
      )}
    >
      {/* Saffron (Kesariya) Top-Left Ambient Glow Mesh */}
      <div 
        className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent blur-3xl dark:from-orange-500/15 dark:via-amber-500/8 dark:to-transparent transform-gpu" 
      />

      {/* India Green (Emerald) Bottom-Right Ambient Glow Mesh */}
      <div 
        className="absolute -bottom-[15%] -right-[10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-tl from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl dark:from-emerald-500/15 dark:via-teal-500/8 dark:to-transparent transform-gpu" 
      />

      {/* Subtle Indigo/Cyan Center Laser Ambient Core */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-r from-indigo-500/3 via-cyan-500/3 to-transparent blur-3xl dark:from-indigo-500/8 dark:via-cyan-500/5 transform-gpu" 
      />

      {/* Cyber Dot-Matrix Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" 
      />

      {/* Subtle Rotating 24-Spoke National Dharma Chakra Vector */}
      {showChakra && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] dark:opacity-[0.035] text-indigo-900 dark:text-cyan-400">
          <svg 
            width="620" 
            height="620" 
            viewBox="0 0 100 100" 
            className="animate-[spin_180s_linear_infinite]"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.8"
          >
            <circle cx="50" cy="50" r="46" strokeWidth="1.2" />
            <circle cx="50" cy="50" r="42" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
            <circle cx="50" cy="50" r="10" strokeWidth="1" />
            <circle cx="50" cy="50" r="4" fill="currentColor" />
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              return (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 42 * Math.cos((angle * Math.PI) / 180)}
                  y2={50 + 42 * Math.sin((angle * Math.PI) / 180)}
                  strokeWidth="0.6"
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Ministry & SIH Authority Micro-Watermark Stamping */}
      {showWatermarkText && (
        <div className="hidden lg:flex absolute bottom-3 right-6 items-center gap-2.5 opacity-20 dark:opacity-30 text-[10px] font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase">
          <span>GOVT OF INDIA • MOCAFPD</span>
          <span>•</span>
          <span>LEGAL METROLOGY & FSSAI SCREENING</span>
          <span>•</span>
          <span className="font-bold text-amber-500/80">SIH 2026 PS-SIH26034</span>
        </div>
      )}
    </div>
  );
};
