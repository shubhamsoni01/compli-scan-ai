import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Scale, CheckCircle2, Activity } from 'lucide-react';
import { fetchRealStats, type RealStatsResponse } from '@/services/api';

export const NationalMetricsBar: React.FC = () => {
  const [stats, setStats] = useState<RealStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRealStats()
      .then((data) => setStats(data))
      .catch((err) => console.warn('Could not fetch real stats:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const totalAudits = stats ? stats.totalScans : 0;
  const uniqueVisitors = stats ? stats.uniqueVisitors : 0;
  const compliantCount = stats ? stats.compliantProducts : 0;

  const metrics = [
    {
      icon: ShieldCheck,
      value: isLoading ? "..." : `${totalAudits}`,
      badge: "LIVE ATLAS DB",
      badgeColor: "text-emerald-400 bg-emerald-950/60 border-emerald-500/40",
      label: "Live Label Audits",
      subtext: totalAudits > 0 ? `${compliantCount} 100% Compliant Audited` : "Real-time scans logged to DB",
      color: "from-emerald-400 to-teal-400",
      borderColor: "border-emerald-500/30",
      bgGlow: "bg-emerald-500/10"
    },
    {
      icon: Scale,
      value: "22+",
      badge: "FSSAI / LM RULES",
      badgeColor: "text-amber-400 bg-amber-950/60 border-amber-500/40",
      label: "Statutory Check Rules",
      subtext: "FSSAI, Legal Metrology & BIS",
      color: "from-amber-400 to-orange-400",
      borderColor: "border-amber-500/30",
      bgGlow: "bg-amber-500/10"
    },
    {
      icon: Zap,
      value: "< 2.4s",
      badge: "DUAL OCR ENGINE",
      badgeColor: "text-cyan-400 bg-cyan-950/60 border-cyan-500/40",
      label: "Dual-Engine OCR Speed",
      subtext: "Gemini Vision + Tesseract",
      color: "from-cyan-400 to-blue-400",
      borderColor: "border-cyan-500/30",
      bgGlow: "bg-cyan-500/10"
    },
    {
      icon: Activity,
      value: isLoading ? "..." : `${uniqueVisitors}`,
      badge: "REAL CITIZENS",
      badgeColor: "text-purple-400 bg-purple-950/60 border-purple-500/40",
      label: "Verified Citizen Visits",
      subtext: "Tracked anonymously via DB",
      color: "from-purple-400 to-pink-400",
      borderColor: "border-purple-500/30",
      bgGlow: "bg-purple-500/10"
    }
  ];

  return (
    <section className="relative z-20 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`p-5 rounded-2xl bg-slate-900/90 dark:bg-slate-950/90 border ${m.borderColor} backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between mb-3">
              <span className={`w-10 h-10 rounded-xl ${m.bgGlow} flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform`}>
                <m.icon className="w-5 h-5 text-white" />
              </span>
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${m.badgeColor}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {m.badge}
              </span>
            </div>

            <div className={`text-3xl font-extrabold font-mono bg-gradient-to-r ${m.color} bg-clip-text text-transparent mb-1`}>
              {m.value}
            </div>
            <div className="text-sm font-bold text-white mb-0.5">
              {m.label}
            </div>
            <div className="text-xs text-slate-400">
              {m.subtext}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default NationalMetricsBar;
