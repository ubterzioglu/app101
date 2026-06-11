import { ScrollView, StyleSheet, Text } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton } from '@/components/ui';
import { EXTERNAL_LINKS } from '@/constants/external-links';
import { openExternalUrl } from '@/lib/urls';
import { colors, fontSize, fontWeight, lineHeight, spacing } from '@/theme';

export default function AboutScreen() {
  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Hakkımızda" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>almanya101</Text>
        <Text style={styles.paragraph}>
          almanya101, Almanya'da yaşayan veya taşınmayı planlayan Türk topluluğu için günlük
          hayatı kolaylaştıran araçlar ve güncel içerikler sunar. Haberler, Türkçe hizmet
          rehberi, vatandaşlık testi, maaş hesaplayıcı ve iş ilanları gibi modüllerle pratik
          bilgiye hızlı erişim sağlar.
        </Text>
        <Text style={styles.paragraph}>
          Bu mobil uygulama, web platformundaki güncel verileri ve araçları Android cihazlara
          taşır.
        </Text>
        <AppButton
          label="Web Sitesini Aç"
          variant="outline"
          onPress={() => openExternalUrl(EXTERNAL_LINKS.website)}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.gray900 },
  paragraph: {
    fontSize: fontSize.md,
    color: colors.gray700,
    lineHeight: fontSize.md * lineHeight.relaxed,
  },
});
