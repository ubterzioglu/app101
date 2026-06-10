import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export function AppTextInput({ label, error, required, style, ...rest }: AppTextInputProps) {
  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.gray400}
        style={[styles.input, error ? styles.inputError : null, style]}
        accessibilityLabel={label}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray700,
    marginBottom: spacing.xs,
  },
  required: {
    color: colors.red,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.gray900,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.red,
  },
  error: {
    fontSize: fontSize.xs,
    color: colors.red,
    marginTop: spacing.xs,
  },
});
