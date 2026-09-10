import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ImageIcon, FileText, Search, ShieldCheck, CheckCircle2, Camera, AlertCircle, RefreshCw, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { DropZone } from '@/components/ui/DropZone';
import { CameraCapture } from '@/components/ui/CameraCapture';
import { MinistryLogo } from '@/components/ui/MinistryLogo';
import { SIHLogo } from '@/components/ui/SIHLogo';
import { startRealScan, startRealMultiScan, type MultiAngleImages } from '@/services/scanService';
import { createSampleLabelFile } from '@/utils/sampleImages';
import { Layers, ScanLine, Check, UploadCloud, Play } from 'lucide-react';
import { VideoDemoModal } from '@/components/media/VideoDemoModal';

const categories = ['Food', 'Edible Oil', 'Cosmetics', 'Household', 'Other'];

interface StepState {
  id: number;
  label: string;
  icon: any;
  status: 'pending' | 'active' | 'completed' | 'error';
}

const INITIAL_STEPS: StepState[] = [
  { id: 1, label: 'Image Processing', icon: ImageIcon, status: 'pending' },
  { id: 2, label: 'Text Extraction (OCR)', icon: FileText, status: 'pending' },
  { id: 3, label: 'Information Analysis', icon: Search, status: 'pending' },
  { id: 4, label: 'Rule Compliance Check', icon: ShieldCheck, status: 'pending' },
  { id: 5, label: 'Generating Report', icon: FileText, status: 'pending' },
];

