import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, AppCard, AppSelect, AppTextInput } from '@/components/ui';
import { calculateSalary, formatCurrency } from '@/features/salary/calculator';
import { STATES, TAX_CLASSES, type SalaryInput, type SalaryResult } from '@/features/salary/types';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

const STATE_OPTIONS = STATES.map((s) => ({ label: s.name, value: s.code }));
const TAX_CLASS_OPTIONS = TAX_CLASSES.map((t) => ({ label: t.label, value: t.value }));

export default function SalaryScreen() {
  const [type, setType] = useState<'gross' | 'net'>('gross');
  const [amount, setAmount] = useState('3000');
  const [taxClass, setTaxClass] = useState('1');
  const [state, setState] = useState('NRW');
  const [churchTax, setChurchTax] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
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
      period: 'monthly',
      type,
      taxClass: taxClass as SalaryInput['taxClass'],
      state,
      hasChildren,
      childrenCount: hasChildren ? 1 : 0,
      childrenUnder25Count: hasChildren ? 1 : 0,
      age23Plus: true,
      churchTax,
      childAllowance: 0,
      insuranceType: 'gkv',
      kvBase: 14.6,
      kvZusatz: 2.5,
      pkvPremium: 0,
      ppvPremium: 0,
    };
    setResult(calculateSalary(input));
  }

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

        <View style={styles.toggle}>
          <Pressable
            accessibilityRole="button"
            style={[styles.toggleBtn, type === 'gross' && styles.toggleActive]}
            onPress={() => setType('gross')}
          >
            <Text style={[styles.toggleText, type === 'gross' && styles.toggleTextActive]}>
              Brüt → Net
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={[styles.toggleBtn, type === 'net' && styles.toggleActive]}
            onPress={() => setType('net')}
          >
            <Text style={[styles.toggleText, type === 'net' && styles.toggleTextActive]}>
              Net → Brüt
            </Text>
          </Pressable>
        </View>

        <AppTextInput
          label={type === 'gross' ? 'Aylık brüt (€)' : 'Aylık net (€)'}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          error={error}
        />
        <AppSelect label="Vergi sınıfı" value={taxClass} options={TAX_CLASS_OPTIONS} onChange={setTaxClass} />
        <AppSelect label="Eyalet" value={state} options={STATE_OPTIONS} onChange={setState} />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Kilise vergisi</Text>
          <Switch value={churchTax} onValueChange={setChurchTax} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Çocuk var</Text>
          <Switch value={hasChildren} onValueChange={setHasChildren} />
        </View>

        <View style={styles.calcBtn}>
          <AppButton label="Hesapla" onPress={onCalculate} />
        </View>

        {result ? (
          <AppCard accentColor={colors.green} style={styles.resultCard}>
            <Text style={styles.resultLabel}>Aylık net</Text>
            <Text style={styles.resultNet}>{formatCurrency(result.netMonthly)}</Text>
            <Text style={styles.resultSub}>Brüt: {formatCurrency(result.grossMonthly)}</Text>

            <View style={styles.divider} />
            <Row label="Lohnsteuer" value={result.tax.lohnsteuer} />
            <Row label="Soli" value={result.tax.soli} />
            <Row label="Kilise vergisi" value={result.kirchensteuer} />
            <Row label="Sağlık (KV)" value={result.social.kv} />
            <Row label="Bakım (PV)" value={result.social.pv} />
            <Row label="Emeklilik (RV)" value={result.social.rv} />
            <Row label="İşsizlik (AV)" value={result.social.av} />
            <View style={styles.divider} />
            <Row label="Toplam kesinti" value={result.deductionsMonthly} bold />
          </AppCard>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.rowBold]}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.rowBold]}>{formatCurrency(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  betaBox: {
    backgroundColor: '#FFF7E6',
    borderWidth: 1,
    borderColor: colors.orange,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  betaTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.orange },
  betaText: { fontSize: fontSize.xs, color: colors.gray700, marginTop: spacing.xs },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.gray100,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.lg,
  },
  toggleBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.sm, alignItems: 'center' },
  toggleActive: { backgroundColor: colors.blue },
  toggleText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.gray600 },
  toggleTextActive: { color: colors.white },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  switchLabel: { fontSize: fontSize.md, color: colors.gray800 },
  calcBtn: { marginTop: spacing.lg },
  resultCard: { marginTop: spacing.lg },
  resultLabel: { fontSize: fontSize.sm, color: colors.gray500 },
  resultNet: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.green },
  resultSub: { fontSize: fontSize.sm, color: colors.gray500, marginTop: spacing.xs },
  divider: { height: 1, backgroundColor: colors.gray200, marginVertical: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  rowLabel: { fontSize: fontSize.sm, color: colors.gray600 },
  rowValue: { fontSize: fontSize.sm, color: colors.gray800 },
  rowBold: { fontWeight: fontWeight.bold, color: colors.gray900 },
});
