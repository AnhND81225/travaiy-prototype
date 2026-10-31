import { useState, useCallback } from 'react';
import { placesApi } from './places.api';
import type { BackendPlace, PlaceFilterParams } from './places.types';
import { ApiError } from '../core/apiError';

export function usePlaces(initialParams?: PlaceFilterParams) {
  const [places, setPlaces] = useState<BackendPlace[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchPlaces = useCallback(async (params?: PlaceFilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await placesApi.getPlaces(params || initialParams);
      setPlaces(res.items || []);
      setTotal(res.total || 0);
      return res;
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError({ message: 'Không thể tải danh sách địa điểm' });
      setError(apiErr);
      return null;
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  const toggleFavorite = useCallback(async (placeId: string, currentStatus: boolean) => {
    // Optimistic update
    setPlaces((prev) =>
      prev.map((p) => (p.id === placeId ? { ...p, isFavorite: !currentStatus } : p))
    );
    try {
      const newStatus = await placesApi.toggleFavorite(placeId, currentStatus);
      setPlaces((prev) =>
        prev.map((p) => (p.id === placeId ? { ...p, isFavorite: newStatus } : p))
      );
    } catch (err) {
      // Revert nếu lỗi
      setPlaces((prev) =>
        prev.map((p) => (p.id === placeId ? { ...p, isFavorite: currentStatus } : p))
      );
      throw err;
    }
  }, []);

  return {
    places,
    total,
    loading,
    error,
    fetchPlaces,
    toggleFavorite,
    setPlaces,
  };
}
