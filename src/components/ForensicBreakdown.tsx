import React, { useState } from 'react';
import {
  Palette,
  Sun,
  User,
  Camera,
  CloudRain,
  Layers,
  Copy,
  Check,
  ShieldAlert,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ExtractionResult, ColorSwatch } from '../types';

interface ForensicBreakdownProps {
  result: ExtractionResult;
  onCopyText: (text: string, label: string) => void;
}

export const ForensicBreakdown: React.FC<ForensicBreakdownProps> = ({
  result,
  onCopyText,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedAllHex, setCopiedAllHex] = useState(false);

  // Collapsible panels state: Colors open by default, others collapsed for ultra-compact UI
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({
    colors: true,
    style: false,
    camera: false,
    subject: false,
    atmosphere: false,
    negative: false,
  });

  const breakdown = result.breakdown;
  if (!breakdown) return null;

  const togglePanel = (id: string) => {
    setOpenPanels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = (open: boolean) => {
    setOpenPanels({
      colors: open,
      style: open,
      camera: open,
      subject: open,
      atmosphere: open,
      negative: open,
    });
  };

  const handleCopyHex = (hex: string) => {
    onCopyText(hex, `Hex code ${hex}`);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleCopyAllHexes = () => {
    if (!breakdown?.colorPalette?.swatches) return;
    const allHexes = breakdown.colorPalette.swatches.map((s) => s.hex).join(', ');
    onCopyText(allHexes, 'Color Palette (All Hex codes)');
    setCopiedAllHex(true);
    setTimeout(() => setCopiedAllHex(false), 1800);
  };

  const allOpen = Object.values(openPanels).every(Boolean);

  return (
    <div className="w-full space-y-2">
      {/* Header with expand/collapse all */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-1.5 px-0.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Forensic Visual Layers
        </span>
        <button
          onClick={() => toggleAll(!allOpen)}
          className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
        >
          {allOpen ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* Custom Extraction Query Result if present */}
      {result.customExtraction && (
        <div className="rounded-lg border border-indigo-500/40 bg-indigo-950/20 p-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-indigo-300 font-semibold mb-1">
            <Search className="h-3.5 w-3.5" />
            <span>Custom Focus Result</span>
          </div>
          <p className="text-neutral-300 text-[11px] leading-relaxed">
            {result.customExtraction}
          </p>
        </div>
      )}

      {/* Collapsible Accordion Panels */}
      <div className="space-y-1.5">
        {/* Panel 1: Colors & Lighting */}
        <div className="rounded-lg border border-neutral-800/90 bg-neutral-900/60 overflow-hidden">
          <button
            type="button"
            onClick={() => togglePanel('colors')}
            className="flex w-full items-center justify-between p-2.5 text-left text-xs font-medium text-neutral-200 hover:bg-neutral-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Palette className="h-3.5 w-3.5 text-amber-400" />
              <span>Color Swatches & Lighting</span>
              {breakdown.colorPalette?.swatches && (
                <div className="flex items-center gap-1 ml-2">
                  {breakdown.colorPalette.swatches.slice(0, 5).map((s, i) => (
                    <span
                      key={i}
                      className="h-2.5 w-2.5 rounded-full inline-block border border-white/20"
                      style={{ backgroundColor: s.hex }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ChevronDown
                className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${
                  openPanels.colors ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {openPanels.colors && (
            <div className="p-2.5 pt-0 border-t border-neutral-800/60 text-xs space-y-2">
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-neutral-400">
                  {breakdown.colorPalette?.paletteDescription}
                </span>
                <button
                  onClick={handleCopyAllHexes}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:underline"
                >
                  {copiedAllHex ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedAllHex ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>

              {/* Color Swatches Grid */}
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-6">
                {breakdown.colorPalette?.swatches?.map((swatch: ColorSwatch, i: number) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleCopyHex(swatch.hex)}
                    className="flex items-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-950 p-1.5 text-left hover:border-neutral-700 transition-colors"
                    title={`Copy ${swatch.hex}`}
                  >
                    <div
                      className="h-5 w-5 shrink-0 rounded ring-1 ring-white/10"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[10px] font-semibold text-neutral-200 truncate">
                        {swatch.hex}
                      </div>
                      <div className="text-[9px] text-neutral-400 truncate">
                        {swatch.role}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Lighting Info */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] pt-1 border-t border-neutral-800/40 text-neutral-300">
                <span>
                  <strong className="text-neutral-500 font-normal">Light:</strong> {breakdown.lighting?.type}
                </span>
                <span>
                  <strong className="text-neutral-500 font-normal">Direction:</strong> {breakdown.lighting?.direction}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Panel 2: Style, Medium & Movement */}
        <div className="rounded-lg border border-neutral-800/90 bg-neutral-900/60 overflow-hidden">
          <button
            type="button"
            onClick={() => togglePanel('style')}
            className="flex w-full items-center justify-between p-2.5 text-left text-xs font-medium text-neutral-200 hover:bg-neutral-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-purple-400" />
              <span>Style, Medium & Movement</span>
              <span className="text-[11px] text-neutral-500 hidden sm:inline">
                ({breakdown.style?.medium})
              </span>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${
                openPanels.style ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openPanels.style && (
            <div className="p-2.5 pt-2 border-t border-neutral-800/60 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] uppercase text-neutral-500">Medium</span>
                <p className="text-neutral-200 font-medium">{breakdown.style?.medium}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-500">Genre / Movement</span>
                <p className="text-neutral-300">{breakdown.style?.artMovement}</p>
              </div>
              {breakdown.style?.renderingEngine && (
                <div>
                  <span className="text-[10px] uppercase text-neutral-500">Render / Grain</span>
                  <p className="text-neutral-400">{breakdown.style.renderingEngine}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel 3: Camera Optics & Composition */}
        <div className="rounded-lg border border-neutral-800/90 bg-neutral-900/60 overflow-hidden">
          <button
            type="button"
            onClick={() => togglePanel('camera')}
            className="flex w-full items-center justify-between p-2.5 text-left text-xs font-medium text-neutral-200 hover:bg-neutral-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Camera className="h-3.5 w-3.5 text-blue-400" />
              <span>Camera & Cinematography</span>
              <span className="text-[11px] text-neutral-500 hidden sm:inline">
                ({breakdown.composition?.lensAndFocal})
              </span>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${
                openPanels.camera ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openPanels.camera && (
            <div className="p-2.5 pt-2 border-t border-neutral-800/60 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] uppercase text-neutral-500">Lens & Focal Depth</span>
                <p className="text-neutral-200 font-medium">{breakdown.composition?.lensAndFocal}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-500">Framing</span>
                <p className="text-neutral-300">{breakdown.composition?.framing}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-500">Perspective Angle</span>
                <p className="text-neutral-400">{breakdown.composition?.perspective}</p>
              </div>
            </div>
          )}
        </div>

        {/* Panel 4: Subject Anatomy & Pose */}
        <div className="rounded-lg border border-neutral-800/90 bg-neutral-900/60 overflow-hidden">
          <button
            type="button"
            onClick={() => togglePanel('subject')}
            className="flex w-full items-center justify-between p-2.5 text-left text-xs font-medium text-neutral-200 hover:bg-neutral-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-emerald-400" />
              <span>Subject & Character Isolation</span>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${
                openPanels.subject ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openPanels.subject && (
            <div className="p-2.5 pt-2 border-t border-neutral-800/60 text-xs space-y-2">
              <p className="text-neutral-300 leading-relaxed">
                {breakdown.subject?.description}
              </p>
              {breakdown.subject?.features && breakdown.subject.features.length > 0 && (
                <div className="flex flex-wrap gap-1 text-[11px]">
                  {breakdown.subject.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-neutral-950 px-1.5 py-0.5 text-neutral-400 border border-neutral-800"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel 5: Atmosphere & Textures */}
        <div className="rounded-lg border border-neutral-800/90 bg-neutral-900/60 overflow-hidden">
          <button
            type="button"
            onClick={() => togglePanel('atmosphere')}
            className="flex w-full items-center justify-between p-2.5 text-left text-xs font-medium text-neutral-200 hover:bg-neutral-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <CloudRain className="h-3.5 w-3.5 text-cyan-400" />
              <span>Atmosphere & Materials</span>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${
                openPanels.atmosphere ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openPanels.atmosphere && (
            <div className="p-2.5 pt-2 border-t border-neutral-800/60 text-xs space-y-1.5">
              <div className="text-[11px] text-neutral-300">
                <strong className="text-neutral-500 font-normal">Vibe:</strong> {breakdown.mood?.atmosphere}
              </div>
              {breakdown.textures?.materials && (
                <div className="text-[11px] text-neutral-400">
                  <strong className="text-neutral-500 font-normal">Materials:</strong>{' '}
                  {breakdown.textures.materials.join(', ')} ({breakdown.textures.finish})
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel 6: Negative Prompt */}
        <div className="rounded-lg border border-neutral-800/90 bg-neutral-900/60 overflow-hidden">
          <button
            type="button"
            onClick={() => togglePanel('negative')}
            className="flex w-full items-center justify-between p-2.5 text-left text-xs font-medium text-neutral-200 hover:bg-neutral-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Negative Prompt Shield</span>
            </div>
            <div className="flex items-center gap-2">
              <ChevronDown
                className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${
                  openPanels.negative ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {openPanels.negative && (
            <div className="p-2.5 pt-2 border-t border-neutral-800/60 text-xs flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] text-neutral-400 leading-relaxed truncate">
                {result.negativePrompt}
              </p>
              <button
                type="button"
                onClick={() => onCopyText(result.negativePrompt, 'Negative Prompt')}
                className="shrink-0 flex items-center gap-1 rounded bg-neutral-800 px-2 py-1 text-[10px] text-neutral-300 hover:bg-neutral-700 hover:text-white"
              >
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
