import { slugify } from '@/features/news/mapper';
import type {
  CornerAuthor,
  CornerAuthorProfile,
  CornerAuthorRow,
  CornerAuthorPostSummary,
  CornerPost,
  CornerPostRow,
} from './types';

// Ported from web lib/corner.ts.

export function buildPostSlug(row: Pick<CornerPostRow, 'id' | 'title'>): string {
  const titlePart = slugify(String(row.title || 'yazi'));
  return `${titlePart || 'yazi'}--${row.id}`;
}

export function buildAuthorHref(slug: string): string {
  return `/yazi-dizisi/yazar/${slug}`;
}

export function getIdFromPostSlug(slug: string): string {
  const separatorIndex = slug.lastIndexOf('--');
  if (separatorIndex === -1) return '';
  return slug.slice(separatorIndex + 2).trim();
}

export function formatCornerDate(dateValue: string | null): string {
  if (!dateValue) return 'Tarih belirtilmedi';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return 'Tarih belirtilmedi';
  return parsed.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function mapAuthorRow(row: CornerAuthorRow): CornerAuthor {
  return {
    id: row.id,
    slug: String(row.slug || '').trim(),
    displayName: String(row.display_name || 'Arkadaşın Köşesi').trim(),
    shortBio: String(row.short_bio || '').trim(),
    bioContent: String(row.bio_content || '').trim(),
    avatarImageUrl: row.avatar_image_url ? String(row.avatar_image_url).trim() : null,
    displayOrder: Number(row.display_order ?? 1000),
  };
}

export function mapAuthorProfileRow(row: CornerAuthorRow): CornerAuthorProfile {
  const author = mapAuthorRow(row);
  return {
    ...author,
    href: buildAuthorHref(author.slug),
  };
}

function firstRelatedAuthor(
  value: CornerPostRow['corner_authors']
): CornerAuthorRow | undefined {
  if (Array.isArray(value)) return value[0];
  return value || undefined;
}

export function mapPostRow(
  row: CornerPostRow,
  author?: Pick<CornerAuthor, 'slug' | 'displayName' | 'avatarImageUrl'>
): CornerPost {
  const title = String(row.title || 'Başlıksız yazı').trim();
  const publishedAt = row.published_at || row.created_at || new Date().toISOString();
  return {
    id: row.id,
    authorId: row.author_id,
    authorSlug: author?.slug,
    authorName: author?.displayName,
    authorAvatarImageUrl: author?.avatarImageUrl ?? null,
    slug: buildPostSlug(row),
    title,
    summary: String(row.summary || '').trim(),
    content: row.content || null,
    coverImageUrl: row.cover_image_url ? String(row.cover_image_url).trim() : null,
    readingMinutes: Math.max(1, Number(row.reading_minutes || 3)),
    publishedAt,
    dateLabel: formatCornerDate(publishedAt),
  };
}

export function mapPostRowWithJoin(row: CornerPostRow): CornerPost {
  const authorRow = firstRelatedAuthor(row.corner_authors);
  const author = authorRow ? mapAuthorRow(authorRow) : undefined;
  return mapPostRow(row, author);
}

export function mapPostSummaryRow(row: CornerPostRow): CornerAuthorPostSummary {
  const post = mapPostRow(row);
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    coverImageUrl: post.coverImageUrl,
    readingMinutes: post.readingMinutes,
    publishedAt: post.publishedAt,
    dateLabel: post.dateLabel,
  };
}
