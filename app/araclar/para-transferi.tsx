import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, AppCard } from '@/components/ui';
import { ProgressBar } from '@/components/tools/ProgressBar';
import { rankTransferSystems, TRANSFER_QUESTIONS } from '@/features/recommendations/transfer/engine';
import type { TransferAnswers, RankedTransferSystem } from '@/features/recommendations/transfer/engine';
import { colors, fontSize, fontWeight, radius, spacing, MIN_TOUCH_TARGET } from '@/theme';

const YESNO_OPTIONS = [
  { key: 'yes', label: 'Evet' },
  { key: 'no', label: 'Hayır' },
];

const TAG_COLOR: Record<string, string> = {
  purple: colors.accent,
  red: colors.error,
  '': colors.textSecondary,
};

export default function TransferScreen() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<TransferAnswers>({});
  const [done, setDone] = useState(false);

  const total = TRANSFER_QUESTIONS.length;
  const question = TRANSFER_QUESTIONS[index];

  const ranked = useMemo<RankedTransferSystem[]>(
    () => (done ? rankTransferSystems(answers, 5) : []),
    [done, answers]
  );

  function choose(optionKey: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: optionKey }));
    if (index < total - 1) setIndex(index + 1);
    else setDone(true);
  }

  function restart() {
    setIndex(0);
    setAnswers({});
    setDone(false);
  }

  if (done) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Para Transferi Aracı" showBack />
        <ScrollView contentContainerStyle={styles.content}>
          <AppCard accentColor={colors.accent}>
            <Text style={styles.resultTitle}>Size En Uygun Sistemler</Text>
            <Text style={styles.resultDesc}>
              Tercihlerinize göre sıralanmıştır. Transferden önce güncel kur ve ücreti kontrol edin.
            </Text>
          </AppCard>

          {ranked.map((sys, idx) => (
            <AppCard
              key={sys.id}
              accentColor={idx === 0 ? colors.success : colors.accent}
              style={styles.resultCard}
            >
              <View style={styles.resultHeader}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{sys.rank}</Text>
                </View>
                <View style={styles.resultNameBlock}>
                  <Text style={styles.resultName}>{sys.name}</Text>
                  {idx === 0 ? <Text style={styles.bestLabel}>En uygun</Text> : null}
                </View>
              </View>

              <View style={styles.tags}>
                {sys.tags.map((tag) => (
                  <View key={tag} style={[styles.tag, { borderColor: TAG_COLOR[sys.color] }]}>
                    <Text style={[styles.tagText, { color: TAG_COLOR[sys.color] }]}>{tag}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.scoresRow}>
                <ScoreChip label="Maliyet" value={sys.scores.cost} />
                <ScoreChip label="Hız" value={sys.scores.speed} />
                <ScoreChip label="Online" value={sys.scores.online} />
                <ScoreChip label="Nakit" value={sys.scores.cash} />
              </View>
            </AppCard>
          ))}

          <AppButton label="Baştan Başla" variant="outline" onPress={restart} />
          <Text style={styles.note}>
            Sonuçlar bilgilendirme amaçlıdır; transferden önce güncel kur ve ücreti kontrol edin.
          </Text>
        </ScrollView>
      </ScreenContainer>
    );
  }

  const options =
    question.type === 'yesno'
      ? YESNO_OPTIONS
      : (question.options ?? []);

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Para Transferi Aracı" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>Soru {index + 1} / {total}</Text>
          <Pressable onPress={restart} accessibilityRole="button">
            <Text style={styles.resetLink}>Sıfırla</Text>
          </Pressable>
        </View>
        <ProgressBar value={(index + 1) / total} color={colors.accent} />

        <AppCard accentColor={colors.accent} style={styles.questionCard}>
          <Text style={styles.questionTitle}>{question.title}</Text>
          {question.desc ? <Text style={styles.questionDesc}>{question.desc}</Text> : null}
          <View style={styles.options}>
            {options.map((opt) => (
              <Pressable
                key={opt.key}
                accessibilityRole="button"
                style={[
                  styles.option,
                  answers[question.id] === opt.key && styles.optionSelected,
                ]}
                onPress={() => choose(opt.key)}
              >
                <Text style={styles.optionLabel}>{opt.label}</Text>
                {'desc' in opt && typeof (opt as { desc?: string }).desc === 'string' ? (
                  <Text style={styles.optionDesc}>{(opt as { desc: string }).desc}</Text>
                ) : null}
              </Pressable>
            ))}
          </View>
        </AppCard>

        {index > 0 ? (
          <AppButton
            label="Önceki Soru"
            variant="outline"
            onPress={() => setIndex(index - 1)}
          />
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

function ScoreChip({ label, value }: { label: string; value: number }) {
  const filled = Math.round(value);
  return (
    <View style={styles.chip}>
      <Text style={styles.chipLabel}>{label}</Text>
      <View style={styles.chipDots}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i < filled ? styles.dotFilled : styles.dotEmpty]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.textSecondary },
  resetLink: { fontSize: fontSize.sm, color: colors.accent },
  questionCard: { gap: spacing.sm },
  questionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary },
  questionDesc: { fontSize: fontSize.sm, color: colors.textSecondary },
  options: { gap: spacing.sm, marginTop: spacing.sm },
  option: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  optionSelected: { borderColor: colors.accent, backgroundColor: `${colors.accent}15` },
  optionLabel: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.textPrimary },
  optionDesc: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  resultTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.textPrimary },
  resultDesc: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
  resultCard: { gap: spacing.sm },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textInverse },
  resultNameBlock: { flex: 1 },
  resultName: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textPrimary },
  bestLabel: { fontSize: fontSize.xs, color: colors.success, fontWeight: fontWeight.semibold },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  tag: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  tagText: { fontSize: fontSize.xs },
  scoresRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  chip: { alignItems: 'center', gap: 2 },
  chipLabel: { fontSize: fontSize.xs, color: colors.textSecondary },
  chipDots: { flexDirection: 'row', gap: 2 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotFilled: { backgroundColor: colors.accent },
  dotEmpty: { backgroundColor: colors.surface2 },
  note: { fontSize: fontSize.xs, color: colors.textSecondary, fontStyle: 'italic' },
});
