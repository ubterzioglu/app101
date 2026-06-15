import { useCallback, useEffect, useState, type DependencyList } from 'react';

interface StaticContentState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  reload: () => void;
}

export function useStaticContent<T>(
  loader: () => T | Promise<T>,
  deps: DependencyList = []
): StaticContentState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loader();
      setData(result);
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason : new Error('İçerik yüklenemedi.'));
    } finally {
      setIsLoading(false);
    }
  }, deps);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await loader();
        if (!isMounted) return;
        setData(result);
      } catch (reason: unknown) {
        if (!isMounted) return;
        setError(reason instanceof Error ? reason : new Error('İçerik yüklenemedi.'));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [load]);

  return {
    data,
    error,
    isLoading,
    isError: Boolean(error),
    reload: load,
  };
}
