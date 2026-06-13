import type { NewsCategoryKey } from './helpers';

// News feature types. Mirrors the `news_posts` Supabase table.

export interface NewsPostRow {
  id: string;
  slug: string | null;
  category: string | null;
  title: string | null;
  summary: string | null;
  content: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  source_name: string | null;
  source_url: string | null;
  source_published_at: string | null;
  status: 'pending_review' | 'draft' | 'published' | 'rejected' | 'archived' | null;
  is_featured: boolean | null;
  featured_rank: number | null;
  reading_time_minutes: number | null;
  reading_minutes: number | null;
  whatsapp_share_text: string | null;
  published_at: string | null;
  created_at: string | null;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | null;
  image: string | null;
  imageAlt: string;
  publishedAt: string;
  sourcePublishedAt: string | null;
  dateLabel: string;
  categoryKey: NewsCategoryKey;
  categoryLabel: string;
  readingMinutes: number;
  sourceName?: string;
  sourceUrl?: string;
  isFeatured: boolean;
  featuredRank: number | null;
  whatsAppShareText: string | null;
}

export const NEWS_SELECT =
  'id, slug, category, title, summary, content, cover_image_url, cover_image_alt, source_name, source_url, source_published_at, status, is_featured, featured_rank, reading_time_minutes, reading_minutes, whatsapp_share_text, published_at, created_at';
