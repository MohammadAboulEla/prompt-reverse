import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  AlertCircle,
  HelpCircle,
  Image as ImageIcon,
  History,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ImageUploader } from './components/ImageUploader';
import { ExtractionAspectSelector } from './components/ExtractionAspectSelector';
import { PromptResultViewer } from './components/PromptResultViewer';
import { ForensicBreakdown } from './components/ForensicBreakdown';
import { HistoryModal } from './components/HistoryModal';
import { SuggestionsModal } from './components/SuggestionsModal';
import { SampleGalleryModal } from './components/SampleGalleryModal';
import { SettingsModal } from './components/SettingsModal';
import { Toast, ToastMessage } from './components/Toast';
import { ExtractionResult, HistoryItem, SamplePreset, UserSettings } from './types';
import { AVAILABLE_EXTRACTION_ASPECTS, SAMPLE_PRESETS } from './data/sampleImages';
import {
  createThumbnail,
  getImageMetadata,
  urlToBase64,
  resizeImageToTargetSize,
  formatBytes,
} from './utils/imageUtils';

const STORAGE_KEY = 'reverse_prompt_history_v1';
const SETTINGS_STORAGE_KEY = 'reverse_prompt_user_settings_v1';

export default function App() {
  const [currentImageData, setCurrentImageData] = useState<string | null>(null);
  const [currentMimeType, setCurrentMimeType] = useState<string>('image/jpeg');
  const [fileName, setFileName] = useState<string>('');

  const [activeMode, setActiveMode] = useState<string>('all');
  const [selectedAspects, setSelectedAspects] = useState<string[]>(
    AVAILABLE_EXTRACTION_ASPECTS.map((a) => a.id)
  );
  const [customFocusQuery, setCustomFocusQuery] = useState<string>('');
  const [injectedSubject, setInjectedSubject] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // User Settings state (persisted locally)
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          model: parsed.model || 'gemini-3.5-flash-lite',
          apiKey: parsed.apiKey || '',
        };
      }
    } catch (e) {
      console.warn('Failed to load user settings from localStorage', e);
    }
    return {
      model: 'gemini-3.5-flash-lite',
      apiKey: '',
    };
  });

  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isSampleGalleryOpen, setIsSampleGalleryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed loading prompt history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = async (newResult: ExtractionResult, dataUrl: string, name: string) => {
    try {
      const thumbnail = await createThumbnail(dataUrl, 200);
      const { aspectRatioString } = await getImageMetadata(dataUrl);

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageThumbnail: thumbnail,
        fileName: name || 'Extracted Image',
        aspectRatio: newResult.aspectRatio || aspectRatioString || '16:9',
        result: newResult,
        selectedFocus: activeMode,
      };

      setHistory((prev) => {
        const updated = [newItem, ...prev.filter((i) => i.id !== newItem.id)].slice(0, 25);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn('LocalStorage quota limit reached, trimming history', e);
        }
        return updated;
      });
    } catch (e) {
      console.error('Failed creating history entry:', e);
    }
  };

  const handleImageSelected = (dataUrl: string, mime: string, name: string) => {
    setCurrentImageData(dataUrl);
    setCurrentMimeType(mime);
    setFileName(name);
    setError(null);
    setResult(null); // Clear previous extraction
  };

  const handleClearImage = () => {
    setCurrentImageData(null);
    setCurrentMimeType('image/jpeg');
    setFileName('');
    setInjectedSubject('');
    setResult(null);
    setError(null);
  };

  const MODE_ASPECT_MAP: Record<string, string[]> = {
    all: AVAILABLE_EXTRACTION_ASPECTS.map((a) => a.id),
    exact: ['exact'],
    style: ['style'],
    subject: ['subject'],
    colors: ['colors'],
    camera: ['camera'],
    mood: ['mood'],
    textures: ['textures'],
    custom: ['exact'],
  };

  const handleSelectMode = (mode: string) => {
    setActiveMode(mode);
    if (MODE_ASPECT_MAP[mode]) {
      setSelectedAspects(MODE_ASPECT_MAP[mode]);
    }
  };

  const handleToggleAspect = (aspectId: string) => {
    setSelectedAspects((prev) => {
      const next = prev.includes(aspectId)
        ? prev.filter((id) => id !== aspectId)
        : [...prev, aspectId];

      if (next.length === AVAILABLE_EXTRACTION_ASPECTS.length) {
        setActiveMode('all');
      } else if (next.length === 1) {
        const single = next[0];
        if (['exact', 'style', 'subject', 'colors', 'camera', 'mood', 'textures'].includes(single)) {
          setActiveMode(single);
        } else {
          setActiveMode('custom');
        }
      } else {
        setActiveMode('custom');
      }

      return next;
    });
  };

  const handleSelectAllAspects = () => {
    setSelectedAspects(AVAILABLE_EXTRACTION_ASPECTS.map((a) => a.id));
    setActiveMode('all');
  };

  const handleClearAllAspects = () => {
    setSelectedAspects([]);
    setActiveMode('custom');
  };

  const handleSelectSamplePreset = async (preset: SamplePreset) => {
    setIsLoading(true);
    setLoadingStep('Fetching sample image...');
    try {
      const { dataUrl } = await urlToBase64(preset.url);
      const optimized = await resizeImageToTargetSize(dataUrl, 1024 * 1024);
      handleImageSelected(optimized.dataUrl, optimized.mimeType, `${preset.name}.jpg`);
    } catch (err: any) {
      setError('Could not load sample image: ' + (err.message || 'Network error'));
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.warn('Failed saving settings to localStorage', e);
    }
    addToast(
      `Model settings updated (${newSettings.model})${newSettings.apiKey ? ' with custom API key' : ''}`,
      'success'
    );
  };

  const handleExtractPrompt = async () => {
    if (!currentImageData) {
      addToast('Please upload or select an image first', 'error');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStep('Resizing image to ≤ 1 MB scale...');

    try {
      // Guarantee image scale is <= 1 MB before sending to AI model
      const optimized = await resizeImageToTargetSize(currentImageData, 1024 * 1024);
      setLoadingStep(`Deconstructing with Gemini Vision (${formatBytes(optimized.sizeBytes)})...`);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (settings.apiKey) {
        headers['x-gemini-api-key'] = settings.apiKey;
      }
      if (settings.model) {
        headers['x-gemini-model'] = settings.model;
      }

      const response = await fetch('/api/extract-prompt', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          image: optimized.dataUrl,
          mimeType: optimized.mimeType,
          mode: activeMode,
          customFocus: activeMode === 'custom' ? customFocusQuery : '',
          aspects: selectedAspects,
          injectedSubject: injectedSubject.trim(),
          apiKey: settings.apiKey,
          model: settings.model || 'gemini-3.5-flash-lite',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Server responded with status ${response.status}`);
      }

      setLoadingStep('Parsing generator prompts & color palette...');
      const data: ExtractionResult = await response.json();
      if (injectedSubject.trim()) {
        data.injectedSubject = injectedSubject.trim();
      }
      setResult(data);

      // Auto-save to history
      await saveToHistory(data, optimized.dataUrl, fileName);
      addToast(
        injectedSubject.trim()
          ? 'Master prompt and 1:1 Injected Subject prompt extracted!'
          : 'Prompt and forensic layers extracted successfully!',
        'success'
      );
    } catch (err: any) {
      console.error('Extraction error:', err);
      setError(err?.message || 'Failed to extract prompt. Please verify image and try again.');
      addToast('Extraction failed. Check error message.', 'error');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast(`Copied ${label} to clipboard!`, 'success');
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setResult(item.result);
    setFileName(item.fileName);
    if (item.imageThumbnail) {
      setCurrentImageData(item.imageThumbnail);
    }
    addToast(`Loaded "${item.result.title || item.fileName}" from history`, 'info');
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    addToast('Deleted history item', 'info');
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    addToast('History cleared', 'info');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onReset={handleClearImage}
        hasActiveImage={!!currentImageData || !!result}
        onOpenSampleGallery={() => setIsSampleGalleryOpen(true)}
        onOpenSuggestions={() => setIsSuggestionsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isCustomSettingsActive={!!settings.apiKey || settings.model !== 'gemini-3.5-flash-lite'}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-5 py-3 space-y-2.5">
        {/* Subtle intro when no image is loaded */}
        {!result && !currentImageData && (
          <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="font-semibold text-white">ReversePrompt Studio</span>
              <span className="text-neutral-400 hidden sm:inline">· Deconstruct any image into exact Midjourney, Flux & DALL-E prompts</span>
            </div>
            <button
              onClick={() => setIsSuggestionsOpen(true)}
              className="text-[11px] text-amber-400 hover:underline"
            >
              Extraction Guide
            </button>
          </div>
        )}

        {/* Error notification banner if any */}
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/30 px-3 py-2 text-xs text-red-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span><strong className="text-red-300">Error:</strong> {error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-neutral-400 hover:text-white text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Section 1: Upload Strip */}
        <ImageUploader
          currentImageData={currentImageData}
          currentMimeType={currentMimeType}
          fileName={fileName}
          onImageSelected={handleImageSelected}
          onClear={handleClearImage}
          isLoading={isLoading}
        />

        {/* Section 2: Mode & Aspect Selector (only when image is present) */}
        {currentImageData && (
          <ExtractionAspectSelector
            activeMode={activeMode}
            onSelectMode={handleSelectMode}
            selectedAspects={selectedAspects}
            onToggleAspect={handleToggleAspect}
            onSelectAllAspects={handleSelectAllAspects}
            onClearAllAspects={handleClearAllAspects}
            customFocusQuery={customFocusQuery}
            onChangeCustomFocus={setCustomFocusQuery}
            injectedSubject={injectedSubject}
            onChangeInjectedSubject={setInjectedSubject}
            onExtract={handleExtractPrompt}
            isLoading={isLoading}
            disabled={!currentImageData}
          />
        )}

        {/* Compact Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-6 rounded-xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-md">
            <div className="relative flex h-7 w-7 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-white">Reverse-engineering prompt layers</span>
              <span className="text-neutral-400 ml-2">· {loadingStep || 'Consulting Gemini Vision...'}</span>
            </div>
          </div>
        )}

        {/* Section 3: Extracted Results Viewers (Master Prompts & Forensic Layers) */}
        {result && !isLoading && (
          <div className="space-y-2.5 animate-in fade-in duration-300">
            {/* Master & Engine Prompts View with tabs & dropdowns */}
            <PromptResultViewer
              result={result}
              onCopyText={handleCopyText}
              activeFocus={activeMode}
              userSettings={settings}
            />

            {/* Collapsible Forensic Visual Deconstruction Breakdown */}
            <ForensicBreakdown result={result} onCopyText={handleCopyText} />
          </div>
        )}
      </main>

      {/* Ultra Compact Footer */}
      <footer className="w-full border-t border-neutral-800/80 bg-neutral-950/80 py-2.5 text-[11px] text-neutral-500">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-neutral-400">ReversePrompt.ai</span>
            <span>·</span>
            <span>Multimodal Vision ({settings.model})</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-400">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              Settings
            </button>
            <button
              onClick={() => setIsSuggestionsOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              Guide
            </button>
            <button
              onClick={() => setIsSampleGalleryOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              Samples
            </button>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              History
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onCopyText={handleCopyText}
      />

      <SuggestionsModal
        isOpen={isSuggestionsOpen}
        onClose={() => setIsSuggestionsOpen(false)}
        onSelectExtractionMode={(mode) => handleSelectMode(mode)}
      />

      <SampleGalleryModal
        isOpen={isSampleGalleryOpen}
        onClose={() => setIsSampleGalleryOpen(false)}
        onSelectPreset={handleSelectSamplePreset}
        isLoading={isLoading}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />

      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
