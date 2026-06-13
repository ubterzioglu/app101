import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, EmptyState, ErrorState, LoadingCard } from '@/components/ui';
import { buildWebsiteUrl } from '@/constants/external-links';
import { useCornerPost } from '@/features/corner/hooks';
import { colors, fontSize, fontWeight, lineHeight, radius, spacing } from '@/theme';

export default function CornerDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const slugValue = Array.isArray(slug) ? slug[0] : (slug ?? '');
  const { data: post, isLoading, isError, refetch } = useCornerPost(slugValue);

  async function onShare() {
    if (!post) return;
    const url = buildWebsiteUrl(`/yazi-dizisi/${post.slug}`);
    try {
      await Share.share({ message: `${post.title}\n${url}`, url, title: post.title });
    } catch {
      // cancelled
    }
  }

  if (isLoading) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Yazı" showBack />
        <View style={styles.padded}>
          <LoadingCard />
        </View>
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Yazı" showBack />
        <ErrorState message="Yazı yüklenemedi." onRetry={() => refetch()} />
      </ScreenContainer>
    );
  }

  if (!post) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Yazı" showBack />
        <EmptyState title="Yazı bulunamadı" message="Bu yazı kaldırılmış veya yayında değil." icon="🔍" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Yazı" showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {post.coverImageUrl ? (
          <Image source={{ uri: post.coverImageUrl }} style={styles.hero} contentFit="cover" transition={150} />
        ) : null}
        <View style={styles.body}>
          <View style={styles.authorRow}>
            {post.authorAvatarImageUrl ? (
              <Image source={{ uri: post.authorAvatarImageUrl }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]} />
            )}
            <View style={styles.authorText}>
              <Text style={styles.author}>{post.authorName ?? 'Arkadaşın Köşesi'}</Text>
              <Text style={styles.meta}>
                {post.dateLabel} · {post.readingMinutes} dk okuma
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{post.title}</Text>
          {post.summary ? <Text style={styles.summary}>{post.summary}</Text> : null}
          {post.content ? <Text style={styles.text}>{post.content}</Text> : null}

          <View style={styles.shareBox}>
            <AppButton label="Paylaş" variant="primary" onPress={onShare} />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  padded: { padding: spacing.lg },
  content: { paddingBottom: spacing.xxl },
  hero: { width: '100%', height: 220, backgroundColor: colors.surface2 },
  body: { padding: spacing.lg },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  avatar: { width: 44, height: 44, borderRadius: radius.pill, backgroundColor: colors.surface2 },
  avatarFallback: { backgroundColor: colors.surface3 },
  authorText: { marginLeft: spacing.sm },
  author: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textPrimary },
  meta: { fontSize: fontSize.xs, color: colors.textMuted },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.textPrimary },
  summary: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.md * lineHeight.normal,
  },
  text: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
    lineHeight: fontSize.md * lineHeight.relaxed,
  },
  shareBox: { marginTop: spacing.xl },
});
