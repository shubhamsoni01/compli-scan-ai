import React from 'react';
import { cn } from '@/utils/cn';

export type BadgeStatus = 'compliant' | 'potential-issue' | 'needs-review' | 'non-compliant' | 'not-applicable';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: BadgeStatus;
  variant?: 'outline' | 'success' | 'warning' | 'destructive' | 'secondary' | 'default' | string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, variant, size = 'md', className, children, ...props }) => {
  const styles = {
    compliant: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50',
    'potential-issue': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
    'needs-review': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
    'non-compliant': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50',
    'not-applicable': 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700/50',
  };

  const variantStyles: Record<string, string> = {
    outline: 'bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    default: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  const resolvedClass = status
    ? styles[status]
    : variant && variantStyles[variant]
    ? variantStyles[variant]
    : variantStyles.default;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        resolvedClass,
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
