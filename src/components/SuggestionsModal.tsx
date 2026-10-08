import React from 'react';
import {
  Sparkles,
  X,
  Palette,
  User,
  Sun,
  Camera,
  CloudRain,
  Layers,
  Cpu,
  Zap,
  FileText,
  ShieldAlert,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExtractionMode: (modeId: string) => void;
}

export const SuggestionsModal: React.FC<SuggestionsModalProps> = ({
  isOpen,
  onClose,
  onSelectExtractionMode,
}) => {
  if (!isOpen) return null;

  const suggestions = [
    {
      id: 'exact',
      title: '1. Exact 1:1 Reproduction Prompt',
      icon: Sparkles,
      color: 'text-amber-400',
      badge: 'Master Prompt',
      description:
        'A comprehensive 80-160 word prompt describing the full composition, foreground, midground, background, lighting physics, and style with microscopic fidelity so any image generator can recreate the identical picture.',
      useCase: 'Recreating an image you saw online or lost the original seed/prompt for.',
    },
    {
      id: 'style',
      title: '2. Art Style & Medium Clone',
      icon: Palette,
      color: 'text-purple-400',
      badge: 'Style Transfer',
      description:
        'Extracts exclusively the artistic medium (35mm Kodak Portra film, oil on canvas, 3D Octane render, risograph, claymation), brushwork, grain, rendering engine, and art movement, leaving a placeholder "[YOUR SUBJECT HERE]".',
      useCase: 'Applying the exact same artistic aesthetic to your own characters or ideas.',
    },
    {
      id: 'subject',
      title: '3. Subject & Pose Isolation',
      icon: User,
      color: 'text-emerald-400',
      badge: 'Character Design',
      description:
        'Extracts the main protagonist, character, creature, or product with precision: anatomy, outfit, garments, textures, posture, facial expression, and gaze, stripping away the background.',
      useCase: 'Taking a character or costume you love and placing them in an entirely new world.',
    },
    {
      id: 'colors',
      title: '4. Color Palette & Lighting Rig',
      icon: Sun,
      color: 'text-yellow-400',
      badge: 'Lighting Physics',
      description:
        'Extracts 5 to 6 exact representative Hex Codes (#RRGGBB) with color harmony roles (Dominant, Accent, Rim, Shadow), plus lighting setup (golden hour, chiaroscuro, volumetric god rays, neon rim glow).',
      useCase: 'Creating consistent brand palettes or transferring cinematic lighting to another shot.',
    },
    {
      id: 'camera',
      title: '5. Camera Optics & Cinematography',
      icon: Camera,
      color: 'text-blue-400',
      badge: 'Camera Specs',
      description:
        'Reverse-engineers photographic technical parameters: focal length (e.g. 85mm f/1.4, 24mm wide angle), sensor format, depth of field, framing scale (close-up portrait, wide establishing), and camera angle (Dutch tilt, worms-eye).',
      useCase: 'Photorealism prompting for photographers and cinematic directors.',
    },
    {
      id: 'mood',
      title: '6. Atmosphere, Weather & Particles',
      icon: CloudRain,
      color: 'text-cyan-400',
      badge: 'Vibe & Particles',
      description:
        'Identifies emotional tone (melancholy, whimsical, dystopian) and atmospheric conditions: volumetric fog, airborne dust motes, rain droplets on glass, embers, or lens flares.',
      useCase: 'Injecting mood and depth into sterile or flat AI generations.',
    },
    {
      id: 'textures',
      title: '7. Textures & Tactile Materiality',
      icon: Layers,
      color: 'text-rose-400',
      badge: 'Materials',
      description:
        'Details tangible surfaces: brushed titanium, aged weathered leather, silk velvet, translucent porcelain, glossy wet asphalt, skin pores, or coarse linen canvas.',
      useCase: '3D rendering prompts and luxury product concept art.',
    },
    {
      id: 'midjourney',
      title: '8. Midjourney v6.1 Parameters',
      icon: Cpu,
      color: 'text-indigo-400',
      badge: 'MJ v6.1 Flags',
      description:
        'Formats the prompt specifically with Midjourney flags: --ar (aspect ratio), --style raw, --v 6.1, and tuned --stylize values for maximum aesthetic coherence.',
      useCase: 'Direct copy-pasting into Midjourney Discord or web alpha.',
    },
    {
      id: 'flux',
      title: '9. Flux.1 / SDXL Tag Clusters',
      icon: Zap,
      color: 'text-amber-400',
      badge: 'Flux & SDXL',
      description:
        'Formats prompt using comma-separated keyword weight clusters and descriptive tags favored by open-source diffusion models.',
      useCase: 'Running in ComfyUI, Automatic1111, or Fooocus.',
    },
    {
      id: 'dalle',
      title: '10. DALL-E 3 & Imagen 3 Storytelling Prose',
      icon: FileText,
      color: 'text-teal-400',
      badge: 'Narrative Prose',
      description:
        'Transforms the visual decomposition into fluent, natural-language descriptive storytelling prose that instruction-following LLM-based diffusion models excel at.',
      useCase: 'Generating in ChatGPT DALL-E or Google Imagen.',
    },
    {
      id: 'negative',
      title: '11. Negative Prompt Shield',
      icon: ShieldAlert,
      color: 'text-red-400',
      badge: 'Artifact Blocker',
      description:
        'Suggests tailored negative prompt exclusions (e.g., deformed hands, blurry, low-res, oversaturated, plastic skin, CGI cartoonish) to guarantee clean results.',
      useCase: 'Entering into the Negative Prompt field in generative interfaces.',
    },
    {
      id: 'custom',
      title: '12. Custom Targeted Forensic Focus',
      icon: Search,
      color: 'text-violet-400',
      badge: 'Custom Query',
      description:
        'Ask Gemini anything specific: "Extract only the jewelry metals and gems", "Describe the exact historical architectural style of the buildings", or "Extract font style".',
      useCase: 'Niche visual research and domain-specific design deconstruction.',
    },
  ];

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
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">
                Everything You Can Extract from an Image
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-neutral-400">
              Explore the 12 visual dimensions ReversePrompt AI can forensically reverse-engineer
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List of Extractable Aspects */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {suggestions.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 transition-all hover:border-neutral-700 hover:bg-neutral-900/60"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${item.color}`} />
                        <h3 className="text-xs font-bold text-white">{item.title}</h3>
                      </div>
                      <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-neutral-300">
                        {item.badge}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-neutral-300">
                      {item.description}
                    </p>

                    <div className="mt-2 text-[11px] text-neutral-500">
                      <span className="font-semibold text-neutral-400">Best for: </span>
                      {item.useCase}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectExtractionMode(item.id);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Select this extraction mode</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-950 px-6 py-3.5">
          <span className="text-xs text-neutral-400">
            You can also run the <strong>Full Master Blueprint</strong> to extract all 12 dimensions at once!
          </span>
          <button
            onClick={() => {
              onSelectExtractionMode('all');
              onClose();
            }}
            className="rounded-lg bg-amber-400 px-4 py-1.5 text-xs font-bold hover:brightness-110 transition-colors"
            style={{ color: 'var(--theme-accent-contrast, #0a0a0a)' }}
          >
            Extract All Dimensions
          </button>
        </div>
      </div>
    </div>
  );
};
