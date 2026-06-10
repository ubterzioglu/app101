import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Bulunamadı' }} />
      <View style={styles.container}>
        <Text style={styles.icon}>🔍</Text>
        <Text style={styles.title}>Sayfa bulunamadı</Text>
        <Text style={styles.message}>Aradığınız içerik mevcut değil veya kaldırılmış olabilir.</Text>
        <Link href="/(tabs)" style={styles.link}>
          Ana sayfaya dön
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
    backgroundColor: colors.gray50,
  },
  icon: { fontSize: 48 },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.gray900 },
  message: { fontSize: fontSize.sm, color: colors.gray500, textAlign: 'center' },
  link: {
    marginTop: spacing.lg,
    color: colors.blue,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
