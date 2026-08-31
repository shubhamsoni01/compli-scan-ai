import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, padding = 'md', children, ...props }, ref) => {
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { 
          y: -5, 
          scale: 1.01,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
          transition: { duration: 0.25, ease: 'easeOut' } 
        } : {}}
        className={cn(
          'bg-white dark:bg-surface-900 rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-sm overflow-hidden backdrop-blur-xl backdrop-filter transition-all duration-300',
          hover && 'hover:border-indigo-200 dark:hover:border-indigo-500/20',
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = 'Card';
