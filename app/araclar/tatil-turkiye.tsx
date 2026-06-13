import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, AppCard, AppSelect } from '@/components/ui';
import {
  calculateTRRange,
  calculateEfficiency,
  formatDateTR,
  humanizeDays,
  parseISODate,
  toISODateUTC,
} from '@/features/holidays/holiday-calculator';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

const TODAY = toISODateUTC(new Date());
const IN_14 = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return toISODateUTC(d);
})();

const DATE_OPTIONS = (() => {
  const opts: { label: string; value: string }[] = [];
  const base = new Date();
  base.setDate(1);
  for (let m = 0; m < 18; m++) {
    const month = new Date(base.getFullYear(), base.getMonth() + m, 1);
    for (let day = 1; day <= 31; day++) {
      const d = new Date(month.getFullYear(), month.getMonth(), day);
      if (d.getMonth() !== month.getMonth()) break;
      const iso = toISODateUTC(d);
      opts.push({ label: formatDateTR(d), value: iso });
    }
  }
  return opts;
})();

export default function HolidayTRScreen() {
  const [startDate, setStartDate] = useState(TODAY);
  const [endDate, setEndDate] = useState(IN_14);
  const [result, setResult] = useState<ReturnType<typeof calculateTRRange> | null>(null);

  function handleCalculate() {
    const s = parseISODate(startDate);
    const e = parseISODate(endDate);
    if (e < s) return;
    setResult(calculateTRRange(s, e));
  }

  const efficiency = result ? calculateEfficiency(result.leaveDays, result.totalDays) : null;

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Tatil Planlayıcı 2026 — Türkiye" showBack />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <AppCard accentColor={colors.accent}>
          <Text style={styles.sectionTitle}>Tarih Aralığı Seç</Text>

          <View style={styles.row2}>
            <View style={styles.row2Item}>
              <AppSelect
                label="Başlangıç"
                value={startDate}
                options={DATE_OPTIONS}
                onChange={setStartDate}
              />
            </View>
            <View style={styles.row2Item}>
              <AppSelect
                label="Bitiş"
                value={endDate}
                options={DATE_OPTIONS}
                onChange={setEndDate}
              />
            </View>
          </View>

          <AppButton label="Hesapla" onPress={handleCalculate} />
        </AppCard>

        {result && efficiency ? (
          <>
            <AppCard accentColor={colors.success}>
              <Text style={styles.effBadge}>{efficiency.badge}</Text>
              <Text style={styles.effLabel}>{efficiency.label}</Text>

              <View style={styles.statGrid}>
                <StatBox label="Toplam Gün" value={String(result.totalDays)} />
                <StatBox label="Hafta Sonu" value={String(result.weekendDays)} />
                <StatBox label="İş Günü" value={String(result.workdays)} />
                <StatBox label="Resmî Tatil" value={humanizeDays(result.officialHolidayDays)} />
                <StatBox label="İzin Gün" value={humanizeDays(result.leaveDays)} accent />
              </View>
            </AppCard>

            {result.holidayHits.length > 0 ? (
              <AppCard accentColor={colors.warning}>
                <Text style={styles.hitsTitle}>Bu Aralıktaki Resmî Tatiller</Text>
                {result.holidayHits.map((h) => (
                  <View key={h.date} style={styles.hitRow}>
                    <View style={styles.hitLeft}>
                      <Text style={styles.hitName}>{h.name}</Text>
                      <Text style={styles.hitDate}>{formatDateTR(parseISODate(h.date))}</Text>
                      {h.weight === 0.5 ? (
                        <Text style={styles.halfDay}>Yarım gün</Text>
                      ) : null}
                    </View>
                    {h.weekend ? (
                      <View style={styles.weekendBadge}>
                        <Text style={styles.weekendText}>Hafta sonu</Text>
                      </View>
                    ) : null}
                  </View>
                ))}
              </AppCard>
            ) : (
              <AppCard accentColor={colors.border}>
                <Text style={styles.noHits}>Bu aralıkta Türkiye resmî tatili yok.</Text>
              </AppCard>
            )}

            <Text style={styles.note}>
              Türkiye 2026 tatilleri. Yarım gün tatiller (0.5) dikkate alınmıştır.
              Bilgilendirme amaçlıdır.
            </Text>
          </>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

function StatBox({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={[styles.statBox, accent && styles.statBoxAccent]}>
      <Text style={[styles.statValue, accent && styles.statValueAccent]}>{value}</Text>
      <Text style={[styles.statLabel, accent && styles.statLabelAccent]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.sm },
  row2: { flexDirection: 'row', gap: spacing.md },
  row2Item: { flex: 1 },

  effBadge: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.textPrimary },
  effLabel: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.md },

  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statBox: {
    flex: 1,
    minWidth: '40%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  statBoxAccent: { borderColor: colors.success, backgroundColor: `${colors.success}15` },
  statValue: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.textPrimary },
  statValueAccent: { color: colors.success },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  statLabelAccent: { color: colors.success },

  hitsTitle: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.textPrimary, marginBottom: spacing.sm },
  hitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hitLeft: { flex: 1 },
  hitName: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textPrimary },
  hitDate: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  halfDay: { fontSize: fontSize.xs, color: colors.warning, marginTop: 2 },
  weekendBadge: {
    backgroundColor: `${colors.textSecondary}22`,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  weekendText: { fontSize: fontSize.xs, color: colors.textSecondary },

  noHits: { fontSize: fontSize.sm, color: colors.textSecondary, fontStyle: 'italic' },
  note: { fontSize: fontSize.xs, color: colors.textSecondary, fontStyle: 'italic' },
});
