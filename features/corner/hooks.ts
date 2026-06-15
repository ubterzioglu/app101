import { useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/lib/query-client';
import {
  fetchCornerAuthorBySlug,
  fetchCornerPostBySlug,
  fetchCornerPosts,
  fetchCornerPostsByAuthorSlug,
} from './api';
import type { CornerAuthorPostSummary, CornerAuthorProfile, CornerPost } from './types';

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

export function useCornerAuthor(slug: string) {
  return useQuery<CornerAuthorProfile | null, Error>({
    queryKey: ['corner', 'author', slug],
    queryFn: () => fetchCornerAuthorBySlug(slug),
    staleTime: STALE_TIME.corner,
    enabled: Boolean(slug),
  });
}

export function useCornerAuthorPosts(slug: string) {
  return useQuery<CornerAuthorPostSummary[], Error>({
    queryKey: ['corner', 'author-posts', slug],
    queryFn: () => fetchCornerPostsByAuthorSlug(slug),
    staleTime: STALE_TIME.corner,
    enabled: Boolean(slug),
  });
}
