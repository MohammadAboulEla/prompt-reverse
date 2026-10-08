export type ThemeMode = 'dark' | 'light';

export type DarkVariant = 'oled' | 'zinc' | 'midnight' | 'espresso' | 'charcoal';
export type LightVariant = 'snow' | 'alabaster' | 'slate' | 'sand' | 'zinc';

export type AccentColor =
  | 'amber'
  | 'emerald'
  | 'cyan'
  | 'violet'
  | 'rose'
  | 'coral'
  | 'blue'
  | 'slate';

export interface ThemeConfig {
  mode: ThemeMode;
  darkVariant: DarkVariant;
  lightVariant: LightVariant;
  accent: AccentColor;
}

export interface DarkVariantOption {
  id: DarkVariant;
  name: string;
  tag: string;
  description: string;
  bgHex: string;
  cardHex: string;
  borderHex: string;
}

export interface LightVariantOption {
  id: LightVariant;
  name: string;
  tag: string;
  description: string;
  bgHex: string;
  cardHex: string;
  borderHex: string;
}

export interface AccentColorOption {
  id: AccentColor;
  name: string;
  hex: string;
  activeRing: string;
  contrastText: string;
  description: string;
}

export const DARK_VARIANTS: DarkVariantOption[] = [
  {
    id: 'oled',
    name: 'OLED Pitch Black',
    tag: 'Pure 0%',
    description: 'Pitch black for OLED screens & maximum contrast',
    bgHex: '#000000',
    cardHex: '#0a0a0a',
    borderHex: '#222222',
  },
  {
    id: 'zinc',
    name: 'Obsidian Zinc',
    tag: 'Deep Neutral',
    description: 'Deep modern zinc charcoal, sleek and balanced',
    bgHex: '#09090b',
    cardHex: '#121215',
    borderHex: '#27272a',
  },
  {
    id: 'midnight',
    name: 'Midnight Navy',
    tag: 'Deep Slate',
    description: 'Subtle cool twilight navy and deep slate undertones',
    bgHex: '#060913',
    cardHex: '#0f172a',
    borderHex: '#334155',
  },
  {
    id: 'espresso',
    name: 'Espresso Stone',
    tag: 'Studio Default',
    description: 'Cozy warm coffee charcoal with earthy stone depth',
    bgHex: '#0c0a09',
    cardHex: '#1c1917',
    borderHex: '#44403c',
  },
  {
    id: 'charcoal',
    name: 'Charcoal Graphite',
    tag: 'Soft Dark',
    description: 'Gentle neutral dark gray, comfortable for prolonged use',
    bgHex: '#141414',
    cardHex: '#1e1e1e',
    borderHex: '#383838',
  },
];

export const LIGHT_VARIANTS: LightVariantOption[] = [
  {
    id: 'snow',
    name: 'Pure Snow',
    tag: 'Crisp White',
    description: 'Pure 100% white canvas with crisp modern borders',
    bgHex: '#ffffff',
    cardHex: '#f8fafc',
    borderHex: '#e2e8f0',
  },
  {
    id: 'alabaster',
    name: 'Soft Alabaster',
    tag: 'Warm Milk',
    description: 'Gentle warm ivory tone, softer on the eyes than pure white',
    bgHex: '#fcfbf9',
    cardHex: '#f6f4ee',
    borderHex: '#ded8cc',
  },
  {
    id: 'slate',
    name: 'Cool Slate',
    tag: 'Silver Technical',
    description: 'Modern technical cool gray with crisp contrast',
    bgHex: '#f1f5f9',
    cardHex: '#ffffff',
    borderHex: '#cbd5e1',
  },
  {
    id: 'sand',
    name: 'Warm Sand',
    tag: 'Linen Paper',
    description: 'Natural editorial linen warmth, warm and tactile',
    bgHex: '#faf6ed',
    cardHex: '#ffffff',
    borderHex: '#dfd6c5',
  },
  {
    id: 'zinc',
    name: 'Minimal Zinc',
    tag: 'Neutral Gray',
    description: 'Contemporary subtle zinc gray light aesthetic',
    bgHex: '#f4f4f5',
    cardHex: '#ffffff',
    borderHex: '#d4d4d8',
  },
];

