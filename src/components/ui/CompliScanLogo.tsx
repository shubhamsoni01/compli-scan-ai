import React from 'react';
import { cn } from '@/utils/cn';

interface CompliScanLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  withGlow?: boolean;
  className?: string;
}

export const CompliScanLogo: React.FC<CompliScanLogoProps> = ({
  size = 'md',
  showText = true,
  withGlow = true,
  className = '',
}) => {
  const sizeMap = {
    xs: { img: 'w-6 h-6 rounded-lg', text: 'text-sm' },
    sm: { img: 'w-8 h-8 rounded-xl', text: 'text-base' },
    md: { img: 'w-10 h-10 rounded-xl', text: 'text-xl' },
    lg: { img: 'w-14 h-14 rounded-2xl', text: 'text-2xl' },
    xl: { img: 'w-20 h-20 rounded-3xl', text: 'text-3xl' },
  };

  const { img, text } = sizeMap[size] || sizeMap.md;

  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none group', className)}>
      <div className="relative shrink-0">
        {withGlow && (
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
        )}
        <img
          src="/compliscan-logo.jpg"
          alt="CompliScan AI Logo"
          className={cn(
            img,
            'relative object-cover border border-emerald-500/40 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform'
          )}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn('font-heading font-extrabold tracking-tight text-slate-900 dark:text-white', text)}>
            CompliScan <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">AI</span>
          </span>
          {size !== 'xs' && size !== 'sm' && (
            <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase mt-0.5">
              Statutory Label Inspector
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CompliScanLogo;
