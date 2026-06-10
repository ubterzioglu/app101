import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui';
import type { Provider } from '@/features/providers/types';
import { openDialer, openExternalUrl, toPhoneUrl, toSafeExternalUrl } from '@/lib/urls';
import { spacing } from '@/theme';

// Renders contact actions only when the underlying data is present and valid
// (plan §12.4: dialer only if phone exists, browser only for valid URLs).
export function ProviderActions({ provider }: { provider: Provider }) {
  const phoneUrl = toPhoneUrl(provider.phone);
  const websiteUrl = toSafeExternalUrl(provider.website);

  return (
    <View style={styles.actions}>
      {phoneUrl ? (
        <AppButton label="📞 Ara" variant="primary" onPress={() => openDialer(provider.phone)} />
      ) : null}
      {websiteUrl ? (
        <AppButton label="🌐 Web Sitesi" variant="secondary" onPress={() => openExternalUrl(provider.website)} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { gap: spacing.sm, marginTop: spacing.lg },
});
