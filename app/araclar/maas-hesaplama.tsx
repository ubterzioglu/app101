import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, AppCard, AppSelect, AppTextInput } from '@/components/ui';
import { calculateSalary, formatCurrency } from '@/features/salary/calculator';
import { CAR_RATES } from '@/features/salary/company-car';
import { STATES, TAX_CLASSES, type SalaryInput, type SalaryResult } from '@/features/salary/types';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

const STATE_OPTIONS = STATES.map((s) => ({ label: s.name, value: s.code }));
const TAX_CLASS_OPTIONS = TAX_CLASSES.map((t) => ({ label: t.label, value: t.value }));
const CAR_RATE_OPTIONS = CAR_RATES.map((r) => ({ label: r.label, value: String(r.value) }));

export default function SalaryScreen() {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [type, setType] = useState<'gross' | 'net'>('gross');
  const [amount, setAmount] = useState('3000');
  const [taxClass, setTaxClass] = useState('1');
  const [state, setState] = useState('NRW');
  const [hasChildren, setHasChildren] = useState(false);
  const [childrenCount, setChildrenCount] = useState('0');
  const [childrenUnder25, setChildrenUnder25] = useState('0');
  const [age23Plus, setAge23Plus] = useState(true);
  const [churchTax, setChurchTax] = useState(false);
  const [childAllowance, setChildAllowance] = useState('0');
  const [insuranceType, setInsuranceType] = useState<'gkv' | 'pkv'>('gkv');
  const [kvBase, setKvBase] = useState('14.6');
  const [kvZusatz, setKvZusatz] = useState('2.5');
  const [pkvPremium, setPkvPremium] = useState('0');
  const [ppvPremium, setPpvPremium] = useState('0');

  const [hasCompanyCar, setHasCompanyCar] = useState(false);
  const [carListPrice, setCarListPrice] = useState('40000');
  const [carRate, setCarRate] = useState('0.01');
  const [carCommuteEnabled, setCarCommuteEnabled] = useState(false);
  const [carCommuteKm, setCarCommuteKm] = useState('10');
  const [carCommuteMode, setCarCommuteMode] = useState<'monthly' | 'daily'>('monthly');
  const [carCommuteDays, setCarCommuteDays] = useState('15');

  const [showInfo, setShowInfo] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [result, setResult] = useState<SalaryResult | null>(null);
  const [error, setError] = useState('');

  function onCalculate() {
    const value = Number(amount.replace(',', '.'));
    if (!Number.isFinite(value) || value <= 0) {
      setError('Lütfen geçerli, pozitif bir tutar girin.');
      setResult(null);
      return;
    }
    setError('');
    const input: SalaryInput = {
      amount: value,
      period,
      type,
      taxClass: taxClass as SalaryInput['taxClass'],
      state,
      hasChildren,
      childrenCount: hasChildren ? Number(childrenCount) || 0 : 0,
      childrenUnder25Count: hasChildren ? Number(childrenUnder25) || 0 : 0,
      age23Plus,
      churchTax,
      childAllowance: Number(childAllowance) || 0,
      insuranceType,
      kvBase: Number(kvBase) || 14.6,
      kvZusatz: Number(kvZusatz) || 2.5,
      pkvPremium: Number(pkvPremium) || 0,
      ppvPremium: Number(ppvPremium) || 0,
      companyCar: hasCompanyCar
        ? {
            enabled: true,
            listPrice: Number(carListPrice) || 0,
            rate: Number(carRate) || 0.01,
            commuteEnabled: carCommuteEnabled,
            commuteKm: Number(carCommuteKm) || 0,
            commuteMode: carCommuteMode,
            commuteDays: Number(carCommuteDays) || 0,
          }
        : { enabled: false, listPrice: 0, rate: 0, commuteEnabled: false, commuteKm: 0, commuteMode: 'monthly', commuteDays: 0 },
    };
    setResult(calculateSalary(input));
  }

  const amountLabel =
    type === 'gross'
      ? period === 'monthly'
        ? 'Aylık brüt (€)'
        : 'Yıllık brüt (€)'
      : period === 'monthly'
        ? 'Aylık net (€)'
        : 'Yıllık net (€)';

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Maaş Hesaplayıcı" showBack />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.betaBox}>
          <Text style={styles.betaTitle}>Beta — Referans amaçlı</Text>
          <Text style={styles.betaText}>
            Bu hesaplama bilgilendirme ve karşılaştırma amaçlıdır. Resmî bordro veya vergi
            danışmanlığı yerine geçmez.
          </Text>
        </View>

        <AppCard
          accentColor={colors.accent}
          onPress={() => setShowInfo(!showInfo)}
          accessibilityLabel="Nasıl Çalışır?"
        >
          <View style={styles.infoHeader}>
            <Text style={styles.infoHeaderText}>Nasıl Çalışır?</Text>
            <Text style={[styles.chevron, showInfo && styles.chevronOpen]}>▾</Text>
          </View>
          {showInfo ? (
            <View style={styles.infoBody}>
              <Text style={styles.infoItem}>• Kullanıcı verileri saklanmaz.</Text>
              <Text style={styles.infoItem}>
                •{' '}
                <Text style={styles.infoBold}>KV (Krankenkasse)</Text>
                : Yasal sağlık sigortası kesintisi. Standart oran %14.6&apos;dır.
              </Text>
              <Text style={styles.infoItem}>
                •{' '}
                <Text style={styles.infoBold}>Zusatzbeitrag</Text>
                : Ek prim, genelde %1.6 – %2.5 arasındadır.
              </Text>
              <Text style={styles.infoItem}>
                • Her iki prim de çalışan ve işveren arasında yarı yarıya paylaşılır.
              </Text>
            </View>
          ) : null}
        </AppCard>

        <AppCard accentColor={colors.yellow}>
          <Text style={styles.sectionTitle}>Girdi</Text>

          <View style={styles.toggleRow}>
            <View style={styles.toggleGroup}>
              <Text style={styles.toggleLabel}>Periyot</Text>
              <View style={styles.toggle}>
                <Pressable
                  accessibilityRole="button"
                  style={[styles.toggleBtn, period === 'monthly' && styles.toggleActive]}
                  onPress={() => setPeriod('monthly')}
                >
                  <Text style={[styles.toggleText, period === 'monthly' && styles.toggleTextActive]}>Aylık</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  style={[styles.toggleBtn, period === 'yearly' && styles.toggleActive]}
                  onPress={() => setPeriod('yearly')}
                >
                  <Text style={[styles.toggleText, period === 'yearly' && styles.toggleTextActive]}>Yıllık</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.toggleGroup}>
              <Text style={styles.toggleLabel}>Tip</Text>
              <View style={styles.toggle}>
                <Pressable
                  accessibilityRole="button"
                  style={[styles.toggleBtn, type === 'gross' && styles.toggleActive]}
                  onPress={() => setType('gross')}
                >
                  <Text style={[styles.toggleText, type === 'gross' && styles.toggleTextActive]}>Brüt</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  style={[styles.toggleBtn, type === 'net' && styles.toggleActive]}
                  onPress={() => setType('net')}
                >
                  <Text style={[styles.toggleText, type === 'net' && styles.toggleTextActive]}>Net</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <AppTextInput
            label={amountLabel}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            error={error}
          />
          <View style={styles.row2}>
            <View style={styles.row2Item}>
              <AppSelect label="Vergi sınıfı" value={taxClass} options={TAX_CLASS_OPTIONS} onChange={setTaxClass} />
            </View>
            <View style={styles.row2Item}>
              <AppSelect label="Eyalet" value={state} options={STATE_OPTIONS} onChange={setState} />
            </View>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Çocuk var</Text>
            <Switch value={hasChildren} onValueChange={setHasChildren} />
          </View>

          {hasChildren ? (
            <View style={styles.row2}>
              <View style={styles.row2Item}>
                <AppTextInput label="Çocuk sayısı" keyboardType="numeric" value={childrenCount} onChangeText={setChildrenCount} />
              </View>
              <View style={styles.row2Item}>
                <AppTextInput label="25 yaş altı" keyboardType="numeric" value={childrenUnder25} onChangeText={setChildrenUnder25} />
              </View>
            </View>
          ) : null}

          <View style={styles.toggleRow}>
            <View style={styles.toggleGroup}>
              <Text style={styles.toggleLabel}>Yaş</Text>
              <View style={styles.toggle}>
                <Pressable
                  accessibilityRole="button"
                  style={[styles.toggleBtn, !age23Plus && styles.toggleActiveSmall]}
                  onPress={() => setAge23Plus(false)}
                >
                  <Text style={[styles.toggleTextSmall, !age23Plus && styles.toggleTextActive]}>23 altı</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  style={[styles.toggleBtn, age23Plus && styles.toggleActiveSmall]}
                  onPress={() => setAge23Plus(true)}
                >
                  <Text style={[styles.toggleTextSmall, age23Plus && styles.toggleTextActive]}>23+</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.toggleGroup}>
              <View style={styles.switchRowCompact}>
                <Text style={styles.switchLabel}>Kilise vergisi</Text>
                <Switch value={churchTax} onValueChange={setChurchTax} />
              </View>
            </View>
          </View>

          <AppTextInput label="Kinderfreibetrag (ZKF)" keyboardType="numeric" value={childAllowance} onChangeText={setChildAllowance} />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Dienstwagen (Şirket Aracı)</Text>
            <Switch value={hasCompanyCar} onValueChange={setHasCompanyCar} />
          </View>

          {hasCompanyCar ? (
            <View style={styles.subSection}>
              <AppTextInput label="Brüt Liste Fiyatı (€)" keyboardType="numeric" value={carListPrice} onChangeText={setCarListPrice} />
              <View style={styles.toggle}>
                {CAR_RATE_OPTIONS.map((r) => (
                  <Pressable
                    key={r.value}
                    accessibilityRole="button"
                    style={[styles.toggleBtn, carRate === r.value && styles.toggleActiveSmall]}
                    onPress={() => setCarRate(r.value)}
                  >
                    <Text style={[styles.toggleTextSmall, carRate === r.value && styles.toggleTextActive]} numberOfLines={1}>
                      {r.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>İş yolu hesabı</Text>
                <Switch value={carCommuteEnabled} onValueChange={setCarCommuteEnabled} />
              </View>
              {carCommuteEnabled ? (
                <View style={styles.row2}>
                  <View style={styles.row2Item}>
                    <AppTextInput label="Mesafe (km)" keyboardType="numeric" value={carCommuteKm} onChangeText={setCarCommuteKm} />
                  </View>
                  <View style={styles.row2Item}>
                    <AppSelect
                      label="Mod"
                      value={carCommuteMode}
                      options={[
                        { label: 'Aylık', value: 'monthly' },
                        { label: 'Günlük', value: 'daily' },
                      ]}
                      onChange={(v) => setCarCommuteMode(v as 'monthly' | 'daily')}
                    />
                  </View>
                </View>
              ) : null}
              {carCommuteEnabled && carCommuteMode === 'daily' ? (
                <AppTextInput label="Gün sayısı" keyboardType="numeric" value={carCommuteDays} onChangeText={setCarCommuteDays} />
              ) : null}
            </View>
          ) : null}

          <Text style={styles.toggleLabel}>Sigorta</Text>
          <View style={styles.toggle}>
            <Pressable
              accessibilityRole="button"
              style={[styles.toggleBtn, insuranceType === 'gkv' && styles.toggleActive]}
              onPress={() => setInsuranceType('gkv')}
            >
              <Text style={[styles.toggleText, insuranceType === 'gkv' && styles.toggleTextActive]}>GKV (Yasal)</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={[styles.toggleBtn, insuranceType === 'pkv' && styles.toggleActive]}
              onPress={() => setInsuranceType('pkv')}
            >
              <Text style={[styles.toggleText, insuranceType === 'pkv' && styles.toggleTextActive]}>PKV (Özel)</Text>
            </Pressable>
          </View>

          {insuranceType === 'gkv' ? (
            <View style={styles.row2}>
              <View style={styles.row2Item}>
                <AppTextInput label="KV Kassensatz (%)" keyboardType="numeric" value={kvBase} onChangeText={setKvBase} />
              </View>
              <View style={styles.row2Item}>
                <AppTextInput label="KV Zusatz (%)" keyboardType="numeric" value={kvZusatz} onChangeText={setKvZusatz} />
              </View>
            </View>
          ) : (
            <View style={styles.row2}>
              <View style={styles.row2Item}>
                <AppTextInput label="PKV Primi (€)" keyboardType="numeric" value={pkvPremium} onChangeText={setPkvPremium} />
              </View>
              <View style={styles.row2Item}>
                <AppTextInput label="PPV Primi (€)" keyboardType="numeric" value={ppvPremium} onChangeText={setPpvPremium} />
              </View>
            </View>
          )}

          <View style={styles.calcBtn}>
            <AppButton label="Hesapla" onPress={onCalculate} />
          </View>
        </AppCard>

        {result ? (
          <>
            <View style={styles.resultsGrid}>
              <AppCard accentColor={colors.success} style={styles.resultCardSmall}>
                <Text style={styles.resultLabel}>Net (Aylık)</Text>
                <Text style={styles.resultNet}>{formatCurrency(result.netMonthly)}</Text>
              </AppCard>
              <AppCard accentColor={colors.success} style={styles.resultCardSmall}>
                <Text style={styles.resultLabel}>Net (Yıllık)</Text>
                <Text style={styles.resultNet}>{formatCurrency(result.netYearly)}</Text>
              </AppCard>
              <AppCard accentColor={colors.accent} style={styles.resultCardSmall}>
                <Text style={styles.resultLabel}>Brüt (Aylık)</Text>
                <Text style={styles.resultValue}>{formatCurrency(result.grossMonthly)}</Text>
              </AppCard>
              <AppCard accentColor={colors.accent} style={styles.resultCardSmall}>
                <Text style={styles.resultLabel}>Brüt (Yıllık)</Text>
                <Text style={styles.resultValue}>{formatCurrency(result.grossYearly)}</Text>
              </AppCard>
              <AppCard accentColor={colors.error} style={styles.resultCardSmall}>
                <Text style={styles.resultLabel}>Kesinti (Aylık)</Text>
                <Text style={styles.resultValue}>{formatCurrency(result.deductionsMonthly)}</Text>
              </AppCard>
              <AppCard accentColor={colors.error} style={styles.resultCardSmall}>
                <Text style={styles.resultLabel}>Kesinti (Yıllık)</Text>
                <Text style={styles.resultValue}>{formatCurrency(result.deductionsYearly)}</Text>
              </AppCard>
            </View>

            <AppCard
              accentColor={colors.yellow}
              onPress={() => setShowBreakdown(!showBreakdown)}
              accessibilityLabel="Nedir bu kesintiler?"
            >
              <View style={styles.infoHeader}>
                <Text style={styles.infoHeaderText}>Nedir bu kesintiler?</Text>
                <Text style={[styles.chevron, showBreakdown && styles.chevronOpen]}>▾</Text>
              </View>
              {showBreakdown ? (
                <View style={styles.breakdownBody}>
                  <Text style={styles.breakdownSectionTitle}>Aylık Kesintiler</Text>
                  <BreakdownRow label="Lohnsteuer (Gelir Vergisi)" value={result.tax.lohnsteuer} />
                  {result.kirchensteuer > 0 ? (
                    <BreakdownRow label="Kirchensteuer (Kilise Vergisi)" value={result.kirchensteuer} />
                  ) : null}
                  <BreakdownRow label="Solidaritätszuschlag (Dayanışma)" value={result.tax.soli} />
                  <BreakdownRow label="Krankenversicherung (Sağlık)" value={result.social.kv} />
                  <BreakdownRow label="Pflegeversicherung (Bakım)" value={result.social.pv} />
                  <BreakdownRow label="Rentenversicherung (Emeklilik)" value={result.social.rv} />
                  <BreakdownRow label="Arbeitslosenversicherung (İşsizlik)" value={result.social.av} />

                  <View style={styles.divider} />
                  <Text style={styles.breakdownSectionTitle}>Yıllık Kesintiler</Text>
                  <BreakdownRow label="Lohnsteuer (Gelir Vergisi)" value={result.tax.lohnsteuer * 12} />
                  {result.kirchensteuer > 0 ? (
                    <BreakdownRow label="Kirchensteuer (Kilise Vergisi)" value={result.kirchensteuer * 12} />
                  ) : null}
                  <BreakdownRow label="Solidaritätszuschlag (Dayanışma)" value={result.tax.soli * 12} />
                  <BreakdownRow label="Krankenversicherung (Sağlık)" value={result.social.kv * 12} />
                  <BreakdownRow label="Pflegeversicherung (Bakım)" value={result.social.pv * 12} />
                  <BreakdownRow label="Rentenversicherung (Emeklilik)" value={result.social.rv * 12} />
                  <BreakdownRow label="Arbeitslosenversicherung (İşsizlik)" value={result.social.av * 12} />
                </View>
              ) : null}
            </AppCard>

            {result.companyCarBenefit > 0 ? (
              <AppCard>
                <Text style={styles.resultLabel}>Dienstwagen Benefit (Aylık)</Text>
                <Text style={styles.resultValue}>{formatCurrency(result.companyCarBenefit)}</Text>
              </AppCard>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel} numberOfLines={2}>{label}</Text>
      <Text style={styles.rowValue}>{formatCurrency(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  betaBox: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  betaTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.warning },
  betaText: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.md },
  toggleRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  toggleGroup: { flex: 1 },
  toggleLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.textSecondary, marginBottom: spacing.xs },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    padding: 3,
    marginBottom: spacing.md,
  },
  toggleBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.sm, alignItems: 'center' },
  toggleActive: { backgroundColor: colors.accent },
  toggleActiveSmall: { backgroundColor: colors.accent },
  toggleText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.textSecondary },
  toggleTextSmall: { fontSize: fontSize.xs, fontWeight: fontWeight.medium, color: colors.textSecondary },
  toggleTextActive: { color: colors.textInverse },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  switchRowCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  switchLabel: { fontSize: fontSize.md, color: colors.textPrimary },
  row2: { flexDirection: 'row', gap: spacing.md },
  row2Item: { flex: 1 },
  subSection: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  calcBtn: { marginTop: spacing.md },
  resultsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  resultCardSmall: { flex: 1, minWidth: '45%', padding: spacing.md },
  resultLabel: { fontSize: fontSize.xs, color: colors.textSecondary },
  resultNet: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.success, marginTop: spacing.xs },
  resultValue: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary, marginTop: spacing.xs },
  divider: { height: 1, backgroundColor: colors.surface2, marginVertical: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs, gap: spacing.sm },
  rowLabel: { fontSize: fontSize.sm, color: colors.textSecondary, flex: 1 },
  rowValue: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textPrimary },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoHeaderText: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.textPrimary },
  chevron: { color: colors.accent, fontSize: fontSize.xl },
  chevronOpen: { transform: [{ rotate: '180deg' }] },
  infoBody: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.surface2 },
  infoItem: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.xs },
  infoBold: { fontWeight: fontWeight.bold },
  breakdownBody: { marginTop: spacing.md },
  breakdownSectionTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textPrimary, marginBottom: spacing.xs, marginTop: spacing.xs },
});
