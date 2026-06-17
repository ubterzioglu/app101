import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, radius, shadow, spacing } from '@/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
}

const VARIANT_BG: Record<Variant, string> = {
  primary: colors.accent,
  secondary: colors.success,
  outline: 'transparent',
  danger: colors.error,
};

const VARIANT_TEXT: Record<Variant, string> = {
  primary: colors.textInverse,
  secondary: colors.textInverse,
  outline: colors.accent,
  danger: colors.white,
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
  accessibilityLabel,
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: VARIANT_BG[variant] },
        variant === 'primary' && !isDisabled && shadow.glow,
        variant === 'outline' && styles.outline,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator size="small" color={VARIANT_TEXT[variant]} style={styles.spinner} />
        )}
        <Text style={[styles.label, { color: VARIANT_TEXT[variant] }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginRight: spacing.sm,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.2,
  },
});
