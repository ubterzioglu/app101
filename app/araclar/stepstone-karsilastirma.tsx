import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppCard, AppSelect } from '@/components/ui';
import {
  EXPERIENCE_OPTIONS,
  STEPSTONE_2026,
} from '@/features/salary/stepstone-data';
import { STATES } from '@/features/salary/types';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

function formatEUR(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

const STATE_OPTIONS = STATES.map((s) => ({ label: s.name, value: s.code }));

export default function StepstoneScreen() {
  const [experience, setExperience] = useState('3-5');
  const [state, setState] = useState('NRW');

  const expMedian = (STEPSTONE_2026.experience as Record<string, number>)[experience];
  const stateMedian = (STEPSTONE_2026.states as Record<string, number>)[state];

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="StepStone Karşılaştırma" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.reportBadge}>
          <Text style={styles.reportText}>StepStone Gehaltsreport 2026 raporu</Text>
        </View>

        <AppCard accentColor={colors.blue} style={styles.overallCard}>
          <Text style={styles.overallLabel}>Genel medyan brüt yıllık</Text>
          <Text style={styles.overallValue}>{formatEUR(STEPSTONE_2026.overall.median)}</Text>
          <Text style={styles.overallSub}>Ortalama: {formatEUR(STEPSTONE_2026.overall.mean)}</Text>
        </AppCard>

        <AppSelect
          label="Deneyim"
          value={experience}
          options={EXPERIENCE_OPTIONS}
          onChange={setExperience}
        />
        <AppSelect label="Eyalet" value={state} options={STATE_OPTIONS} onChange={setState} />

        <AppCard style={styles.resultCard}>
          <Row label="Deneyime göre medyan" value={expMedian} />
          <View style={styles.divider} />
          <Row label="Eyalete göre medyan" value={stateMedian} />
        </AppCard>

        <Text style={styles.note}>
          Veriler StepStone Gehaltsreport 2026'dan alınmıştır ve referans amaçlıdır.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

function Row({ label, value }: { label: string; value: number | undefined }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value ? formatEUR(value) : '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  reportBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.gray100,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  reportText: { fontSize: fontSize.xs, color: colors.gray600, fontWeight: fontWeight.medium },
  overallCard: { alignItems: 'center' },
  overallLabel: { fontSize: fontSize.sm, color: colors.gray500 },
  overallValue: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.blue },
  overallSub: { fontSize: fontSize.sm, color: colors.gray500, marginTop: spacing.xs },
  resultCard: {},
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  rowLabel: { fontSize: fontSize.sm, color: colors.gray600 },
  rowValue: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.gray900 },
  divider: { height: 1, backgroundColor: colors.gray200 },
  note: { fontSize: fontSize.xs, color: colors.gray500, fontStyle: 'italic' },
});
