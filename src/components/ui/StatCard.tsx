import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './Card';
import { cn } from '@/utils/cn';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card hover padding="md" className={cn("flex flex-col cursor-default transition-all duration-300", className)}>
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 bg-indigo-50 dark:bg-surface-800 rounded-xl text-indigo-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          {trend && (
            <div className={cn(
              "flex items-center text-sm font-medium",
              trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              {trend.isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {trend.value}%
            </div>
          )}
        </div>
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h4>
        <p className="text-2xl font-heading font-bold text-gray-900 dark:text-white">{value}</p>
      </Card>
    </motion.div>
  );
};
