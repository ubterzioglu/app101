import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, AppCard, EmptyState, ErrorState, LoadingCard } from '@/components/ui';
import { CONTACT_CHANNELS } from '@/constants/contact-channels';
import { getContactChannelTarget } from '@/features/contact/helpers';
import { useStaticContent } from '@/features/content/hooks';
import { openEmail, openExternalUrl } from '@/lib/urls';
import { colors, fontSize, fontWeight, lineHeight, spacing } from '@/theme';

const JOIN_AREAS = [
  {
    key: 'content',
    icon: '✍️',
    title: 'İçerik Üretimi',
    description: 'Rehber, belge, yaşam deneyimi ve haber özetleri konusunda katkı sunabilirsiniz.',
  },
  {
    key: 'technical',
    icon: '🛠️',
    title: 'Teknik Geliştirme',
    description: 'Mobil uygulama, veri akışı ve kalite süreçlerinde gönüllü destek verebilirsiniz.',
  },
  {
    key: 'community',
    icon: '🌍',
    title: 'Topluluk Desteği',
    description: 'Yeni gelenlere yol göstermek ve topluluk iletişimini güçlendirmek için katılabilirsiniz.',
  },
] as const;

export default function JoinUsScreen() {
  const { data: areas, isLoading, isError, reload } = useStaticContent(() => JOIN_AREAS, []);
  const areaList = areas ?? [];
  const whatsapp = CONTACT_CHANNELS.find((item) => item.id === 'whatsapp');
  const instagram = CONTACT_CHANNELS.find((item) => item.id === 'instagram');
  const telegram = CONTACT_CHANNELS.find((item) => item.id === 'telegram');
  const whatsappTarget = whatsapp ? getContactChannelTarget(whatsapp) : null;
  const instagramTarget = instagram ? getContactChannelTarget(instagram) : null;
  const telegramTarget = telegram ? getContactChannelTarget(telegram) : null;

  if (isLoading) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Ekibimize Katıl" showBack />
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
        <AppHeader title="Ekibimize Katıl" showBack />
        <ErrorState message="Katılım bilgileri yüklenemedi." onRetry={reload} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Ekibimize Katıl" showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppCard accentColor={colors.warning}>
          <Text style={styles.title}>almanya101 ekibine katkı sunun</Text>
          <Text style={styles.text}>
            İçerik, teknik geliştirme veya topluluk desteği alanlarında gönüllü katkı vermek
            istiyorsanız aşağıdaki kanallardan bize ulaşabilirsiniz.
          </Text>
        </AppCard>

        {areaList.length === 0 ? (
          <EmptyState title="Katkı alanı bulunamadı" message="Daha sonra tekrar deneyin." icon="🚀" />
        ) : (
          <View style={styles.areaList}>
            {areaList.map((area) => (
              <AppCard key={area.key}>
                <Text style={styles.areaIcon}>{area.icon}</Text>
                <Text style={styles.areaTitle}>{area.title}</Text>
                <Text style={styles.areaText}>{area.description}</Text>
              </AppCard>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <AppButton label="E-Posta Gönder" variant="primary" onPress={() => openEmail('info@almanya101.de')} />
          <AppButton
            label="WhatsApp ile Yaz"
            variant="secondary"
            disabled={!whatsappTarget}
            onPress={() => {
              if (!whatsappTarget) return;
              void openExternalUrl(whatsappTarget);
            }}
          />
          <AppButton
            label="Instagram Aç"
            variant="outline"
            disabled={!instagramTarget}
            onPress={() => {
              if (!instagramTarget) return;
              void openExternalUrl(instagramTarget);
            }}
          />
          <AppButton
            label="Telegram Aç"
            variant="outline"
            disabled={!telegramTarget}
            onPress={() => {
              if (!telegramTarget) return;
              void openExternalUrl(telegramTarget);
            }}
          />
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
  areaList: { gap: spacing.md },
  areaIcon: { fontSize: 28, marginBottom: spacing.sm },
  areaTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  areaText: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.relaxed,
  },
  actions: { gap: spacing.sm },
});
