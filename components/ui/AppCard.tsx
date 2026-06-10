import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/theme';

interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  accentColor?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function AppCard({ children, onPress, accentColor, style, accessibilityLabel }: AppCardProps) {
  const cardStyle = [
    styles.card,
    accentColor ? { borderColor: accentColor, borderWidth: 2 } : styles.defaultBorder,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [...cardStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={cardStyle} accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  defaultBorder: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.9,
  },
});
