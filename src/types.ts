export interface ColorSwatch {
  hex: string;
  name: string;
  role: string;
}

export interface ExtractionResult {
  title: string;
  exactPrompt: string;
  shortPrompt: string;
  midjourneyPrompt: string;
  fluxPrompt: string;
  dallePrompt: string;
  subjectOnlyPrompt: string;
  styleOnlyPrompt: string;
  lightingAndColorPrompt: string;
  cameraAndCompositionPrompt: string;
  negativePrompt: string;
  injectedPrompt?: string;
  injectedSubject?: string;
  aspectRatio: string;
  suggestedTags: string[];
  breakdown: {
    subject: {
      description: string;
      features: string[];
    };
    style: {
      medium: string;
      artMovement: string;
      renderingEngine?: string;
    };
    colorPalette: {
      paletteDescription: string;
      swatches: ColorSwatch[];
    };
    lighting: {
      type: string;
      direction: string;
      highlights: string;
    };
    composition: {
      framing: string;
      perspective: string;
      lensAndFocal: string;
    };
    mood: {
      atmosphere: string;
      environmentalElements: string[];
    };
    textures: {
      materials: string[];
      finish: string;
    };
  };
  customExtraction?: string;
}

export type ExtractionFocusKey =
  | 'exact'
  | 'style'
  | 'subject'
  | 'colors'
  | 'camera'
  | 'mood'
  | 'textures'
  | 'midjourney'
  | 'flux'
  | 'dalle'
  | 'negative';

export interface ExtractionAspectOption {
  id: ExtractionFocusKey;
  label: string;
  shortDesc: string;
  category: 'core' | 'style' | 'cinematography' | 'engine';
  icon: string;
  defaultSelected: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageThumbnail: string; // low-res data URL for preview
  fullImageData?: string;
  fileName: string;
  aspectRatio: string;
  result: ExtractionResult;
  selectedFocus?: string;
}

export interface SamplePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
}

export interface UserSettings {
  apiKey: string;
  model: string;
}
