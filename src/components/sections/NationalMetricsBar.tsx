import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Scale, FileText, CheckCircle2 } from 'lucide-react';

export const NationalMetricsBar: React.FC = () => {
  const metrics = [
    {
      icon: ShieldCheck,
      value: "1,248+",
      label: "Label Audits Completed",
      subtext: "Across Food, Cosmetics & Oils",
      color: "from-emerald-400 to-teal-400",
      borderColor: "border-emerald-500/30",
      bgGlow: "bg-emerald-500/10"
    },
    {
      icon: Scale,
      value: "22+",
      label: "Mandatory Regulatory Rules",
      subtext: "FSSAI, Legal Metrology & BIS",
      color: "from-amber-400 to-orange-400",
      borderColor: "border-amber-500/30",
      bgGlow: "bg-amber-500/10"
    },
    {
      icon: Zap,
      value: "< 2.4s",
      label: "Instant Dual-OCR Audit",
      subtext: "Gemini Vision + Tesseract",
      color: "from-cyan-400 to-blue-400",
      borderColor: "border-cyan-500/30",
      bgGlow: "bg-cyan-500/10"
    },
    {
      icon: CheckCircle2,
      value: "₹0",
      label: "Free Citizen Inspection",
      subtext: "vs ₹15,000 Laboratory Testing",
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
            className={`p-5 rounded-2xl bg-slate-900/90 dark:bg-slate-950/90 border ${m.borderColor} backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all group`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`w-10 h-10 rounded-xl ${m.bgGlow} flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform`}>
                <m.icon className="w-5 h-5 text-white" />
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded-full bg-slate-800/80">
                VERIFIED
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
