import React from 'react';

interface MinistryLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const MinistryLogo: React.FC<MinistryLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeMap = {
    sm: { height: 'h-8', text: 'text-[10px]', subText: 'text-[9px]' },
    md: { height: 'h-10', text: 'text-xs', subText: 'text-[10px]' },
    lg: { height: 'h-12', text: 'text-sm', subText: 'text-xs' },
  };

  const { height, text, subText } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/95 dark:bg-slate-900/95 border border-amber-500/40 shadow-lg shadow-amber-500/10 backdrop-blur-xl ${className}`}>
      {/* Official Ashok Stambh Transparent Emblem */}
      <div className="relative flex items-center shrink-0">
        {/* Subtle Tricolor Vertical Strip */}
        <div className="w-1 self-stretch rounded-full overflow-hidden flex flex-col mr-1.5 shadow-sm">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-[#FFFFFF]" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        {/* Real Official High-Res Emblem */}
        <div className="flex items-center justify-center">
          <img
            src="/assets/ministry-emblem-transparent-gold.png"
            alt="Department of Consumer Affairs, Government of India"
            className={`${height} w-auto object-contain drop-shadow-sm`}
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
              Govt. of India
            </span>
            <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">
              DOCA
            </span>
          </div>
          <span className={`font-bold text-white tracking-tight leading-snug ${text}`}>
            Ministry of Consumer Affairs
          </span>
          <span className={`text-emerald-400 font-medium ${subText}`}>
            Food & Public Distribution • Legal Metrology
          </span>
        </div>
      )}
    </div>
  );
};
