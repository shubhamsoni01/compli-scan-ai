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
    sm: { img: 'h-8 w-auto', text: 'text-[11px]' },
    md: { img: 'h-10 w-auto', text: 'text-xs' },
    lg: { img: 'h-13 w-auto', text: 'text-sm' },
  };

  const { img, text } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 dark:bg-slate-900/90 border border-amber-500/30 shadow-md ${className}`}>
      {/* Official Emblem Image in high-contrast crisp frame */}
      <div className="bg-white px-1.5 py-0.5 rounded-md flex items-center justify-center shrink-0">
        <img
          src="/assets/ministry-of-consumer-affairs.jpg"
          alt="Ministry of Consumer Affairs, Food & Public Distribution"
          className={`${img} object-contain`}
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Government of India
          </span>
          <span className={`font-semibold text-slate-200 leading-tight ${text}`}>
            Ministry of Consumer Affairs
          </span>
        </div>
      )}
    </div>
  );
};
