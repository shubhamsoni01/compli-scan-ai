import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ImageIcon, FileText, Search, ShieldCheck, CheckCircle2, Camera, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { DropZone } from '@/components/ui/DropZone';
import { CameraCapture } from '@/components/ui/CameraCapture';
import { startRealScan } from '@/services/scanService';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

      // Successfully processed: navigate to compliance result page
      navigate(`/result/${result.scanId}`);
    } catch (error: any) {
      console.error('Scan workflow error:', error);
      setScanError(error.message || 'Unable to read the label. Please upload a clearer image.');
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
            handleFile(file);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      {!isScanning ? (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-heading">Scan Product</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Upload a packaged product label image or capture with your camera for real AI analysis.
            </p>
          </div>

          {!selectedFile ? (
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

                <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p className="font-semibold text-indigo-700 dark:text-indigo-400">Live AI Pipeline Ready:</p>
                  <p>1. OCR.Space extracts complete text from the label.</p>
                  <p>2. Groq LLM parses and structures fields into compliant JSON.</p>
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
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-heading">
              {scanError ? 'Analysis Interrupted' : 'Analyzing Product Label'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {scanError 
                ? 'An issue occurred during label reading.' 
                : 'OCR.Space & Groq AI are currently extracting and structuring label information...'}
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
    </div>
  );
}
