import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

type ChipVariant = 'yellow' | 'green' | 'blue' | 'neutral';

interface ModernChipProps {
  label: string;
  icon?: string;
  active?: boolean;
  onPress?: () => void;
  variant?: ChipVariant;
}

const VARIANT_ACTIVE: Record<ChipVariant, { bg: string; text: string }> = {
  yellow: { bg: colors.accent, text: colors.textInverse },
  green: { bg: colors.greenAccent, text: colors.textInverse },
  blue: { bg: colors.blueAccent, text: colors.textInverse },
  neutral: { bg: colors.surface4, text: colors.textPrimary },
};

export function ModernChip({
  label,
  icon,
  active = false,
  onPress,
  variant = 'yellow',
}: ModernChipProps) {
  const activeColors = VARIANT_ACTIVE[variant];

  const content = (
    <>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text
        style={[styles.label, active ? { color: activeColors.text } : styles.labelInactive]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </>
  );

  const baseStyle: ViewStyle = active
    ? { backgroundColor: activeColors.bg, borderColor: activeColors.bg }
    : styles.inactive;

  if (!onPress) {
    return <View style={[styles.chip, baseStyle]}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, baseStyle, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  inactive: {
    backgroundColor: colors.surface2,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.8,
  },
  icon: {
    fontSize: fontSize.sm,
    marginRight: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  labelInactive: {
    color: colors.textSecondary,
  },
});
