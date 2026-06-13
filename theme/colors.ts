export const colors = {
  // Brand palette — yellow / black / white dark theme
  yellow: '#F5C518',
  yellowLight: '#FFD740',
  yellowDim: '#C49A10',

  black: '#000000',
  white: '#FFFFFF',

  // Dark surface scale
  surface0: '#000000',  // page background
  surface1: '#111111',  // card / panel
  surface2: '#1A1A1A',  // elevated card
  surface3: '#242424',  // input background
  surface4: '#2E2E2E',  // hover / pressed

  // Border scale
  border: '#2E2E2E',
  borderStrong: '#444444',

  // Text scale
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textMuted: '#666666',
  textInverse: '#000000',

  // Semantic
  background: '#000000',
  surface: '#111111',
  accent: '#F5C518',
  accentPressed: '#C49A10',

  // Status
  error: '#FF4444',
  success: '#00C851',
  warning: '#F5C518',
} as const;

export type ColorToken = keyof typeof colors;
