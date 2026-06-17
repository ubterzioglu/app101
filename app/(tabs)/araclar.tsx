import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppCard, HeroPanel, InfoBadge, SectionHeader } from '@/components/ui';
import {
  TOOL_HELPERS,
  TOOL_LINKS,
  TOOL_STATUS,
  type ToolLink,
} from '@/constants/navigation';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

const STATUS_BADGE: Record<
  string,
  { label: string; variant: 'success' | 'warning' | 'muted' }
> = {
  active: { label: 'Aktif', variant: 'success' },
  beta: { label: 'Beta', variant: 'warning' },
  soon: { label: 'Yakında', variant: 'muted' },
};

function ToolRow({ tool, onPress }: { tool: ToolLink; onPress: () => void }) {
  const status = STATUS_BADGE[TOOL_STATUS[tool.key] ?? 'active'];
  return (
    <AppCard
      variant="elevated"
      style={styles.toolRow}
      accessibilityLabel={tool.label}
      onPress={onPress}
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
}

export default function AraclarScreen() {
  const router = useRouter();
  const p0 = TOOL_LINKS.filter((t) => t.phase === 'p0');
  const p1 = TOOL_LINKS.filter((t) => t.phase === 'p1');

  const go = (href: string) => router.push(href as never);

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Araçlar" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HeroPanel
          subtitle="Pratik araçlar"
          title="Almanya araç kutun"
          description="Maaş, vatandaşlık, iş ve günlük hayat kararları için pratik araçlar."
        />

        <View style={styles.section}>
          <SectionHeader title="Öne Çıkan Araçlar" icon="⭐" />
          <View style={styles.list}>
            {p0.map((tool) => (
              <ToolRow key={tool.key} tool={tool} onPress={() => go(tool.href)} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Diğer Araçlar" icon="🧰" />
          <View style={styles.list}>
            {p1.map((tool) => (
              <ToolRow key={tool.key} tool={tool} onPress={() => go(tool.href)} />
            ))}
          </View>
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
  section: { marginTop: spacing.xl },
  list: { gap: spacing.sm },
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
});
