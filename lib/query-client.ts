import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

import { asyncStorage } from './storage';

// Cache duration tokens (see plan §11.1). Persisted across launches so the UI
// can render cached content first, then refresh in the background when online.
export const STALE_TIME = {
  news: 5 * 60 * 1000, // 5 min
  newsDetail: 15 * 60 * 1000, // 15 min
  providers: 30 * 60 * 1000, // 30 min
  cities: 24 * 60 * 60 * 1000, // 24 h
  providerDetail: 60 * 60 * 1000, // 60 min
  citizenship: 7 * 24 * 60 * 60 * 1000, // 7 days
  corner: 60 * 60 * 1000, // 60 min
} as const;

const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // keep persisted cache up to 7 days

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME.news,
      gcTime: MAX_AGE,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export const queryPersister = createAsyncStoragePersister({
  storage: asyncStorage,
  key: 'APP101_QUERY_CACHE',
  throttleTime: 1000,
});

export const persistOptions = {
  persister: queryPersister,
  maxAge: MAX_AGE,
};
