import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius, shadow, spacing } from '@/theme';

type AppCardVariant = 'default' | 'elevated' | 'glass';

interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  accentColor?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
  /** Visual treatment. Defaults to a subtle elevated card. */
  variant?: AppCardVariant;
  /** Adds a soft yellow glow behind the card for premium accent surfaces. */
  glow?: boolean;
}

export function AppCard({
  children,
  onPress,
  accentColor,
  style,
  accessibilityLabel,
  variant = 'default',
  glow = false,
}: AppCardProps) {
  const cardStyle: ViewStyle[] = [
    styles.card,
    variant === 'elevated' && styles.elevated,
    variant === 'glass' && styles.glass,
    glow && styles.glow,
    accentColor ? { borderColor: accentColor, borderWidth: 1.5 } : styles.defaultBorder,
    style,
  ].filter(Boolean) as ViewStyle[];

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [...cardStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={cardStyle} accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.sm,
  },
  elevated: {
    backgroundColor: colors.surfaceElevated,
    ...shadow.md,
  },
  glass: {
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  glow: {
    ...shadow.glow,
  },
  defaultBorder: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
});
