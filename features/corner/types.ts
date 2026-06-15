// Arkadaşın Köşesi tipleri. Tables: corner_authors, corner_posts (plan §2.3).

export interface CornerAuthorRow {
  id: string;
  slug: string | null;
  display_name: string | null;
  short_bio: string | null;
  bio_content: string | null;
  avatar_image_url: string | null;
  display_order?: number | null;
  updated_at: string | null;
}

export interface CornerPostRow {
  id: string;
  author_id: string | null;
  title: string | null;
  summary: string | null;
  content: string | null;
  cover_image_url: string | null;
  reading_minutes: number | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  corner_authors?: CornerAuthorRow | CornerAuthorRow[] | null;
}

export interface CornerAuthor {
  id: string;
  slug: string;
  displayName: string;
  shortBio: string;
  bioContent: string;
  avatarImageUrl: string | null;
  displayOrder: number;
}

export interface CornerAuthorProfile extends CornerAuthor {
  href: string;
}

export interface CornerPost {
  id: string;
  authorId: string | null;
  authorSlug?: string;
  authorName?: string;
  authorAvatarImageUrl?: string | null;
  slug: string;
  title: string;
  summary: string;
  content: string | null;
  coverImageUrl: string | null;
  readingMinutes: number;
  publishedAt: string;
  dateLabel: string;
}

export interface CornerAuthorPostSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImageUrl: string | null;
  readingMinutes: number;
  publishedAt: string;
  dateLabel: string;
}

export const AUTHOR_SELECT =
  'id, slug, display_name, short_bio, bio_content, avatar_image_url, display_order, updated_at';

export const POST_SELECT =
  'id, author_id, title, summary, content, cover_image_url, reading_minutes, published_at, created_at, updated_at';

export const POST_SELECT_WITH_AUTHOR = `${POST_SELECT}, corner_authors(${AUTHOR_SELECT})`;
