import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Scan, FileText, BookOpen, BarChart3, 
  Settings, Sparkles, ArrowRight, ShieldCheck, 
  Layers, ExternalLink, X, Command
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  category: 'Navigation' | 'Actions' | 'Regulations' | 'Samples';
  action: () => void;
  badge?: string;
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = useCallback((action: () => void) => {
    action();
    setIsOpen(false);
    setSearch('');
  }, []);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-scan',
      title: 'Scan Product Label',
      subtitle: 'Open AI label scanner with camera & upload',
      icon: Scan,
      category: 'Actions',
      action: () => navigate('/scan'),
      badge: 'Main Feature'
    },
    {
      id: 'nav-dashboard',
      title: 'Dashboard Overview',
      subtitle: 'View live compliance metrics & recent audit activity',
      icon: BarChart3,
      category: 'Navigation',
      action: () => navigate('/dashboard')
    },
    {
      id: 'nav-rules',
      title: 'Compliance Rules & Gazette',
      subtitle: 'Browse 22+ FSSAI, Legal Metrology & CDSCO rules',
      icon: BookOpen,
      category: 'Navigation',
      action: () => navigate('/rules'),
      badge: 'Gazette'
    },
    {
      id: 'nav-reports',
      title: 'Audit Reports & History',
      subtitle: 'Download court-admissible PDF reports',
      icon: FileText,
      category: 'Navigation',
      action: () => navigate('/reports')
    },
    {
      id: 'nav-dev',
      title: 'Hackathon & Architecture Info',
      subtitle: 'View SIH 2026 problem statement & system diagram',
      icon: ShieldCheck,
      category: 'Navigation',
      action: () => navigate('/development')
    },
    {
      id: 'nav-settings',
      title: 'Profile & Settings',
      subtitle: 'Manage account, avatar & system preferences',
      icon: Settings,
      category: 'Navigation',
      action: () => navigate('/settings')
    },
    // Regulations Direct Lookup
    {
      id: 'reg-fssai-lic',
      title: 'Rule LM-001: 14-Digit FSSAI License',
      subtitle: 'Mandatory on all pre-packaged food items with logo',
      icon: Layers,
      category: 'Regulations',
      action: () => navigate('/rules'),
      badge: 'FSSAI'
    },
    {
      id: 'reg-veg-logo',
      title: 'Rule LM-002: Veg / Non-Veg Symbol',
      subtitle: 'Green/Brown filled circle inside square box with contrasting background',
      icon: Layers,
      category: 'Regulations',
      action: () => navigate('/rules'),
      badge: 'FSSAI 2020'
    },
    {
      id: 'reg-net-qty',
      title: 'Rule LM-006: Metric Net Quantity & Volume',
      subtitle: 'Standard SI metric units (g, kg, ml, L) with minimum font height',
      icon: Layers,
      category: 'Regulations',
      action: () => navigate('/rules'),
      badge: 'Legal Metrology'
    },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(search.toLowerCase()) ||
    cmd.subtitle.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Search trigger button for mobile / navbar */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-slate-400 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer backdrop-blur-md"
        title="Open Command Search (Ctrl+K)"
      >
        <Search className="w-3.5 h-3.5 text-emerald-400" />
        <span>Search...</span>
        <kbd className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-slate-300 border border-white/10">
          ⌘K
        </kbd>
      </button>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-20 sm:pt-28 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Apple Spotlight Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-slate-900/95 text-white border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-500/20 overflow-hidden backdrop-blur-2xl z-10"
            >
              {/* Input Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
                <Search className="w-5 h-5 text-emerald-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type a command, rule, or destination... (Esc to close)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-0 focus:outline-none text-base text-white placeholder-slate-500 font-sans"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  ESC
                </kbd>
              </div>

              {/* List of Results */}
              <div className="max-h-[380px] overflow-y-auto p-3 space-y-1 divide-y divide-slate-800/40">
                {filtered.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <p className="text-sm">No results found for &ldquo;{search}&rdquo;</p>
                  </div>
                ) : (
                  filtered.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.action)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-transparent transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-500/20 transition-all">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                            {item.title}
                            {item.badge && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">{item.subtitle}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2 text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" /> CompliScan Spotlight Engine
                </span>
                <span className="hidden sm:inline">Use ↑↓ to navigate • ↵ to select</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
