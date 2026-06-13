import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, AppCard, AppSelect, AppTextInput } from '@/components/ui';
import {
  COMPANY_SIZE_OPTIONS,
  EDUCATION_OPTIONS,
  EXPERIENCE_OPTIONS,
  GENDER_OPTIONS,
  RESPONSIBILITY_OPTIONS,
  STEPSTONE_2026,
  getSortedCities,
  getSortedJobGroups,
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
const JOB_GROUPS = getSortedJobGroups().map((g) => ({ label: g, value: g }));
const CITIES = getSortedCities().map((c) => ({ label: c, value: c }));

interface FormState {
  grossMonthly: string;
  state: string;
  jobGroup: string;
  experience: string;
  city: string;
  companySize: string;
  education: string;
  responsibility: string;
  gender: string;
}

interface CompareRow {
  label: string;
  median: number;
  diff: number;
  diffPct: number;
}

interface Result {
  grossYearly: number;
  picks: Record<string, string>;
  rows: CompareRow[];
}

const INITIAL: FormState = {
  grossMonthly: '',
  state: '',
  jobGroup: '',
  experience: '',
  city: '',
  companySize: '',
  education: '',
  responsibility: '',
  gender: '',
};

const FIELD_LABELS: Record<keyof FormState, string> = {
  grossMonthly: 'Aylık Brüt Maaş',
  state: 'Eyalet',
  jobGroup: 'Meslek grubu',
  experience: 'Deneyim',
  city: 'Şehir',
  companySize: 'Şirket büyüklüğü',
  education: 'Eğitim',
  responsibility: 'Personalverantwortung',
  gender: 'Cinsiyet',
};

function buildResult(form: FormState): { result?: Result; missing: string[] } {
  const grossMonthly = parseFloat(form.grossMonthly);
  const missing: string[] = [];

  for (const [key, label] of Object.entries(FIELD_LABELS)) {
    if (key === 'grossMonthly') {
      if (!grossMonthly || grossMonthly <= 0) missing.push(label);
    } else if (!form[key as keyof FormState]) {
      missing.push(label);
    }
  }

  if (missing.length) return { missing };

  const grossYearly = Math.round(grossMonthly * 12);

  function row(label: string, median: number): CompareRow {
    const diff = grossYearly - median;
    const diffPct = (diff / median) * 100;
    return { label, median, diff, diffPct };
  }

  const stateName = STATES.find((s) => s.code === form.state)?.name ?? form.state;
  const eduLabel = form.education === 'yes' ? 'Var' : 'Yok';
  const respLabel = form.responsibility === 'yes' ? 'Var' : 'Yok';
  const genderLabel = form.gender === 'm' ? 'Erkek' : 'Kadın';

  return {
    missing: [],
    result: {
      grossYearly,
      picks: {
        'Eyalet': stateName,
        'Meslek grubu': form.jobGroup,
        'Deneyim': form.experience,
        'Şehir': form.city,
        'Şirket büyüklüğü': form.companySize,
        'Eğitim': eduLabel,
        'Personalverantwortung': respLabel,
        'Cinsiyet': genderLabel,
      },
      rows: [
        row('Genel Almanya (Median)', STEPSTONE_2026.overall.median),
        row('Genel Almanya (Ortalama)', STEPSTONE_2026.overall.mean),
        row(`Eyalet (${stateName})`, (STEPSTONE_2026.states as Record<string, number>)[form.state]),
        row(`Meslek grubu (${form.jobGroup})`, (STEPSTONE_2026.jobGroups as Record<string, number>)[form.jobGroup]),
        row(`Deneyim (${form.experience})`, (STEPSTONE_2026.experience as Record<string, number>)[form.experience]),
        row(`Şehir (${form.city})`, (STEPSTONE_2026.cities as Record<string, number>)[form.city]),
        row(`Şirket büyüklüğü (${form.companySize})`, (STEPSTONE_2026.companySize as Record<string, number>)[form.companySize]),
        row(`Eğitim (${eduLabel})`, STEPSTONE_2026.education[form.education as 'yes' | 'no']),
        row(`Personalverantwortung (${respLabel})`, STEPSTONE_2026.responsibility[form.responsibility as 'yes' | 'no']),
        row(`Cinsiyet (${genderLabel})`, STEPSTONE_2026.gender[form.gender as 'm' | 'f']),
      ],
    },
  };
}

export default function StepstoneScreen() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [result, setResult] = useState<Result | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [showInfo, setShowInfo] = useState(false);

  function set(key: keyof FormState) {
    return (value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCompare() {
    const out = buildResult(form);
    setMissing(out.missing);
    setResult(out.result ?? null);
  }

  function handleReset() {
    setForm(INITIAL);
    setResult(null);
    setMissing([]);
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="StepStone Karşılaştırma" showBack />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppCard
          accentColor={colors.blue}
          onPress={() => setShowInfo(!showInfo)}
          accessibilityLabel="Nasıl Çalışır?"
        >
          <View style={styles.infoHeader}>
            <Text style={styles.infoHeaderText}>Nasıl Çalışır?</Text>
            <Text style={[styles.chevron, showInfo && styles.chevronOpen]}>▾</Text>
          </View>
          {showInfo ? (
            <View style={styles.infoBody}>
              <Text style={styles.infoItem}>• Aylık brüt maaşını ve profilini gir, Stepstone 2026 medyanlarıyla karşılaştır.</Text>
              <Text style={styles.infoItem}>• Eyalet, meslek grubu, deneyim, şehir gibi 8 farklı boyutta analiz üretilir.</Text>
              <Text style={styles.infoItem}>• Kaynak: Stepstone Gehaltsreport 2026 (PDF). Bilgilendirme amaçlıdır.</Text>
            </View>
          ) : null}
        </AppCard>

        <AppCard accentColor={colors.yellow}>
          <Text style={styles.sectionTitle}>Profil Bilgileri</Text>
          <Text style={styles.sectionDesc}>
            Alanları doldurdukça karşılaştırma daha isabetli olur.
          </Text>

          <AppTextInput
            label="Aylık Brüt Maaş (€)"
            keyboardType="numeric"
            placeholder="4500"
            value={form.grossMonthly}
            onChangeText={set('grossMonthly')}
            required
          />

          <View style={styles.row2}>
            <View style={styles.row2Item}>
              <AppSelect label="Eyalet" value={form.state} options={STATE_OPTIONS} onChange={set('state')} required />
            </View>
            <View style={styles.row2Item}>
              <AppSelect label="Deneyim" value={form.experience} options={EXPERIENCE_OPTIONS} onChange={set('experience')} required />
            </View>
          </View>

          <AppSelect label="Meslek Grubu" value={form.jobGroup} options={JOB_GROUPS} onChange={set('jobGroup')} required />
          <AppSelect label="Şehir" value={form.city} options={CITIES} onChange={set('city')} required />

          <View style={styles.row2}>
            <View style={styles.row2Item}>
              <AppSelect label="Şirket Büyüklüğü" value={form.companySize} options={COMPANY_SIZE_OPTIONS} onChange={set('companySize')} required />
            </View>
            <View style={styles.row2Item}>
              <AppSelect label="Eğitim (Hochschulabschluss)" value={form.education} options={EDUCATION_OPTIONS} onChange={set('education')} required />
            </View>
          </View>

          <View style={styles.row2}>
            <View style={styles.row2Item}>
              <AppSelect label="Personalverantwortung" value={form.responsibility} options={RESPONSIBILITY_OPTIONS} onChange={set('responsibility')} required />
            </View>
            <View style={styles.row2Item}>
              <AppSelect label="Cinsiyet" value={form.gender} options={GENDER_OPTIONS} onChange={set('gender')} required />
            </View>
          </View>

          <View style={styles.btnRow}>
            <View style={styles.btnFlex}>
              <AppButton label="Karşılaştır" onPress={handleCompare} />
            </View>
            <View style={styles.btnFlex}>
              <AppButton label="Sıfırla" onPress={handleReset} variant="outline" />
            </View>
          </View>
        </AppCard>

        {missing.length > 0 ? (
          <AppCard accentColor={colors.yellow}>
            <Text style={styles.missingTitle}>Eksik alanlar:</Text>
            <Text style={styles.missingText}>{missing.join(', ')}</Text>
          </AppCard>
        ) : null}

        {result ? (
          <>
            <AppCard accentColor={colors.green}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryLeft}>
                  <Text style={styles.summaryLabel}>Senin yıllık brütün</Text>
                  <Text style={styles.summaryBig}>{formatEUR(result.grossYearly)}</Text>
                  <Text style={styles.summarySub}>Kaynak: Stepstone Gehaltsreport 2026</Text>
                </View>
                <View style={styles.summaryRight}>
                  <Text style={styles.summaryLabel}>Genel Almanya</Text>
                  <Text style={styles.summaryMedian}>Median: {formatEUR(STEPSTONE_2026.overall.median)}</Text>
                  <Text style={styles.summaryMedian}>Ort.: {formatEUR(STEPSTONE_2026.overall.mean)}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <Text style={styles.picksTitle}>Seçimin</Text>
              <View style={styles.picksGrid}>
                {Object.entries(result.picks).map(([k, v]) => (
                  <View key={k} style={styles.pickItem}>
                    <Text style={styles.pickKey}>{k}: </Text>
                    <Text style={styles.pickValue}>{v}</Text>
                  </View>
                ))}
              </View>
            </AppCard>

            <AppCard accentColor={colors.blue}>
              <Text style={styles.compareTitle}>Boyuta Göre Karşılaştırma</Text>
              {result.rows.map((r) => {
                const above = r.diff > 0;
                const sign = r.diff > 0 ? '+' : '';
                return (
                  <View key={r.label} style={styles.compareRow}>
                    <Text style={styles.compareLabel} numberOfLines={2}>{r.label}</Text>
                    <View style={styles.compareRight}>
                      <Text style={styles.compareMedian}>{formatEUR(r.median)}</Text>
                      <Text style={[styles.compareDiff, above ? styles.diffAbove : styles.diffBelow]}>
                        {sign}{formatEUR(r.diff)} ({sign}{r.diffPct.toFixed(1)}%)
                      </Text>
                    </View>
                  </View>
                );
              })}
            </AppCard>
          </>
        ) : null}

        <Text style={styles.note}>
          Veriler StepStone Gehaltsreport 2026&apos;dan alınmıştır ve referans amaçlıdır.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoHeaderText: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.gray900 },
  chevron: { color: colors.blue, fontSize: fontSize.xl },
  chevronOpen: { transform: [{ rotate: '180deg' }] },
  infoBody: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.gray200 },
  infoItem: { fontSize: fontSize.sm, color: colors.gray700, lineHeight: 20, marginBottom: spacing.xs },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.gray900, marginBottom: spacing.xs },
  sectionDesc: { fontSize: fontSize.sm, color: colors.gray600, marginBottom: spacing.md },
  row2: { flexDirection: 'row', gap: spacing.md },
  row2Item: { flex: 1 },
  btnRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  btnFlex: { flex: 1 },
  missingTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.gray700 },
  missingText: { fontSize: fontSize.sm, color: colors.gray600, marginTop: spacing.xs },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLeft: { flex: 1 },
  summaryRight: { alignItems: 'flex-end' },
  summaryLabel: { fontSize: fontSize.xs, color: colors.gray500 },
  summaryBig: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.gray900, marginTop: spacing.xs },
  summarySub: { fontSize: fontSize.xs, color: colors.gray400, marginTop: spacing.xs },
  summaryMedian: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.gray900 },
  divider: { height: 1, backgroundColor: colors.gray200, marginVertical: spacing.md },
  picksTitle: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: colors.gray500, marginBottom: spacing.xs },
  picksGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  pickItem: { flexDirection: 'row', width: '50%', paddingRight: spacing.sm },
  pickKey: { fontSize: fontSize.sm, color: colors.gray500 },
  pickValue: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.gray700 },
  compareTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.gray900, marginBottom: spacing.md },
  compareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${colors.blue}33`,
    backgroundColor: `${colors.blue}11`,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  compareLabel: { fontSize: fontSize.sm, color: colors.gray700, flex: 1, paddingRight: spacing.sm },
  compareRight: { alignItems: 'flex-end' },
  compareMedian: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.gray900 },
  compareDiff: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
  diffAbove: { color: colors.green },
  diffBelow: { color: colors.red },
  note: { fontSize: fontSize.xs, color: colors.gray500, fontStyle: 'italic' },
});
