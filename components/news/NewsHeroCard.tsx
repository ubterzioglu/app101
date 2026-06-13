import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui';
import type { NewsArticle } from '@/features/news/types';
import { colors, fontSize, fontWeight, lineHeight, radius, spacing } from '@/theme';

interface NewsHeroCardProps {
  article: NewsArticle;
  onPress: () => void;
}

export function NewsHeroCard({ article, onPress }: NewsHeroCardProps) {
  return (
    <AppCard style={styles.card} accessibilityLabel={article.title} onPress={onPress}>
      {article.image ? (
        <Image source={{ uri: article.image }} style={styles.image} contentFit="cover" transition={150} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>almanya101</Text>
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{article.categoryLabel}</Text>
        </View>
        <Text style={styles.title}>{article.title}</Text>
        {article.excerpt ? <Text style={styles.excerpt}>{article.excerpt}</Text> : null}
        <Text style={styles.meta}>
          {article.dateLabel} · {article.readingMinutes} dk okuma
        </Text>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.sm,
    marginBottom: spacing.lg,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: radius.lg,
    backgroundColor: colors.gray200,
  },
  placeholder: {
    width: '100%',
    height: 220,
    borderRadius: radius.lg,
    backgroundColor: colors.gray900,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  body: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.blue,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  categoryText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  title: {
    color: colors.gray900,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  excerpt: {
    color: colors.gray700,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.normal,
  },
  meta: {
    color: colors.gray500,
    fontSize: fontSize.xs,
  },
});
