import { httpClient } from '../core/httpClient';
import { API_CONFIG } from '../core/apiConfig';
import type { Album, MediaItem, MediaInput, PageMedia } from './media.types';

export const mediaApi = {
  /**
   * GET /api/v1/trips/{tripId}/albums
   * Lấy danh sách album ảnh của chuyến đi
   */
  getAlbums(tripId: string, page = 0, size = 20): Promise<{ items: Album[]; total: number }> {
    return httpClient.get(`/trips/${tripId}/albums`, { page, size });
  },

  /**
   * POST /api/v1/trips/{tripId}/albums
   * Tạo album mới
   */
  createAlbum(tripId: string, title: string, audience = 'ALL'): Promise<Album> {
    return httpClient.post<Album>(`/trips/${tripId}/albums`, { title, audience });
  },

  /**
   * POST /api/v1/trips/{tripId}/albums/{albumId}/media
   * Upload ảnh kèm metadata vị trí / thời gian chụp vào album
   */
  uploadMedia(tripId: string, albumId: string, file: File, metadata?: MediaInput): Promise<MediaItem> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      // Spring Boot multipart expect metadata as JSON blob or string
      const metaBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      formData.append('metadata', metaBlob);
    } else {
      const metaBlob = new Blob([JSON.stringify({ title: file.name })], { type: 'application/json' });
      formData.append('metadata', metaBlob);
    }

    return httpClient.upload<MediaItem>(`/trips/${tripId}/albums/${albumId}/media`, formData);
  },

  /**
   * GET /api/v1/trips/{tripId}/media-map
   * Lấy toàn bộ ảnh có tọa độ địa lý của chuyến đi để render lên Memory Map
   */
  getMediaMap(tripId: string, page = 0, size = 100): Promise<PageMedia> {
    return httpClient.get<PageMedia>(`/trips/${tripId}/media-map`, { page, size });
  },

  /**
   * Lấy URL xem ảnh trực tiếp từ backend
   */
  getMediaFileUrl(tripId: string, mediaId: string): string {
    const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '');
    return `${baseUrl}/trips/${tripId}/media/${mediaId}/file`;
  },
};
