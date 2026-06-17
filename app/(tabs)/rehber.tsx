import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ProviderCard } from '@/components/providers/ProviderCard';
import { ProviderFilters } from '@/components/providers/ProviderFilters';
import { EmptyState, ErrorState, LoadingCard } from '@/components/ui';
import { useCities, useProviders } from '@/features/providers/hooks';
import { filterProvidersByQuery } from '@/features/providers/mapper';
import type { ProviderType } from '@/features/providers/types';
import { colors, fontSize, lineHeight, spacing } from '@/theme';

export default function RehberScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<ProviderType | 'all'>('all');
  const [city, setCity] = useState('all');
  const [query, setQuery] = useState('');

  const { data: cities = [] } = useCities();
  const { data: providers = [], isLoading, isError, refetch } = useProviders(category, city);

  const filtered = useMemo(
    () => filterProvidersByQuery(providers, query),
    [providers, query]
  );

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Hizmet Rehberi" />
      <FlatList
        data={isLoading || isError ? [] : filtered}
        keyExtractor={(item) => `${item.source}-${item.id}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <Text style={styles.intro}>
              Almanya’da Türkçe hizmet veren uzmanları, işletmeleri ve topluluk kaynaklarını keşfet.
            </Text>
            <ProviderFilters
              category={category}
              city={city}
              query={query}
              cities={cities}
              onCategoryChange={setCategory}
              onCityChange={setCity}
              onQueryChange={setQuery}
            />
          </View>
        }
        renderItem={({ item }) => (
          <ProviderCard provider={item} onPress={() => router.push(`/rehber/${item.id}`)} />
        )}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loading}>
              <LoadingCard showImage={false} />
              <LoadingCard showImage={false} />
            </View>
          ) : isError ? (
            <ErrorState message="Rehber yüklenemedi." onRetry={() => refetch()} />
          ) : (
            <EmptyState
              title="Sonuç bulunamadı"
              message="Farklı bir kategori, şehir veya arama deneyin."
              icon="🧭"
            />
          )
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  loading: { paddingTop: spacing.md },
  intro: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.normal,
    paddingTop: spacing.lg,
  },
});
