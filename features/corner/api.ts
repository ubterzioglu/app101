import { supabase } from '@/lib/supabase';
import { getIdFromPostSlug, mapPostRowWithJoin } from './mapper';
import {
  POST_SELECT_WITH_AUTHOR,
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
