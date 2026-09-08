import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, icon, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold hover:from-emerald-400 hover:to-cyan-400 shadow-md shadow-emerald-500/20 border border-emerald-400/30',
      secondary: 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50 border border-emerald-500/20',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-surface-800',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm border border-transparent',
      outline: 'bg-transparent text-gray-700 border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-emerald-500/30 dark:hover:bg-emerald-500/10 border',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-4 py-2 text-sm rounded-xl',
      lg: 'px-6 py-3 text-base rounded-xl',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled && !isLoading ? { 
          scale: 1.025,
          y: -1.5,
          boxShadow: variant === 'primary' 
            ? '0 10px 25px -5px rgba(79, 70, 229, 0.4), 0 8px 10px -6px rgba(79, 70, 229, 0.2)' 
            : variant === 'danger'
            ? '0 10px 25px -5px rgba(220, 38, 38, 0.4), 0 8px 10px -6px rgba(220, 38, 38, 0.2)'
            : '0 8px 20px -4px rgba(0, 0, 0, 0.1)',
          transition: { duration: 0.2, ease: 'easeOut' }
        } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.97, y: 0, transition: { duration: 0.1 } } : {}}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {!isLoading && icon && <span className="mr-2">{icon}</span>}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
