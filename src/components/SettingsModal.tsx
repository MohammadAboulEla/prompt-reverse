import React, { useState, useEffect } from 'react';
import {
  Settings,
  X,
  Key,
  Cpu,
  Check,
  Eye,
  EyeOff,
  RotateCcw,
  Palette,
  Sun,
  Moon,
  Sparkles,
  Layers,
} from 'lucide-react';
import { UserSettings } from '../types';
import {
  ThemeConfig,
  ThemeMode,
  DarkVariant,
  LightVariant,
  AccentColor,
  DARK_VARIANTS,
  LIGHT_VARIANTS,
  ACCENT_COLORS,
  DEFAULT_THEME_CONFIG,
  applyTheme,
} from '../utils/theme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (newSettings: UserSettings) => void;
  themeConfig: ThemeConfig;
  onSaveTheme: (newTheme: ThemeConfig) => void;
  initialTab?: 'theme' | 'model';
}

const MODEL_PRESETS = [
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash',
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  themeConfig,
  onSaveTheme,
  initialTab = 'theme',
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'model'>(initialTab);

  // Model settings
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [model, setModel] = useState(settings.model || 'gemini-3.5-flash-lite');
  const [showKey, setShowKey] = useState(false);

  // Theme settings (live previewable)
  const [mode, setMode] = useState<ThemeMode>(themeConfig.mode);
  const [darkVariant, setDarkVariant] = useState<DarkVariant>(themeConfig.darkVariant);
  const [lightVariant, setLightVariant] = useState<LightVariant>(themeConfig.lightVariant);
  const [accent, setAccent] = useState<AccentColor>(themeConfig.accent);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setApiKey(settings.apiKey || '');
      setModel(settings.model || 'gemini-3.5-flash-lite');
      setMode(themeConfig.mode);
      setDarkVariant(themeConfig.darkVariant);
      setLightVariant(themeConfig.lightVariant);
      setAccent(themeConfig.accent);
      setSavedSuccess(false);
    }
  }, [isOpen, settings, themeConfig, initialTab]);

  if (!isOpen) return null;

  // Handle immediate live theme preview when user changes options
  const updateLiveTheme = (
    newMode: ThemeMode,
    newDark: DarkVariant,
    newLight: LightVariant,
    newAccent: AccentColor
  ) => {
    setMode(newMode);
    setDarkVariant(newDark);
    setLightVariant(newLight);
    setAccent(newAccent);

    // Apply immediately so user sees live changes
    applyTheme({
      mode: newMode,
      darkVariant: newDark,
      lightVariant: newLight,
      accent: newAccent,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newTheme: ThemeConfig = {
      mode,
      darkVariant,
      lightVariant,
      accent,
    };

    onSaveTheme(newTheme);
    onSaveSettings({
      apiKey: apiKey.trim(),
      model: model.trim() || 'gemini-3.5-flash-lite',
    });

    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleResetDefaults = () => {
    if (activeTab === 'theme') {
      updateLiveTheme(
        DEFAULT_THEME_CONFIG.mode,
        DEFAULT_THEME_CONFIG.darkVariant,
        DEFAULT_THEME_CONFIG.lightVariant,
        DEFAULT_THEME_CONFIG.accent
      );
    } else {
      setApiKey('');
      setModel('gemini-3.5-flash-lite');
    }
  };

  const currentAccentObj =
    ACCENT_COLORS.find((a) => a.id === accent) || ACCENT_COLORS[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3.5 shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Studio Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/60 px-5 pt-2 shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'theme'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Palette className="h-3.5 w-3.5 text-amber-400" />
            <span>Theme & Colors</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('model')}
            className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'model'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Cpu className="h-3.5 w-3.5 text-amber-400" />
            <span>AI Model & API Key</span>
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {activeTab === 'theme' ? (
            <div className="space-y-4">
              {/* 1. Theme Mode: Dark vs Light */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Color Mode</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateLiveTheme('dark', darkVariant, lightVariant, accent)}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 transition-all ${
                      mode === 'dark'
                        ? 'border-amber-400 bg-neutral-800/90 text-white ring-1 ring-amber-400/30 font-semibold'
                        : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                    }`}
                  >
                    <Moon className="h-4 w-4 text-amber-400" />
                    <span>Dark Theme</span>
                    {mode === 'dark' && <Check className="h-3.5 w-3.5 text-amber-400 stroke-[3]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => updateLiveTheme('light', darkVariant, lightVariant, accent)}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 transition-all ${
                      mode === 'light'
                        ? 'border-amber-400 bg-neutral-800/90 text-white ring-1 ring-amber-400/30 font-semibold'
                        : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                    }`}
                  >
                    <Sun className="h-4 w-4 text-amber-400" />
                    <span>Light Theme</span>
                    {mode === 'light' && <Check className="h-3.5 w-3.5 text-amber-400 stroke-[3]" />}
                  </button>
                </div>
              </div>

              {/* 2. Accent Colors */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>Accent Color</span>
                  </label>
                  <span className="text-[10px] text-amber-400 font-medium">
                    {currentAccentObj.name}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {ACCENT_COLORS.map((acc) => {
                    const isSelected = accent === acc.id;
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => updateLiveTheme(mode, darkVariant, lightVariant, acc.id)}
                        className={`group relative flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-neutral-800/90 shadow-sm ring-1 ring-amber-400/40'
                            : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 hover:bg-neutral-800/40'
                        }`}
                      >
                        <div
                          className="h-6 w-6 rounded-full flex items-center justify-center shadow-inner transition-transform group-hover:scale-110"
                          style={{ backgroundColor: acc.hex }}
                        >
                          {isSelected && (
                            <Check
                              className="h-3.5 w-3.5 stroke-[3]"
                              style={{ color: acc.contrastText }}
                            />
                          )}
                        </div>
                        <span
                          className={`text-[10px] truncate max-w-full ${
                            isSelected ? 'font-bold text-white' : 'text-neutral-400'
                          }`}
                        >
                          {acc.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Background Color Variant (Degrees) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-amber-400" />
                    <span>
                      {mode === 'dark' ? 'Dark Degrees (Depth)' : 'Light Degrees (Tone)'}
                    </span>
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    5 tailored variations
                  </span>
                </div>

                <div className="space-y-1.5">
                  {mode === 'dark' ? (
                    DARK_VARIANTS.map((variant) => {
                      const isSelected = darkVariant === variant.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => updateLiveTheme('dark', variant.id, lightVariant, accent)}
                          className={`w-full flex items-center justify-between rounded-xl border p-2.5 text-left transition-all ${
                            isSelected
                              ? 'border-amber-400 bg-neutral-800/90 ring-1 ring-amber-400/30'
                              : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 hover:bg-neutral-800/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Color chips preview */}
                            <div className="flex -space-x-1 shrink-0">
                              <span
                                className="h-5 w-5 rounded-full border border-neutral-700 shadow-sm"
                                style={{ backgroundColor: variant.bgHex }}
                                title="Background canvas"
                              />
                              <span
                                className="h-5 w-5 rounded-full border border-neutral-700 shadow-sm"
                                style={{ backgroundColor: variant.cardHex }}
                                title="Card surface"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs ${isSelected ? 'font-bold text-white' : 'font-medium text-neutral-200'}`}>
                                  {variant.name}
                                </span>
                                <span className="rounded bg-neutral-800 px-1.5 py-0.2 text-[9px] font-mono text-neutral-400">
                                  {variant.tag}
                                </span>
                              </div>
                              <p className="text-[10px] text-neutral-400 line-clamp-1">
                                {variant.description}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="h-4 w-4 text-amber-400 stroke-[3] shrink-0" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    LIGHT_VARIANTS.map((variant) => {
                      const isSelected = lightVariant === variant.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => updateLiveTheme('light', darkVariant, variant.id, accent)}
                          className={`w-full flex items-center justify-between rounded-xl border p-2.5 text-left transition-all ${
                            isSelected
                              ? 'border-amber-400 bg-neutral-800/90 ring-1 ring-amber-400/30'
                              : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 hover:bg-neutral-800/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Color chips preview */}
                            <div className="flex -space-x-1 shrink-0">
                              <span
                                className="h-5 w-5 rounded-full border border-neutral-300 shadow-sm"
                                style={{ backgroundColor: variant.bgHex }}
                                title="Background canvas"
                              />
                              <span
                                className="h-5 w-5 rounded-full border border-neutral-300 shadow-sm"
                                style={{ backgroundColor: variant.cardHex }}
                                title="Card surface"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs ${isSelected ? 'font-bold text-white' : 'font-medium text-neutral-200'}`}>
                                  {variant.name}
                                </span>
                                <span className="rounded bg-neutral-800 px-1.5 py-0.2 text-[9px] font-mono text-neutral-400">
                                  {variant.tag}
                                </span>
                              </div>
                              <p className="text-[10px] text-neutral-400 line-clamp-1">
                                {variant.description}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="h-4 w-4 text-amber-400 stroke-[3] shrink-0" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 4. Live Mini Preview */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-3 space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Live Preview Sample
                </span>
                <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded-md flex items-center justify-center font-bold text-xs shadow-sm"
                      style={{
                        backgroundColor: currentAccentObj.hex,
                        color: currentAccentObj.contrastText,
                      }}
                    >
                      AI
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white">
                        ReversePrompt Visualizer
                      </p>
                      <p className="text-[9px] text-neutral-400">
                        {mode === 'dark' ? 'Dark' : 'Light'} · {mode === 'dark' ? darkVariant : lightVariant} · {currentAccentObj.name}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded px-2.5 py-1 text-[10px] font-bold shadow-sm transition-transform active:scale-95"
                    style={{
                      backgroundColor: currentAccentObj.hex,
                      color: currentAccentObj.contrastText,
                    }}
                  >
                    Active Accent
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Configure your Gemini model and API key. These are saved in your browser&apos;s local storage so you do not need to enter them repeatedly.
              </p>

              {/* Model Name */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 font-medium text-neutral-200">
                  <Cpu className="h-3.5 w-3.5 text-amber-400" />
                  <span>Model Name</span>
                  <span className="text-[10px] text-neutral-500">(Default: gemini-3.5-flash-lite)</span>
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="gemini-3.5-flash-lite"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-400"
                />
                {/* Model Presets */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {MODEL_PRESETS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModel(m)}
                      className={`rounded px-1.5 py-0.5 font-mono text-[10px] transition-colors ${
                        model === m
                          ? 'bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/40'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* API Key */}
              <div className="space-y-1.5">
                <label className="flex items-center justify-between font-medium text-neutral-200">
                  <div className="flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5 text-amber-400" />
                    <span>Gemini API Key</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">Optional</span>
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy... (Leave blank to use server environment key)"
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 pr-9 font-mono text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    title={showKey ? 'Hide key' : 'Show key'}
                  >
                    {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500 leading-tight">
                  Only required when self-hosting or running outside Google AI Studio. Left empty, the backend uses its configured <code className="text-neutral-400 font-mono">GEMINI_API_KEY</code>.
                </p>
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-800 shrink-0">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset {activeTab === 'theme' ? 'Theme' : 'Model'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-1.5 text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm"
                style={{
                  backgroundColor: currentAccentObj.hex,
                  color: currentAccentObj.contrastText,
                }}
              >
                {savedSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save All Settings</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
