import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppCard, EmptyState, ErrorState, LoadingCard } from '@/components/ui';
import { useCornerPosts } from '@/features/corner/hooks';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

export default function CornerListScreen() {
  const router = useRouter();
  const { data: posts = [], isLoading, isError, refetch, isRefetching } = useCornerPosts();

  if (isLoading) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Arkadaşın Köşesi" showBack />
        <View style={styles.padded}>
          <LoadingCard />
          <LoadingCard />
        </View>
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Arkadaşın Köşesi" showBack />
        <ErrorState message="Yazılar yüklenemedi." onRetry={() => refetch()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Arkadaşın Köşesi" showBack />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor={colors.accent} />
        }
        ListEmptyComponent={<EmptyState title="Henüz yazı yok" icon="✍️" />}
        renderItem={({ item }) => (
          <AppCard
            style={styles.card}
            accessibilityLabel={item.title}
            onPress={() => router.push(`/yazi-dizisi/${item.slug}`)}
          >
            <View style={styles.row}>
              {item.authorAvatarImageUrl ? (
                <Image source={{ uri: item.authorAvatarImageUrl }} style={styles.avatar} contentFit="cover" />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]} />
              )}
              <View style={styles.rowText}>
                <Text style={styles.author}>{item.authorName ?? 'Arkadaşın Köşesi'}</Text>
                <Text style={styles.meta}>
                  {item.dateLabel} · {item.readingMinutes} dk
                </Text>
              </View>
            </View>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            {item.summary ? (
              <Text style={styles.summary} numberOfLines={2}>
                {item.summary}
              </Text>
            ) : null}
          </AppCard>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  padded: { padding: spacing.lg },
  list: { padding: spacing.lg },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  avatar: { width: 40, height: 40, borderRadius: radius.pill, backgroundColor: colors.surface2 },
  avatarFallback: { backgroundColor: colors.surface3 },
  rowText: { marginLeft: spacing.sm },
  author: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textPrimary },
  meta: { fontSize: fontSize.xs, color: colors.textMuted },
  title: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textPrimary },
  summary: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
});
