import React from 'react';
import { cn } from '@/utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'rect' | 'card';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  width,
  height,
  className,
  ...props
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-800 animate-pulse';
  
  const variantClasses = {
    text: 'rounded-md h-4 w-full',
    circle: 'rounded-full',
    rect: 'rounded-xl',
    card: 'rounded-2xl w-full h-48',
  };

  const style = {
    width: width,
    height: variant === 'text' && !height ? undefined : height,
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
      {...props}
    />
  );
};
