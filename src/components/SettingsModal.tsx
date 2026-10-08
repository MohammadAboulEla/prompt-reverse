import React, { useState, useEffect } from 'react';
import { Settings, X, Key, Cpu, Check, Eye, EyeOff, RotateCcw } from 'lucide-react';

export interface UserSettings {
  apiKey: string;
  model: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
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
  onSave,
}) => {
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [model, setModel] = useState(settings.model || 'gemini-3.5-flash-lite');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(settings.apiKey || '');
      setModel(settings.model || 'gemini-3.5-flash-lite');
      setSavedSuccess(false);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      apiKey: apiKey.trim(),
      model: model.trim() || 'gemini-3.5-flash-lite',
    });
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleReset = () => {
    setApiKey('');
    setModel('gemini-3.5-flash-lite');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Model & API Key Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Configure your Gemini settings. These are stored locally in your browser so you don't need to re-enter them on each visit.
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
                placeholder="AIzaSy... (Leave empty to use server default key)"
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
              Only required when running or hosting the app outside Google AI Studio. Left empty, the backend uses its configured <code className="text-neutral-400 font-mono">GEMINI_API_KEY</code>.
            </p>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-1.5 text-xs font-bold text-neutral-950 hover:bg-amber-300 active:scale-95 transition-all shadow-sm"
              >
                {savedSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Settings</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
