import React, { useRef, useState, useEffect, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, X, Maximize2, Loader2, RefreshCw } from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/sampleImages';
import { SamplePreset } from '../types';
import {
  fileToBase64,
  urlToBase64,
  getImageMetadata,
  resizeImageToTargetSize,
  calculateBase64Bytes,
  formatBytes,
} from '../utils/imageUtils';

interface ImageUploaderProps {
  currentImageData: string | null;
  currentMimeType: string;
  fileName: string;
  onImageSelected: (dataUrl: string, mimeType: string, name: string) => void;
  onClear: () => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageData,
  currentMimeType,
  fileName,
  onImageSelected,
  onClear,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [sampleLoadingId, setSampleLoadingId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{ width: number; height: number; aspectRatioString: string } | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentImageData) {
      getImageMetadata(currentImageData).then(setMetadata);
    } else {
      setMetadata(null);
    }
  }, [currentImageData]);

  // Handle global paste event (Cmd+V / Ctrl+V anywhere)
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (isLoading || isCompressing) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            try {
              setIsCompressing(true);
              const rawBase64 = await fileToBase64(file);
              // Resize image to total scale <= 1 MB
              const optimized = await resizeImageToTargetSize(rawBase64, 1024 * 1024);
              onImageSelected(optimized.dataUrl, optimized.mimeType, `Pasted-${new Date().toLocaleTimeString()}.jpg`);
            } catch (err) {
              console.error('Failed to paste image', err);
            } finally {
              setIsCompressing(false);
            }
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isLoading, isCompressing, onImageSelected]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      try {
        setIsCompressing(true);
        const rawBase64 = await fileToBase64(file);
        // Resize image to total scale <= 1 MB
        const optimized = await resizeImageToTargetSize(rawBase64, 1024 * 1024);
        onImageSelected(optimized.dataUrl, optimized.mimeType, file.name);
      } catch (err) {
        console.error('Failed reading file', err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          try {
            setIsCompressing(true);
            const rawBase64 = await fileToBase64(file);
            // Resize image to total scale <= 1 MB
            const optimized = await resizeImageToTargetSize(rawBase64, 1024 * 1024);
            onImageSelected(optimized.dataUrl, optimized.mimeType, file.name);
          } catch (err) {
            console.error('Error reading dropped image:', err);
          } finally {
            setIsCompressing(false);
          }
        }
      }
    },
    [onImageSelected]
  );

  const handleSelectSample = async (preset: SamplePreset) => {
    if (isLoading || isCompressing) return;
    setSampleLoadingId(preset.id);
    try {
      const { dataUrl } = await urlToBase64(preset.url);
      // Resize image to total scale <= 1 MB
      const optimized = await resizeImageToTargetSize(dataUrl, 1024 * 1024);
      onImageSelected(optimized.dataUrl, optimized.mimeType, `${preset.name}.jpg`);
    } catch (err) {
      console.error('Failed loading sample image:', err);
    } finally {
      setSampleLoadingId(null);
    }
  };

  const imageByteSize = currentImageData ? calculateBase64Bytes(currentImageData) : 0;

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {currentImageData ? (
        /* Compact Active Image Strip */
        <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3 min-w-0">
            {/* Thumbnail with quick zoom */}
            <div
              onClick={() => setIsZoomed(true)}
              className="group relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-neutral-700/80 bg-neutral-950 shadow-inner"
              title="Click to zoom"
            >
              <img
                src={currentImageData}
                alt="Source preview"
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="h-3 w-3 text-white" />
              </div>
            </div>

            {/* Metadata info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-xs font-semibold text-white max-w-[180px] sm:max-w-xs">
                  {fileName}
                </span>
                {metadata && (
                  <span className="rounded bg-neutral-800 px-1.5 py-0.2 font-mono text-[10px] text-amber-400">
                    {metadata.aspectRatioString}
                  </span>
                )}
                <span className="rounded bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.2 font-mono text-[10px] text-emerald-400">
                  {formatBytes(imageByteSize)} (≤ 1MB)
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                {metadata && (
                  <span>{metadata.width}×{metadata.height}px</span>
                )}
                <span>·</span>
                <span className="uppercase">{currentMimeType.replace('image/', '')}</span>
                <span className="hidden sm:inline">· Paste Ctrl+V to replace</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isCompressing}
              className="flex items-center gap-1 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-[11px] font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className="h-3 w-3" />
              <span className="hidden sm:inline">Change</span>
            </button>
            <button
              type="button"
              onClick={onClear}
              disabled={isLoading || isCompressing}
              className="rounded-md p-1 text-neutral-400 hover:bg-neutral-800 hover:text-red-400 transition-colors disabled:opacity-50"
              title="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Compact Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group flex cursor-pointer flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-dashed px-4 py-3 transition-all ${
            isDragging
              ? 'border-amber-400 bg-amber-950/20'
              : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-800/80 text-amber-400 group-hover:bg-amber-500/20 group-hover:text-amber-300 transition-colors">
              {isCompressing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="h-4 w-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">
                  {isCompressing ? 'Resizing to ≤ 1 MB...' : 'Drop image here or click to browse'}
                </span>
                <kbd className="hidden sm:inline-block rounded bg-neutral-800 px-1 py-0.2 text-[10px] font-mono text-neutral-400">
                  Ctrl+V
                </kbd>
                <span className="text-[10px] text-amber-400 font-mono">
                  Auto-scaled ≤ 1 MB
                </span>
              </div>
              <p className="text-[10px] text-neutral-500">
                Supports PNG, JPG, WEBP, AVIF (Auto-resized for fast AI analysis)
              </p>
            </div>
          </div>

          {/* Quick preset chips inline */}
          <div className="flex flex-wrap items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] text-neutral-500 mr-1 hidden lg:inline">
              Or test sample:
            </span>
            {SAMPLE_PRESETS.slice(0, 3).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectSample(preset)}
                disabled={sampleLoadingId === preset.id || isCompressing}
                className="flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-800/60 px-2 py-0.5 text-[10px] text-neutral-300 hover:border-amber-500/40 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                {sampleLoadingId === preset.id ? (
                  <Loader2 className="h-2.5 w-2.5 animate-spin text-amber-400" />
                ) : (
                  <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                )}
                <span>{preset.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && currentImageData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -top-8 right-0 text-white hover:text-amber-400 text-sm"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={currentImageData}
              alt="Expanded view"
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

