import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Code2, 
  FileText, 
  Image as ImageIcon, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface AIProcessingDetailsProps {
  image?: string | null;
  ocrText?: string | null;
  groqData?: any | null;
  scanId?: string | null;
  ocrEngine?: string | null;
}

export const AIProcessingDetails: React.FC<AIProcessingDetailsProps> = ({
  image,
  ocrText,
  groqData,
  scanId,
  ocrEngine = 'OCR.Space',
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [imgZoom, setImgZoom] = useState(1);
  const [imgRotate, setImgRotate] = useState(0);

  // Return nothing if no processing data is provided
  if (!image && !ocrText && !groqData) return null;

  const rawJsonString = groqData 
    ? (typeof groqData === 'string' ? groqData : JSON.stringify(groqData, null, 2))
    : '// No Groq structured data returned';

  const handleCopyText = () => {
    if (!ocrText) return;
    navigator.clipboard.writeText(ocrText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyJson = () => {
    if (!groqData) return;
    navigator.clipboard.writeText(rawJsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <Card className="p-0 overflow-hidden border border-indigo-100 dark:border-indigo-900/40 bg-white dark:bg-gray-900 shadow-sm rounded-2xl transition-all">
      {/* Interactive Header Banner */}
      <div
        className="px-6 py-4 bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/40 dark:from-indigo-950/40 dark:via-gray-900 dark:to-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-heading font-semibold text-base text-gray-900 dark:text-gray-100">
                AI Processing Details
              </h3>
              <Badge variant="outline" className="bg-white/80 dark:bg-gray-800 text-[11px] font-mono border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
                Scan Intelligence
              </Badge>
              {scanId && (
                <span className="hidden sm:inline-block font-mono text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800/80 px-2 py-0.5 rounded-full">
                  {scanId}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              End-to-end pipeline: Product Image → OCR.Space Text → Groq AI Structured JSON
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hidden sm:inline-block">
            {isOpen ? 'Hide Details' : 'View Details'}
          </span>
          <div className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Visual Pipeline Stepper Indicator */}
      <div className="bg-gray-50/70 dark:bg-gray-950/40 px-6 py-2.5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] font-medium text-gray-500 dark:text-gray-400 overflow-x-auto gap-3">
        <div className="flex items-center gap-1.5 shrink-0 text-indigo-600 dark:text-indigo-400">
          <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
          <span>1. Product Image</span>
        </div>
        <span>→</span>
        <div className="flex items-center gap-1.5 shrink-0 text-cyan-600 dark:text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-500" />
          <span>2. OCR.Space (Raw Text)</span>
        </div>
        <span>→</span>
        <div className="flex items-center gap-1.5 shrink-0 text-emerald-600 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>3. Groq AI (Structured JSON)</span>
        </div>
        <span>→</span>
        <div className="flex items-center gap-1.5 shrink-0 text-gray-400 dark:text-gray-500">
          <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span>4. Rule Engine (Next)</span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-7">
              {/* SECTION 1: Uploaded Product Image */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    <ImageIcon size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <span>Uploaded Product Image</span>
                  </div>
                  {image && (
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setImgZoom((z) => Math.max(0.75, z - 0.25)); }}
                        className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 rounded"
                        title="Zoom out"
                      >
                        <ZoomOut size={14} />
                      </button>
                      <span className="text-[10px] font-mono px-1 text-gray-600 dark:text-gray-300">
                        {Math.round(imgZoom * 100)}%
                      </span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setImgZoom((z) => Math.min(2.5, z + 0.25)); }}
                        className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 rounded"
                        title="Zoom in"
                      >
                        <ZoomIn size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setImgRotate((r) => r + 90); }}
                        className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 rounded ml-1 border-l border-gray-200 dark:border-gray-700 pl-1.5"
                        title="Rotate 90°"
                      >
                        <RotateCw size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-gray-50/70 dark:bg-gray-950/60 rounded-xl border border-gray-200/80 dark:border-gray-800 flex items-center justify-center min-h-[160px] max-h-80 overflow-hidden relative">
                  {image ? (
                    <div
                      className="transition-transform duration-200 ease-out flex items-center justify-center"
                      style={{ transform: `scale(${imgZoom}) rotate(${imgRotate}deg)` }}
                    >
                      <img
                        src={image}
                        alt="Uploaded label preview"
                        className="max-h-72 object-contain rounded-lg shadow-sm"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 py-6">
                      <ImageIcon size={32} className="stroke-1 mb-2" />
                      <span className="text-xs font-mono">Image buffer processed in active session</span>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: Raw OCR Text */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-cyan-600 dark:text-cyan-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Raw OCR Text
                    </span>
                    <Badge variant="secondary" className="text-[11px] font-medium bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                      {ocrEngine || 'OCR.Space'}
                    </Badge>
                  </div>
                  {ocrText && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 font-mono hidden sm:inline-block">
                        {ocrText.length} characters
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyText}
                        className="h-7 text-xs flex items-center gap-1.5"
                      >
                        {copiedText ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        <span>{copiedText ? 'Copied' : 'Copy Text'}</span>
                      </Button>
                    </div>
                  )}
                </div>

                <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-slate-950 text-slate-100">
                  <div className="px-4 py-2 bg-slate-900/80 border-b border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Source: Exact unmodified OCR response</span>
                    <span>Language: English</span>
                  </div>
                  <pre className="p-4 font-mono text-xs text-cyan-300 whitespace-pre-wrap break-words max-h-60 overflow-y-auto leading-relaxed select-text">
                    {ocrText || '// No text extracted from this label'}
                  </pre>
                </div>
              </div>

              {/* SECTION 3: Groq Structured Data */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Groq Structured Data
                    </span>
                    <Badge variant="secondary" className="text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Groq AI
                    </Badge>
                  </div>
                  {groqData && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyJson}
                      className="h-7 text-xs flex items-center gap-1.5"
                    >
                      {copiedJson ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                    </Button>
                  )}
                </div>

                <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-slate-950 text-slate-100">
                  <div className="px-4 py-2 bg-slate-900/80 border-b border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Schema: Indian Packaged Commodities Declarations</span>
                    <span>Strict JSON</span>
                  </div>
                  <pre className="p-4 font-mono text-xs text-emerald-400 whitespace-pre-wrap break-words max-h-80 overflow-y-auto leading-relaxed select-text">
                    {rawJsonString}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default AIProcessingDetails;
