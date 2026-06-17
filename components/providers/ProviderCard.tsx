import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui';
import type { Provider } from '@/features/providers/types';
import { PROVIDER_CATEGORIES } from '@/features/providers/types';
import { colors, fontSize, fontWeight, lineHeight, radius, spacing } from '@/theme';

function categoryLabel(type: string): { label: string; icon: string } {
  const found = PROVIDER_CATEGORIES.find((c) => c.id === type);
  if (found) return { label: found.label, icon: found.icon };
  return { label: type, icon: '📍' };
}

interface ProviderCardProps {
  provider: Provider;
  onPress: () => void;
}

export function ProviderCard({ provider, onPress }: ProviderCardProps) {
  const { label, icon } = categoryLabel(provider.type);
  return (
    <AppCard
      variant="elevated"
      style={styles.card}
      accessibilityLabel={provider.name}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>
            {provider.name || 'İsimsiz'}
          </Text>
          <Text style={styles.category} numberOfLines={1}>
            {label} · {provider.city}
          </Text>
        </View>
      </View>
      {provider.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {provider.description}
        </Text>
      ) : null}
      <View style={styles.footer}>
        <Text style={styles.detailHint}>Detayları gör →</Text>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.sm, gap: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: { fontSize: 24 },
  headerText: { flex: 1 },
  name: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textPrimary },
  category: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  detailHint: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.greenAccent,
  },
});
