import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error' | 'muted';

interface InfoBadgeProps {
  label: string;
  icon?: string;
  variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  default: { bg: colors.surface3, text: colors.textSecondary, border: colors.border },
  accent: { bg: colors.accentSoft, text: colors.accent, border: colors.borderStrong },
  success: { bg: 'rgba(52, 211, 153, 0.14)', text: colors.greenAccent, border: 'rgba(52, 211, 153, 0.35)' },
  warning: { bg: colors.accentSoft, text: colors.accent, border: colors.borderStrong },
  error: { bg: 'rgba(248, 113, 113, 0.14)', text: colors.redAccent, border: 'rgba(248, 113, 113, 0.35)' },
  muted: { bg: colors.surface2, text: colors.textMuted, border: colors.border },
};

export function InfoBadge({ label, icon, variant = 'default' }: InfoBadgeProps) {
  const v = VARIANT_STYLES[variant];
  return (
    <View style={[styles.badge, { backgroundColor: v.bg, borderColor: v.border }]}>
      {icon ? <Text style={[styles.icon, { color: v.text }]}>{icon}</Text> : null}
      <Text style={[styles.label, { color: v.text }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  icon: {
    fontSize: fontSize.xs,
    marginRight: spacing.xs,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
});
