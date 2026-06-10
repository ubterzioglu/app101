import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing, MIN_TOUCH_TARGET } from '@/theme';

interface QuizOptionProps {
  optionKey: string;
  label: string;
  answered: boolean;
  isSelected: boolean;
  isCorrect: boolean;
  onPress: () => void;
}

export function QuizOption({
  optionKey,
  label,
  answered,
  isSelected,
  isCorrect,
  onPress,
}: QuizOptionProps) {
  const showCorrect = answered && isCorrect;
  const showWrong = answered && isSelected && !isCorrect;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: answered, selected: isSelected }}
      disabled={answered}
      onPress={onPress}
      style={[
        styles.option,
        showCorrect && styles.correct,
        showWrong && styles.wrong,
        !answered && isSelected && styles.selected,
        answered && !isSelected && !isCorrect && styles.dimmed,
      ]}
    >
      <Text style={styles.text}>
        <Text style={styles.key}>{optionKey.toUpperCase()}) </Text>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.blue,
    backgroundColor: '#EAF2FE',
    marginBottom: spacing.sm,
  },
  selected: { backgroundColor: '#D6E4FD' },
  correct: { borderColor: colors.green, backgroundColor: '#E6F4EA' },
  wrong: { borderColor: colors.red, backgroundColor: '#FCE8E6' },
  dimmed: { opacity: 0.6 },
  text: { fontSize: fontSize.sm, color: colors.gray800 },
  key: { fontWeight: fontWeight.bold },
});
