import { ScrollView, StyleSheet, View } from 'react-native';

import { AppSelect, AppTextInput, ModernChip } from '@/components/ui';
import { PROVIDER_CATEGORIES, type ProviderType } from '@/features/providers/types';
import { colors, radius, spacing } from '@/theme';

interface ProviderFiltersProps {
  category: ProviderType | 'all';
  city: string;
  query: string;
  cities: string[];
  onCategoryChange: (c: ProviderType | 'all') => void;
  onCityChange: (c: string) => void;
  onQueryChange: (q: string) => void;
}

const CATEGORY_CHIPS: { id: ProviderType | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'Tümü', icon: '📋' },
  ...PROVIDER_CATEGORIES.map((c) => ({ id: c.id, label: c.label, icon: c.icon })),
];

export function ProviderFilters({
  category,
  city,
  query,
  cities,
  onCategoryChange,
  onCityChange,
  onQueryChange,
}: ProviderFiltersProps) {
  const cityOptions = [
    { label: 'Tüm şehirler', value: 'all' },
    ...cities.map((c) => ({ label: c, value: c })),
  ];

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <AppTextInput
          placeholder="Hizmet veya isim ara..."
          value={query}
          onChangeText={onQueryChange}
          autoCorrect={false}
        />
        <AppSelect
          placeholder="Şehir seçin"
          value={city}
          options={cityOptions}
          onChange={onCityChange}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {CATEGORY_CHIPS.map((chip) => (
          <ModernChip
            key={chip.id}
            label={chip.label}
            icon={chip.icon}
            active={chip.id === category}
            onPress={() => onCategoryChange(chip.id)}
            variant="green"
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: spacing.md },
  panel: {
    backgroundColor: colors.surface1,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
  },
  chips: { gap: spacing.sm, paddingBottom: spacing.md },
});
