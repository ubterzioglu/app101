import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function SectionHeader({
  title,
  subtitle,
  icon,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <View style={styles.headingLine}>
            <View style={styles.accentBar} />
            {icon ? <Text style={styles.icon}>{icon}</Text> : null}
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
          </View>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {actionLabel && onActionPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            onPress={onActionPress}
            hitSlop={8}
            style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
          >
            <Text style={styles.actionText}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  titleBlock: {
    flex: 1,
  },
  headingLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accentBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginRight: spacing.sm,
  },
  icon: {
    fontSize: fontSize.lg,
    marginRight: spacing.xs,
  },
  title: {
    flexShrink: 1,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  action: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
  },
  actionPressed: {
    opacity: 0.7,
  },
  actionText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.accent,
  },
});
