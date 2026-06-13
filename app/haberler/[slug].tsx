import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, EmptyState, ErrorState, LoadingCard } from '@/components/ui';
import { buildWhatsAppShareUrl } from '@/features/news/helpers';
import { useNewsArticle } from '@/features/news/hooks';
import { openExternalUrl, toSafeExternalUrl } from '@/lib/urls';
import { colors, fontSize, fontWeight, lineHeight, radius, spacing } from '@/theme';

export default function NewsDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const slugValue = Array.isArray(slug) ? slug[0] : (slug ?? '');
  const { data: article, isLoading, isError, refetch } = useNewsArticle(slugValue);
  const shareUrl = article ? buildWhatsAppShareUrl(article) : null;
  const sourceUrl = toSafeExternalUrl(article?.sourceUrl);

  if (isLoading) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Haber" showBack />
        <View style={styles.padded}>
          <LoadingCard />
        </View>
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Haber" showBack />
        <ErrorState message="Haber yüklenemedi." onRetry={() => refetch()} />
      </ScreenContainer>
    );
  }

  if (!article) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Haber" showBack />
        <EmptyState title="Haber bulunamadı" message="Bu haber kaldırılmış veya yayında değil." icon="🔍" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Haber" showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {article.image ? (
          <Image source={{ uri: article.image }} style={styles.hero} contentFit="cover" transition={150} />
        ) : null}
        <View style={styles.body}>
          <Text style={styles.category}>{article.categoryLabel}</Text>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.meta}>
            {article.dateLabel} · {article.readingMinutes} dk okuma
          </Text>
          {article.sourceName ? <Text style={styles.sourceMeta}>Kaynak: {article.sourceName}</Text> : null}

          {article.excerpt ? <Text style={styles.excerpt}>{article.excerpt}</Text> : null}
          {article.content ? <Text style={styles.text}>{article.content}</Text> : null}

          {sourceUrl ? (
            <View style={styles.sourceBox}>
              <Text style={styles.sourceLabel}>Kaynak</Text>
              <AppButton
                label={article.sourceName ?? 'Kaynağı aç'}
                variant="outline"
                onPress={() => openExternalUrl(sourceUrl)}
              />
            </View>
          ) : null}

          {shareUrl ? (
            <View style={styles.shareBox}>
              <AppButton
                label="WhatsApp'ta paylaş"
                variant="primary"
                onPress={() => openExternalUrl(shareUrl)}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  padded: { padding: spacing.lg },
  content: { paddingBottom: spacing.xxl },
  hero: { width: '100%', height: 220, backgroundColor: colors.gray200 },
  body: { padding: spacing.lg },
  category: { color: colors.blue, fontWeight: fontWeight.semibold, fontSize: fontSize.sm },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.gray900,
    marginTop: spacing.xs,
  },
  meta: { fontSize: fontSize.xs, color: colors.gray400, marginTop: spacing.sm },
  sourceMeta: { fontSize: fontSize.xs, color: colors.gray500, marginTop: spacing.xs },
  excerpt: {
    fontSize: fontSize.md,
    color: colors.gray700,
    marginTop: spacing.lg,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.md * lineHeight.normal,
  },
  text: {
    fontSize: fontSize.md,
    color: colors.gray800,
    marginTop: spacing.md,
    lineHeight: fontSize.md * lineHeight.relaxed,
  },
  sourceBox: { marginTop: spacing.xl, gap: spacing.sm },
  sourceLabel: { fontSize: fontSize.sm, color: colors.gray500, fontWeight: fontWeight.medium },
  shareBox: { marginTop: spacing.lg },
});
