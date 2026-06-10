// News feature types. Mirrors the `news_posts` Supabase table (plan §2.3).

export interface NewsPostRow {
  id: string;
  category: string | null;
  title: string | null;
  summary: string | null;
  content: string | null;
  cover_image_url: string | null;
  source_name: string | null;
  source_url: string | null;
  reading_minutes: number | null;
  published_at: string | null;
  created_at: string | null;
  show_in_carousel?: boolean | null;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | null;
  image: string | null;
  publishedAt: string;
  dateLabel: string;
  category: string;
  readingMinutes: number;
  sourceName?: string;
  sourceUrl?: string;
}

export const NEWS_SELECT =
  'id, category, title, summary, content, cover_image_url, source_name, source_url, reading_minutes, published_at, created_at, show_in_carousel';
