import { buildWebsiteUrl } from '@/constants/external-links';
import { toSafeExternalUrl } from '@/lib/urls';
import type { NewsArticle } from './types';

export const NEWS_CATEGORIES = ['almanya', 'turkiye', 'avrupa', 'dunya'] as const;

export type NewsCategoryKey = (typeof NEWS_CATEGORIES)[number];

const NEWS_CATEGORY_LABELS: Record<NewsCategoryKey, string> = {
  almanya: 'Almanya',
  turkiye: 'Türkiye',
  avrupa: 'Avrupa',
  dunya: 'Dünya',
};

const LEGACY_CATEGORY_TO_KEY: Record<string, NewsCategoryKey> = {
  almanya: 'almanya',
  türkiye: 'turkiye',
  turkiye: 'turkiye',
  avrupa: 'avrupa',
  dünya: 'dunya',
  dunya: 'dunya',
};

export function isNewsCategoryKey(value: string): value is NewsCategoryKey {
  return NEWS_CATEGORIES.includes(value as NewsCategoryKey);
}

export function normalizeNewsCategory(value: string | null | undefined): NewsCategoryKey {
  const normalized = String(value ?? '').trim().toLocaleLowerCase('tr-TR');
  if (isNewsCategoryKey(normalized)) {
    return normalized;
  }

  return LEGACY_CATEGORY_TO_KEY[normalized] ?? 'almanya';
}

export function getNewsCategoryLabel(value: string | null | undefined): string {
  return NEWS_CATEGORY_LABELS[normalizeNewsCategory(value)];
}

export function filterArticlesByCategory(
  articles: NewsArticle[],
  category: NewsCategoryKey
): NewsArticle[] {
  return articles.filter((article) => article.categoryKey === category);
}

export function splitHeroArticle(articles: NewsArticle[], category: NewsCategoryKey) {
  const categoryItems = filterArticlesByCategory(articles, category);
  if (categoryItems.length === 0) {
    return { hero: null, list: [] as NewsArticle[] };
  }

  const hero = categoryItems.find((article) => article.isFeatured) ?? categoryItems[0] ?? null;
  return {
    hero,
    list: hero ? categoryItems.filter((article) => article.id !== hero.id) : categoryItems,
  };
}

export function buildWhatsAppShareText(article: Pick<NewsArticle, 'title' | 'excerpt' | 'slug' | 'whatsAppShareText'>): string {
  const preset = String(article.whatsAppShareText ?? '').trim();
  if (preset) return preset;

  const lines = [article.title.trim()];
  const excerpt = article.excerpt.trim();

  if (excerpt) {
    lines.push('', excerpt);
  }

  lines.push('', 'Devamını oku:', buildWebsiteUrl(`/haberler/${article.slug}`));
  return lines.join('\n');
}

export function buildWhatsAppShareUrl(
  article: Pick<NewsArticle, 'title' | 'excerpt' | 'slug' | 'whatsAppShareText'>
): string | null {
  const message = buildWhatsAppShareText(article);
  return toSafeExternalUrl(`https://wa.me/?text=${encodeURIComponent(message)}`);
}
