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
import { SIHLogo } from '@/components/ui/SIHLogo';

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
          <div className="bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 p-1.5 rounded-lg shadow-sm shadow-emerald-500/30">
            <ShieldCheck size={24} className="stroke-[2.5]" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
            CompliScan <span className="text-emerald-500 dark:text-emerald-400">AI</span>
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
                  ? "text-emerald-600 dark:text-emerald-400 font-semibold" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-xl border border-emerald-500/20"
                    />
                  )}
                  <item.icon size={20} className={cn(
                    "relative z-10 transition-colors",
                    isActive ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white"
                  )} />
                  <span className="relative z-10">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-center">
            <SIHLogo size="sm" showText={true} />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
            <Sparkles size={14} className="flex-shrink-0 text-emerald-500" />
            <span className="font-semibold">SIH 2026 Compliance AI</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#070b12]/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 z-50 flex items-center justify-around pb-safe pt-2 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.filter(item => mobileNavItems.includes(item.path)).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center p-2 rounded-xl transition-colors relative mb-2 w-16",
              isActive 
                ? "text-emerald-600 dark:text-emerald-400 font-semibold" 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl"
                  />
                )}
                <item.icon size={20} className="relative z-10" />
                <span className="text-[10px] mt-1 relative z-10">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
};