export const ACCENT_COLORS: AccentColorOption[] = [
  {
    id: 'amber',
    name: 'Amber Gold',
    hex: '#fbbf24',
    activeRing: 'ring-amber-400',
    contrastText: '#0a0a0a',
    description: 'Classic warm gold and vibrant amber',
  },
  {
    id: 'emerald',
    name: 'Emerald Mint',
    hex: '#34d399',
    activeRing: 'ring-emerald-400',
    contrastText: '#022c22',
    description: 'Fresh natural mint and radiant emerald',
  },
  {
    id: 'cyan',
    name: 'Electric Cyan',
    hex: '#22d3ee',
    activeRing: 'ring-cyan-400',
    contrastText: '#083344',
    description: 'Futuristic electric cyan and bright sky',
  },
  {
    id: 'violet',
    name: 'Royal Violet',
    hex: '#a78bfa',
    activeRing: 'ring-violet-400',
    contrastText: '#ffffff',
    description: 'Creative royal amethyst and deep purple',
  },
  {
    id: 'rose',
    name: 'Rose Fuchsia',
    hex: '#f472b6',
    activeRing: 'ring-rose-400',
    contrastText: '#ffffff',
    description: 'Vibrant neon rose and magenta tones',
  },
  {
    id: 'coral',
    name: 'Flame Coral',
    hex: '#fb923c',
    activeRing: 'ring-orange-400',
    contrastText: '#0a0a0a',
    description: 'Energetic burning flame coral & tangerine (Studio Default)',
  },
  {
    id: 'blue',
    name: 'Sapphire Blue',
    hex: '#60a5fa',
    activeRing: 'ring-blue-400',
    contrastText: '#ffffff',
    description: 'Professional sapphire and tech blue',
  },
  {
    id: 'slate',
    name: 'Monochrome Slate',
    hex: '#94a3b8',
    activeRing: 'ring-slate-400',
    contrastText: '#ffffff',
    description: 'Understated minimalist silver slate',
  },
];

export const THEME_STORAGE_KEY = 'reverse_prompt_theme_settings_v2';

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mode: 'dark',
  darkVariant: 'espresso',
  lightVariant: 'slate',
  accent: 'coral',
};

// Color palettes for dark variants
const DARK_PALETTES: Record<
  DarkVariant,
  {
    n950: string; // body background
    n900: string; // surface / cards
    n800: string; // secondary surface / buttons
    n700: string; // borders
    n600: string; // active borders
    n500: string; // dim labels / placeholders
    n400: string; // secondary text
    n300: string; // body text
    n200: string; // bright body
    n100: string; // high contrast
    white: string;
    black: string;
  }
> = {
  oled: {
    n950: '#000000',
    n900: '#0a0a0a',
    n800: '#161616',
    n700: '#262626',
    n600: '#404040',
    n500: '#737373',
    n400: '#a3a3a3',
    n300: '#d4d4d4',
    n200: '#e5e5e5',
    n100: '#f5f5f5',
    white: '#ffffff',
    black: '#000000',
  },
  zinc: {
    n950: '#09090b',
    n900: '#121215',
    n800: '#1e1e24',
    n700: '#2d2d34',
    n600: '#52525b',
    n500: '#71717a',
    n400: '#a1a1aa',
    n300: '#d4d4d8',
    n200: '#e4e4e7',
    n100: '#f4f4f5',
    white: '#ffffff',
    black: '#000000',
  },
  midnight: {
    n950: '#060913',
    n900: '#0f172a',
    n800: '#1e293b',
    n700: '#334155',
    n600: '#475569',
    n500: '#64748b',
    n400: '#94a3b8',
    n300: '#cbd5e1',
    n200: '#e2e8f0',
    n100: '#f1f5f9',
    white: '#ffffff',
    black: '#000000',
  },
  espresso: {
    n950: '#0c0a09',
    n900: '#1c1917',
    n800: '#292524',
    n700: '#44403c',
    n600: '#57534e',
    n500: '#78716c',
    n400: '#a8a29e',
    n300: '#d6d3d1',
    n200: '#e7e5e4',
    n100: '#f5f5f4',
    white: '#ffffff',
    black: '#000000',
  },
  charcoal: {
    n950: '#121212',
    n900: '#1a1a1a',
    n800: '#262626',
    n700: '#383838',
    n600: '#555555',
    n500: '#777777',
    n400: '#aaaaaa',
    n300: '#cccccc',
    n200: '#e0e0e0',
    n100: '#f0f0f0',
    white: '#ffffff',
    black: '#000000',
  },
};

// Color palettes for light variants
const LIGHT_PALETTES: Record<
  LightVariant,
  {
    n950: string; // body background in light mode
    n900: string; // surface cards in light mode
    n800: string; // secondary chip/buttons in light mode
    n700: string; // borders in light mode
    n600: string; // active borders in light mode
    n500: string; // dim placeholders
    n400: string; // secondary text
    n300: string; // body text
    n200: string; // primary text
    n100: string; // title text
    white: string; // headings in light mode -> deep contrast
    black: string;
  }
