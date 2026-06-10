import { ScrollView, StyleSheet, Text } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppCard } from '@/components/ui';
import { TR_2026_HOLIDAYS } from '@/features/holidays/tr-2026';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
}

const holidays = [...TR_2026_HOLIDAYS].sort((a, b) => a.date.localeCompare(b.date));

export default function HolidayTRScreen() {
  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Tatil Planlayıcı 2026 — Türkiye" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.count}>{holidays.length} resmî tatil (2026)</Text>
        {holidays.map((h) => (
          <AppCard key={`${h.date}-${h.name}`} style={styles.card}>
            <Text style={styles.name}>{h.name}</Text>
            <Text style={styles.date}>{formatDate(h.date)}</Text>
          </AppCard>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxl },
  count: { fontSize: fontSize.sm, color: colors.gray500, marginBottom: spacing.xs },
  card: { paddingVertical: spacing.md, borderRadius: radius.md },
  name: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.gray900 },
  date: { fontSize: fontSize.sm, color: colors.gray500, marginTop: 2 },
});
