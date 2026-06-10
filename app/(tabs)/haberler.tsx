import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { NewsCard } from '@/components/news/NewsCard';
import { EmptyState, ErrorState, LoadingCard } from '@/components/ui';
import { useNewsList } from '@/features/news/hooks';
import type { NewsArticle } from '@/features/news/types';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

const ALL = 'Tümü';

export default function HaberlerScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<string>(ALL);
  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNewsList();

  const articles = useMemo<NewsArticle[]>(
    () => (data?.pages ?? []).flatMap((p) => p.articles),
    [data]
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => set.add(a.category));
    return [ALL, ...[...set].sort()];
  }, [articles]);

  const filtered = useMemo(
    () => (category === ALL ? articles : articles.filter((a) => a.category === category)),
    [articles, category]
  );

  if (isLoading) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Haberler" />
        <View style={styles.loading}>
          <LoadingCard />
          <LoadingCard />
        </View>
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Haberler" />
        <ErrorState message="Haberler yüklenemedi." onRetry={() => refetch()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Haberler" />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(c) => c}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
            renderItem={({ item }) => {
              const active = item === category;
              return (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setCategory(item)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                </Pressable>
              );
            }}
          />
        }
        renderItem={({ item }) => (
          <NewsCard article={item} onPress={() => router.push(`/haberler/${item.slug}`)} />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor={colors.blue} />
        }
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage && category === ALL) fetchNextPage();
        }}
        ListEmptyComponent={<EmptyState title="Haber bulunamadı" icon="📰" />}
        ListFooterComponent={isFetchingNextPage ? <LoadingCard lines={2} /> : null}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loading: { padding: spacing.lg },
  list: { padding: spacing.lg },
  chips: { gap: spacing.sm, paddingBottom: spacing.md },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.blue, borderColor: colors.blue },
  chipText: { fontSize: fontSize.sm, color: colors.gray700, fontWeight: fontWeight.medium },
  chipTextActive: { color: colors.white },
});
