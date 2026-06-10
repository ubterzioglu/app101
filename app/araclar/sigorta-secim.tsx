import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, AppCard } from '@/components/ui';
import { ProgressBar } from '@/components/tools/ProgressBar';
import { INSURANCE_QUESTIONS } from '@/features/recommendations/insurance/data';
import { classifyInsuranceFromAnswers } from '@/features/recommendations/insurance/engine';
import type { ScoredInsurance } from '@/features/recommendations/insurance/types';
import { colors, fontSize, fontWeight, radius, spacing, MIN_TOUCH_TARGET } from '@/theme';

interface DisplayOption {
  key: string;
  label: string;
  desc?: string;
}

const YESNO_OPTIONS: DisplayOption[] = [
  { key: 'yes', label: 'Evet' },
  { key: 'no', label: 'Hayır' },
];

export default function InsuranceScreen() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const total = INSURANCE_QUESTIONS.length;
  const question = INSURANCE_QUESTIONS[index];

  const classified = useMemo(
    () => (done ? classifyInsuranceFromAnswers(answers) : null),
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

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Sigorta Seçim Aracı" showBack />
      {done && classified ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Section title="Olmazsa olmaz" color={colors.red} items={classified.must} />
          <Section title="Önerilir" color={colors.orange} items={classified.should} />
          <Section title="İsteğe bağlı" color={colors.green} items={classified.nice} />
          <View style={styles.restart}>
            <AppButton label="Yeniden Başla" variant="outline" onPress={restart} />
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.progressText}>
            Soru {index + 1} / {total}
          </Text>
          <ProgressBar value={(index + 1) / total} color={colors.green} />
          <AppCard accentColor={colors.green} style={styles.questionCard}>
            <Text style={styles.questionTitle}>{question.title}</Text>
            {question.desc ? <Text style={styles.questionDesc}>{question.desc}</Text> : null}
            <View style={styles.options}>
              {(question.type === 'yesno'
                ? YESNO_OPTIONS
                : (question.options ?? []).map<DisplayOption>((o) => ({
                    key: o.key,
                    label: o.label,
                    desc: o.desc,
                  }))
              ).map((opt) => (
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
      )}
    </ScreenContainer>
  );
}

function Section({ title, color, items }: { title: string; color: string; items: ScoredInsurance[] }) {
  if (items.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      {items.map((item) => (
        <AppCard key={item.key} accentColor={color} style={styles.itemCard}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {item.reasons[0] ? <Text style={styles.itemReason}>{item.reasons[0]}</Text> : null}
        </AppCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  progressText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.gray600 },
  questionCard: { gap: spacing.sm },
  questionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.gray900 },
  questionDesc: { fontSize: fontSize.sm, color: colors.gray500 },
  options: { gap: spacing.sm, marginTop: spacing.sm },
  option: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  optionLabel: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.gray800 },
  optionDesc: { fontSize: fontSize.xs, color: colors.gray500, marginTop: 2 },
  back: { marginTop: spacing.sm },
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  itemCard: {},
  itemTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.gray900 },
  itemReason: { fontSize: fontSize.sm, color: colors.gray600, marginTop: spacing.xs },
  restart: { marginTop: spacing.lg },
});
