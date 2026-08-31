import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const startCamera = async () => {
    setError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission was denied. Please allow camera access in your browser to scan products directly.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera device was detected on your system. Please upload a saved image instead.');
      } else {
        setError('Unable to access camera. Please check your browser settings or upload an image file.');
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedDataUrl(dataUrl);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `label-capture-${Date.now()}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          setCapturedFile(file);
        }
      },
      'image/jpeg',
      0.92
    );
  };

  const handleRetake = () => {
    setCapturedDataUrl(null);
    setCapturedFile(null);
  };

  const handleConfirm = () => {
    if (capturedFile) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      onCapture(capturedFile);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-white font-medium">
            <Camera className="w-5 h-5 text-indigo-400" />
            <span>Capture Product Label</span>
          </div>
          <button
            onClick={() => {
              if (stream) stream.getTracks().forEach((t) => t.stop());
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-8 text-center max-w-md space-y-4">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
              <p className="text-sm text-slate-300">{error}</p>
              <Button variant="outline" onClick={startCamera}>
                Try Again
              </Button>
            </div>
          ) : capturedDataUrl ? (
            <img src={capturedDataUrl} alt="Captured label" className="w-full h-full object-contain" />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Product Label Framing Guide */}
              <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-indigo-400/60 rounded-2xl pointer-events-none flex flex-col items-center justify-between p-4">
                <span className="text-[11px] font-medium tracking-wide text-white/80 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                  Align product label inside frame
                </span>
                <span className="text-[10px] text-white/60 bg-black/40 px-2.5 py-0.5 rounded-full">
                  Ensure good lighting & text clarity
                </span>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="px-6 py-5 bg-slate-950 flex items-center justify-between gap-4 border-t border-white/10">
          {capturedDataUrl ? (
            <>
              <Button variant="ghost" onClick={handleRetake} className="text-slate-300 hover:text-white">
                Retake
              </Button>
              <Button onClick={handleConfirm} className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
                <Check size={18} />
                Use Photo
              </Button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleCamera}
                title="Flip Camera"
                className="p-3 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw size={20} />
              </button>

              <button
                type="button"
                onClick={handleCapture}
                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg active:scale-95 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-white" />
              </button>

              <div className="w-10" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
