import { supabase } from '@/lib/supabase';
import { getIdFromPostSlug, mapAuthorProfileRow, mapPostRowWithJoin, mapPostSummaryRow } from './mapper';
import {
  AUTHOR_SELECT,
  POST_SELECT,
  POST_SELECT_WITH_AUTHOR,
  type CornerAuthorProfile,
  type CornerAuthorRow,
  type CornerAuthorPostSummary,
  type CornerPost,
  type CornerPostRow,
} from './types';

/** Published posts with active-author join (plan §12.9). */
export async function fetchCornerPosts(limit = 100): Promise<CornerPost[]> {
  const { data, error } = await supabase
    .from('corner_posts')
    .select(POST_SELECT_WITH_AUTHOR)
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error('Yazılar yüklenemedi.');

  return ((data ?? []) as unknown as CornerPostRow[])
    .map(mapPostRowWithJoin)
    .filter((post) => Boolean(post.authorSlug));
}

/** Single published post by slug (trailing --{uuid}). */
export async function fetchCornerPostBySlug(slug: string): Promise<CornerPost | null> {
  const id = getIdFromPostSlug(slug);
  if (!id) return null;

  const { data, error } = await supabase
    .from('corner_posts')
    .select(POST_SELECT_WITH_AUTHOR)
    .eq('id', id)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw new Error('Yazı yüklenemedi.');
  if (!data) return null;
  return mapPostRowWithJoin(data as unknown as CornerPostRow);
}

export async function fetchCornerAuthorBySlug(slug: string): Promise<CornerAuthorProfile | null> {
  const slugValue = String(slug || '').trim();
  if (!slugValue) return null;

  const { data, error } = await supabase
    .from('corner_authors')
    .select(AUTHOR_SELECT)
    .eq('slug', slugValue)
    .maybeSingle();

  if (error) throw new Error('Yazar bilgisi yüklenemedi.');
  if (!data) return null;
  return mapAuthorProfileRow(data as unknown as CornerAuthorRow);
}

export async function fetchCornerPostsByAuthorSlug(
  slug: string,
  limit = 100
): Promise<CornerAuthorPostSummary[]> {
  const author = await fetchCornerAuthorBySlug(slug);
  if (!author) return [];

  const { data, error } = await supabase
    .from('corner_posts')
    .select(POST_SELECT)
    .eq('author_id', author.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error('Yazar yazıları yüklenemedi.');

  return ((data ?? []) as unknown as CornerPostRow[]).map(mapPostSummaryRow);
}
