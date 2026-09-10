import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Sparkles, Award } from 'lucide-react';
import { MinistryLogo } from '@/components/ui/MinistryLogo';
import { SIHLogo } from '@/components/ui/SIHLogo';

interface VideoDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
  title?: string;
}

export const VideoDemoModal: React.FC<VideoDemoModalProps> = ({
  isOpen,
  onClose,
  videoSrc = '/sih.mp4',
  title = 'CompliScan AI • SIH 2026 Solution Walkthrough & Video Demonstration',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md">
          {/* Backdrop Click to close */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-5xl bg-slate-950 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10 flex flex-col z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                    <span>{title}</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono uppercase">
                      SIH 2026
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ministry of Consumer Affairs, Food & Public Distribution • Legal Metrology Division
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <MinistryLogo size="sm" showText={false} />
                  <SIHLogo size="sm" showText={false} />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video bg-black flex items-center justify-center group">
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                loop
                playsInline
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Floating Custom Controls Bar on Hover */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md border border-white/15 px-5 py-2.5 rounded-full flex items-center gap-4 text-white shadow-xl opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-amber-400"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-slate-200"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <span className="text-xs font-mono text-slate-400">CompliScan AI Video Demo</span>

                <button
                  onClick={handleFullscreen}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-slate-200"
                  title="Fullscreen"
                >
                  <Maximize size={18} />
                </button>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="px-6 py-3 bg-slate-900/60 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <Sparkles size={14} /> Smart India Hackathon 2026 Project Demonstration
              </span>
              <span>CompliScan AI • Real-Time Legal Compliance Engine</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
