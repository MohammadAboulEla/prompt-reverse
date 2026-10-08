import React from 'react';
import { Sparkles, History, Image as ImageIcon, RotateCcw, HelpCircle, Settings } from 'lucide-react';

interface NavbarProps {
  onOpenHistory: () => void;
  historyCount: number;
  onReset: () => void;
  hasActiveImage: boolean;
  onOpenSampleGallery: () => void;
  onOpenSuggestions: () => void;
  onOpenSettings: () => void;
  isCustomSettingsActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHistory,
  historyCount,
  onReset,
  hasActiveImage,
  onOpenSampleGallery,
  onOpenSuggestions,
  onOpenSettings,
  isCustomSettingsActive,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-3 sm:px-5">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 shadow-sm ring-1 ring-amber-400/30">
            <Sparkles className="h-3.5 w-3.5 text-neutral-950" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold tracking-tight text-white">
              ReversePrompt<span className="text-amber-400">.ai</span>
            </span>
            <span className="hidden text-[10px] text-neutral-400 md:inline">
              Prompt & Aesthetic Extractor
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenSuggestions}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            title="Explore all extractable dimensions"
          >
            <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline text-[11px]">Guide</span>
          </button>

          <button
            onClick={onOpenSampleGallery}
            className="flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-900/70 px-2 py-1 text-[11px] font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <ImageIcon className="h-3.5 w-3.5 text-neutral-400" />
            <span>Samples</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-900/70 px-2 py-1 text-[11px] font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <History className="h-3.5 w-3.5 text-neutral-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-amber-500/20 px-1 text-[9px] font-semibold text-amber-300">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
              isCustomSettingsActive
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                : 'border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:bg-neutral-800 hover:text-white'
            }`}
            title="Configure Gemini Model & API Key"
          >
            <Settings className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Settings</span>
            {isCustomSettingsActive && (
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
            )}
          </button>

          {hasActiveImage && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
              title="Clear workspace"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
