import React from 'react';

export const CyberGridBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* SVG Cyber Grid Pattern with Radial Gradient Mask */}
      <svg
        className="absolute inset-0 w-full h-full stroke-emerald-500/10 dark:stroke-emerald-400/[0.08] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="cyber-grid-pattern"
            width="48"
            height="48"
            x="50%"
            y="-1"
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 48V.5H48" fill="none" strokeWidth="1" />
            <circle cx="0.5" cy="0.5" r="1" className="fill-emerald-500/30 dark:fill-emerald-400/40" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth="0" fill="url(#cyber-grid-pattern)" />
      </svg>

      {/* Cyber Luminous Mesh Light Rays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl -z-10" />
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '7s' }} />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '9s' }} />
    </div>
  );
};