> = {
  snow: {
    n950: '#ffffff',
    n900: '#f8fafc',
    n800: '#f1f5f9',
    n700: '#e2e8f0',
    n600: '#cbd5e1',
    n500: '#94a3b8',
    n400: '#64748b',
    n300: '#334155',
    n200: '#1e293b',
    n100: '#0f172a',
    white: '#0f172a',
    black: '#000000',
  },
  alabaster: {
    n950: '#fcfbf9',
    n900: '#f6f4ee',
    n800: '#ede8dd',
    n700: '#ded8cc',
    n600: '#c7bfb1',
    n500: '#8c8273',
    n400: '#5e564a',
    n300: '#383229',
    n200: '#211d17',
    n100: '#120f0c',
    white: '#120f0c',
    black: '#000000',
  },
  slate: {
    n950: '#f1f5f9',
    n900: '#ffffff',
    n800: '#e2e8f0',
    n700: '#cbd5e1',
    n600: '#94a3b8',
    n500: '#64748b',
    n400: '#475569',
    n300: '#334155',
    n200: '#1e293b',
    n100: '#0f172a',
    white: '#0f172a',
    black: '#000000',
  },
  sand: {
    n950: '#faf6ed',
    n900: '#ffffff',
    n800: '#f0e9dc',
    n700: '#dfd6c5',
    n600: '#bfae95',
    n500: '#8c7b64',
    n400: '#5c4e3a',
    n300: '#3b3020',
    n200: '#241d13',
    n100: '#140f09',
    white: '#140f09',
    black: '#000000',
  },
  zinc: {
    n950: '#f4f4f5',
    n900: '#ffffff',
    n800: '#e4e4e7',
    n700: '#d4d4d8',
    n600: '#a1a1aa',
    n500: '#71717a',
    n400: '#52525b',
    n300: '#3f3f46',
    n200: '#27272a',
    n100: '#18181b',
    white: '#18181b',
    black: '#000000',
  },
};

// Accent color palettes
const ACCENT_PALETTES: Record<
  AccentColor,
  {
    a200: string;
    a300: string;
    a400: string;
    a500: string;
    a600: string;
    a700: string;
    a950: string;
    contrast: string;
    glow: string;
  }
> = {
  amber: {
    a200: '#fde68a',
    a300: '#fcd34d',
    a400: '#fbbf24',
    a500: '#f59e0b',
    a600: '#d97706',
    a700: '#b45309',
    a950: '#451a03',
    contrast: '#0a0a0a',
    glow: 'rgba(251, 191, 36, 0.25)',
  },
  emerald: {
    a200: '#a7f3d0',
    a300: '#6ee7b7',
    a400: '#34d399',
    a500: '#10b981',
    a600: '#059669',
    a700: '#047857',
    a950: '#022c22',
    contrast: '#022c22',
    glow: 'rgba(52, 211, 153, 0.25)',
  },
  cyan: {
    a200: '#a5f3fc',
    a300: '#67e8f9',
    a400: '#22d3ee',
    a500: '#06b6d4',
    a600: '#0891b2',
    a700: '#0e7490',
    a950: '#083344',
    contrast: '#083344',
    glow: 'rgba(34, 211, 238, 0.25)',
  },
  violet: {
    a200: '#ddd6fe',
    a300: '#c4b5fd',
    a400: '#a78bfa',
    a500: '#8b5cf6',
    a600: '#7c3aed',
    a700: '#6d28d9',
    a950: '#2e1065',
    contrast: '#ffffff',
    glow: 'rgba(167, 139, 250, 0.25)',
  },
  rose: {
    a200: '#fbcfe8',
    a300: '#f9a8d4',
    a400: '#f472b6',
    a500: '#ec4899',
    a600: '#db2777',
    a700: '#be185d',
    a950: '#500724',
    contrast: '#ffffff',
    glow: 'rgba(244, 114, 182, 0.25)',
  },
  coral: {
    a200: '#fed7aa',
    a300: '#fdba74',
    a400: '#fb923c',
    a500: '#f97316',
    a600: '#ea580c',
    a700: '#c2410c',
    a950: '#431407',
    contrast: '#0a0a0a',
    glow: 'rgba(251, 146, 60, 0.25)',
  },
  blue: {
    a200: '#bfdbfe',
    a300: '#93c5fd',
    a400: '#60a5fa',
    a500: '#3b82f6',
    a600: '#2563eb',
    a700: '#1d4ed8',
    a950: '#172554',
    contrast: '#ffffff',
    glow: 'rgba(96, 165, 250, 0.25)',
  },
  slate: {
    a200: '#e2e8f0',
    a300: '#cbd5e1',
    a400: '#94a3b8',
    a500: '#64748b',
    a600: '#475569',
    a700: '#334155',
    a950: '#0f172a',
    contrast: '#ffffff',
    glow: 'rgba(148, 163, 184, 0.25)',
  },
};

