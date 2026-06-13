import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, AppCard } from '@/components/ui';
import { EXTERNAL_LINKS } from '@/constants/external-links';
import { QUICK_ACTIONS, TOOL_LINKS } from '@/constants/navigation';
import { openExternalUrl } from '@/lib/urls';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();
  const popularTools = TOOL_LINKS.filter((t) => t.phase === 'p0');

  return (
    <ScreenContainer padded={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logo + motto */}
        <View style={styles.hero}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logoImage}
            contentFit="contain"
            accessibilityLabel="almanya101 logosu"
          />
          <Text style={styles.motto}>Almanya'da hayatınızı kolaylaştıran rehber.</Text>
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Hızlı Başlangıç</Text>
        <View style={styles.grid}>
          {QUICK_ACTIONS.map((action) => (
            <AppCard
              key={action.key}
              accentColor={action.color}
              style={styles.quickCard}
              accessibilityLabel={action.label}
              onPress={() => router.push(action.href as never)}
            >
              <Text style={styles.quickIcon}>{action.icon}</Text>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </AppCard>
          ))}
        </View>

        {/* Popular tools */}
        <Text style={styles.sectionTitle}>Popüler Araçlar</Text>
        <View style={styles.toolList}>
          {popularTools.map((tool) => (
            <AppCard
              key={tool.key}
              style={styles.toolCard}
              accessibilityLabel={tool.label}
              onPress={() => router.push(tool.href as never)}
            >
              <Text style={styles.toolIcon}>{tool.icon}</Text>
              <Text style={styles.toolLabel}>{tool.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </AppCard>
          ))}
        </View>

        {/* Open website */}
        <View style={styles.websiteCta}>
          <AppButton
            label="Web Sitesini Aç"
            variant="outline"
            onPress={() => openExternalUrl(EXTERNAL_LINKS.website)}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  hero: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  motto: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.gray500,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.gray900,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickCard: {
    width: '47%',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  quickIcon: { fontSize: 30, marginBottom: spacing.sm },
  quickLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
    textAlign: 'center',
  },
  toolList: { gap: spacing.sm },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  toolIcon: { fontSize: 22, marginRight: spacing.md },
  toolLabel: { flex: 1, fontSize: fontSize.md, color: colors.gray800 },
  chevron: { fontSize: fontSize.xl, color: colors.gray400 },
  websiteCta: { marginTop: spacing.xl },
});
