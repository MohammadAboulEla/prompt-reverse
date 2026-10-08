import React, { useState, useEffect, useRef } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  RotateCcw,
  Palette,
  User,
  Camera,
  Sun,
  ShieldAlert,
  Cpu,
  Zap,
  FileText,
  Plus,
} from 'lucide-react';
import { ExtractionResult } from '../types';

interface PromptResultViewerProps {
  result: ExtractionResult;
  onCopyText: (text: string, label: string) => void;
  activeFocus?: string;
}

type TabKey =
  | 'exact'
  | 'injected'
  | 'midjourney'
  | 'flux'
  | 'dalle'
  | 'style'
  | 'subject'
  | 'lighting'
  | 'camera'
  | 'negative';

const TABS: { id: TabKey; label: string; icon: React.FC<any>; badge?: string }[] = [
  { id: 'exact', label: 'Master Prompt', icon: Sparkles, badge: '1:1' },
  { id: 'injected', label: '1:1 Injected Subject', icon: User, badge: 'Swap' },
  { id: 'midjourney', label: 'Midjourney', icon: Cpu, badge: 'v6.1' },
  { id: 'flux', label: 'Flux / SDXL', icon: Zap, badge: 'Tags' },
  { id: 'dalle', label: 'DALL-E 3', icon: FileText, badge: 'Prose' },
  { id: 'style', label: 'Style Only', icon: Palette, badge: '[SUBJECT]' },
  { id: 'subject', label: 'Subject Only', icon: User, badge: 'Isolated' },
  { id: 'lighting', label: 'Lighting', icon: Sun },
  { id: 'camera', label: 'Camera', icon: Camera },
  { id: 'negative', label: 'Negative', icon: ShieldAlert, badge: 'Shield' },
];

const ASPECT_RATIOS = ['16:9', '1:1', '9:16', '4:5', '2:3', '21:9'];
const BOOST_MODIFIERS = [
  'cinematic lighting',
  'photorealistic 8k',
  '35mm film grain',
  'octane render',
  'masterpiece',
  'shallow depth of field',
];

const INJECTION_PRESETS = [
  'A golden retriever wearing aviator goggles',
  'A futuristic cybernetic robot cat',
  'An ancient wizard with glowing staff',
  'A vintage red 1968 Mustang sports car',
  'A cute red panda in a spacesuit',
];

