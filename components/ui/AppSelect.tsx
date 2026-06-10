import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing, MIN_TOUCH_TARGET } from '@/theme';

export interface SelectOption {
  label: string;
  value: string;
}

interface AppSelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  required?: boolean;
}

export function AppSelect({
  label,
  placeholder = 'Seçiniz',
  value,
  options,
  onChange,
  required,
}: AppSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        style={styles.trigger}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.triggerText, !selected && styles.placeholder]} numberOfLines={1}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  style={styles.option}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[styles.optionText, item.value === value && styles.optionSelected]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray700,
    marginBottom: spacing.xs,
  },
  required: { color: colors.red },
  trigger: {
    minHeight: MIN_TOUCH_TARGET,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  triggerText: { fontSize: fontSize.md, color: colors.gray900, flex: 1 },
  placeholder: { color: colors.gray400 },
  chevron: { color: colors.blue, fontSize: fontSize.lg, marginLeft: spacing.sm },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '60%',
    paddingVertical: spacing.sm,
  },
  option: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  optionText: { fontSize: fontSize.md, color: colors.gray800 },
  optionSelected: { color: colors.blue, fontWeight: fontWeight.semibold },
});
