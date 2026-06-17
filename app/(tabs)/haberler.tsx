import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { NewsHeroCard } from '@/components/news/NewsHeroCard';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { NewsCard } from '@/components/news/NewsCard';
import { AppButton, EmptyState, ErrorState, LoadingCard, ModernChip } from '@/components/ui';
import {
  NEWS_CATEGORIES,
  getNewsCategoryLabel,
  splitHeroArticle,
  type NewsCategoryKey,
} from '@/features/news/helpers';
import { useNewsList } from '@/features/news/hooks';
import type { NewsArticle } from '@/features/news/types';
import { colors, fontSize, lineHeight, spacing } from '@/theme';

export default function HaberlerScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<NewsCategoryKey>('almanya');
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

  const visible = useMemo(() => splitHeroArticle(articles, category), [articles, category]);

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
        data={visible.list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.intro}>
              Almanya ve dünyadan seçilen güncel haberleri Türkçe takip et.
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
            >
              {NEWS_CATEGORIES.map((item) => (
                <ModernChip
                  key={item}
                  label={getNewsCategoryLabel(item)}
                  active={item === category}
                  onPress={() => setCategory(item)}
                  variant="yellow"
                />
              ))}
            </ScrollView>
            {visible.hero ? (
              <NewsHeroCard
                article={visible.hero}
                onPress={() => router.push(`/haberler/${visible.hero?.slug}`)}
              />
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <NewsCard article={item} onPress={() => router.push(`/haberler/${item.slug}`)} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={colors.accent}
          />
        }
        ListEmptyComponent={
          visible.hero ? null : (
            <EmptyState
              title={`${getNewsCategoryLabel(category)} kategorisinde haber bulunamadı`}
              message="Bu kategori için yayınlanmış içerik geldiğinde burada görünecek."
              icon="📰"
            />
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <LoadingCard lines={2} />
          ) : hasNextPage ? (
            <View style={styles.footer}>
              <AppButton
                label="Daha fazla yükle"
                variant="outline"
                fullWidth={false}
                onPress={() => fetchNextPage()}
              />
            </View>
          ) : null
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loading: { padding: spacing.lg },
  list: { padding: spacing.lg },
  intro: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.normal,
    marginBottom: spacing.md,
  },
  chips: { gap: spacing.sm, paddingBottom: spacing.lg },
  footer: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
});
