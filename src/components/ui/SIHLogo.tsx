import React from 'react';

interface SIHLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const SIHLogo: React.FC<SIHLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const sizeMap = {
    sm: { img: 'h-8 w-auto', text: 'text-xs' },
    md: { img: 'h-10 w-auto', text: 'text-sm' },
    lg: { img: 'h-14 w-auto', text: 'text-base' }
  };

  const { img, text } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 dark:bg-slate-900/90 border border-slate-700/80 shadow-md ${className}`}>
      {/* Official SIH Emblem Vector */}
      <svg 
        viewBox="0 0 160 50" 
        className={`${img} transition-transform hover:scale-105`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tricolor background shield */}
        <rect x="4" y="4" width="42" height="42" rx="8" fill="#0F172A" stroke="#6366F1" strokeWidth="1.5" />
        <rect x="8" y="8" width="34" height="10" rx="3" fill="#FF9933" />
        <rect x="8" y="20" width="34" height="10" rx="3" fill="#FFFFFF" />
        <rect x="8" y="32" width="34" height="10" rx="3" fill="#138808" />
        
        {/* Ashoka / AI Innovation Center Circle */}
        <circle cx="25" cy="25" r="3.8" stroke="#000080" strokeWidth="1.2" fill="none" />
        <circle cx="25" cy="25" r="1.2" fill="#000080" />

        {/* Text SIH 2026 */}
        <text x="56" y="23" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="17" fill="#818CF8" letterSpacing="0.5">SIH</text>
        <text x="90" y="23" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="15" fill="#FB923C">2026</text>
        <text x="56" y="35" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="8" fill="#94A3B8" letterSpacing="0.4">SMART INDIA</text>
        <text x="56" y="44" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="8" fill="#94A3B8" letterSpacing="0.4">HACKATHON</text>
      </svg>

      {showText && (
        <span className={`font-bold tracking-tight text-white ${text}`}>
          <span className="text-orange-400">SIH</span> <span className="text-indigo-300">2026</span>
        </span>
      )}
    </div>
  );
};
