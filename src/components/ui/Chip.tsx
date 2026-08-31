import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface ChipProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  label?: string;
  selected?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  variant?: string;
  children?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({ label, selected, icon, size = 'md', variant, children, className, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors border',
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        selected
          ? 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-violet-500/20 dark:text-violet-300 dark:border-violet-500/30'
          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-surface-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-surface-700',
        className
      )}
      {...props}
    >
      {icon && <span className="mr-1.5 -ml-0.5">{icon}</span>}
      {children || label}
    </motion.button>
  );
};
