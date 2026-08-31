import { useState, useCallback, useRef } from 'react';

export interface UploadState {
  file: File | null;
  preview: string | null;
  isDragging: boolean;
  error: string | null;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function useScanUpload() {
  const [state, setState] = useState<UploadState>({
    file: null,
    preview: null,
    isDragging: false,
    error: null,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Please upload a JPG, PNG, or WEBP image.';
    }
    if (file.size > MAX_SIZE) {
      return 'File size must be less than 10MB.';
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      const error = validateFile(file);
      if (error) {
        setState((prev) => ({ ...prev, error, file: null, preview: null }));
        return;
      }

      const preview = URL.createObjectURL(file);
      setState({ file, preview, isDragging: false, error: null });
    },
    [validateFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState((prev) => ({ ...prev, isDragging: false }));
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const removeFile = useCallback(() => {
    if (state.preview) URL.revokeObjectURL(state.preview);
    setState({ file: null, preview: null, isDragging: false, error: null });
    if (inputRef.current) inputRef.current.value = '';
  }, [state.preview]);

  return {
    ...state,
    inputRef,
    onDrop,
    onDragOver,
    onDragLeave,
    onFileSelect,
    openFileDialog,
    removeFile,
  };
}
