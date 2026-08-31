import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ScanLine,
  History,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { cn } from '@/utils/cn';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Scan Product', path: '/scan', icon: ScanLine },
  { name: 'History', path: '/history', icon: History },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Rules & Info', path: '/rules', icon: BookOpen },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const mobileNavItems = ['/dashboard', '/scan', '/history', '/reports', '/settings'];

export const Sidebar: React.FC = () => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-full bg-white dark:bg-surface-900 border-r border-gray-200 dark:border-white/5 z-20 transition-colors duration-200">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-white/5">
          <div className="bg-indigo-600 dark:bg-violet-600 text-white p-1.5 rounded-lg shadow-sm">
            <ShieldCheck size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
            CompliScan AI
          </span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group",
                isActive 
                  ? "text-indigo-700 dark:text-violet-300" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-indigo-50 dark:bg-violet-500/10 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <item.icon size={20} className="relative z-10" />
                  <span className="relative z-10">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 m-4 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40 rounded-xl border border-indigo-100/50 dark:border-indigo-500/10">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-violet-300 font-medium mb-1 text-sm">
            <Sparkles size={16} />
            AI-Powered
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Product Compliance checking made easy.
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-900 border-t border-gray-200 dark:border-white/5 z-50 flex items-center justify-around pb-safe pt-2 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none">
        {navItems.filter(item => mobileNavItems.includes(item.path)).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center p-2 rounded-xl transition-colors relative mb-2 w-16",
              isActive 
                ? "text-indigo-600 dark:text-violet-400" 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute inset-0 bg-indigo-50 dark:bg-violet-500/10 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon size={20} className="relative z-10 mb-1" />
                <span className="text-[10px] font-medium relative z-10 leading-none">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
};
