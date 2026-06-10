import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@/theme';
import { useNetwork } from '@/providers/NetworkProvider';

export function OfflineBanner() {
  const { isOnline } = useNetwork();
  if (isOnline) return null;

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>İnternet bağlantısı yok — kayıtlı içerik gösteriliyor.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.orange,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  text: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
});
