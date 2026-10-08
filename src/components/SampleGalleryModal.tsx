import React from 'react';
import { Image as ImageIcon, X, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/sampleImages';
import { SamplePreset } from '../types';

interface SampleGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: SamplePreset) => void;
  isLoading: boolean;
}

export const SampleGalleryModal: React.FC<SampleGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-4xl flex-col rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Sample Image Gallery</h2>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="mb-4 text-xs text-neutral-400">
            Pick any sample image below to see how ReversePrompt AI reverse-engineers style, subjects, lighting, and camera optics into actionable AI prompts.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_PRESETS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => {
                  if (!isLoading) {
                    onSelectPreset(preset);
                    onClose();
                  }
                }}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/60 transition-all hover:border-amber-500/50 hover:bg-neutral-800/40 hover:shadow-xl hover:shadow-amber-500/5"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-medium text-amber-300 backdrop-blur-sm">
                    {preset.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-3.5">
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      {preset.name}
                    </h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-neutral-400">
                      {preset.description}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-neutral-800/80 pt-2 text-[11px] font-semibold text-amber-400 group-hover:text-amber-300">
                    <span>Extract this image</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
