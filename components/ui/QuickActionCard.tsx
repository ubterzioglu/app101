import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, radius, shadow, spacing } from '@/theme';

interface QuickActionCardProps {
  icon: string;
  title: string;
  subtitle?: string;
  accentColor?: string;
  onPress: () => void;
}

export function QuickActionCard({
  icon,
  title,
  subtitle,
  accentColor = colors.accent,
  onPress,
}: QuickActionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, { backgroundColor: hexToSoft(accentColor) }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      ) : null}
      <View style={[styles.accentDot, { backgroundColor: accentColor }]} />
    </Pressable>
  );
}

// Turns a solid hex accent into a low-opacity background tint for the icon
// chip. Falls back to the shared accentSoft token for non-hex inputs.
function hexToSoft(color: string): string {
  if (color.startsWith('#') && (color.length === 7 || color.length === 4)) {
    const full =
      color.length === 4
        ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
        : color;
    const r = parseInt(full.slice(1, 3), 16);
    const g = parseInt(full.slice(3, 5), 16);
    const b = parseInt(full.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.16)`;
  }
  return colors.accentSoft;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 140,
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    justifyContent: 'flex-start',
    ...shadow.sm,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: fontSize.xs * 1.4,
  },
  accentDot: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
