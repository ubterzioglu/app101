// Shared spacing, radius and typography tokens for the mobile design system.

import type { ViewStyle } from 'react-native';

import { colors } from './colors';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.45,
  relaxed: 1.6,
} as const;

// Icon sizing scale for emoji / glyph containers.
export const iconSize = {
  sm: 18,
  md: 24,
  lg: 32,
  xl: 44,
} as const;

// Default inner padding for cards across the app.
export const cardPadding = spacing.lg;

// Elevation / shadow presets (Android uses `elevation`, iOS uses shadow*).
export const shadow = {
  none: {
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  } as ViewStyle,
  sm: {
    shadowColor: colors.shadowColor,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  } as ViewStyle,
  md: {
    shadowColor: colors.shadowColor,
    shadowOpacity: 0.32,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  } as ViewStyle,
  lg: {
    shadowColor: colors.shadowColor,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  } as ViewStyle,
  // Warm yellow glow used for hero / accent surfaces.
  glow: {
    shadowColor: colors.yellow,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  } as ViewStyle,
} as const;

// Minimum touch target for accessibility (Android Material guidance).
export const MIN_TOUCH_TARGET = 48;

export const MAX_CONTENT_WIDTH = 720;
