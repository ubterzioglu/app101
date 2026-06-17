import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { AppCard, InfoBadge } from '@/components/ui';
import type { NewsArticle } from '@/features/news/types';
import { colors, fontSize, fontWeight, lineHeight, radius, spacing } from '@/theme';

interface NewsHeroCardProps {
  article: NewsArticle;
  onPress: () => void;
}

export function NewsHeroCard({ article, onPress }: NewsHeroCardProps) {
  return (
    <AppCard
      variant="elevated"
      glow
      style={styles.card}
      accessibilityLabel={article.title}
      onPress={onPress}
    >
      <View style={styles.imageWrap}>
        {article.image ? (
          <Image
            source={{ uri: article.image }}
            style={styles.image}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>almanya101</Text>
          </View>
        )}
        <View style={styles.featuredBadge}>
          <InfoBadge label="Öne Çıkan" icon="★" variant="accent" />
        </View>
      </View>

      <View style={styles.body}>
        <InfoBadge label={article.categoryLabel} variant="accent" />
        <Text style={styles.title}>{article.title}</Text>
        {article.excerpt ? <Text style={styles.excerpt} numberOfLines={3}>{article.excerpt}</Text> : null}
        <View style={styles.metaRow}>
          <Text style={styles.meta} numberOfLines={1}>
            {article.sourceName ? `${article.sourceName} · ` : ''}
            {article.dateLabel}
          </Text>
          <Text style={styles.readTime}>{article.readingMinutes} dk okuma</Text>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: radius.lg,
    backgroundColor: colors.surface3,
  },
  placeholder: {
    width: '100%',
    height: 220,
    borderRadius: radius.lg,
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.accent,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  featuredBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  body: {
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxl * lineHeight.tight,
  },
  excerpt: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.normal,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  meta: {
    flex: 1,
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  readTime: {
    color: colors.accent,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
});
