import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, AppCard, EmptyState, ErrorState, LoadingCard } from '@/components/ui';
import { CONTACT_CHANNELS } from '@/constants/contact-channels';
import { EXTERNAL_LINKS } from '@/constants/external-links';
import { getVisibleContactChannels } from '@/features/contact/helpers';
import { useStaticContent } from '@/features/content/hooks';
import { colors, fontSize, fontWeight, lineHeight, spacing } from '@/theme';
import { openDialer, openEmail, openExternalUrl } from '@/lib/urls';

export default function ContactScreen() {
  const { data: channels, isLoading, isError, reload } = useStaticContent(
    () => getVisibleContactChannels(CONTACT_CHANNELS),
    []
  );
  const visibleChannels = channels ?? [];

  const handleChannelPress = (channelId: string) => {
    const channel = visibleChannels.find((item) => item.id === channelId);
    if (!channel) return;

    if (channel.kind === 'external') {
      void openExternalUrl(channel.value);
      return;
    }

    if (channel.kind === 'phone') {
      void openDialer(channel.value);
      return;
    }

    void openEmail(channel.value);
  };

  if (isLoading) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="İletişim" showBack />
        <View style={styles.loading}>
          <LoadingCard showImage={false} lines={3} />
          <LoadingCard showImage={false} lines={3} />
        </View>
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="İletişim" showBack />
        <ErrorState message="İletişim kanalları yüklenemedi." onRetry={reload} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="İletişim" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          Görüş, öneri, veri talebi ve topluluk katkıları için aşağıdaki güvenli iletişim
          kanallarını kullanabilirsiniz.
        </Text>
        {visibleChannels.length === 0 ? (
          <EmptyState
            title="Geçerli iletişim kanalı yok"
            message="Daha sonra tekrar deneyin."
            icon="✉️"
          />
        ) : (
          <View style={styles.channelList}>
            {visibleChannels.map((channel) => (
              <AppCard
                key={channel.id}
                style={styles.channelCard}
                accentColor={channel.accentColor}
                accessibilityLabel={channel.label}
                onPress={() => handleChannelPress(channel.id)}
              >
                <Text style={styles.channelIcon}>{channel.icon}</Text>
                <View style={styles.channelBody}>
                  <Text style={styles.channelLabel}>{channel.label}</Text>
                  <Text style={styles.channelDescription}>{channel.description}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </AppCard>
            ))}
          </View>
        )}
        <AppButton label="Web İletişim Sayfasını Aç" variant="outline" onPress={() => openExternalUrl(EXTERNAL_LINKS.contact)} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  loading: { padding: spacing.lg },
  paragraph: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: fontSize.md * lineHeight.relaxed,
  },
  channelList: { gap: spacing.sm },
  channelCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  channelIcon: { fontSize: 24, marginRight: spacing.md },
  channelBody: { flex: 1 },
  channelLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  channelDescription: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  chevron: { fontSize: fontSize.xl, color: colors.textMuted },
});
