import React from 'react';
import { cn } from '@/utils/cn';

interface NationalAmbientBackgroundProps {
  className?: string;
}

export const NationalAmbientBackground: React.FC<NationalAmbientBackgroundProps> = ({
  className,
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'fixed inset-0 pointer-events-none z-0 overflow-hidden select-none',
        className
      )}
    >
      {/* Clean, Deep Official Navy/Slate Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100/80 dark:from-[#070b14] dark:via-[#090e1c] dark:to-[#060912]" />

      {/* Subtle Micro Dot Pattern (Professional Enterprise Grid) */}
      <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035] bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Very Soft Top Accent Glow (Navy & Gold Ambient Haze) */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[85vw] max-w-4xl h-64 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-amber-500/5 blur-3xl dark:from-blue-600/10 dark:via-indigo-600/10 dark:to-amber-500/5 rounded-full" />
    </div>
  );
};
