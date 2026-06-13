import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

import { colors, spacing, MAX_CONTENT_WIDTH } from '@/theme';
import { OfflineBanner } from '@/components/ui/OfflineBanner';

interface ScreenContainerProps {
  children: React.ReactNode;
  padded?: boolean;
  edges?: Edge[];
  style?: ViewStyle;
  showOfflineBanner?: boolean;
}

export function ScreenContainer({
  children,
  padded = true,
  edges = ['top', 'left', 'right'],
  style,
  showOfflineBanner = true,
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      {showOfflineBanner ? <OfflineBanner /> : null}
      <View style={[styles.inner, padded && styles.padded, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface0,
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  padded: {
    paddingHorizontal: spacing.lg,
  },
});
