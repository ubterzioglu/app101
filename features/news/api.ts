import { supabase } from '@/lib/supabase';
import { mapRowToArticle, getIdFromNewsSlug } from './mapper';
import { NEWS_SELECT, type NewsArticle, type NewsPostRow } from './types';

export interface NewsPage {
  articles: NewsArticle[];
  nextOffset: number | null;
}

const PAGE_SIZE = 12;

/** Paginated published news list, newest first (plan §12.2). */
export async function fetchNewsPage(offset = 0): Promise<NewsPage> {
  const to = offset + PAGE_SIZE - 1;
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from('news_posts')
    .select(NEWS_SELECT)
    .eq('status', 'published')
    .lte('published_at', nowIso)
    .order('is_featured', { ascending: false, nullsFirst: false })
    .order('featured_rank', { ascending: true, nullsFirst: false })
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .range(offset, to);

  if (error) throw new Error('Haberler yüklenemedi.');

  const rows = (data ?? []) as NewsPostRow[];
  const articles = rows.map(mapRowToArticle);
  const nextOffset = rows.length === PAGE_SIZE ? offset + PAGE_SIZE : null;
  return { articles, nextOffset };
}

/** Single published article by slug (parses trailing --{uuid}). */
export async function fetchNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const nowIso = new Date().toISOString();
  const normalizedSlug = String(slug || '').trim();
  if (!normalizedSlug) return null;

  const { data: slugData, error: slugError } = await supabase
    .from('news_posts')
    .select(NEWS_SELECT)
    .eq('slug', normalizedSlug)
    .eq('status', 'published')
    .lte('published_at', nowIso)
    .maybeSingle();

  if (slugError) throw new Error('Haber yüklenemedi.');
  if (slugData) return mapRowToArticle(slugData as NewsPostRow);

  const id = getIdFromNewsSlug(slug);
  if (!id) return null;

  const { data, error } = await supabase
    .from('news_posts')
    .select(NEWS_SELECT)
    .eq('id', id)
    .eq('status', 'published')
    .lte('published_at', nowIso)
    .maybeSingle();

  if (error) throw new Error('Haber yüklenemedi.');
  if (!data) return null;
  return mapRowToArticle(data as NewsPostRow);
}
