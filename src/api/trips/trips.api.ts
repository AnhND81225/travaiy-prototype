import { httpClient } from '../core/httpClient';
import type {
  Trip,
  PageSummary,
  TripDetailView,
  CreateTripRequest,
  SaveTripRequest,
  PlanningJobSubmit,
  JobView,
  QuotaInfo,
} from './trips.types';

export const tripsApi = {
  /**
   * GET /api/v1/trips
   * Lấy danh sách các chuyến đi (phân trang)
   */
  getTrips(page = 0, size = 20): Promise<PageSummary> {
    return httpClient.get<PageSummary>('/trips', { page, size });
  },

  /**
   * GET /api/v1/trips/{id}
   * Lấy chi tiết chuyến đi kèm quyền hạn (role)
   */
  getTripById(id: string): Promise<TripDetailView> {
    return httpClient.get<TripDetailView>(`/trips/${id}`);
  },

  /**
   * POST /api/v1/trips
   * Khởi tạo chuyến đi mới với tiêu đề
   */
  createTrip(payload: CreateTripRequest): Promise<Trip> {
    return httpClient.post<Trip>('/trips', payload);
  },

  /**
   * PUT /api/v1/trips/{id}
   * Lưu / Cập nhật toàn bộ thông tin lịch trình (kèm expectedVersion để chống xung đột)
   */
  saveTrip(id: string, payload: SaveTripRequest): Promise<Trip> {
    return httpClient.put<Trip>(`/trips/${id}`, payload);
  },

  /**
   * POST /api/v1/trips/{id}/status
   * Cập nhật trạng thái chuyến đi
   */
  updateStatus(id: string, expectedVersion: number, status: string): Promise<Trip> {
    return httpClient.post<Trip>(`/trips/${id}/status`, { expectedVersion, status });
  },

  /**
   * PATCH /api/v1/trips/{id}/activities/{activityId}/completion
   * Đánh dấu hoàn thành một hoạt động trong lịch trình
   */
  toggleActivityCompletion(
    tripId: string,
    activityId: string,
    expectedVersion: number,
    completed: boolean
  ): Promise<void> {
    return httpClient.patch<void>(
      `/trips/${tripId}/activities/${activityId}/completion`,
      { expectedVersion, completed }
    );
  },

  /**
   * POST /api/v1/trips/{tripId}/planning-jobs
   * Tạo job AI sinh lịch trình hoặc điều chỉnh lịch trình thông minh
   */
  submitPlanningJob(tripId: string, payload: PlanningJobSubmit): Promise<JobView> {
    return httpClient.post<JobView>(`/trips/${tripId}/planning-jobs`, payload, {
      timeoutMs: 60000,
    });
  },

  /**
   * GET /api/v1/trips/{tripId}/planning-jobs/{jobId}
   * Kiểm tra trạng thái job AI
   */
  getPlanningJob(tripId: string, jobId: string): Promise<JobView> {
    return httpClient.get<JobView>(`/trips/${tripId}/planning-jobs/${jobId}`);
  },

  /**
   * POST /api/v1/trips/{tripId}/planning-jobs/{jobId}/apply
   * Áp dụng đề xuất từ AI vào chuyến đi
   */
  applyPlanningJob(tripId: string, jobId: string): Promise<JobView> {
    return httpClient.post<JobView>(`/trips/${tripId}/planning-jobs/${jobId}/apply`);
  },

  /**
   * GET /api/v1/trips/{tripId}/quota
   * Kiểm tra quota AI còn lại của chuyến đi
   */
  getQuota(tripId: string): Promise<QuotaInfo> {
    return httpClient.get<QuotaInfo>(`/trips/${tripId}/quota`);
  },
};
