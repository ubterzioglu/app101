import { useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/lib/query-client';
import { fetchAvailableCities, fetchProviderById, fetchProvidersByCategory } from './api';
import type { Provider, ProviderType } from './types';

export function useProviders(category: ProviderType | 'all', city: string) {
  return useQuery<Provider[], Error>({
    queryKey: ['providers', category, city],
    queryFn: () => fetchProvidersByCategory(category, city),
    staleTime: STALE_TIME.providers,
  });
}

export function useCities() {
  return useQuery<string[], Error>({
    queryKey: ['providers', 'cities'],
    queryFn: fetchAvailableCities,
    staleTime: STALE_TIME.cities,
  });
}

export function useProvider(id: string) {
  return useQuery<Provider | null, Error>({
    queryKey: ['providers', 'detail', id],
    queryFn: () => fetchProviderById(id),
    staleTime: STALE_TIME.providerDetail,
    enabled: Boolean(id),
  });
}
