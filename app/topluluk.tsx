import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, AppCard, EmptyState, ErrorState, LoadingCard } from '@/components/ui';
import { CONTACT_CHANNELS } from '@/constants/contact-channels';
import { getContactChannelTarget } from '@/features/contact/helpers';
import { useStaticContent } from '@/features/content/hooks';
import { openExternalUrl } from '@/lib/urls';
import { colors, fontSize, fontWeight, lineHeight, spacing } from '@/theme';

const COMMUNITY_FEATURES = [
  {
    key: 'qa',
    icon: '❓',
    title: 'Sorularını Sor',
    description:
      'Almanya yaşamı, evrak süreçleri ve günlük ihtiyaçlar hakkında topluluğa soru sor.',
  },
  {
    key: 'share',
    icon: '💬',
    title: 'Deneyimini Paylaş',
    description:
      'Yeni gelenlere destek olacak deneyimlerini ve pratik önerilerini toplulukla paylaş.',
  },
  {
    key: 'network',
    icon: '🤝',
    title: 'Bağlantı Kur',
    description:
      'Benzer süreçlerden geçen kişilerle bağlantı kurarak güçlü bir destek ağı oluştur.',
  },
  {
    key: 'events',
    icon: '🎉',
    title: 'Güncel Kal',
    description:
      'WhatsApp ve Telegram grupları üzerinden topluluk hareketlerinden haberdar ol.',
  },
] as const;

export default function CommunityScreen() {
  const router = useRouter();
  const { data: features, isLoading, isError, reload } = useStaticContent(
    () => COMMUNITY_FEATURES,
    []
  );
  const featureList = features ?? [];
  const whatsapp = CONTACT_CHANNELS.find((item) => item.id === 'whatsapp');
  const telegram = CONTACT_CHANNELS.find((item) => item.id === 'telegram');
  const whatsappTarget = whatsapp ? getContactChannelTarget(whatsapp) : null;
  const telegramTarget = telegram ? getContactChannelTarget(telegram) : null;

  if (isLoading) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Topluluk" showBack />
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
        <AppHeader title="Topluluk" showBack />
        <ErrorState message="Topluluk bilgileri yüklenemedi." onRetry={reload} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Topluluk" showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppCard accentColor={colors.success}>
          <Text style={styles.heroTitle}>Topluluğumuza Katılın</Text>
          <Text style={styles.heroText}>
            Almanya'da yaşayan Türklerle bağlantı kurun, deneyim paylaşın ve güvenilir iletişim
            kanallarından bize ulaşın.
          </Text>
        </AppCard>

        {featureList.length === 0 ? (
          <EmptyState
            title="Topluluk bilgisi bulunamadı"
            message="Daha sonra tekrar deneyin."
            icon="🤝"
          />
        ) : (
          <View style={styles.featureList}>
            {featureList.map((feature) => (
              <AppCard key={feature.key}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureText}>{feature.description}</Text>
              </AppCard>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <AppButton
            label="WhatsApp Grubunu Aç"
            variant="primary"
            disabled={!whatsappTarget}
            onPress={() => {
              if (!whatsappTarget) return;
              void openExternalUrl(whatsappTarget);
            }}
          />
          <AppButton
            label="Telegram Kanalını Aç"
            variant="secondary"
            disabled={!telegramTarget}
            onPress={() => {
              if (!telegramTarget) return;
              void openExternalUrl(telegramTarget);
            }}
          />
          <AppButton
            label="İletişim Ekranına Git"
            variant="outline"
            onPress={() => router.push('/iletisim')}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  loading: { padding: spacing.lg },
  heroTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  heroText: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.relaxed,
  },
  featureList: { gap: spacing.md },
  featureIcon: { fontSize: 28, marginBottom: spacing.sm },
  featureTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  featureText: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.relaxed,
  },
  actions: { gap: spacing.sm },
});
