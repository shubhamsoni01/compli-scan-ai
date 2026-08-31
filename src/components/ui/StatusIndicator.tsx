import React from 'react';
import { Check, X, AlertTriangle, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface StatusIndicatorProps {
  status: 'success' | 'error' | 'warning' | 'neutral' | 'passed' | 'failed' | 'review' | string;
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label, className }) => {
  const configs = {
    success: { icon: Check, color: 'text-green-500 bg-green-50 dark:bg-green-500/10' },
    error: { icon: X, color: 'text-red-500 bg-red-50 dark:bg-red-500/10' },
    warning: { icon: AlertTriangle, color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
    neutral: { icon: Minus, color: 'text-gray-500 bg-gray-100 dark:bg-gray-800' },
  };

  const normalizedStatus =
    status === 'passed'
      ? 'success'
      : status === 'failed'
      ? 'error'
      : status === 'review'
      ? 'warning'
      : (status as keyof typeof configs) in configs
      ? (status as keyof typeof configs)
      : 'neutral';

  const { icon: Icon, color } = configs[normalizedStatus];

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div className={cn('p-1 rounded-full', color)}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
    </div>
  );
};
