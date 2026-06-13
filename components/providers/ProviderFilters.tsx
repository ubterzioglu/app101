import { ScrollView, StyleSheet, Pressable, Text, View } from 'react-native';

import { AppSelect, AppTextInput } from '@/components/ui';
import { PROVIDER_CATEGORIES, type ProviderType } from '@/features/providers/types';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {CATEGORY_CHIPS.map((chip) => {
          const active = chip.id === category;
          return (
            <Pressable
              key={chip.id}
              accessibilityRole="button"
              onPress={() => onCategoryChange(chip.id)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {chip.icon} {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: spacing.md },
  chips: { gap: spacing.sm, paddingBottom: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.success, borderColor: colors.success },
  chipText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: fontWeight.medium },
  chipTextActive: { color: colors.white },
});
