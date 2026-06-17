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
        style={({ pressed }) => [styles.trigger, open && styles.triggerOpen, pressed && styles.pressed]}
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
            <View style={styles.sheetHandle} />
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionSelected]}>
                      {item.label}
                    </Text>
                    {isSelected ? <Text style={styles.check}>✓</Text> : null}
                  </Pressable>
                );
              }}
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
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  required: { color: colors.error },
  trigger: {
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface3,
  },
  triggerOpen: {
    borderColor: colors.accent,
    backgroundColor: colors.surface4,
  },
  pressed: { opacity: 0.9 },
  triggerText: { fontSize: fontSize.md, color: colors.textPrimary, flex: 1 },
  placeholder: { color: colors.textMuted },
  chevron: { color: colors.accent, fontSize: fontSize.lg, marginLeft: spacing.sm },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface1,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    borderTopWidth: 1,
    borderColor: colors.border,
    maxHeight: '60%',
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surface4,
    marginBottom: spacing.sm,
  },
  option: {
    minHeight: MIN_TOUCH_TARGET,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionPressed: { backgroundColor: colors.surface2 },
  optionText: { fontSize: fontSize.md, color: colors.textPrimary },
  optionSelected: { color: colors.accent, fontWeight: fontWeight.semibold },
  check: { color: colors.accent, fontSize: fontSize.md, fontWeight: fontWeight.bold },
});
