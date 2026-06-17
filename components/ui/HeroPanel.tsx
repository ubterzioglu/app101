import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, lineHeight, radius, shadow, spacing } from '@/theme';
import { AppButton } from './AppButton';

interface HeroPanelProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  image?: React.ReactNode;
}

export function HeroPanel({
  title,
  subtitle,
  description,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  image,
}: HeroPanelProps) {
  const hasPrimary = primaryActionLabel && onPrimaryAction;
  const hasSecondary = secondaryActionLabel && onSecondaryAction;

  return (
    <View style={styles.wrapper}>
      {/* Decorative glow orbs — pure-View, no extra dependency */}
      <View style={styles.orbTop} pointerEvents="none" />
      <View style={styles.orbBottom} pointerEvents="none" />

      {image ? <View style={styles.imageWrap}>{image}</View> : null}

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}

      {hasPrimary || hasSecondary ? (
        <View style={styles.actions}>
          {hasPrimary ? (
            <View style={styles.actionButton}>
              <AppButton label={primaryActionLabel} onPress={onPrimaryAction} variant="primary" />
            </View>
          ) : null}
          {hasSecondary ? (
            <View style={styles.actionButton}>
              <AppButton
                label={secondaryActionLabel}
                onPress={onSecondaryAction}
                variant="outline"
              />
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.xl,
    ...shadow.glow,
  },
  orbTop: {
    position: 'absolute',
    top: -70,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.yellowGlow,
    opacity: 0.6,
  },
  orbBottom: {
    position: 'absolute',
    bottom: -90,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.accentMuted,
  },
  imageWrap: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  description: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: fontSize.md * lineHeight.normal,
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  actionButton: {
    width: '100%',
  },
});
