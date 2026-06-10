import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { queryClient, persistOptions } from '@/lib/query-client';
import { NetworkProvider } from './NetworkProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      <NetworkProvider>{children}</NetworkProvider>
    </PersistQueryClientProvider>
  );
}
