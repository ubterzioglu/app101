import { useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/lib/query-client';
import { fetchCornerPostBySlug, fetchCornerPosts } from './api';
import type { CornerPost } from './types';

export function useCornerPosts() {
  return useQuery<CornerPost[], Error>({
    queryKey: ['corner', 'posts'],
    queryFn: () => fetchCornerPosts(),
    staleTime: STALE_TIME.corner,
  });
}

export function useCornerPost(slug: string) {
  return useQuery<CornerPost | null, Error>({
    queryKey: ['corner', 'post', slug],
    queryFn: () => fetchCornerPostBySlug(slug),
    staleTime: STALE_TIME.corner,
    enabled: Boolean(slug),
  });
}
