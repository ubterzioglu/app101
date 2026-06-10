import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@/theme';
import { AppButton } from './AppButton';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

// Never shows raw technical error objects (UX §17). Friendly Turkish copy only.
export function ErrorState({
  title = 'Bir şeyler ters gitti',
  message = 'İçerik yüklenemedi. Lütfen tekrar deneyin.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <View style={styles.action}>
          <AppButton label="Tekrar dene" onPress={onRetry} variant="primary" fullWidth={false} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  icon: { fontSize: 40, marginBottom: spacing.xs },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.gray900,
    textAlign: 'center',
  },
  message: { fontSize: fontSize.sm, color: colors.gray500, textAlign: 'center' },
  action: { marginTop: spacing.md },
});
