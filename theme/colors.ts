export const colors = {
  // Brand palette — yellow / black / white premium dark theme
  yellow: '#F5C518',
  yellowLight: '#FFD740',
  yellowDim: '#C49A10',
  yellowGlow: 'rgba(245, 197, 24, 0.28)',

  black: '#000000',
  white: '#FFFFFF',

  // Dark graphite surface scale — layered, not flat pure-black
  surface0: '#050505', // page background
  surface1: '#101010', // card / panel
  surface2: '#171717', // elevated card
  surface3: '#202020', // input background
  surface4: '#2A2A2A', // hover / pressed

  // Additional surface treatments
  surfaceElevated: '#1C1C1C', // highest cards / hero panels
  surfaceGlass: 'rgba(245, 197, 24, 0.05)', // subtle warm glass tint
  surfaceOverlay: 'rgba(255, 255, 255, 0.04)', // hairline highlight layer

  // Border scale
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(245, 197, 24, 0.35)',

  // Text scale
  textPrimary: '#FFFFFF',
  textSecondary: '#C9C9C9',
  textMuted: '#777777',
  textInverse: '#000000',

  // Semantic
  background: '#050505',
  surface: '#101010',
  accent: '#F5C518',
  accentPressed: '#C49A10',
  accentSoft: 'rgba(245, 197, 24, 0.14)',
  accentMuted: 'rgba(245, 197, 24, 0.08)',

  // Accent palette for category / status differentiation
  blueAccent: '#4F9CF9',
  greenAccent: '#34D399',
  redAccent: '#F87171',
  orangeAccent: '#FB923C',

  // Effects
  shadowColor: '#000000',
  overlay: 'rgba(0, 0, 0, 0.55)',

  // Status
  error: '#FF5A5A',
  success: '#34D399',
  warning: '#F5C518',
} as const;

export type ColorToken = keyof typeof colors;
