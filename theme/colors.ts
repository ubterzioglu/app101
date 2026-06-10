// Google color palette — preserved from the web app (almanya101).

export const colors = {
  blue: '#4285F4',
  red: '#EA4335',
  yellow: '#FBBC05',
  green: '#34A853',
  orange: '#FF9500',
  black: '#000000',
  white: '#FFFFFF',

  // Neutral gray scale (aligned with the web app's tokens).
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Semantic
  background: '#000000',
  surface: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
} as const;

export type ColorToken = keyof typeof colors;
