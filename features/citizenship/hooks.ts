import { useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/lib/query-client';
import { fetchGeneralQuestions, fetchStateQuestions } from './api';
import { GENERAL_POOL, type CitizenshipQuestion } from './types';

// Questions are cached 7 days and persisted so the quiz works offline
// once it has been opened online at least once (plan §11.2).
export function useGeneralQuestions(enabled: boolean) {
  return useQuery<CitizenshipQuestion[], Error>({
    queryKey: ['citizenship', GENERAL_POOL],
    queryFn: fetchGeneralQuestions,
    staleTime: STALE_TIME.citizenship,
    enabled,
  });
}

export function useStateQuestions(state: string, enabled: boolean) {
  return useQuery<CitizenshipQuestion[], Error>({
    queryKey: ['citizenship', state],
    queryFn: () => fetchStateQuestions(state),
    staleTime: STALE_TIME.citizenship,
    enabled: enabled && Boolean(state),
  });
}
