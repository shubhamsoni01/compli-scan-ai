import React, { useState } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'children'> {
  hover?: boolean;
  spotlight?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, spotlight = true, padding = 'md', children, onMouseMove, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      if (onMouseMove) onMouseMove(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(true);
      if (onMouseEnter) onMouseEnter(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(false);
      if (onMouseLeave) onMouseLeave(e);
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={hover ? { 
          y: -4, 
          transition: { duration: 0.25, ease: 'easeOut' } 
        } : {}}
        className={cn(
          'relative bg-white dark:bg-[#0b101b] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden backdrop-blur-xl transition-all duration-300',
          hover && 'hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5',
          paddings[padding],
          className
        )}
        {...props}
      >
        {/* Spotlight Mouse Cursor Glow */}
        {spotlight && isHovered && (
          <>
            {/* Inner background radial glow */}
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 -z-0"
              style={{
                background: `radial-gradient(450px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.10), transparent 80%)`,
              }}
            />
            {/* Border tracking highlight */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 -z-0"
              style={{
                background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.15), transparent 70%)`,
              }}
            />
          </>
        )}

        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);
Card.displayName = 'Card';
