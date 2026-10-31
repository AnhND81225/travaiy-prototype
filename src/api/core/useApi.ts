import { useState, useCallback } from 'react';
import { ApiError } from './apiError';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export interface UseApiReturn<T, P extends unknown[]> extends UseApiState<T> {
  execute: (...args: P) => Promise<T | null>;
  reset: () => void;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

/**
 * Generic React Hook quản lý trạng thái { data, loading, error, execute }
 */
export function useApi<T, P extends unknown[] = []>(
  apiFunc: (...args: P) => Promise<T>,
  initialData: T | null = null
): UseApiReturn<T, P> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err: unknown) {
        const normalizedError =
          err instanceof ApiError
            ? err
            : new ApiError({
                message: err instanceof Error ? err.message : 'Lỗi không xác định',
                rawResponse: err,
              });
        setError(normalizedError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData,
  };
}

