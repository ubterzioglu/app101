import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppCard } from '@/components/ui';
import { MORE_LINKS } from '@/constants/navigation';
import { openExternalUrl } from '@/lib/urls';
import { colors, fontSize, fontWeight, spacing } from '@/theme';

export default function DahaFazlaScreen() {
  const router = useRouter();
  const appVersion = Application.nativeApplicationVersion ?? Constants.expoConfig?.version ?? 'Bilinmiyor';
  const fallbackBuildVersion = String(Constants.expoConfig?.android?.versionCode ?? '').trim();
  const buildVersion = Application.nativeBuildVersion ?? (fallbackBuildVersion || null);
  const versionLabel = buildVersion
    ? `Uygulama sürümü ${appVersion} (Build ${buildVersion})`
    : `Uygulama sürümü ${appVersion}`;

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Daha Fazla" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {MORE_LINKS.map((item) => (
            <AppCard
              key={item.key}
              style={styles.card}
              accessibilityLabel={item.label}
              onPress={() => {
                if (item.external) {
                  openExternalUrl(item.external);
                } else if (item.href) {
                  router.push(item.href as never);
                }
              }}
            >
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </AppCard>
          ))}
        </View>

        <Text style={styles.version}>{versionLabel}</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, paddingBottom: spacing.xxl },
  list: { gap: spacing.sm },
  card: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  icon: { fontSize: 22, marginRight: spacing.md },
  label: { flex: 1, fontSize: fontSize.md, color: colors.textPrimary },
  chevron: { fontSize: fontSize.xl, color: colors.textMuted },
  version: {
    marginTop: spacing.xl,
    textAlign: 'center',
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
});
