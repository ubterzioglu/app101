import { ScrollView, StyleSheet, Text } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton } from '@/components/ui';
import { openExternalUrl } from '@/lib/urls';
import { colors, fontSize, fontWeight, lineHeight, spacing } from '@/theme';

export default function ContactScreen() {
  return (
    <ScreenContainer padded={false}>
      <AppHeader title="İletişim" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          Görüş, öneri ve sorularınız için web sitemizdeki iletişim kanallarını kullanabilirsiniz.
        </Text>
        <AppButton
          label="İletişim Sayfasını Aç"
          variant="primary"
          onPress={() => openExternalUrl('https://almanya101.de/iletisim')}
        />
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
