import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, Moon, Sun } from 'lucide-react';
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
        style={{ height: 'var(--navbar-height, 72px)' }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[9999] transition-colors duration-200 border-b flex items-center",
          scrolled 
            ? "bg-white/85 dark:bg-surface-950/85 backdrop-blur-md border-gray-200/80 dark:border-white/10 shadow-sm" 
            : "bg-white/50 dark:bg-surface-950/50 backdrop-blur-sm border-transparent"
        )}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 dark:bg-violet-600 text-white p-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
              CompliScan AI
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600 dark:text-gray-300">
            {[
              { label: 'Features', href: '/#features', isInternal: true },
              { label: 'How It Works', href: '/#how-it-works', isInternal: true },
              { label: 'Development', href: '/development', isInternal: false },
              { label: 'Pricing', href: '/#pricing', isInternal: true }
            ].map((link) => (
              link.isInternal ? (
                <a 
                  key={link.label}
                  href={link.href} 
                  className="relative py-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 group"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-300 group-hover:w-full" />
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="relative py-1 text-indigo-600 dark:text-cyan-400 font-semibold hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors duration-200 group"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-cyan-400 rounded-full transition-all duration-300" />
                </Link>
              )
            ))}
          </nav>

          <div className="flex items-center gap-4">
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
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

