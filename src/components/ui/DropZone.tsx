import React, { useState, useRef } from 'react';
import { UploadCloud, FileImage, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface DropZoneProps {
  onFileSelect?: (file: File) => void;
  onSelect?: (file: File) => void;
  className?: string;
  accept?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelect, onSelect, className, accept = 'image/*' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
    onFileSelect?.(file);
    onSelect?.(file);
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-2xl border-2 border-dashed p-8 transition-colors flex flex-col items-center justify-center text-center cursor-pointer",
        isDragging 
          ? "border-indigo-500 bg-indigo-50/50 dark:border-violet-500 dark:bg-violet-500/10" 
          : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-surface-800/50 hover:bg-gray-100 dark:hover:bg-surface-800",
        preview ? "p-4" : "",
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
      />

      {preview ? (
        <div className="relative w-full rounded-xl overflow-hidden group">
          <img src={preview} alt="Preview" className="w-full h-auto max-h-[300px] object-contain" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <p className="text-white font-medium flex items-center">
              <UploadCloud className="w-5 h-5 mr-2" /> Change Image
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreview(null);
            }}
            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg hover:bg-black/70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-surface-700 flex items-center justify-center mb-4">
            <FileImage className="w-8 h-8 text-indigo-600 dark:text-violet-400" />
          </div>
          <h4 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-1">
            Drag & drop image here
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            or click to upload
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Supports JPG, PNG, WEBP (Max 5MB)
          </p>
        </>
      )}
    </div>
  );
};
