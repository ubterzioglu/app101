import { ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, EmptyState } from '@/components/ui';
import { buildWebsiteUrl } from '@/constants/external-links';
import { openExternalUrl } from '@/lib/urls';
import { spacing } from '@/theme';

// Full document list + detail screens are P1 (plan §3.3). MVP links to the web
// document hub so users still have access.
export default function DocumentsScreen() {
  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Yararlı Belgeler" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <EmptyState
          title="Belgeler web sitesinde"
          message="Yararlı belgelerin tam listesi yakında uygulamaya eklenecek. Şimdilik web sitesinden erişebilirsiniz."
          icon="📄"
        />
        <View style={styles.action}>
          <AppButton
            label="Belgeler Sayfasını Aç"
            variant="primary"
            onPress={() => openExternalUrl(buildWebsiteUrl('/belgeler'))}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  action: { marginTop: spacing.lg },
});
