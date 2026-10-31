import { useState, useCallback } from 'react';
import { mediaApi } from './media.api';
import type { MediaItem, MediaInput, Album } from './media.types';
import { ApiError } from '../core/apiError';

export function useMedia(tripId: string) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [mapPhotos, setMapPhotos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchMediaMap = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await mediaApi.getMediaMap(tripId);
      setMapPhotos(res.items || []);
      return res;
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError({ message: 'Không thể tải bản đồ ảnh' });
      setError(apiErr);
      return null;
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  const uploadPhoto = useCallback(
    async (albumId: string, file: File, metadata?: MediaInput) => {
      setUploading(true);
      setError(null);
      try {
        const item = await mediaApi.uploadMedia(tripId, albumId, file, metadata);
        if (item.lat && item.lng) {
          setMapPhotos((prev) => [item, ...prev]);
        }
        return item;
      } catch (err) {
        const apiErr = err instanceof ApiError ? err : new ApiError({ message: 'Upload ảnh thất bại' });
        setError(apiErr);
        throw apiErr;
      } finally {
        setUploading(false);
      }
    },
    [tripId]
  );

  return {
    albums,
    mapPhotos,
    loading,
    uploading,
    error,
    fetchMediaMap,
    uploadPhoto,
    getMediaFileUrl: (mediaId: string) => mediaApi.getMediaFileUrl(tripId, mediaId),
  };
}
