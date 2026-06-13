import { getNewsCategoryLabel, normalizeNewsCategory } from './helpers';
import type { NewsArticle, NewsPostRow } from './types';

// Ported 1:1 from the web app's lib/public-news.ts so mobile and web produce
// identical slugs and labels for the same row.

export function slugify(value: string): string {
  const turkishMap: Record<string, string> = {
    ç: 'c',
    Ç: 'c',
    ğ: 'g',
    Ğ: 'g',
    ı: 'i',
    İ: 'i',
    ö: 'o',
    Ö: 'o',
    ş: 's',
    Ş: 's',
    ü: 'u',
    Ü: 'u',
  };

  return value
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (letter) => turkishMap[letter] ?? letter)
    .toLocaleLowerCase('tr-TR')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function buildNewsSlug(row: Pick<NewsPostRow, 'id' | 'title'>): string {
  const titlePart = slugify(String(row.title || 'haber'));
  return `${titlePart || 'haber'}--${row.id}`;
}

/** Extracts the trailing `--{uuid}` id from a news slug (plan §12.3). */
export function getIdFromNewsSlug(slug: string): string {
  const separatorIndex = slug.lastIndexOf('--');
  if (separatorIndex === -1) return '';
  return slug.slice(separatorIndex + 2).trim();
}

export function formatNewsDate(dateValue: string | null): string {
  if (!dateValue) return 'Tarih belirtilmedi';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return 'Tarih belirtilmedi';
  return parsed.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function mapRowToArticle(row: NewsPostRow): NewsArticle {
  const title = String(row.title || 'Başlıksız haber').trim();
  const publishedAt = row.published_at || row.created_at || new Date().toISOString();
  const categoryKey = normalizeNewsCategory(row.category);
  const slug = String(row.slug || '').trim() || buildNewsSlug({ id: row.id, title });
  const image = String(row.cover_image_url || '').trim();
  const readingMinutes = Number(row.reading_time_minutes || row.reading_minutes || 3);

  return {
    id: row.id,
    slug,
    title,
    excerpt: String(row.summary || '').trim(),
    content: row.content || null,
    image: image || null,
    imageAlt: String(row.cover_image_alt || '').trim() || title,
    publishedAt,
    sourcePublishedAt: row.source_published_at || null,
    dateLabel: formatNewsDate(publishedAt),
    categoryKey,
    categoryLabel: getNewsCategoryLabel(categoryKey),
    readingMinutes: Math.max(1, readingMinutes),
    sourceName: String(row.source_name || '').trim() || undefined,
    sourceUrl: String(row.source_url || '').trim() || undefined,
    isFeatured: Boolean(row.is_featured),
    featuredRank: row.featured_rank ?? null,
    whatsAppShareText: String(row.whatsapp_share_text || '').trim() || null,
  };
}
