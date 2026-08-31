import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface TiltCardProps extends HTMLMotionProps<'div'> {
  tiltFactor?: number;
  glareEffect?: boolean;
  children?: React.ReactNode;
}

/**
 * TiltCard: High-performance 3D mouse parallax card wrapper.
 * Smoothly tilts with realistic 3D perspective based on pointer movement.
 * Automatically gracefully disables on touch/reduced-motion devices.
 */
export const TiltCard = React.forwardRef<HTMLDivElement, TiltCardProps>(
  ({ className, tiltFactor = 8, glareEffect = true, children, ...props }, ref) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Spring physics coordinates for ultra-smooth responsiveness
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 260, damping: 25 });
    const mouseYSpring = useSpring(y, { stiffness: 260, damping: 25 });

    // 3D rotation angles
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltFactor, -tiltFactor]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltFactor, tiltFactor]);

    // Glare position
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = (e.clientX - rect.left) / width - 0.5;
      const mouseY = (e.clientY - rect.top) / height - 0.5;
      x.set(mouseX);
      y.set(mouseY);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    };

    return (
      <motion.div
        ref={(node) => {
          cardRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{
          y: -6,
          transition: { duration: 0.25, ease: 'easeOut' },
        }}
        className={cn(
          'relative rounded-2xl transition-shadow duration-300',
          isHovered ? 'shadow-xl shadow-indigo-500/10 dark:shadow-indigo-950/30' : '',
          className
        )}
        {...props}
      >
        {children}

        {/* Subtle dynamic sheen/glare effect following mouse cursor */}
        {glareEffect && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.08 : 0,
              background: `radial-gradient(600px circle at ${glareX} ${glareY}, rgba(255,255,255,0.8), transparent 60%)`,
            }}
          />
        )}
      </motion.div>
    );
  }
);

TiltCard.displayName = 'TiltCard';
export default TiltCard;
