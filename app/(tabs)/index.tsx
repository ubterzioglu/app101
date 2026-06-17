import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import {
  AppCard,
  HeroPanel,
  InfoBadge,
  QuickActionCard,
  SectionHeader,
} from '@/components/ui';
import {
  POPULAR_TOOL_KEYS,
  QUICK_ACTIONS,
  QUICK_ACTION_HELPERS,
  TOOL_HELPERS,
  TOOL_LINKS,
  TOOL_STATUS,
  type ToolLink,
} from '@/constants/navigation';
import { colors, fontSize, fontWeight, lineHeight, radius, shadow, spacing } from '@/theme';

const STATUS_BADGE: Record<
  string,
  { label: string; variant: 'success' | 'warning' | 'muted' }
> = {
  active: { label: 'Aktif', variant: 'success' },
  beta: { label: 'Beta', variant: 'warning' },
  soon: { label: 'Yakında', variant: 'muted' },
};

export default function HomeScreen() {
  const router = useRouter();

  const popularTools = POPULAR_TOOL_KEYS.map((key) =>
    TOOL_LINKS.find((tool) => tool.key === key)
  ).filter((tool): tool is ToolLink => Boolean(tool));

  const go = (href: string) => router.push(href as never);

  return (
    <ScreenContainer padded={false}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 9.1 Hero */}
        <HeroPanel
          subtitle="Yalnız değilsin. almanya101 seninle."
          title="almanya101"
          description="Almanya’daki hayatını kolaylaştıran haberler, rehberler, araçlar ve topluluk bağlantıları."
          primaryActionLabel="Vatandaşlık Testine Başla"
          secondaryActionLabel="Hizmet Rehberi"
          onPrimaryAction={() => go('/araclar/vatandaslik-testi')}
          onSecondaryAction={() => go('/(tabs)/rehber')}
          image={
            <Image
              source={require('@/assets/images/logoandroid.png')}
              style={styles.logoImage}
              contentFit="contain"
              accessibilityLabel="almanya101 logosu"
            />
          }
        />

        {/* 9.2 Quick actions */}
        <View style={styles.section}>
          <SectionHeader
            title="Hızlı Başlangıç"
            subtitle="En çok kullanılan alanlara tek dokunuşla ulaş."
            icon="⚡"
          />
          <View style={styles.quickGrid}>
            {QUICK_ACTIONS.map((action) => (
              <View key={action.key} style={styles.quickItem}>
                <QuickActionCard
                  icon={action.icon}
                  title={action.label}
                  subtitle={QUICK_ACTION_HELPERS[action.key]}
                  accentColor={action.color}
                  onPress={() => go(action.href)}
                />
              </View>
            ))}
          </View>
        </View>

        {/* 9.3 Popular tools */}
        <View style={styles.section}>
          <SectionHeader
            title="Popüler Araçlar"
            subtitle="En çok tercih edilen pratik araçlar."
            icon="🛠️"
            actionLabel="Tümü"
            onActionPress={() => go('/(tabs)/araclar')}
          />
          <View style={styles.toolList}>
            {popularTools.map((tool) => {
              const status = STATUS_BADGE[TOOL_STATUS[tool.key] ?? 'active'];
              return (
                <AppCard
                  key={tool.key}
                  variant="elevated"
                  style={styles.toolRow}
                  accessibilityLabel={tool.label}
                  onPress={() => go(tool.href)}
                >
                  <View style={styles.toolIconWrap}>
                    <Text style={styles.toolIcon}>{tool.icon}</Text>
                  </View>
                  <View style={styles.toolBody}>
                    <Text style={styles.toolTitle} numberOfLines={1}>
                      {tool.label}
                    </Text>
                    {TOOL_HELPERS[tool.key] ? (
                      <Text style={styles.toolHelper} numberOfLines={1}>
                        {TOOL_HELPERS[tool.key]}
                      </Text>
                    ) : null}
                  </View>
                  {status ? <InfoBadge label={status.label} variant={status.variant} /> : null}
                  <Text style={styles.chevron}>›</Text>
                </AppCard>
              );
            })}
          </View>
        </View>

        {/* 9.4 Community block */}
        <View style={styles.section}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Topluluğa Katıl"
            onPress={() => go('/topluluk')}
            style={({ pressed }) => [styles.ctaCard, pressed && styles.ctaPressed]}
          >
            <View style={styles.ctaOrb} pointerEvents="none" />
            <Text style={styles.ctaTitle}>Almanya’da yolunu birlikte bulalım</Text>
            <Text style={styles.ctaText}>
              Haberler, rehberler ve pratik araçlarla günlük kararlarını daha kolay ver.
            </Text>
            <View style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Topluluğa Katıl →</Text>
            </View>
          </Pressable>
        </View>

        {/* 9.5 News teaser */}
        <View style={styles.section}>
          <AppCard
            variant="elevated"
            style={styles.newsCard}
            accessibilityLabel="Haberleri Aç"
            onPress={() => go('/(tabs)/haberler')}
          >
            <View style={styles.newsHeader}>
              <Text style={styles.newsEmoji}>📰</Text>
              <InfoBadge label="Güncel" variant="accent" />
            </View>
            <Text style={styles.newsTitle}>Son Haberler</Text>
            <Text style={styles.newsText}>
              Almanya, Türkiye, Avrupa ve Dünya gündeminden seçilen Türkçe içerikler.
            </Text>
            <Text style={styles.newsLink}>Haberleri Aç →</Text>
          </AppCard>
        </View>
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
  logoImage: {
    width: 96,
    height: 96,
  },
  section: {
    marginTop: spacing.xl,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  quickItem: {
    width: '50%',
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.md,
  },
  toolList: {
    gap: spacing.sm,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  toolIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolIcon: { fontSize: 22 },
  toolBody: { flex: 1 },
  toolTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  toolHelper: {
    marginTop: 2,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: fontSize.xl,
    color: colors.textMuted,
    marginLeft: spacing.xs,
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
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.yellowGlow,
    opacity: 0.5,
  },
  ctaTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  ctaText: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  ctaButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textInverse,
  },
  newsCard: {
    gap: spacing.sm,
  },
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  newsEmoji: { fontSize: 26 },
  newsTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  newsText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  newsLink: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.accent,
  },
});
