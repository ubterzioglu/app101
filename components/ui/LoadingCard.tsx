import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';

interface LoadingCardProps {
  lines?: number;
  showImage?: boolean;
}

// Static skeleton placeholder (no animation dependency) shown while loading.
export function LoadingCard({ lines = 3, showImage = true }: LoadingCardProps) {
  return (
    <View style={styles.card} accessibilityLabel="Yükleniyor" accessibilityRole="progressbar">
      {showImage ? <View style={styles.image} /> : null}
      {Array.from({ length: lines }).map((_, i) => (
        <View key={i} style={[styles.line, i === lines - 1 && styles.lineShort]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  image: {
    height: 140,
    borderRadius: radius.md,
    backgroundColor: colors.gray200,
    marginBottom: spacing.md,
  },
  line: {
    height: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.gray200,
    marginBottom: spacing.sm,
  },
  lineShort: {
    width: '60%',
  },
});
