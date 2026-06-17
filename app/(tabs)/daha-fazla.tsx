import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppCard, SectionHeader } from '@/components/ui';
import { MORE_LINKS, type MoreLink } from '@/constants/navigation';
import { openExternalUrl } from '@/lib/urls';
import { colors, fontSize, fontWeight, lineHeight, radius, shadow, spacing } from '@/theme';

interface MenuGroup {
  title: string;
  icon: string;
  keys: string[];
}

// Grouped structure (plan §15). Keys map to MORE_LINKS entries.
const GROUPS: MenuGroup[] = [
  { title: 'İçerik ve Rehberler', icon: '📚', keys: ['corner', 'docs', 'community', 'life', 'holiday'] },
  { title: 'Destek ve İletişim', icon: '💬', keys: ['join', 'contact'] },
  { title: 'Yasal ve Uygulama', icon: '⚖️', keys: ['about', 'privacy'] },
];

function getLink(key: string): MoreLink | undefined {
  return MORE_LINKS.find((item) => item.key === key);
}

export default function DahaFazlaScreen() {
  const router = useRouter();
  const appVersion = Application.nativeApplicationVersion ?? Constants.expoConfig?.version ?? 'Bilinmiyor';
  const fallbackBuildVersion = String(Constants.expoConfig?.android?.versionCode ?? '').trim();
  const buildVersion = Application.nativeBuildVersion ?? (fallbackBuildVersion || null);
  const versionLabel = buildVersion
    ? `Uygulama sürümü ${appVersion} (Build ${buildVersion})`
    : `Uygulama sürümü ${appVersion}`;

  const website = getLink('website');
  const community = getLink('community');

  const openLink = (item: MoreLink) => {
    if (item.external) {
      openExternalUrl(item.external);
    } else if (item.href) {
      router.push(item.href as never);
    }
  };

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Daha Fazla" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Community CTA */}
        {community ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={community.label}
            onPress={() => openLink(community)}
            style={({ pressed }) => [styles.ctaCard, pressed && styles.ctaPressed]}
          >
            <View style={styles.ctaOrb} pointerEvents="none" />
            <Text style={styles.ctaEmoji}>{community.icon}</Text>
            <Text style={styles.ctaTitle}>Topluluğa katıl</Text>
            <Text style={styles.ctaText}>
              WhatsApp, Telegram ve diğer kanallarla almanya101 topluluğuna bağlan.
            </Text>
          </Pressable>
        ) : null}

        {GROUPS.map((group) => {
          const links = group.keys.map(getLink).filter((l): l is MoreLink => Boolean(l));
          if (links.length === 0) return null;
          return (
            <View key={group.title} style={styles.section}>
              <SectionHeader title={group.title} icon={group.icon} />
              <AppCard variant="elevated" style={styles.groupCard}>
                {links.map((item, index) => (
                  <Pressable
                    key={item.key}
                    accessibilityRole="button"
                    accessibilityLabel={item.label}
                    onPress={() => openLink(item)}
                    style={({ pressed }) => [
                      styles.row,
                      index < links.length - 1 && styles.rowDivider,
                      pressed && styles.rowPressed,
                    ]}
                  >
                    <Text style={styles.rowIcon}>{item.icon}</Text>
                    <Text style={styles.rowLabel}>{item.label}</Text>
                    <Text style={styles.chevron}>›</Text>
                  </Pressable>
                ))}
              </AppCard>
            </View>
          );
        })}

        {/* External website CTA */}
        {website ? (
          <View style={styles.section}>
            <AppCard
              style={styles.websiteCard}
              accessibilityLabel={website.label}
              onPress={() => openLink(website)}
            >
              <Text style={styles.rowIcon}>{website.icon}</Text>
              <View style={styles.websiteBody}>
                <Text style={styles.websiteTitle}>{website.label}</Text>
                <Text style={styles.websiteText}>almanya101.com adresinde daha fazlasını keşfet.</Text>
              </View>
              <Text style={styles.chevron}>↗</Text>
            </AppCard>
          </View>
        ) : null}

        <Text style={styles.version}>{versionLabel}</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  ctaCard: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.xl,
    ...shadow.glow,
  },
  ctaPressed: { opacity: 0.95 },
  ctaOrb: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.yellowGlow,
    opacity: 0.5,
  },
  ctaEmoji: { fontSize: 30, marginBottom: spacing.sm },
  ctaTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  ctaText: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  section: { marginTop: spacing.xl },
  groupCard: { padding: 0, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowPressed: { backgroundColor: colors.surface3 },
  rowIcon: { fontSize: 22, marginRight: spacing.md },
  rowLabel: { flex: 1, fontSize: fontSize.md, color: colors.textPrimary },
  chevron: { fontSize: fontSize.xl, color: colors.textMuted },
  websiteCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  websiteBody: { flex: 1 },
  websiteTitle: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.textPrimary },
  websiteText: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  version: {
    marginTop: spacing.xxl,
    textAlign: 'center',
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
});