/**
 * Applies the given ThemeConfig to the document root dynamically.
 */
export function applyTheme(config: ThemeConfig): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const isDark = config.mode === 'dark';

  // Set dataset attributes
  root.setAttribute('data-theme', config.mode);
  root.setAttribute('data-dark-variant', config.darkVariant);
  root.setAttribute('data-light-variant', config.lightVariant);
  root.setAttribute('data-accent', config.accent);

  // Toggle dark/light class
  if (isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }

  // Get background neutrals
  const neutrals = isDark
    ? DARK_PALETTES[config.darkVariant] || DARK_PALETTES.zinc
    : LIGHT_PALETTES[config.lightVariant] || LIGHT_PALETTES.slate;

  // Set Tailwind variables for neutrals
  root.style.setProperty('--color-neutral-950', neutrals.n950);
  root.style.setProperty('--color-neutral-900', neutrals.n900);
  root.style.setProperty('--color-neutral-800', neutrals.n800);
  root.style.setProperty('--color-neutral-700', neutrals.n700);
  root.style.setProperty('--color-neutral-600', neutrals.n600);
  root.style.setProperty('--color-neutral-500', neutrals.n500);
  root.style.setProperty('--color-neutral-400', neutrals.n400);
  root.style.setProperty('--color-neutral-300', neutrals.n300);
  root.style.setProperty('--color-neutral-200', neutrals.n200);
  root.style.setProperty('--color-neutral-100', neutrals.n100);
  root.style.setProperty('--color-white', neutrals.white);
  root.style.setProperty('--color-black', neutrals.black);

  // Get accent palette
  const accent = ACCENT_PALETTES[config.accent] || ACCENT_PALETTES.amber;

  // Set Tailwind variables for amber (which the UI uses for accent)
  root.style.setProperty('--color-amber-200', accent.a200);
  root.style.setProperty('--color-amber-300', accent.a300);
  root.style.setProperty('--color-amber-400', accent.a400);
  root.style.setProperty('--color-amber-500', accent.a500);
  root.style.setProperty('--color-amber-600', accent.a600);
  root.style.setProperty('--color-amber-700', accent.a700);
  root.style.setProperty('--color-amber-950', accent.a950);

  // Generic custom semantic tokens
  root.style.setProperty('--theme-bg-app', neutrals.n950);
  root.style.setProperty('--theme-bg-surface', neutrals.n900);
  root.style.setProperty('--theme-bg-subtle', neutrals.n800);
  root.style.setProperty('--theme-border', neutrals.n700);
  root.style.setProperty('--theme-text-main', neutrals.white);
  root.style.setProperty('--theme-text-muted', neutrals.n400);
  root.style.setProperty('--theme-accent', accent.a400);
  root.style.setProperty('--theme-accent-hover', accent.a300);
  root.style.setProperty('--theme-accent-contrast', accent.contrast);
  root.style.setProperty('--theme-accent-glow', accent.glow);
}

/**
 * Loads the saved theme config from localStorage or defaults.
 */
export function loadSavedTheme(): ThemeConfig {
  if (typeof window === 'undefined') return DEFAULT_THEME_CONFIG;

  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        mode: parsed.mode === 'light' ? 'light' : 'dark',
        darkVariant: DARK_VARIANTS.some((v) => v.id === parsed.darkVariant)
          ? parsed.darkVariant
          : 'espresso',
        lightVariant: LIGHT_VARIANTS.some((v) => v.id === parsed.lightVariant)
          ? parsed.lightVariant
          : 'slate',
        accent: ACCENT_COLORS.some((a) => a.id === parsed.accent)
          ? parsed.accent
          : 'coral',
      };
    }
  } catch (err) {
    console.warn('Failed to load saved theme configuration:', err);
  }
  return DEFAULT_THEME_CONFIG;
}

/**
 * Saves the theme config to localStorage.
 */
export function saveTheme(config: ThemeConfig): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.warn('Failed to save theme configuration to localStorage:', err);
  }
}
