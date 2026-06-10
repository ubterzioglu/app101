import { ScrollView, StyleSheet, Text } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton } from '@/components/ui';
import { openExternalUrl } from '@/lib/urls';
import { colors, fontSize, fontWeight, lineHeight, spacing } from '@/theme';

export default function PrivacyScreen() {
  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Gizlilik Politikası" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          Bu uygulama, içerik göstermek için yalnızca herkese açık verileri okur. Hizmet önerisi
          veya kırık bağlantı bildirimi gönderdiğinizde, girdiğiniz bilgiler değerlendirme için
          almanya101 sunucularına iletilir.
        </Text>
        <Text style={styles.paragraph}>
          İlk sürümde kişisel hesap, kullanıcı takibi veya reklam amaçlı analytics
          bulunmamaktadır. Ayrıntılı gizlilik politikası web sitemizde yer alır.
        </Text>
        <AppButton
          label="Tam Gizlilik Politikası"
          variant="outline"
          onPress={() => openExternalUrl('https://almanya101.de/gizlilik')}
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
