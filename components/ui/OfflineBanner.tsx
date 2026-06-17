import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@/theme';
import { useNetwork } from '@/providers/NetworkProvider';

export function OfflineBanner() {
  const { isOnline } = useNetwork();
  if (isOnline) return null;

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <View style={styles.dot} />
      <Text style={styles.text}>İnternet bağlantısı yok — kayıtlı içerik gösteriliyor.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderStrong,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginRight: spacing.sm,
  },
  text: {
    color: colors.accent,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
});