export default function ScanPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>('Food');
  const [scanMode, setScanMode] = useState<'single' | 'multi'>('single');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Multi-Angle 360° Scan states
  const [multiAngles, setMultiAngles] = useState<{
    front: File | null;
    back: File | null;
    side: File | null;
  }>({ front: null, back: null, side: null });
  const [multiPreviews, setMultiPreviews] = useState<{
    front: string | null;
    back: string | null;
    side: string | null;
  }>({ front: null, back: null, side: null });
  const [activeCameraTarget, setActiveCameraTarget] = useState<'single' | 'front' | 'back' | 'side'>('single');

  const [isScanning, setIsScanning] = useState(false);
  const [scanSteps, setScanSteps] = useState<StepState[]>(INITIAL_STEPS);
  const [scanError, setScanError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleFile = (f: File) => {
    // Clear previous scan state and previews
    if (preview) URL.revokeObjectURL(preview);
    setScanError(null);
    setIsScanning(false);
    setScanSteps(INITIAL_STEPS);
    setSelectedFile(f);
    if (f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleMultiFile = (angle: 'front' | 'back' | 'side', f: File) => {
    setScanError(null);
    setIsScanning(false);
    setScanSteps(INITIAL_STEPS);
    if (multiPreviews[angle]) URL.revokeObjectURL(multiPreviews[angle]!);

    setMultiAngles((prev) => ({ ...prev, [angle]: f }));
    setMultiPreviews((prev) => ({ ...prev, [angle]: URL.createObjectURL(f) }));
  };

  const handleClearMultiAngle = (angle: 'front' | 'back' | 'side') => {
    if (multiPreviews[angle]) URL.revokeObjectURL(multiPreviews[angle]!);
    setMultiAngles((prev) => ({ ...prev, [angle]: null }));
    setMultiPreviews((prev) => ({ ...prev, [angle]: null }));
  };

  const handleClear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(null);
    setScanError(null);
    setIsScanning(false);
    setScanSteps(INITIAL_STEPS);
    setPreview(null);
  };

  const handleStartScan = async () => {
    if (!selectedFile) return;
    setIsScanning(true);
    setScanError(null);

    // Reset steps
    setScanSteps(INITIAL_STEPS.map((s) => ({ ...s, status: 'pending' })));

    try {
      const result = await startRealScan(
        selectedFile,
        category,
        (stepId: number, status: 'pending' | 'active' | 'completed' | 'error', errorMsg?: string) => {
          setScanSteps((prev) =>
            prev.map((step) => {
              if (step.id === stepId) {
                return { ...step, status };
              }
              if (step.id < stepId && step.status !== 'completed') {
                return { ...step, status: 'completed' };
              }
              return step;
            })
          );
          if (errorMsg) {
            setScanError(errorMsg);
          }
        }
      );

      navigate(`/result/${result.scanId}`);
    } catch (error: any) {
      console.error('Scan workflow error:', error);
      setScanError(error.message || 'Unable to read the label. Please upload a clearer image.');
    }
  };

  const handleStartMultiScan = async () => {
    if (!multiAngles.front && !multiAngles.back && !multiAngles.side) return;
    setIsScanning(true);
    setScanError(null);

    setScanSteps(INITIAL_STEPS.map((s) => ({ ...s, status: 'pending' })));

    try {
      const result = await startRealMultiScan(
        multiAngles,
        category,
        (stepId: number, status: 'pending' | 'active' | 'completed' | 'error', errorMsg?: string) => {
          setScanSteps((prev) =>
            prev.map((step) => {
              if (step.id === stepId) {
                return { ...step, status };
              }
              if (step.id < stepId && step.status !== 'completed') {
                return { ...step, status: 'completed' };
              }
              return step;
            })
          );
          if (errorMsg) {
            setScanError(errorMsg);
          }
        }
      );

      navigate(`/result/${result.scanId}`);
    } catch (error: any) {
      console.error('Multi-angle scan workflow error:', error);
      setScanError(error.message || 'Unable to process multi-angle scan. Please try again.');
    }
  };

  const handleRetry = () => {
    setIsScanning(false);
    setScanError(null);
    setScanSteps(INITIAL_STEPS);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {showCamera && (
        <CameraCapture
          onCapture={(file) => {
            setShowCamera(false);
            if (scanMode === 'multi') {
              handleMultiFile(activeCameraTarget === 'single' ? 'front' : activeCameraTarget, file);
            } else {
              handleFile(file);
            }
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      {!isScanning ? (
        <div className="space-y-8">
          {/* Official Ministry of Consumer Affairs & SIH 2026 Authority Header Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-amber-500/30 shadow-lg shadow-amber-500/5">
            <div className="flex items-center gap-3">
              <MinistryLogo size="sm" showText={true} className="bg-transparent border-0 p-0 shadow-none" />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all cursor-pointer shadow-sm"
              >
                <Play size={12} className="fill-current text-amber-400" />
                <span>Watch SIH Demo Video</span>
              </button>
              <div className="hidden sm:block h-8 w-px bg-white/10" />
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <span>SIH 2026</span>
                  <span className="text-amber-500">•</span>
                  <span>ID: SIH26034</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Legal Metrology Division
                </div>
              </div>
              <SIHLogo size="sm" showText={false} />
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex justify-center">
            <div className="p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 inline-flex">
              <button
                type="button"
                onClick={() => setScanMode('single')}
                className={cn(
                  'flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all',
                  scanMode === 'single'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                )}
              >
                <ScanLine size={16} />
                <span>Standard Single Label</span>
              </button>
              <button
                type="button"
                onClick={() => setScanMode('multi')}
                className={cn(
                  'flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all',
                  scanMode === 'multi'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                )}
              >
                <Layers size={16} />
                <span>📸 360° Multi-Angle Scan (Front + Back + Side)</span>
                <span className="text-[9px] font-bold bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded uppercase">
                  NEW
                </span>
              </button>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-heading">
              {scanMode === 'multi' ? '360° Multi-Angle Label Scan' : 'Scan Product Label'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm">
              {scanMode === 'multi'
                ? 'Upload or capture Front, Back, and Side panels simultaneously. Our AI stitches all angles together for 100% statutory coverage.'
                : 'Upload a single packaged product label image or capture via camera for live legal audit.'}
            </p>
          </div>

          {scanMode === 'multi' ? (
            /* Multi-Angle 360° Stitched Upload UI */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. FRONT PANEL */}
                <Card className="p-4 border-dashed border-2 border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/10 flex flex-col justify-between h-72">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                        1. Front Panel
                      </span>
                      {multiAngles.front && <Check size={16} className="text-emerald-500" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Brand Name, Veg/Non-Veg Logo, Net Quantity
                    </p>
                  </div>

                  {multiPreviews.front ? (
                    <div className="relative flex-1 flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 p-1">
                      <img src={multiPreviews.front} alt="Front" className="max-h-36 object-contain" />
                      <button
                        type="button"
                        onClick={() => handleClearMultiAngle('front')}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all p-3">
                      <UploadCloud size={24} className="text-indigo-600 mb-1" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Upload Front</span>
                      <span className="text-[10px] text-slate-400">or drag image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleMultiFile('front', e.target.files[0])}
                      />
                    </label>
                  )}

                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs h-8"
                      onClick={() => {
                        setActiveCameraTarget('front');
                        setShowCamera(true);
                      }}
                    >
                      <Camera size={14} className="mr-1" /> Camera
                    </Button>
                  </div>
                </Card>

                {/* 2. BACK PANEL */}
                <Card className="p-4 border-dashed border-2 border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10 flex flex-col justify-between h-72">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        2. Back Panel
                      </span>
                      {multiAngles.back && <Check size={16} className="text-emerald-500" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Nutrition Facts Table, Ingredients, HFSS
                    </p>
                  </div>

                  {multiPreviews.back ? (
                    <div className="relative flex-1 flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 p-1">
                      <img src={multiPreviews.back} alt="Back" className="max-h-36 object-contain" />
                      <button
                        type="button"
                        onClick={() => handleClearMultiAngle('back')}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all p-3">
                      <UploadCloud size={24} className="text-emerald-600 mb-1" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Upload Back</span>
                      <span className="text-[10px] text-slate-400">or drag image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleMultiFile('back', e.target.files[0])}
                      />
                    </label>
                  )}

                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs h-8"
                      onClick={() => {
                        setActiveCameraTarget('back');
                        setShowCamera(true);
                      }}
                    >
                      <Camera size={14} className="mr-1" /> Camera
                    </Button>
                  </div>
                </Card>

                {/* 3. SIDE / FLAP PANEL */}
                <Card className="p-4 border-dashed border-2 border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10 flex flex-col justify-between h-72">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        3. Side / Flap Panel
                      </span>
                      {multiAngles.side && <Check size={16} className="text-emerald-500" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">
                      14-Digit FSSAI, MRP, Dates, Batch, Address
                    </p>
                  </div>

                  {multiPreviews.side ? (
                    <div className="relative flex-1 flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 p-1">
                      <img src={multiPreviews.side} alt="Side" className="max-h-36 object-contain" />
                      <button
                        type="button"
                        onClick={() => handleClearMultiAngle('side')}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-amber-50/50 dark:hover:bg-amber-950/30 transition-all p-3">
                      <UploadCloud size={24} className="text-amber-600 mb-1" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Upload Side</span>
                      <span className="text-[10px] text-slate-400">or drag image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleMultiFile('side', e.target.files[0])}
                      />
                    </label>
                  )}

                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs h-8"
                      onClick={() => {
                        setActiveCameraTarget('side');
                        setShowCamera(true);
                      }}
                    >
                      <Camera size={14} className="mr-1" /> Camera
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Category selector & Start Multi-Angle Scan button */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Select Commodity Category
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <Chip key={c} label={c} selected={category === c} onClick={() => setCategory(c)} />
                      ))}
                    </div>
                  </div>

                  <Button
                    size="lg"
                    disabled={!multiAngles.front && !multiAngles.back && !multiAngles.side}
                    onClick={handleStartMultiScan}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold h-12 px-6 shadow-md"
                  >
                    Start 360° Stitched Audit
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : !selectedFile ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <DropZone onFileSelect={handleFile} />

              <div className="flex items-center justify-center gap-4">
                <span className="text-sm text-gray-400">or</span>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCamera(true)}
                  className="flex items-center gap-2 border-dashed border-indigo-300 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                >
                  <Camera size={18} className="text-indigo-600 dark:text-indigo-400" />
                  Capture via Camera
                </Button>
              </div>

              <div className="flex flex-col items-center space-y-3 pt-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Select Initial Category</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((c) => (
                    <Chip 
                      key={c} 
                      label={c} 
                      selected={category === c} 
                      onClick={() => setCategory(c)} 
                    />
                  ))}
                </div>
              </div>

              {/* 1-Click Quick Testing Samples Tray */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-cyan-950/40 border border-emerald-500/25 shadow-lg shadow-emerald-500/5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
                  <Sparkles className="w-4 h-4" />
                  <span>Judges / Demo Quick Test (1-Click Sample Labels)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('Food');
                      const sampleFile = createSampleLabelFile(
                        'Classic Masala Instant Noodles 70g',
                        'Food',
                        '10012011000168',
                        '₹14.00 (Incl. of all taxes)',
                        '70 g',
                        true
                      );
                      handleFile(sampleFile);
                    }}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-emerald-950/60 border border-slate-700/60 hover:border-emerald-500/50 transition-all text-left group cursor-pointer"
                  >
                    <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                      <span>🍜</span>
                      <span>Instant Noodles</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Food • FSSAI Validated (Pass)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCategory('Cosmetics');
                      const sampleFile = createSampleLabelFile(
                        'Herbal Sunscreen SPF 50+ Lotion',
                        'Cosmetics',
                        'NOT DECLARED ⚠',
                        '₹349.00',
                        '100 ml',
                        false
                      );
                      handleFile(sampleFile);
                    }}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-amber-950/60 border border-slate-700/60 hover:border-amber-500/50 transition-all text-left group cursor-pointer"
                  >
                    <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                      <span>🧴</span>
                      <span>Sunscreen Lotion</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Cosmetics • CDSCO Warning</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCategory('Edible Oil');
                      const sampleFile = createSampleLabelFile(
                        'Kachi Ghani Mustard Oil 1 Litre',
                        'Edible Oil',
                        '10819003000452',
                        '₹175.00',
                        '1 L (910 g Mass Equiv)',
                        true
                      );
                      handleFile(sampleFile);
                    }}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-cyan-950/60 border border-slate-700/60 hover:border-cyan-500/50 transition-all text-left group cursor-pointer"
                  >
                    <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                      <span>🫒</span>
                      <span>Musted Oil 1L</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Edible Oil • 100% Metrology Pass</div>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid md:grid-cols-2 gap-8 items-start"
            >
              <div className="space-y-4">
                <Card className="overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2 flex justify-center items-center h-80">
                  {preview && (
                    <img
                      src={preview}
                      alt="Product label preview"
                      className="max-h-full object-contain rounded-lg shadow-sm"
                    />
                  )}
                </Card>
                <div className="flex gap-4">
                  <Button variant="ghost" onClick={handleClear} className="flex-1">
                    Remove
                  </Button>
                  <Button variant="outline" onClick={() => setShowCamera(true)} className="flex-1 flex items-center justify-center gap-1.5">
                    <Camera size={16} />
                    Camera
                  </Button>
                  <Button variant="outline" onClick={handleClear} className="flex-1">
                    Replace
                  </Button>
                </div>
              </div>

              <div className="space-y-6 flex flex-col justify-center h-full">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Selected Category</h3>
                  <Chip label={category} selected />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    AI will automatically verify and adjust this category from the detected label content.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 to-amber-50/40 dark:from-indigo-950/30 dark:to-amber-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-indigo-700 dark:text-indigo-400">Live Statutory AI Pipeline:</p>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">SIH26034</span>
                  </div>
                  <p>1. OCR.Space extracts complete text from the label.</p>
                  <p>2. Groq LLM parses mandatory declaration fields.</p>
                  <p>3. Audits against Legal Metrology Rules 2011 & FSSAI 2020 standards.</p>
                </div>

                <Button size="lg" className="w-full text-lg h-14" onClick={handleStartScan}>
                  Start Live Analysis
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-8 space-y-8"
        >
          {/* Official Ministry Badge while scanning */}
          <div className="flex items-center gap-3">
            <MinistryLogo size="sm" showText={true} />
            <SIHLogo size="sm" showText={false} />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-heading">
              {scanError ? 'Analysis Interrupted' : 'Analyzing Product Label'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {scanError 
                ? 'An issue occurred during label reading.' 
                : 'OCR.Space & Groq AI are currently auditing declarations against Ministry of Consumer Affairs & FSSAI standards...'}
            </p>
          </div>

          {/* Stepper with Actual Live State */}
          <div className="w-full max-w-md space-y-3.5 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
            {scanSteps.map((step) => {
              const StepIcon = step.icon;
              const isDone = step.status === 'completed';
              const isActive = step.status === 'active';
              const isError = step.status === 'error';

              return (
                <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white dark:bg-gray-900 z-10 transition-colors',
                      isDone && 'border-emerald-500 text-emerald-500',
                      isActive && 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.5)]',
                      isError && 'border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]',
                      !isDone && !isActive && !isError && 'border-gray-300 dark:border-gray-700 text-gray-400'
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 size={20} />
                    ) : isError ? (
                      <AlertCircle size={20} />
                    ) : (
                      <StepIcon size={20} className={isActive ? 'animate-pulse' : ''} />
                    )}
                  </div>
                  <div
                    className={cn(
                      'w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3.5 rounded-xl border transition-all duration-300',
                      isActive && 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
                      isDone && 'bg-white dark:bg-gray-800 border-emerald-500/20',
                      isError && 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
                      !isActive && !isDone && !isError && 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p
                        className={cn(
                          'font-medium text-sm',
                          isActive && 'text-indigo-700 dark:text-indigo-300',
                          isDone && 'text-gray-900 dark:text-gray-100',
                          isError && 'text-red-700 dark:text-red-400',
                          !isActive && !isDone && !isError && 'text-gray-400'
                        )}
                      >
                        {step.label}
                      </p>
                      <span className="text-xs font-semibold">
                        {isDone && <span className="text-emerald-500">✓</span>}
                        {isActive && <span className="text-indigo-500 animate-spin inline-block">⟳</span>}
                        {isError && <span className="text-red-500">✕</span>}
                        {!isDone && !isActive && !isError && <span className="text-gray-300 dark:text-gray-600">○</span>}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* User-friendly Error Feedback and Recovery */}
          {scanError && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-2xl p-5 text-center space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-semibold text-sm">
                <AlertCircle size={18} />
                <span>Scanning Notice</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">
                {scanError.includes('OCR') || scanError.includes('label')
                  ? 'Unable to read the label. Please upload a clearer image.'
                  : scanError}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
                <Button onClick={handleRetry} variant="outline" className="flex items-center justify-center gap-1.5">
                  <RefreshCw size={16} />
                  Try Again
                </Button>
                <Button onClick={handleClear} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Upload Another Image
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Fullscreen Video Demo Theater Modal */}
      <VideoDemoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc="/sih.mp4"
      />
    </div>
  );
}
