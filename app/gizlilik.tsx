import { ScrollView, StyleSheet, Text } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton } from '@/components/ui';
import { EXTERNAL_LINKS } from '@/constants/external-links';
import { openExternalUrl } from '@/lib/urls';
import { colors, fontSize, lineHeight, spacing } from '@/theme';

export default function PrivacyScreen() {
  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Gizlilik Politikası" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          Bu uygulama; haberler, rehber içeriği ve benzeri herkese açık verileri göstermek için
          public okuma akışlarını kullanır.
        </Text>
        <Text style={styles.paragraph}>
          Hizmet sağlayıcı önerisi gönderdiğinizde formda paylaştığınız bilgiler, değerlendirme
          amacıyla almanya101 sunucularına iletilir. Kırık bağlantı bildirimi gönderdiğinizde de
          bildirim içeriği aynı şekilde almanya101 sunucularına ulaşır.
        </Text>
        <Text style={styles.paragraph}>
          Bu ilk sürümde genel kullanıcı hesabı bulunmaz. Kod denetiminde reklam SDK paketi veya
          kullanıcı takibi amacıyla analytics SDK paketi görünmemektedir.
        </Text>
        <Text style={styles.paragraph}>
          Saklama süresi, IP logları veya üçüncü taraf paylaşımı gibi ayrıntılar bu mobil repo
          içinden kesin olarak doğrulanamamaktadır. Ayrıntılı politika için web gizlilik sayfasını
          inceleyebilirsiniz.
        </Text>
        <AppButton
          label="Tam Gizlilik Politikası"
          variant="outline"
          onPress={() => openExternalUrl(EXTERNAL_LINKS.privacyPolicy)}
        />
        <AppButton
          label="İletişim ve Veri Talebi"
          variant="secondary"
          onPress={() => openExternalUrl(EXTERNAL_LINKS.contact)}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  paragraph: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: fontSize.md * lineHeight.relaxed,
  },
});
