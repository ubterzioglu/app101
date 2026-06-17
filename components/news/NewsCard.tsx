import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { AppCard, InfoBadge } from '@/components/ui';
import type { NewsArticle } from '@/features/news/types';
import { colors, fontSize, fontWeight, lineHeight, radius, spacing } from '@/theme';

interface NewsCardProps {
  article: NewsArticle;
  onPress: () => void;
}

export function NewsCard({ article, onPress }: NewsCardProps) {
  return (
    <AppCard
      variant="elevated"
      style={styles.card}
      accessibilityLabel={article.title}
      onPress={onPress}
    >
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
          <InfoBadge label={article.categoryLabel} variant="accent" />
          <Text style={styles.title} numberOfLines={3}>
            {article.title}
          </Text>
          {article.excerpt ? (
            <Text style={styles.excerpt} numberOfLines={2}>
              {article.excerpt}
            </Text>
          ) : null}
          <View style={styles.metaRow}>
            <Text style={styles.meta} numberOfLines={1}>
              {article.sourceName ? `${article.sourceName} · ` : ''}
              {article.dateLabel}
            </Text>
            <Text style={styles.readTime}>{article.readingMinutes} dk</Text>
          </View>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md, padding: spacing.md },
  content: { flexDirection: 'row', gap: spacing.md },
  imageWrap: { width: 104, flexShrink: 0 },
  image: { width: '100%', height: 104, borderRadius: radius.md, backgroundColor: colors.surface3 },
  placeholder: {
    width: '100%',
    height: 104,
    borderRadius: radius.md,
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { color: colors.accent, fontWeight: fontWeight.bold, fontSize: fontSize.sm },
  body: { flex: 1, gap: spacing.xs },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    lineHeight: fontSize.md * lineHeight.tight,
  },
  excerpt: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
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
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  readTime: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.accent,
  },
});
