import { useState, useCallback } from 'react';
import { tripsApi } from './trips.api';
import type { TripSummary, CreateTripRequest, SaveTripRequest, Trip } from './trips.types';
import { ApiError } from '../core/apiError';

export function useTrips(initialPage = 0, initialSize = 20) {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchTrips = useCallback(async (page = initialPage, size = initialSize) => {
    setLoading(true);
    setError(null);
    try {
      const res = await tripsApi.getTrips(page, size);
      setTrips(res.items || []);
      setTotal(res.total || 0);
      return res;
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError({ message: 'Không thể tải danh sách chuyến đi' });
      setError(apiErr);
      return null;
    } finally {
      setLoading(false);
    }
  }, [initialPage, initialSize]);

  const createTrip = useCallback(async (payload: CreateTripRequest): Promise<Trip> => {
    setLoading(true);
    setError(null);
    try {
      const newTrip = await tripsApi.createTrip(payload);
      setTrips((prev) => [
        {
          id: newTrip.id,
          title: newTrip.title,
          status: newTrip.status,
          version: newTrip.version,
          role: 'OWNER',
          updatedAt: newTrip.updatedAt || new Date().toISOString(),
        },
        ...prev,
      ]);
      return newTrip;
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError({ message: 'Tạo chuyến đi thất bại' });
      setError(apiErr);
      throw apiErr;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveTrip = useCallback(async (id: string, payload: SaveTripRequest): Promise<Trip> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await tripsApi.saveTrip(id, payload);
      setTrips((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, title: updated.title, status: updated.status, version: updated.version }
            : t
        )
      );
      return updated;
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError({ message: 'Lưu chuyến đi thất bại' });
      setError(apiErr);
      throw apiErr;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    trips,
    total,
    loading,
    error,
    fetchTrips,
    createTrip,
    saveTrip,
    setTrips,
  };
}
