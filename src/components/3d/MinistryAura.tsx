import React from 'react';

export const MinistryAura: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none -z-0 ${className}`}>
      {/* Background radial saffron & emerald soft glow */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 bg-amber-500/[0.07] dark:bg-amber-500/[0.05] rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-emerald-500/[0.07] dark:bg-emerald-500/[0.05] rounded-full blur-3xl" />

      {/* Watermark Lion Capital & Ashok Chakra SVG Overlay */}
      <svg
        className="absolute -right-12 -bottom-10 w-[380px] h-[380px] opacity-[0.06] dark:opacity-[0.08] transition-opacity"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circular Ring with Spokes */}
        <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-amber-400" />
        <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="1" className="text-emerald-400" />
        
        {/* Ashok Chakra Spoke Pattern */}
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="100"
            x2={100 + 75 * Math.cos((i * 15 * Math.PI) / 180)}
            y2={100 + 75 * Math.sin((i * 15 * Math.PI) / 180)}
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-amber-300"
          />
        ))}

        <circle cx="100" cy="100" r="14" fill="currentColor" className="text-amber-400/30" />
        <circle cx="100" cy="100" r="4" fill="currentColor" className="text-amber-300" />
      </svg>

      {/* Subtle Background Watermark Image of Lion Capital */}
      <div 
        className="absolute right-4 top-1/2 -translate-y-1/2 w-72 h-72 opacity-[0.06] dark:opacity-[0.09] bg-contain bg-no-repeat bg-center pointer-events-none filter grayscale contrast-200"
        style={{ backgroundImage: `url('/assets/ministry-of-consumer-affairs.jpg')` }}
      />
    </div>
  );
};
