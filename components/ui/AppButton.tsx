import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing, MIN_TOUCH_TARGET } from '@/theme';

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
  primary: colors.blue,
  secondary: colors.green,
  outline: 'transparent',
  danger: colors.red,
};

const VARIANT_TEXT: Record<Variant, string> = {
  primary: colors.white,
  secondary: colors.white,
  outline: colors.blue,
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
    minHeight: MIN_TOUCH_TARGET,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outline: {
    borderWidth: 2,
    borderColor: colors.blue,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.85,
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
    fontWeight: fontWeight.semibold,
  },
});
