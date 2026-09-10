import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Award } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

interface VideoShowcaseCardProps {
  videoSrc?: string;
  className?: string;
  onOpenModal?: () => void;
}

export const VideoShowcaseCard: React.FC<VideoShowcaseCardProps> = ({
  videoSrc = '/sih.mp4',
  className,
  onOpenModal,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-1 shadow-2xl shadow-amber-500/10 group',
        className
      )}
    >
      {/* Top Badge Strip */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-white/10 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-amber-500/15 border border-amber-500/30 rounded-lg text-amber-400">
            <Award size={16} />
          </span>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              SIH 2026 Project Walkthrough Video
            </h4>
            <p className="text-[11px] text-slate-400">Watch live label inspection & AI statutory pipeline</p>
          </div>
        </div>

        <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
          Full HD
        </span>
      </div>

      {/* Video Viewport */}
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={videoSrc}
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Big Center Play Overlay Button when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 hover:scale-110 transition-transform">
              <Play size={28} className="translate-x-0.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full border border-white/20">
              Click to Play Demo
            </span>
          </div>
        )}

        {/* Bottom Hover Controls */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button onClick={toggleMute} className="text-slate-300 hover:text-white transition-colors">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <span className="text-[11px] font-mono text-slate-400">CompliScan AI • sih.mp4</span>
          </div>

          {onOpenModal && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal();
              }}
              className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Maximize2 size={14} />
              <span>Expand Theater</span>
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
