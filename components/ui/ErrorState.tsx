import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';
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
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>⚠️</Text>
      </View>
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
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  icon: { fontSize: 34 },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
  },
  action: { marginTop: spacing.md },
});
