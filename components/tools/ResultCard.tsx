import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

interface ResultCardProps {
  total: number;
  correct: number;
  showPassFail?: boolean;
  passed?: boolean;
}

export function ResultCard({ total, correct, showPassFail, passed }: ResultCardProps) {
  const wrong = Math.max(0, total - correct);
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Test Sonucu</Text>
      <Text style={styles.summary}>
        Toplam <Text style={styles.bold}>{total}</Text> sorudan{' '}
        <Text style={styles.correctText}>{correct}</Text> doğru.
      </Text>
      <View style={styles.badges}>
        <View style={[styles.badge, styles.badgeCorrect]}>
          <Text style={styles.badgeCorrectText}>{correct} Doğru</Text>
        </View>
        <View style={[styles.badge, styles.badgeWrong]}>
          <Text style={styles.badgeWrongText}>{wrong} Yanlış</Text>
        </View>
      </View>
      {showPassFail ? (
        <View style={[styles.result, passed ? styles.pass : styles.fail]}>
          <Text style={passed ? styles.passText : styles.failText}>
            {passed
              ? 'Tebrikler! Sınavı geçtiniz.'
              : 'Maalesef geçemediniz. En az 17 doğru gerekir.'}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.green,
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.gray900 },
  summary: { fontSize: fontSize.sm, color: colors.gray500, marginTop: spacing.xs, textAlign: 'center' },
  bold: { fontWeight: fontWeight.bold, color: colors.gray900 },
  correctText: { fontWeight: fontWeight.bold, color: colors.green },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  badge: { borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderWidth: 1 },
  badgeCorrect: { backgroundColor: '#E6F4EA', borderColor: '#A8DAB5' },
  badgeWrong: { backgroundColor: '#FCE8E6', borderColor: '#F3B8B2' },
  badgeCorrectText: { color: colors.green, fontWeight: fontWeight.semibold, fontSize: fontSize.sm },
  badgeWrongText: { color: colors.red, fontWeight: fontWeight.semibold, fontSize: fontSize.sm },
  result: { marginTop: spacing.lg, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, alignSelf: 'stretch' },
  pass: { backgroundColor: '#E6F4EA', borderColor: '#A8DAB5' },
  fail: { backgroundColor: '#FCE8E6', borderColor: '#F3B8B2' },
  passText: { color: colors.green, fontWeight: fontWeight.semibold, textAlign: 'center' },
  failText: { color: colors.red, fontWeight: fontWeight.semibold, textAlign: 'center' },
});
