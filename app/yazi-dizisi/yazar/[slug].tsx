import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppCard, EmptyState, ErrorState, LoadingCard } from '@/components/ui';
import { useCornerAuthor, useCornerAuthorPosts } from '@/features/corner/hooks';
import { colors, fontSize, fontWeight, lineHeight, radius, spacing } from '@/theme';

export default function CornerAuthorScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const slugValue = Array.isArray(slug) ? slug[0] : (slug ?? '');
  const authorQuery = useCornerAuthor(slugValue);
  const postsQuery = useCornerAuthorPosts(slugValue);

  if (authorQuery.isLoading || postsQuery.isLoading) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Yazar" showBack />
        <View style={styles.loading}>
          <LoadingCard />
          <LoadingCard showImage={false} lines={4} />
        </View>
      </ScreenContainer>
    );
  }

  if (authorQuery.isError || postsQuery.isError) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Yazar" showBack />
        <ErrorState
          message="Yazar profili yüklenemedi."
          onRetry={() => {
            void authorQuery.refetch();
            void postsQuery.refetch();
          }}
        />
      </ScreenContainer>
    );
  }

  const author = authorQuery.data;
  const posts = postsQuery.data ?? [];

  if (!author) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Yazar" showBack />
        <EmptyState
          title="Yazar bulunamadı"
          message="Bu köşe profili artık yayında olmayabilir."
          icon="🔍"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Yazar" showBack />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <AppCard accentColor={colors.accent}>
            <View style={styles.heroRow}>
              {author.avatarImageUrl ? (
                <Image source={{ uri: author.avatarImageUrl }} style={styles.avatar} contentFit="cover" />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]} />
              )}
              <View style={styles.heroText}>
                <Text style={styles.authorName}>{author.displayName}</Text>
                <Text style={styles.authorSlug}>/{author.slug}</Text>
              </View>
            </View>
            {author.shortBio ? <Text style={styles.authorBio}>{author.shortBio}</Text> : null}
          </AppCard>
        }
        ListEmptyComponent={
          <EmptyState
            title="Henüz yazı yok"
            message="Bu yazarın yayında olan bir yazısı bulunmuyor."
            icon="✍️"
          />
        }
        renderItem={({ item }) => (
          <AppCard style={styles.postCard}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${item.title} yazısını aç`}
              onPress={() => router.push(`/yazi-dizisi/${item.slug}`)}
            >
              {item.coverImageUrl ? (
                <Image source={{ uri: item.coverImageUrl }} style={styles.cover} contentFit="cover" />
              ) : null}
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postMeta}>
                {item.dateLabel} · {item.readingMinutes} dk
              </Text>
              {item.summary ? <Text style={styles.postSummary}>{item.summary}</Text> : null}
            </Pressable>
          </AppCard>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  loading: { padding: spacing.lg },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: radius.pill, backgroundColor: colors.surface2 },
  avatarFallback: { backgroundColor: colors.surface3 },
  heroText: { marginLeft: spacing.md, flex: 1 },
  authorName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  authorSlug: { marginTop: spacing.xs, fontSize: fontSize.sm, color: colors.textMuted },
  authorBio: {
    marginTop: spacing.md,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.relaxed,
  },
  postCard: { marginTop: spacing.md },
  cover: {
    width: '100%',
    height: 180,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surface2,
  },
  postTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  postMeta: {
    marginTop: spacing.xs,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  postSummary: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.relaxed,
  },
});
