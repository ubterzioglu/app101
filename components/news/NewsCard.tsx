import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui';
import type { NewsArticle } from '@/features/news/types';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

interface NewsCardProps {
  article: NewsArticle;
  onPress: () => void;
}

export function NewsCard({ article, onPress }: NewsCardProps) {
  return (
    <AppCard style={styles.card} accessibilityLabel={article.title} onPress={onPress}>
      <View style={styles.content}>
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
        </View>
        <View style={styles.body}>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryText}>{article.categoryLabel}</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>
          {article.excerpt ? (
            <Text style={styles.excerpt} numberOfLines={2}>
              {article.excerpt}
            </Text>
          ) : null}
          {article.sourceName ? (
            <Text style={styles.source} numberOfLines={1}>
              Kaynak: {article.sourceName}
            </Text>
          ) : null}
          <Text style={styles.meta}>
            {article.dateLabel} · {article.readingMinutes} dk okuma
          </Text>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md, padding: spacing.sm },
  content: { flexDirection: 'row', gap: spacing.md },
  imageWrap: { width: 116, flexShrink: 0 },
  image: { width: '100%', height: 116, borderRadius: radius.md, backgroundColor: colors.surface2 },
  placeholder: {
    width: '100%',
    height: 116,
    borderRadius: radius.md,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { color: colors.white, fontWeight: fontWeight.bold, fontSize: fontSize.sm },
  body: { flex: 1, gap: spacing.xs },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  categoryText: { color: colors.textInverse, fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  excerpt: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  source: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  meta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
});
