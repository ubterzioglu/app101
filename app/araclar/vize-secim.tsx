import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, AppCard } from '@/components/ui';
import {
  getQuestion,
  resolveNext,
  startQuestionId,
} from '@/features/recommendations/visa/engine';
import type { VisaResult } from '@/features/recommendations/visa/data';
import { colors, fontSize, fontWeight, radius, spacing, MIN_TOUCH_TARGET } from '@/theme';

const RESULT_COLOR: Record<VisaResult['color'], string> = {
  blue: colors.blue,
  green: colors.green,
  yellow: colors.yellow,
  orange: colors.orange,
  red: colors.red,
};

export default function VisaScreen() {
  const [currentId, setCurrentId] = useState(startQuestionId);
  const [stack, setStack] = useState<string[]>([]);
  const [result, setResult] = useState<VisaResult | null>(null);

  const question = getQuestion(currentId);

  function choose(next: string) {
    const resolved = resolveNext(next);
    if (resolved.result) {
      setStack((s) => [...s, currentId]);
      setResult(resolved.result);
    } else if (resolved.question) {
      setStack((s) => [...s, currentId]);
      setCurrentId(resolved.question.id);
    }
  }

  function back() {
    setResult(null);
    setStack((s) => {
      if (s.length === 0) return s;
      const prev = s[s.length - 1];
      setCurrentId(prev);
      return s.slice(0, -1);
    });
  }

  function restart() {
    setCurrentId(startQuestionId);
    setStack([]);
    setResult(null);
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Vize Seçim Aracı" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        {result ? (
          <>
            <AppCard accentColor={RESULT_COLOR[result.color]} style={styles.resultCard}>
              <Text style={styles.resultTitle}>{result.title}</Text>
              <Text style={styles.resultSubtitle}>{result.subtitle}</Text>

              {result.requirements.length > 0 ? (
                <View style={styles.block}>
                  <Text style={styles.blockTitle}>Gereksinimler</Text>
                  {result.requirements.map((r, i) => (
                    <Text key={i} style={styles.listItem}>
                      • {r}
                    </Text>
                  ))}
                </View>
              ) : null}

              {result.steps.length > 0 ? (
                <View style={styles.block}>
                  <Text style={styles.blockTitle}>Adımlar</Text>
                  {result.steps.map((s, i) => (
                    <Text key={i} style={styles.listItem}>
                      {i + 1}. {s}
                    </Text>
                  ))}
                </View>
              ) : null}

              {result.note ? <Text style={styles.note}>{result.note}</Text> : null}
            </AppCard>
            <View style={styles.actions}>
              <AppButton label="Geri" variant="outline" onPress={back} />
              <AppButton label="Baştan Başla" onPress={restart} />
            </View>
          </>
        ) : question ? (
          <>
            <AppCard accentColor={colors.blue} style={styles.questionCard}>
              <Text style={styles.questionText}>{question.text}</Text>
              {question.hint ? <Text style={styles.hint}>{question.hint}</Text> : null}
              <View style={styles.options}>
                {question.options.map((opt) => (
                  <Pressable
                    key={opt.key}
                    accessibilityRole="button"
                    style={styles.option}
                    onPress={() => choose(opt.next)}
                  >
                    <Text style={styles.optionLabel}>{opt.label}</Text>
                  </Pressable>
                ))}
              </View>
            </AppCard>
            {stack.length > 0 ? (
              <View style={styles.actions}>
                <AppButton label="Önceki Soru" variant="outline" onPress={back} />
              </View>
            ) : null}
          </>
        ) : (
          <Text style={styles.error}>Bu adım bulunamadı.</Text>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  questionCard: { gap: spacing.sm },
  questionText: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.gray900 },
  hint: { fontSize: fontSize.xs, color: colors.gray500 },
  options: { gap: spacing.sm, marginTop: spacing.sm },
  option: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  optionLabel: { fontSize: fontSize.md, color: colors.gray800 },
  actions: { gap: spacing.sm },
  resultCard: { gap: spacing.sm },
  resultTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.gray900 },
  resultSubtitle: { fontSize: fontSize.sm, color: colors.gray600 },
  block: { marginTop: spacing.md },
  blockTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.gray800, marginBottom: spacing.xs },
  listItem: { fontSize: fontSize.sm, color: colors.gray700, marginBottom: 2 },
  note: { fontSize: fontSize.xs, color: colors.gray500, marginTop: spacing.md, fontStyle: 'italic' },
  error: { fontSize: fontSize.md, color: colors.red, textAlign: 'center' },
});
