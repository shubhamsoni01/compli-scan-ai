import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { CompliScanLogo } from '@/components/ui/CompliScanLogo';
import { SIHLogo } from '@/components/ui/SIHLogo';
import { MinistryLogo } from '@/components/ui/MinistryLogo';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

// Mock hook
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  return {
    theme,
    toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light')
  };
};

export const LandingLayout: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-surface-950 font-sans transition-colors duration-200 text-gray-900 dark:text-gray-100">
      <header 
        className={cn(
          "z-[9999] transition-all duration-300 flex items-center justify-between",
          scrolled 
            ? "fixed top-3 left-1/2 -translate-x-1/2 w-[94%] max-w-6xl rounded-2xl md:rounded-full bg-white/85 dark:bg-[#070b12]/85 backdrop-blur-2xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 px-5 sm:px-8 py-2.5" 
            : "fixed top-0 left-0 right-0 bg-white/40 dark:bg-[#070b12]/40 backdrop-blur-md border-b border-slate-200/40 dark:border-white/5 px-4 sm:px-8 py-4"
        )}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center group">
              <CompliScanLogo size="sm" />
            </Link>
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-white/10">
              <SIHLogo size="sm" showText={false} />
              <MinistryLogo size="sm" showText={false} />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600 dark:text-slate-300">
            {[
              { label: 'Features', href: '/#features', isInternal: true },
              { label: 'How It Works', href: '/#how-it-works', isInternal: true },
              { label: 'Ministry Admin', href: '/admin', isInternal: false },
              { label: 'Development', href: '/development', isInternal: false },
              { label: 'Rules & Gazette', href: '/rules', isInternal: false }
            ].map((link) => (
              link.isInternal ? (
                <a 
                  key={link.label}
                  href={link.href} 
                  className="relative py-1 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-200 group"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-300 group-hover:w-full" />
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="relative py-1 text-slate-700 dark:text-slate-200 hover:text-emerald-500 dark:hover:text-cyan-400 font-medium transition-colors duration-200 group"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-300 group-hover:w-full" />
                </Link>
              )
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <CommandPalette />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'light' ? (
                  <motion.div
                    key="moon"
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 cursor-pointer focus:outline-none"
                  aria-label="Profile menu"
                >
                  {(user?.profilePhotoUrl || user?.profilePicture) ? (
                    <img
                      src={user?.profilePhotoUrl || user?.profilePicture}
                      alt={user?.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover border border-indigo-200 dark:border-indigo-800 shadow-sm"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm select-none">
                      {(() => {
                        if (!user?.name || !user.name.trim()) return 'CS';
                        const parts = user.name.trim().split(/\s+/);
                        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
                        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                      })()}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50"
                      >
                        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {user?.name || 'Inspector'}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/history"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl"
                        >
                          My History
                        </Link>
                        <Link
                          to="/reports"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl"
                        >
                          My Reports
                        </Link>
                        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                        <button
                          onClick={async () => {
                            await logout();
                            setIsProfileOpen(false);
                            window.location.reload();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                to="/auth/login"
                className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-violet-400 transition-colors"
              >
                Log in
              </Link>
            )}
            <Link 
              to="/scan"
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-md shadow-emerald-500/20 border border-emerald-400/30"
            >
              Scan Product
            </Link>
          </div>
        </div>
      </header>

      <main 
        style={{ paddingTop: 'var(--navbar-height, 72px)' }} 
        className="flex-1 flex flex-col"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default LandingLayout;

