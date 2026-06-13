import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui';
import type { Provider } from '@/features/providers/types';
import { PROVIDER_CATEGORIES } from '@/features/providers/types';
import { colors, fontSize, fontWeight, spacing } from '@/theme';

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
    <AppCard style={styles.card} accessibilityLabel={provider.name} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>
            {provider.name || 'İsimsiz'}
          </Text>
          <Text style={styles.category}>
            {label} · {provider.city}
          </Text>
        </View>
      </View>
      {provider.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {provider.description}
        </Text>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 26, marginRight: spacing.md },
  headerText: { flex: 1 },
  name: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textPrimary },
  category: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  description: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.sm },
});
