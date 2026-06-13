import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppCard } from '@/components/ui';
import { TOOL_LINKS } from '@/constants/navigation';
import { colors, fontSize, fontWeight, spacing } from '@/theme';

export default function AraclarScreen() {
  const router = useRouter();
  const p0 = TOOL_LINKS.filter((t) => t.phase === 'p0');
  const p1 = TOOL_LINKS.filter((t) => t.phase === 'p1');

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Araçlar" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Öne Çıkanlar</Text>
        <View style={styles.list}>
          {p0.map((tool) => (
            <AppCard
              key={tool.key}
              style={styles.card}
              accessibilityLabel={tool.label}
              onPress={() => router.push(tool.href as never)}
            >
              <Text style={styles.icon}>{tool.icon}</Text>
              <Text style={styles.label}>{tool.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </AppCard>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Diğer Araçlar</Text>
        <View style={styles.list}>
          {p1.map((tool) => (
            <AppCard
              key={tool.key}
              style={styles.card}
              accessibilityLabel={tool.label}
              onPress={() => router.push(tool.href as never)}
            >
              <Text style={styles.icon}>{tool.icon}</Text>
              <Text style={styles.label}>{tool.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </AppCard>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  list: { gap: spacing.sm },
  card: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  icon: { fontSize: 22, marginRight: spacing.md },
  label: { flex: 1, fontSize: fontSize.md, color: colors.textPrimary },
  chevron: { fontSize: fontSize.xl, color: colors.textMuted },
});
