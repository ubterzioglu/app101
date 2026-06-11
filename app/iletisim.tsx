import { Linking, ScrollView, StyleSheet, Text } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton } from '@/components/ui';
import { EXTERNAL_LINKS, SUPPORT_EMAIL } from '@/constants/external-links';
import { openExternalUrl } from '@/lib/urls';
import { colors, fontSize, lineHeight, spacing } from '@/theme';

export default function ContactScreen() {
  const openSupportEmail = async () => {
    if (!SUPPORT_EMAIL) return;
    await Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
  };

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="İletişim" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          Görüş, öneri, veri talebi ve diğer sorularınız için web sitemizdeki iletişim kanallarını
          kullanabilirsiniz.
        </Text>
        <AppButton
          label="İletişim Sayfasını Aç"
          variant="primary"
          onPress={() => openExternalUrl(EXTERNAL_LINKS.contact)}
        />
        {SUPPORT_EMAIL ? (
          <AppButton label="Destek E-postası" variant="outline" onPress={openSupportEmail} />
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  paragraph: {
    fontSize: fontSize.md,
    color: colors.gray700,
    lineHeight: fontSize.md * lineHeight.relaxed,
  },
});
