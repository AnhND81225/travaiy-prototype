import { httpClient } from '../core/httpClient';
import type {
  BackendPlace,
  PagePlace,
  Destination,
  PageDestination,
  Category,
  PlaceFilterParams,
  PlaceReview,
} from './places.types';

export const placesApi = {
  /**
   * GET /api/v1/catalog/places
   * Lấy danh sách địa điểm theo bộ lọc (destinationId, category, q, cost, indoor, page, size)
   */
  getPlaces(params?: PlaceFilterParams): Promise<PagePlace> {
    return httpClient.get<PagePlace>('/catalog/places', params as any, {
      skipAuth: true,
    });
  },

  /**
   * GET /api/v1/catalog/places/{id}
   * Chi tiết địa điểm
   */
  getPlaceById(id: string): Promise<BackendPlace> {
    return httpClient.get<BackendPlace>(`/catalog/places/${id}`, undefined, {
      skipAuth: true,
    });
  },

  /**
   * GET /api/v1/catalog/destinations
   * Lấy danh sách các điểm đến / thành phố
   */
  getDestinations(page = 0, size = 50): Promise<PageDestination> {
    return httpClient.get<PageDestination>('/catalog/destinations', { page, size }, {
      skipAuth: true,
    });
  },

  /**
   * GET /api/v1/catalog/categories
   * Lấy danh mục địa điểm
   */
  getCategories(): Promise<Category[]> {
    return httpClient.get<Category[]>('/catalog/categories', undefined, {
      skipAuth: true,
    });
  },

  /**
   * GET /api/v1/catalog/places/{id}/reviews
   */
  getPlaceReviews(id: string, page = 0, size = 20): Promise<{ items: PlaceReview[]; total: number }> {
    return httpClient.get(`/catalog/places/${id}/reviews`, { page, size }, {
      skipAuth: true,
    });
  },

  /**
   * GET /api/v1/me/favorites
   * Lấy danh sách địa điểm yêu thích của người dùng hiện tại
   */
  getFavorites(page = 0, size = 50): Promise<PagePlace> {
    return httpClient.get<PagePlace>('/me/favorites', { page, size });
  },

  /**
   * PUT /api/v1/me/favorites/{id}
   * Thêm vào yêu thích
   */
  addFavorite(id: string): Promise<void> {
    return httpClient.put<void>(`/me/favorites/${id}`);
  },

  /**
   * DELETE /api/v1/me/favorites/{id}
   * Bỏ yêu thích
   */
  removeFavorite(id: string): Promise<void> {
    return httpClient.delete<void>(`/me/favorites/${id}`);
  },

  /**
   * Toggle yêu thích tiện ích
   */
  async toggleFavorite(id: string, isFavorite: boolean): Promise<boolean> {
    if (isFavorite) {
      await this.removeFavorite(id);
      return false;
    } else {
      await this.addFavorite(id);
      return true;
    }
  },
};
