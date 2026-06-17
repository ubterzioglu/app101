import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppCard, EmptyState, ErrorState, LoadingCard } from '@/components/ui';
import { useStaticContent } from '@/features/content/hooks';
import { colors, fontSize, fontWeight, lineHeight, spacing } from '@/theme';

const HOLIDAY_HUB_ITEMS = [
  {
    key: 'de',
    icon: '🇩🇪',
    title: 'Tatil Planlayıcı — Almanya',
    description:
      'Eyalet seçimiyle 2026 Almanya resmi tatillerini ve izin verimliliğini hesaplayın.',
    href: '/araclar/tatil-almanya',
  },
  {
    key: 'tr',
    icon: '🇹🇷',
    title: 'Tatil Planlayıcı — Türkiye',
    description:
      '2026 Türkiye resmi tatilleriyle izin günlerinizi en verimli şekilde planlayın.',
    href: '/araclar/tatil-turkiye',
  },
] as const;

export default function HolidayHubScreen() {
  const router = useRouter();
  const { data: items, isLoading, isError, reload } = useStaticContent(() => HOLIDAY_HUB_ITEMS, []);
  const holidayItems = items ?? [];

  if (isLoading) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Tatil Planlayıcı" showBack />
        <View style={styles.loading}>
          <LoadingCard showImage={false} lines={4} />
          <LoadingCard showImage={false} lines={4} />
        </View>
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Tatil Planlayıcı" showBack />
        <ErrorState message="Tatil araçları yüklenemedi." onRetry={reload} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Tatil Planlayıcı" showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppCard variant="elevated" glow accentColor={colors.warning}>
          <Text style={styles.title}>2026 tatil planlayıcı merkezine hoş geldiniz</Text>
          <Text style={styles.text}>
            Almanya ve Türkiye tatil araçlarına tek ekrandan geçin, resmi tatilleri ve izin
            verimliliğini karşılaştırın.
          </Text>
        </AppCard>

        {holidayItems.length === 0 ? (
          <EmptyState title="Araç bulunamadı" message="Daha sonra tekrar deneyin." icon="🗓️" />
        ) : (
          <View style={styles.list}>
            {holidayItems.map((item) => (
              <AppCard
                key={item.key}
                accessibilityLabel={item.title}
                onPress={() => router.push(item.href as never)}
              >
                <Text style={styles.itemIcon}>{item.icon}</Text>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemText}>{item.description}</Text>
              </AppCard>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  loading: { padding: spacing.lg },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  text: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.relaxed,
  },
  list: { gap: spacing.md },
  itemIcon: { fontSize: 30, marginBottom: spacing.sm },
  itemTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  itemText: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.relaxed,
  },
});
