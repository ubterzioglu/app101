import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppCard, AppSelect } from '@/components/ui';
import {
  GERMAN_STATES,
  getHolidaysForState,
  type GermanStateCode,
} from '@/features/holidays/de-2026';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

const STATE_OPTIONS = GERMAN_STATES.map((s) => ({ label: s.name, value: s.code }));

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
}

export default function HolidayDEScreen() {
  const [state, setState] = useState<GermanStateCode>('NW' as GermanStateCode);
  const holidays = useMemo(
    () =>
      [...getHolidaysForState(state)].sort((a, b) => a.date.localeCompare(b.date)),
    [state]
  );

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Tatil Planlayıcı 2026 — Almanya" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <AppSelect
          label="Eyalet"
          value={state}
          options={STATE_OPTIONS}
          onChange={(v) => setState(v as GermanStateCode)}
        />
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
