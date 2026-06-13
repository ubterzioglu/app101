import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton, AppCard } from '@/components/ui';
import { ProgressBar } from '@/components/tools/ProgressBar';
import {
  recommend,
  type Answers,
  type RecConfig,
  type RankedItem,
} from '@/features/recommendations/engine';
import { colors, fontSize, fontWeight, radius, spacing, MIN_TOUCH_TARGET } from '@/theme';

interface RecommendationToolProps {
  config: RecConfig;
  accentColor?: string;
}

// Shared question-flow + results UI for all recommendation tools (plan §13.2).
// Pure-engine output is rendered; logic lives in features/recommendations.
export function RecommendationTool({ config, accentColor = colors.accent }: RecommendationToolProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const total = config.questions.length;
  const question = config.questions[index];

  const results = useMemo<RankedItem[]>(
    () => (done ? recommend(config, answers, 3) : []),
    [done, config, answers]
  );

  function choose(optionKey: string) {
    const next = { ...answers, [question.id]: optionKey };
    setAnswers(next);
    if (index < total - 1) {
      setIndex(index + 1);
    } else {
      setDone(true);
    }
  }

  function restart() {
    setIndex(0);
    setAnswers({});
    setDone(false);
  }

  if (done) {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.resultsTitle}>Sana en uygun ilk 3 seçenek</Text>
        {results.map((item) => (
          <AppCard key={item.id} accentColor={accentColor} style={styles.resultCard}>
            <View style={styles.rankRow}>
              <View style={[styles.rankBadge, { backgroundColor: accentColor }]}>
                <Text style={styles.rankText}>{item.rank}</Text>
              </View>
              <View style={styles.resultText}>
                <Text style={styles.resultName}>{item.name}</Text>
                {item.type ? <Text style={styles.resultType}>{item.type}</Text> : null}
              </View>
            </View>
          </AppCard>
        ))}
        <View style={styles.restart}>
          <AppButton label="Yeniden Başla" variant="outline" onPress={restart} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.progressText}>
        Soru {index + 1} / {total}
      </Text>
      <ProgressBar value={(index + 1) / total} color={accentColor} />

      <AppCard accentColor={accentColor} style={styles.questionCard}>
        <Text style={styles.questionTitle}>{question.title}</Text>
        {question.desc ? <Text style={styles.questionDesc}>{question.desc}</Text> : null}

        <View style={styles.options}>
          {question.options.map((opt) => (
            <Pressable
              key={opt.key}
              accessibilityRole="button"
              style={styles.option}
              onPress={() => choose(opt.key)}
            >
              <Text style={styles.optionLabel}>{opt.label}</Text>
              {opt.desc ? <Text style={styles.optionDesc}>{opt.desc}</Text> : null}
            </Pressable>
          ))}
        </View>
      </AppCard>

      {index > 0 ? (
        <View style={styles.back}>
          <AppButton label="Önceki Soru" variant="outline" onPress={() => setIndex(index - 1)} />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  progressText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.textSecondary },
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
  optionLabel: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.textPrimary },
  optionDesc: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  back: { marginTop: spacing.sm },
  resultsTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary },
  resultCard: {},
  rankRow: { flexDirection: 'row', alignItems: 'center' },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rankText: { color: colors.white, fontWeight: fontWeight.bold, fontSize: fontSize.md },
  resultText: { flex: 1 },
  resultName: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textPrimary },
  resultType: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  restart: { marginTop: spacing.lg },
});
