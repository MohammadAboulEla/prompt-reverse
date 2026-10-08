import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Palette,
  User,
  Sun,
  Camera,
  Search,
  Check,
  ChevronDown,
  ArrowRight,
  Loader2,
  Zap,
  SlidersHorizontal,
} from 'lucide-react';
import { AVAILABLE_EXTRACTION_ASPECTS } from '../data/sampleImages';

interface ExtractionAspectSelectorProps {
  activeMode: string;
  onSelectMode: (mode: string) => void;
  selectedAspects: string[];
  onToggleAspect: (aspectId: string) => void;
  onSelectAllAspects: () => void;
  onClearAllAspects: () => void;
  customFocusQuery: string;
  onChangeCustomFocus: (query: string) => void;
  injectedSubject: string;
  onChangeInjectedSubject: (sub: string) => void;
  onExtract: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const MODES = [
  { id: 'all', label: 'Full Blueprint', icon: Sparkles, short: 'All 11' },
  { id: 'exact', label: 'Exact (1:1)', icon: Zap, short: '1:1' },
  { id: 'style', label: 'Style Only', icon: Palette, short: 'Style' },
  { id: 'subject', label: 'Subject', icon: User, short: 'Subject' },
  { id: 'colors', label: 'Colors & Light', icon: Sun, short: 'Colors' },
  { id: 'camera', label: 'Camera', icon: Camera, short: 'Camera' },
  { id: 'custom', label: 'Custom', icon: Search, short: 'Custom' },
];

const SUGGESTED_SUBJECTS = [
  'A golden retriever in aviator goggles',
  'A futuristic robot cat',
  'An ancient wizard with glowing staff',
  'A vintage red 1968 Mustang sports car',
  'A cybernetic ronin astronaut',
];

export const ExtractionAspectSelector: React.FC<ExtractionAspectSelectorProps> = ({
  activeMode,
  onSelectMode,
  selectedAspects,
  onToggleAspect,
  onSelectAllAspects,
  onClearAllAspects,
  customFocusQuery,
  onChangeCustomFocus,
  injectedSubject,
  onChangeInjectedSubject,
  onExtract,
  isLoading,
  disabled,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSubjectInjection, setShowSubjectInjection] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isDropdownOpen]);

  return (
    <div className="w-full space-y-2 rounded-xl border border-neutral-800 bg-neutral-900/70 p-2.5 backdrop-blur-sm">
      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Horizontal Mode Segmented Tabs */}
        <div className="no-scrollbar flex overflow-x-auto items-center gap-1 rounded-lg bg-neutral-950/80 p-1 border border-neutral-800/80">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onSelectMode(mode.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-neutral-800 text-white shadow-sm ring-1 ring-amber-500/40'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                }`}
                title={mode.label}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    isSelected ? 'text-amber-400' : 'text-neutral-500'
                  }`}
                />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right side: Subject Injection Toggle + Dropdown Dimensions Menu + Extract CTA */}
        <div className="flex items-center gap-2 relative">
          {/* Subject Injection Toggle Button */}
          <button
            type="button"
            onClick={() => setShowSubjectInjection(!showSubjectInjection)}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              showSubjectInjection || injectedSubject
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                : 'border-neutral-800 bg-neutral-950/80 text-neutral-300 hover:border-neutral-700 hover:text-white'
            }`}
            title="Inject a new subject to replace the original in the 1:1 prompt"
          >
            <User className="h-3.5 w-3.5 text-amber-400" />
            <span>Subject Swap</span>
            {injectedSubject && (
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
            )}
          </button>

          {/* Dropdown Menu for Granular Dimensions */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950/80 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-amber-400" />
              <span>
                Dimensions{' '}
                <span className="font-mono text-amber-400">({selectedAspects.length})</span>
              </span>
              <ChevronDown
                className={`h-3 w-3 text-neutral-400 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Popover */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-150 w-72 sm:w-80 rounded-xl border border-neutral-800 bg-neutral-950 p-3 shadow-2xl shadow-black/80 ring-1 ring-white/10 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
                  <span className="text-[11px] font-semibold text-neutral-200">
                    Extractable Dimensions ({selectedAspects.length}/{AVAILABLE_EXTRACTION_ASPECTS.length})
                  </span>
                  <div className="flex items-center gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={onSelectAllAspects}
                      className="text-amber-400 hover:underline"
                    >
                      All
                    </button>
                    <span className="text-neutral-600">·</span>
                    <button
                      type="button"
                      onClick={onClearAllAspects}
                      className="text-neutral-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                  {AVAILABLE_EXTRACTION_ASPECTS.map((aspect) => {
                    const isChecked = selectedAspects.includes(aspect.id);
                    return (
                      <div
                        key={aspect.id}
                        onClick={() => onToggleAspect(aspect.id)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg px-2 py-1 text-xs transition-colors ${
                          isChecked
                            ? 'bg-neutral-900 text-white'
                            : 'text-neutral-400 hover:bg-neutral-900/50'
                        }`}
                      >
                        <span className="text-[11px] truncate">{aspect.label}</span>
                        <div
                          className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border ${
                            isChecked
                              ? 'border-amber-400 bg-amber-400 text-neutral-950'
                              : 'border-neutral-700 bg-neutral-800'
                          }`}
                        >
                          {isChecked && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA Button */}
          <button
            type="button"
            onClick={onExtract}
            disabled={disabled || isLoading}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 px-3.5 py-1.5 text-xs font-bold shadow-md shadow-amber-500/10 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 transition-all"
            style={{ color: 'var(--theme-accent-contrast, #0a0a0a)' }}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 fill-current" />
                <span>Extract Prompt</span>
                <ArrowRight className="h-3 w-3" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Subject Injection Section (Optional 1:1 Replacement) */}
      {(showSubjectInjection || injectedSubject) && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-2.5 text-xs space-y-1.5 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
              <User className="h-3.5 w-3.5" />
              <span>Subject Injection (Optional 1:1 Replacement)</span>
            </div>
            {injectedSubject && (
              <button
                type="button"
                onClick={() => onChangeInjectedSubject('')}
                className="text-[10px] text-neutral-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <p className="text-[10px] text-neutral-400 leading-tight">
            Inject any new subject to replace the original. The AI will generate an exact 1:1 reproduction prompt with your new subject, preserving identical background, camera, lighting, and style.
          </p>

          <div className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-950 px-2 py-1">
            <input
              type="text"
              value={injectedSubject}
              onChange={(e) => onChangeInjectedSubject(e.target.value)}
              placeholder="e.g. 'a golden retriever wearing aviator goggles', 'a futuristic robot cat'..."
              className="w-full bg-transparent text-xs text-white placeholder-neutral-500 outline-none"
            />
          </div>

          {/* Quick preset suggestions */}
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            <span className="text-[9px] text-neutral-500 uppercase mr-1">Quick ideas:</span>
            {SUGGESTED_SUBJECTS.map((sub, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChangeInjectedSubject(sub)}
                className="rounded bg-neutral-900 px-1.5 py-0.5 text-[10px] text-neutral-300 border border-neutral-800/80 hover:border-amber-500/50 hover:text-amber-300 transition-colors"
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inline Custom Input when 'custom' mode is selected */}
      {activeMode === 'custom' && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-neutral-950/80 px-2.5 py-1 text-xs">
          <Search className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <input
            type="text"
            value={customFocusQuery}
            onChange={(e) => onChangeCustomFocus(e.target.value)}
            placeholder="Type specific aspect to extract (e.g., 'fashion tailoring', 'architectural era')..."
            className="w-full bg-transparent text-xs text-white placeholder-neutral-500 outline-none"
          />
        </div>
      )}
    </div>
  );
};
