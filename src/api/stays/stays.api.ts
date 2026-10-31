import { httpClient } from '../core/httpClient';
import type { BackendPlace, PagePlace } from '../places/places.types';
import type { PublicOffer, StayQueryParams, StayDetail } from './stays.types';

export const staysApi = {
  /**
   * GET /api/v1/catalog/places?category=STAY
   * Lấy danh sách khách sạn / chỗ ở
   */
  getStays(params?: StayQueryParams): Promise<PagePlace> {
    return httpClient.get<PagePlace>(
      '/catalog/places',
      { ...params, category: 'STAY' },
      { skipAuth: true }
    );
  },

  /**
   * GET /api/v1/catalog/places/{id}
   * Chi tiết chỗ ở
   */
  getStayById(id: string): Promise<BackendPlace> {
    return httpClient.get<BackendPlace>(`/catalog/places/${id}`, undefined, {
      skipAuth: true,
    });
  },

  /**
   * GET /api/v1/catalog/places/{id}/offers
   * Lấy các phòng / gói ưu đãi phòng của khách sạn
   */
  getStayOffers(id: string, page = 0, size = 20): Promise<{ items: PublicOffer[]; total: number }> {
    return httpClient.get(`/catalog/places/${id}/offers`, { page, size }, {
      skipAuth: true,
    });
  },

  /**
   * Lấy chi tiết chỗ ở kèm danh sách phòng
   */
  async getStayWithOffers(id: string): Promise<StayDetail> {
    const [stay, offersRes] = await Promise.all([
      this.getStayById(id),
      this.getStayOffers(id).catch(() => ({ items: [], total: 0 })),
    ]);
    return {
      ...stay,
      offers: offersRes.items || [],
    };
  },
};
