import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { colors, fontSize, fontWeight, shadow, spacing, MIN_TOUCH_TARGET } from '@/theme';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  rightSlot?: React.ReactNode;
  subtitle?: string;
}

export function AppHeader({ title, showBack = false, rightSlot, subtitle }: AppHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={() => router.back()}
            hitSlop={8}
            style={({ pressed }) => [styles.backButton, pressed && styles.backPressed]}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface1,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadow.sm,
  },
  side: { width: MIN_TOUCH_TARGET, alignItems: 'flex-start', justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  backButton: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    borderRadius: MIN_TOUCH_TARGET / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
  },
  backPressed: { opacity: 0.7, backgroundColor: colors.surface3 },
  backText: { fontSize: 30, color: colors.accent, lineHeight: 32, marginTop: -2 },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  title: {
    textAlign: 'center',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
