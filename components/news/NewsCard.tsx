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
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{article.category}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {article.title}
      </Text>
      {article.excerpt ? (
        <Text style={styles.excerpt} numberOfLines={2}>
          {article.excerpt}
        </Text>
      ) : null}
      <Text style={styles.meta}>
        {article.dateLabel} · {article.readingMinutes} dk okuma
      </Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md, padding: spacing.sm },
  imageWrap: { position: 'relative', marginBottom: spacing.sm },
  image: { width: '100%', height: 170, borderRadius: radius.md, backgroundColor: colors.gray200 },
  placeholder: {
    width: '100%',
    height: 170,
    borderRadius: radius.md,
    backgroundColor: colors.gray900,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { color: colors.white, fontWeight: fontWeight.bold, fontSize: fontSize.lg },
  categoryChip: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.blue,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  categoryText: { color: colors.white, fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.gray900,
    paddingHorizontal: spacing.xs,
  },
  excerpt: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  meta: {
    fontSize: fontSize.xs,
    color: colors.gray400,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
});
