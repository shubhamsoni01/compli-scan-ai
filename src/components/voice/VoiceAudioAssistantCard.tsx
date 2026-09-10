import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Languages, 
  Sparkles, 
  Copy, 
  Check, 
  Radio,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  generateVoiceScript, 
  speechController, 
  type VoiceLanguage, 
  type VoiceScriptData 
} from '@/services/voiceService';

interface VoiceAudioAssistantCardProps {
  scanData: any;
  className?: string;
  autoPlayPrompt?: boolean;
}

export const VoiceAudioAssistantCard: React.FC<VoiceAudioAssistantCardProps> = ({
  scanData,
  className = '',
  autoPlayPrompt = false,
}) => {
  const [selectedLang, setSelectedLang] = useState<VoiceLanguage>('hi');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [copied, setCopied] = useState<boolean>(false);
  const [spokenWord, setSpokenWord] = useState<string>('');
  const [scriptData, setScriptData] = useState<VoiceScriptData>(() =>
    generateVoiceScript(scanData, 'hi')
  );

  // Update script whenever scanData or language changes
  useEffect(() => {
    const data = generateVoiceScript(scanData, selectedLang);
    setScriptData(data);
    if (isPlaying) {
      speechController.stop();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [scanData, selectedLang]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      speechController.stop();
    };
  }, []);

  const handlePlayToggle = () => {
    if (isPlaying && !isPaused) {
      speechController.pause();
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      speechController.resume();
      setIsPaused(false);
      return;
    }

    setIsPlaying(true);
    setIsPaused(false);

    speechController.speak(scriptData.text, selectedLang, speechRate, {
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
        setSpokenWord('');
      },
      onPause: () => setIsPaused(true),
      onResume: () => setIsPaused(false),
      onBoundary: (_charIdx, word) => {
        setSpokenWord(word.trim());
      },
      onError: (err) => {
        console.warn('[Voice Assistant Warning]:', err);
        setIsPlaying(false);
        setIsPaused(false);
      },
    });
  };

  const handleStop = () => {
    speechController.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setSpokenWord('');
  };

  const handleCopyScript = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(scriptData.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Card className={`p-5 sm:p-6 bg-gradient-to-br from-indigo-950/20 via-slate-900/10 to-amber-950/20 dark:from-indigo-950/40 dark:via-slate-900/30 dark:to-amber-950/30 border-indigo-200/80 dark:border-indigo-900/60 shadow-lg relative overflow-hidden ${className}`}>
      {/* Background Subtle Accent Aura */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-100 dark:border-indigo-900/40 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl transition-all duration-300 ${
            isPlaying && !isPaused
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 animate-pulse'
              : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
          }`}>
            <Volume2 size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-gray-900 dark:text-gray-100 text-base flex items-center gap-1.5">
                <span>AI Multilingual Voice Brief</span>
                <span className="text-[10px] bg-gradient-to-r from-orange-500 via-slate-200 to-emerald-500 text-slate-950 font-black px-2 py-0.2 rounded-full shadow-xs">
                  AUDIO READOUT
                </span>
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Instant voice summary for rural consumers, inspectors & visually impaired citizens
            </p>
          </div>
        </div>

        {/* Language Selector Pills */}
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl border border-gray-200 dark:border-gray-700/80 self-start sm:self-auto">
          <button
            onClick={() => setSelectedLang('hi')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedLang === 'hi'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white'
            }`}
          >
            <span>🇮🇳 हिन्दी</span>
          </button>
          <button
            onClick={() => setSelectedLang('en')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedLang === 'en'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white'
            }`}
          >
            <span>🇬🇧 English</span>
          </button>
          <button
            onClick={() => setSelectedLang('hinglish')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedLang === 'hinglish'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white'
            }`}
          >
            <span>🗣️ Hinglish</span>
          </button>
        </div>
      </div>

      {/* Main Player Bar */}
      <div className="py-4 space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/60 dark:bg-gray-900/70 p-4 rounded-2xl border border-indigo-100/80 dark:border-indigo-900/40 backdrop-blur-md">
          {/* Audio Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={handlePlayToggle}
              className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 transition-transform active:scale-95 shrink-0"
              title={isPlaying && !isPaused ? 'Pause Voice Brief' : 'Play Voice Brief'}
            >
              {isPlaying && !isPaused ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>

            {isPlaying && (
              <button
                onClick={handleStop}
                className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                title="Stop & Reset"
              >
                <RotateCcw size={16} />
              </button>
            )}

            {/* Equalizer Sound Waves */}
            <div className="flex items-center gap-1 h-8 px-3">
              {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
                <motion.div
                  key={i}
                  className={`w-1 rounded-full ${
                    isPlaying && !isPaused
                      ? 'bg-gradient-to-t from-indigo-600 to-amber-500'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                  animate={
                    isPlaying && !isPaused
                      ? { height: [`${Math.max(15, h * 0.2)}%`, `${h}%`, `${Math.max(15, h * 0.3)}%`] }
                      : { height: '20%' }
                  }
                  transition={{
                    duration: 0.5 + (i % 3) * 0.2,
                    repeat: isPlaying && !isPaused ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                  style={{ minHeight: '4px' }}
                />
              ))}
            </div>
          </div>

          {/* Spoken Word / Live Teleprompter status */}
          <div className="flex-1 text-center sm:text-right">
            {isPlaying && !isPaused ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-mono text-indigo-700 dark:text-indigo-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Speaking: <strong>{spokenWord || '...'}</strong></span>
              </div>
            ) : isPaused ? (
              <span className="text-xs font-mono text-amber-600 dark:text-amber-400">
                ❚❚ Audio Paused
              </span>
            ) : (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Est. Duration: ~{scriptData.durationEstimateSec}s
              </span>
            )}
          </div>

          {/* Speed & Copy Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSpeechRate((r) => (r === 1.0 ? 1.25 : r === 1.25 ? 0.85 : 1.0))}
              className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              title="Change playback speed"
            >
              {speechRate}x
            </button>
            <button
              onClick={handleCopyScript}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              title="Copy voice transcript"
            >
              {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
            </button>
          </div>
        </div>

        {/* Live Audio Transcript Box */}
        <div className="p-3.5 bg-slate-50/80 dark:bg-gray-900/60 rounded-xl border border-gray-200/80 dark:border-gray-800/80 text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
          <p className="font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <Radio size={12} className="text-indigo-500" />
            <span>Voice Transcript ({selectedLang === 'hi' ? 'हिन्दी' : selectedLang === 'en' ? 'English' : 'Hinglish'})</span>
          </p>
          <p className="italic">"{scriptData.text}"</p>
        </div>

        {/* Key Statutory Highlights Bullets */}
        {scriptData.bulletPoints && scriptData.bulletPoints.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {scriptData.bulletPoints.map((b, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 rounded-lg bg-white/40 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-[11px] text-gray-600 dark:text-gray-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default VoiceAudioAssistantCard;
