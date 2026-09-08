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
    sm: { img: 'h-6 w-auto', text: 'text-xs' },
    md: { img: 'h-8 w-auto', text: 'text-sm' },
    lg: { img: 'h-11 w-auto', text: 'text-base' }
  };

  const { img, text } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Official SIH SVG Emblem */}
      <svg 
        viewBox="0 0 160 50" 
        className={`${img} transition-transform hover:scale-105`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tricolor background accents */}
        <path d="M5 12C5 8.13401 8.13401 5 12 5H38C41.866 5 45 8.13401 45 12V38C45 41.866 41.866 45 38 45H12C8.13401 45 5 41.866 5 38V12Z" fill="#1E293B" stroke="#6366F1" strokeWidth="1.5" />
        <rect x="9" y="9" width="32" height="10" rx="3" fill="#FF9933" />
        <rect x="9" y="20" width="32" height="10" rx="3" fill="#FFFFFF" />
        <rect x="9" y="31" width="32" height="10" rx="3" fill="#138808" />
        
        {/* Ashoka / AI Innovation Center Circle */}
        <circle cx="25" cy="25" r="3.5" stroke="#000080" strokeWidth="1.2" fill="none" />
        <circle cx="25" cy="25" r="1" fill="#000080" />

        {/* Text SIH */}
        <text x="54" y="22" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="16" fill="#6366F1" letterSpacing="0.5">SIH</text>
        <text x="86" y="22" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="14" fill="#FF9933">2026</text>
        <text x="54" y="34" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="7.5" fill="#64748B" letterSpacing="0.4">SMART INDIA</text>
        <text x="54" y="42" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="7.5" fill="#64748B" letterSpacing="0.4">HACKATHON</text>
      </svg>

      {showText && (
        <span className={`font-semibold tracking-tight text-slate-700 dark:text-slate-200 ${text}`}>
          <span className="text-orange-500">SIH</span> <span className="text-indigo-600 dark:text-violet-400">2026</span>
        </span>
      )}
    </div>
  );
};