export const PromptResultViewer: React.FC<PromptResultViewerProps> = ({
  result,
  onCopyText,
  activeFocus,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('exact');
  const [editedPrompts, setEditedPrompts] = useState<Record<string, string>>({});
  const [selectedAR, setSelectedAR] = useState<string>(result.aspectRatio || '16:9');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Subject injection state
  const [injectedSubjectInput, setInjectedSubjectInput] = useState<string>(result.injectedSubject || '');
  const [injectedPromptState, setInjectedPromptState] = useState<string>(result.injectedPrompt || '');
  const [isInjecting, setIsInjecting] = useState<boolean>(false);
  const [showInjectionStudio, setShowInjectionStudio] = useState<boolean>(!!result.injectedPrompt);

  // Dropdown states
  const [isARDropdownOpen, setIsARDropdownOpen] = useState(false);
  const [isBoostDropdownOpen, setIsBoostDropdownOpen] = useState(false);
  const arRef = useRef<HTMLDivElement>(null);
  const boostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedPrompts({});
    if (result.aspectRatio) {
      setSelectedAR(result.aspectRatio);
    }
    if (result.injectedPrompt) {
      setInjectedPromptState(result.injectedPrompt);
      if (result.injectedSubject) setInjectedSubjectInput(result.injectedSubject);
      setActiveTab('injected');
      setShowInjectionStudio(true);
    } else if (activeFocus) {
      if (activeFocus === 'style') setActiveTab('style');
      else if (activeFocus === 'subject') setActiveTab('subject');
      else if (activeFocus === 'colors') setActiveTab('lighting');
      else if (activeFocus === 'camera') setActiveTab('camera');
      else if (activeFocus === 'midjourney') setActiveTab('midjourney');
      else if (activeFocus === 'flux') setActiveTab('flux');
      else if (activeFocus === 'dalle') setActiveTab('dalle');
      else if (activeFocus === 'negative') setActiveTab('negative');
      else setActiveTab('exact');
    }
  }, [result, activeFocus]);

  // Handle outside click for dropdown menus
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (arRef.current && !arRef.current.contains(e.target as Node)) {
        setIsARDropdownOpen(false);
      }
      if (boostRef.current && !boostRef.current.contains(e.target as Node)) {
        setIsBoostDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getBasePrompt = (key: TabKey): string => {
    switch (key) {
      case 'exact':
        return result.exactPrompt;
      case 'injected':
        return injectedPromptState || result.injectedPrompt || result.exactPrompt;
      case 'midjourney':
        return result.midjourneyPrompt;
      case 'flux':
        return result.fluxPrompt;
      case 'dalle':
        return result.dallePrompt;
      case 'style':
        return result.styleOnlyPrompt;
      case 'subject':
        return result.subjectOnlyPrompt;
      case 'lighting':
        return result.lightingAndColorPrompt;
      case 'camera':
        return result.cameraAndCompositionPrompt;
      case 'negative':
        return result.negativePrompt;
      default:
        return result.exactPrompt;
    }
  };

  const currentPrompt = editedPrompts[activeTab] ?? getBasePrompt(activeTab);

  const handlePromptChange = (val: string) => {
    setEditedPrompts((prev) => ({
      ...prev,
      [activeTab]: val,
    }));
  };

  const handleResetCurrentPrompt = () => {
    setEditedPrompts((prev) => {
      const copy = { ...prev };
      delete copy[activeTab];
      return copy;
    });
  };

  const handleCopy = (text: string, label: string) => {
    onCopyText(text, label);
    setCopiedKey(activeTab);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleAddModifier = (modifier: string) => {
    let next = currentPrompt.trim();
    if (!next.includes(modifier)) {
      if (next.endsWith('.')) {
        next = `${next} ${modifier}`;
      } else {
        next = `${next}, ${modifier}`;
      }
      handlePromptChange(next);
    }
  };

  const handleUpdateAspectRatio = (newAR: string) => {
    setSelectedAR(newAR);
    setIsARDropdownOpen(false);
    let prompt = currentPrompt;
    if (activeTab === 'midjourney') {
      if (prompt.includes('--ar')) {
        prompt = prompt.replace(/--ar\s+[0-9:]+/g, `--ar ${newAR}`);
      } else {
        prompt = `${prompt} --ar ${newAR}`;
      }
      handlePromptChange(prompt);
    }
  };

  // Perform instant 1:1 subject injection swap
  const handleInjectSubject = async () => {
    if (!injectedSubjectInput.trim()) return;
    setIsInjecting(true);
    try {
      const res = await fetch('/api/inject-subject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exactPrompt: result.exactPrompt,
          originalSubject: result.breakdown?.subject?.description || '',
          newSubject: injectedSubjectInput.trim(),
          style: result.breakdown?.style?.medium || '',
          lighting: result.breakdown?.lighting?.type || '',
          aspectRatio: selectedAR,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to inject subject');
      }

      const data = await res.json();
      setInjectedPromptState(data.injectedPrompt);
      setActiveTab('injected');
      onCopyText(data.injectedPrompt, `1:1 Swapped Prompt with ${injectedSubjectInput}`);
    } catch (err: any) {
      console.error('Subject injection failed:', err);
    } finally {
      setIsInjecting(false);
    }
  };

  const wordCount = currentPrompt.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="w-full space-y-2.5 rounded-xl border border-neutral-800 bg-neutral-900/80 p-3 shadow-lg backdrop-blur-md">
      {/* Subject Injection Section */}
      <div className="rounded-lg border border-amber-500/40 bg-amber-950/20 p-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
            <User className="h-3.5 w-3.5" />
            <span>Subject Injection (1:1 Exact Swap)</span>
          </div>
          <button
            type="button"
            onClick={() => setShowInjectionStudio(!showInjectionStudio)}
            className="text-[11px] text-amber-400 hover:text-amber-300"
          >
            {showInjectionStudio ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {showInjectionStudio && (
          <div className="space-y-2 text-xs">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={injectedSubjectInput}
                onChange={(e) => setInjectedSubjectInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInjectSubject()}
                placeholder="Enter new subject (e.g. 'a golden retriever in aviator goggles')..."
                className="flex-1 rounded-md border border-neutral-700 bg-neutral-950 px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleInjectSubject}
                disabled={isInjecting || !injectedSubjectInput.trim()}
                className="flex items-center justify-center gap-1 rounded-md bg-amber-400 px-3 py-1.5 text-xs font-bold text-neutral-950 hover:bg-amber-300 active:scale-95 disabled:opacity-40 transition-all shrink-0"
              >
                <span>{isInjecting ? 'Swapping Subject...' : 'Inject & Generate 1:1'}</span>
              </button>
            </div>

            {/* Quick preset suggestions */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] text-neutral-400 mr-1">Quick ideas:</span>
              {INJECTION_PRESETS.map((idea, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setInjectedSubjectInput(idea);
                  }}
                  className="rounded bg-neutral-950 px-2 py-0.5 text-[10px] text-neutral-300 border border-neutral-800 hover:border-amber-400/60 hover:text-amber-300 transition-colors"
                >
                  {idea}
                </button>
              ))}
            </div>

            {result.breakdown?.subject?.description && (
              <p className="text-[10px] text-neutral-400 pt-0.5">
                <span className="text-neutral-500">Original detected:</span>{' '}
                <span className="italic text-neutral-300">{result.breakdown.subject.description}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Compact Header & Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-2">
        {/* Scrollable Tabs */}
        <div className="no-scrollbar flex overflow-x-auto gap-1 rounded-lg bg-neutral-950/80 p-0.5 border border-neutral-800/80">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-neutral-800 text-white shadow-sm ring-1 ring-neutral-700'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                }`}
              >
                <Icon
                  className={`h-3 w-3 ${
                    isActive ? 'text-amber-400' : 'text-neutral-500'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="rounded bg-neutral-900 px-1 py-0.2 text-[9px] font-mono text-neutral-400">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 1-Click Copy Button */}
        <button
          type="button"
          onClick={() => handleCopy(currentPrompt, `${TABS.find((t) => t.id === activeTab)?.label}`)}
          className="flex items-center gap-1 rounded-lg bg-amber-400 px-3 py-1 text-xs font-bold text-neutral-950 hover:bg-amber-300 active:scale-95 transition-all shadow-sm"
        >
          {copiedKey === activeTab ? (
            <>
              <Check className="h-3.5 w-3.5 stroke-[3]" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Prompt</span>
            </>
          )}
        </button>
      </div>

      {/* Injected Subject Indicator Badge if activeTab is injected */}
      {activeTab === 'injected' && (
        <div className="flex items-center justify-between rounded-md bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-[11px] text-amber-300">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>1:1 Injected Subject:</strong>{' '}
              {injectedSubjectInput || 'Injected Subject Prompt'}
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 hidden sm:inline">
            Preserves 100% of original background, lighting, camera & style
          </span>
        </div>
      )}

      {/* Compact Secondary Controls Strip (AR dropdown, Boost dropdown, Word Count) */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {/* Aspect Ratio Dropdown Menu */}
          <div className="relative" ref={arRef}>
            <button
              type="button"
              onClick={() => setIsARDropdownOpen(!isARDropdownOpen)}
              className="flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-950 px-2 py-0.5 text-[11px] font-mono text-neutral-300 hover:border-neutral-700 transition-colors"
            >
              <span>AR: {selectedAR}</span>
              <ChevronDown className="h-3 w-3 text-neutral-400" />
            </button>
            {isARDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 z-30 w-24 rounded-lg border border-neutral-800 bg-neutral-950 p-1 shadow-xl">
                {ASPECT_RATIOS.map((ar) => (
                  <button
                    key={ar}
                    onClick={() => handleUpdateAspectRatio(ar)}
                    className={`w-full rounded px-2 py-1 text-left font-mono text-[11px] transition-colors ${
                      selectedAR === ar
                        ? 'bg-amber-400/20 text-amber-300'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Boost Modifiers Dropdown */}
          <div className="relative" ref={boostRef}>
            <button
              type="button"
              onClick={() => setIsBoostDropdownOpen(!isBoostDropdownOpen)}
              className="flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-950 px-2 py-0.5 text-[11px] text-neutral-300 hover:border-neutral-700 transition-colors"
            >
              <Plus className="h-3 w-3 text-amber-400" />
              <span>Inject Boost</span>
              <ChevronDown className="h-3 w-3 text-neutral-400" />
            </button>
            {isBoostDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 z-30 w-48 rounded-lg border border-neutral-800 bg-neutral-950 p-1 shadow-xl">
                {BOOST_MODIFIERS.map((boost) => (
                  <button
                    key={boost}
                    onClick={() => {
                      handleAddModifier(boost);
                      setIsBoostDropdownOpen(false);
                    }}
                    className="w-full rounded px-2 py-1 text-left text-[11px] text-neutral-300 hover:bg-neutral-900 hover:text-amber-300 transition-colors"
                  >
                    + {boost}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset button if edited */}
          {editedPrompts[activeTab] && (
            <button
              onClick={handleResetCurrentPrompt}
              className="flex items-center gap-1 text-[11px] text-amber-400 hover:underline"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="text-[11px] text-neutral-500 font-mono">
          {wordCount} words · {currentPrompt.length} chars
        </div>
      </div>

      {/* Compact Textarea */}
      <textarea
        value={currentPrompt}
        onChange={(e) => handlePromptChange(e.target.value)}
        rows={3}
        className="w-full resize-y rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 font-mono text-xs leading-relaxed text-neutral-200 focus:border-amber-400/60 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
        placeholder="Extracted prompt will appear here..."
      />

      {/* Suggested Tags inline row */}
      {result.suggestedTags && result.suggestedTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 pt-1 text-[11px]">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider mr-1">
            Tags:
          </span>
          {result.suggestedTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => handleAddModifier(tag)}
              className="rounded bg-neutral-950 px-1.5 py-0.2 text-[10px] text-neutral-400 border border-neutral-800/80 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
              title={`Add #${tag} to prompt`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

