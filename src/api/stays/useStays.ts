import { useState, useCallback } from 'react';
import { staysApi } from './stays.api';
import type { BackendPlace } from '../places/places.types';
import type { StayQueryParams } from './stays.types';
import { ApiError } from '../core/apiError';

export function useStays(initialParams?: StayQueryParams) {
  const [stays, setStays] = useState<BackendPlace[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchStays = useCallback(async (params?: StayQueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await staysApi.getStays(params || initialParams);
      const items = res.items || [];
      setStays(items);
      setTotal(res.total || items.length);
      return res;
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError({ message: 'Không thể tải danh sách khách sạn' });
      setError(apiErr);
      return null;
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  return {
    stays,
    total,
    loading,
    error,
    fetchStays,
    setStays,
  };
}
