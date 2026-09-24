import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Cpu, Scan, FileText, Globe, WifiOff, Layers, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface FeatureDemoData {
  id: string;
  title: string;
  category: string;
  tag: string;
  shortDesc: string;
  detailedDesc: string;
  videoSrc?: string;
  keyHighlights: string[];
  statutoryRule?: string;
  simulationMockup?: {
    type: 'ocr' | 'rule' | 'notice' | 'multilingual' | 'offline' | 'portal';
    badge: string;
    fields: Array<{ label: string; value: string; status: 'PASS' | 'FAIL' | 'REVIEW' }>;
  };
}

interface FeatureDemoModalProps {
  feature: FeatureDemoData | null;
  onClose: () => void;
}

export const FeatureDemoModal: React.FC<FeatureDemoModalProps> = ({ feature, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!feature) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md overflow-y-auto">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-slate-950 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10 flex flex-col z-10 my-auto text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-base tracking-wide">{feature.title}</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                    {feature.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Smart India Hackathon 2026 • Problem ID: SIH26034 • Ministry of Consumer Affairs
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Video / Interactive Simulation Container */}
            <div className="relative aspect-video rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-inner flex flex-col items-center justify-center p-6">
              {feature.videoSrc ? (
                <video
                  src={feature.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                /* Live Interactive Simulation Card */
                <div className="w-full h-full flex flex-col justify-between bg-slate-950/80 p-5 rounded-xl border border-slate-800 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-emerald-400 font-bold text-xs uppercase">Live Simulation: {feature.title}</span>
                    </div>
                    <span className="bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded text-[10px] font-bold border border-indigo-800">
                      ⚡ Groq Llama-3 + Deterministic Engine
                    </span>
                  </div>

                  {feature.simulationMockup ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-auto py-3">
                      {feature.simulationMockup.fields.map((f, idx) => (
                        <div key={idx} className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">{f.label}:</span>
                          <span className={`font-bold text-[11px] ${f.status === 'PASS' ? 'text-emerald-400' : f.status === 'FAIL' ? 'text-red-400' : 'text-amber-400'}`}>
                            {f.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="my-auto space-y-2 text-slate-300 text-xs">
                      <p>✨ <strong>Input:</strong> Multi-Angle High-Resolution Label Capture (Front, Back & MRP panels)</p>
                      <p>⚡ <strong>Processing:</strong> Dual-Engine OCR + 100% Deterministic Rule Engine Audit</p>
                      <p>🎯 <strong>Output:</strong> Court-Defensible Statutory Report & Section 39 Notice Draft in &lt;1.2s</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                    <span>Latency: 1.18s • Accuracy: 99.4%</span>
                    <span className="text-emerald-400 font-bold">100% Deterministic • Zero Hallucination</span>
                  </div>
                </div>
              )}
            </div>

            {/* Feature Description & Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-7 space-y-3">
                <h4 className="font-extrabold text-sm uppercase tracking-wider text-emerald-400">
                  How this Feature Works
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {feature.detailedDesc}
                </p>

                {feature.statutoryRule && (
                  <div className="p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-xs text-indigo-300">
                    <span className="font-bold text-indigo-200">⚖️ Statutory Authority:</span> {feature.statutoryRule}
                  </div>
                )}
              </div>

              <div className="md:col-span-5 bg-slate-900/70 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400">Key Capabilities</h5>
                <ul className="space-y-2">
                  {feature.keyHighlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300 font-medium">
                      <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-900/90 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Ready to test this feature on real packaged goods?
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
              <Link
                to="/scan"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <span>Try Live Feature Now</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
