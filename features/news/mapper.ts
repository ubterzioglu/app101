import type { NewsArticle, NewsPostRow } from './types';

// Ported 1:1 from the web app's lib/public-news.ts so mobile and web produce
// identical slugs and labels for the same row.

export function slugify(value: string): string {
  return value
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
  const slug = buildNewsSlug(row);
  const image = String(row.cover_image_url || '').trim();

  return {
    id: row.id,
    slug,
    title,
    excerpt: String(row.summary || '').trim(),
    content: row.content || null,
    image: image || null,
    publishedAt,
    dateLabel: formatNewsDate(publishedAt),
    category: String(row.category || 'Almanya').trim(),
    readingMinutes: Math.max(1, Number(row.reading_minutes || 3)),
    sourceName: String(row.source_name || '').trim() || undefined,
    sourceUrl: String(row.source_url || '').trim() || undefined,
  };
}
