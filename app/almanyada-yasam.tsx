import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, AppCard, EmptyState, ErrorState, LoadingCard } from '@/components/ui';
import { useStaticContent } from '@/features/content/hooks';
import { colors, fontSize, fontWeight, lineHeight, spacing } from '@/theme';

const LIFE_TOPICS = [
  {
    key: 'residence',
    icon: '📋',
    title: 'İkamet',
    items: [
      'Adres kaydı ve Meldebescheinigung süreçleri',
      'Ulusal vize, süreli oturum ve eAT temel akışı',
      'Süresiz oturum ve vatandaşlık hedefi için belge hazırlığı',
    ],
  },
  {
    key: 'health',
    icon: '🏥',
    title: 'Sağlık',
    items: [
      'Sağlık sigortası kartı ve ilk kayıt adımları',
      'Aile sigortası ve resmi belge ihtiyaçları',
      'Doktor, eczane ve sigorta evraklarında temel hazırlık',
    ],
  },
  {
    key: 'language',
    icon: '🗣️',
    title: 'Dil',
    items: [
      'Entegrasyon kursu ve B1 kanıtı hazırlığı',
      'Sınav sertifikalarının oturum ve vatandaşlıktaki rolü',
      'Dil öğrenimi için rehber ve topluluk kanallarından destek',
    ],
  },
] as const;

export default function LifeInGermanyScreen() {
  const router = useRouter();
  const { data: topics, isLoading, isError, reload } = useStaticContent(() => LIFE_TOPICS, []);
  const topicList = topics ?? [];

  if (isLoading) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Almanya'da Yaşam" showBack />
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
        <AppHeader title="Almanya'da Yaşam" showBack />
        <ErrorState message="Yaşam rehberi yüklenemedi." onRetry={reload} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Almanya'da Yaşam" showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppCard variant="elevated" glow accentColor={colors.accent}>
          <Text style={styles.title}>Almanya’da yaşam için başlangıç rehberi</Text>
          <Text style={styles.text}>
            Bu ekran, tam makale sistemi kurmadan önce en kritik yaşam başlıklarını mobilde
            özetler ve sizi ilgili rehber yüzeylerine yönlendirir.
          </Text>
        </AppCard>

        {topicList.length === 0 ? (
          <EmptyState title="Rehber bulunamadı" message="Daha sonra tekrar deneyin." icon="🏙️" />
        ) : (
          <View style={styles.topicList}>
            {topicList.map((topic) => (
              <AppCard key={topic.key}>
                <Text style={styles.topicIcon}>{topic.icon}</Text>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                {topic.items.map((item) => (
                  <Text key={`${topic.key}-${item}`} style={styles.topicItem}>
                    • {item}
                  </Text>
                ))}
              </AppCard>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <AppButton label="Rehbere Git" variant="primary" onPress={() => router.push('/(tabs)/rehber')} />
          <AppButton label="Haberleri Aç" variant="secondary" onPress={() => router.push('/(tabs)/haberler')} />
          <AppButton label="Araçlar Sekmesi" variant="outline" onPress={() => router.push('/(tabs)/araclar')} />
        </View>
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
  topicList: { gap: spacing.md },
  topicIcon: { fontSize: 28, marginBottom: spacing.sm },
  topicTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  topicItem: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.relaxed,
    marginTop: spacing.xs,
  },
  actions: { gap: spacing.sm },
});
