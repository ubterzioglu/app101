import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
} from '@tanstack/react-query';

import { STALE_TIME } from '@/lib/query-client';
import {
  fetchNewsArticleBySlug,
  fetchNewsPage,
  fetchRelatedNews,
  type NewsPage,
} from './api';
import type { NewsArticle } from './types';

export function useNewsList() {
  return useInfiniteQuery<NewsPage, Error, InfiniteData<NewsPage>, string[], number>({
    queryKey: ['news', 'list'],
    queryFn: ({ pageParam }) => fetchNewsPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    staleTime: STALE_TIME.news,
  });
}

export function useNewsArticle(slug: string) {
  return useQuery<NewsArticle | null, Error>({
    queryKey: ['news', 'detail', slug],
    queryFn: () => fetchNewsArticleBySlug(slug),
    staleTime: STALE_TIME.newsDetail,
    enabled: Boolean(slug),
  });
}

export function useRelatedNews(currentId: string) {
  return useQuery<NewsArticle[], Error>({
    queryKey: ['news', 'related', currentId],
    queryFn: () => fetchRelatedNews(currentId),
    staleTime: STALE_TIME.news,
    enabled: Boolean(currentId),
  });
}
