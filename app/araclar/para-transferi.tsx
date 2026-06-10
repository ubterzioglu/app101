import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, AppCard, AppTextInput } from '@/components/ui';
import { rankTransfers } from '@/features/recommendations/transfer/engine';
import { colors, fontSize, fontWeight, spacing } from '@/theme';

function formatEUR(value: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}
function formatTRY(value: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
}

export default function TransferScreen() {
  const [amount, setAmount] = useState('1000');
  const [submitted, setSubmitted] = useState(1000);
  const [error, setError] = useState('');

  const results = useMemo(() => rankTransfers(submitted), [submitted]);

  function onCalculate() {
    const value = Number(amount.replace(',', '.'));
    if (!Number.isFinite(value) || value <= 0) {
      setError('Lütfen geçerli, pozitif bir tutar girin.');
      return;
    }
    setError('');
    setSubmitted(value);
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Para Transferi Aracı" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lead}>Almanya'dan Türkiye'ye en uygun transfer yöntemini bulun.</Text>
        <AppTextInput
          label="Gönderilecek tutar (€)"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          error={error}
        />
        <AppButton label="Hesapla" onPress={onCalculate} />

        <Text style={styles.note}>
          Sonuçlar bilgilendirme amaçlıdır; transferden önce güncel kuru ve ücreti kontrol edin.
        </Text>

        {results.map((r, idx) => (
          <AppCard key={r.id} accentColor={idx === 0 ? colors.green : undefined} style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.logo}>{r.logo}</Text>
              <View style={styles.headerText}>
                <Text style={styles.name}>{r.name}</Text>
                <Text style={styles.time}>{r.transferTime} · ⭐ {r.rating}</Text>
              </View>
              {idx === 0 ? <Text style={styles.best}>En avantajlı</Text> : null}
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Ücret</Text>
              <Text style={styles.rowValue}>{formatEUR(r.fee)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Eline geçen</Text>
              <Text style={styles.received}>{formatTRY(r.receivedAmount)}</Text>
            </View>
          </AppCard>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  lead: { fontSize: fontSize.sm, color: colors.gray600 },
  note: { fontSize: fontSize.xs, color: colors.gray500, fontStyle: 'italic' },
  card: { gap: spacing.xs },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  logo: { fontSize: 26, marginRight: spacing.md },
  headerText: { flex: 1 },
  name: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.gray900 },
  time: { fontSize: fontSize.xs, color: colors.gray500 },
  best: { fontSize: fontSize.xs, color: colors.green, fontWeight: fontWeight.bold },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  rowLabel: { fontSize: fontSize.sm, color: colors.gray600 },
  rowValue: { fontSize: fontSize.sm, color: colors.gray800 },
  received: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.green },
});
