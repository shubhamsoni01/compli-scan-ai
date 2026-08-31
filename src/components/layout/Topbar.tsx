import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Bell, Search, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';

// Mock hook and data for now
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  return {
    theme,
    toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light')
  };
};

import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, History, FileText, LogOut } from 'lucide-react';

const mockNotifications = [
  { id: 1, text: 'New scan completed', unread: true },
];

export const Topbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const unreadCount = mockNotifications.filter((n: any) => n.unread).length;
  
  const { user, logout } = useAuth();
  const getInitials = (fullName?: string) => {
    if (!fullName || !fullName.trim()) return 'CS';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const initials = getInitials(user?.name);
  const photoUrl = user?.profilePhotoUrl || user?.profilePicture;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Basic title generation from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const title = pathParts.length > 0 
    ? pathParts[pathParts.length - 1].charAt(0).toUpperCase() + pathParts[pathParts.length - 1].slice(1)
    : 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-4 bg-white/80 dark:bg-surface-950/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 transition-colors duration-200">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
          {title}
        </h1>
        {pathParts.length > 1 && (
          <div className="hidden sm:flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2 ml-4">
            <span>Home</span>
            <ChevronRight size={14} />
            <span className="capitalize">{title}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors relative overflow-hidden cursor-pointer"
          aria-label="Toggle theme"
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

        <button className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-950"></span>
          )}
        </button>

        <div className="h-8 w-px bg-gray-200 dark:bg-white/10 mx-1"></div>

        {/* Profile Avatar with Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
            aria-label="User menu"
          >
            {photoUrl ? (
              <img 
                src={photoUrl} 
                alt={user?.name || 'User'} 
                className="w-9 h-9 rounded-full object-cover border border-indigo-200 dark:border-indigo-800 shadow-sm"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm select-none">
                {initials}
              </div>
            )}
          </button>

          {/* Profile Dropdown Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsMenuOpen(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 overflow-hidden"
                >
                  <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {user?.name || 'Compliance Inspector'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user?.email || 'inspector@compliscan.ai'}
                    </p>
                  </div>

                  <Link
                    to="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
                  >
                    <User size={15} className="text-indigo-500" />
                    <span>Profile & Settings</span>
                  </Link>

                  <Link
                    to="/history"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
                  >
                    <History size={15} className="text-emerald-500" />
                    <span>My History</span>
                  </Link>

                  <Link
                    to="/reports"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
                  >
                    <FileText size={15} className="text-sky-500" />
                    <span>My Reports</span>
                  </Link>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
