import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface ProgressRingProps {
  value?: number;
  progress?: number;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  strokeWidth?: number;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  progress,
  size = 120,
  strokeWidth = 8,
  className,
}) => {
  const numericValue = Math.round(progress !== undefined ? progress : value || 0);

  const numericSize =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 80
      : size === 'md'
      ? 120
      : size === 'lg'
      ? 160
      : 200;

  const radius = (numericSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (numericValue / 100) * circumference;

  let color = 'text-green-500';
  if (numericValue < 70) color = 'text-red-500';
  else if (numericValue < 90) color = 'text-amber-500';

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: numericSize, height: numericSize }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          className="text-gray-200 dark:text-gray-800 stroke-current"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={numericSize / 2}
          cy={numericSize / 2}
        />
        <motion.circle
          className={cn('stroke-current', color)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={numericSize / 2}
          cy={numericSize / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
          {numericValue}
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">%</span>
        </span>
      </div>
    </div>
  );
};
