/**
 * Định dạng phản hồi chuẩn từ Backend
 */
export interface ApiResponse<T = unknown> {
  code?: number | string;
  message?: string;
  success?: boolean;
  data?: T;
  result?: T;
  timestamp?: string;
}

/**
 * Cấu trúc phân trang chuẩn (hỗ trợ cả Spring Data Pageable và REST thông thường)
 */
export interface PaginatedResponse<T> {
  // Spring Data Page
  content?: T[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  
  // Generic REST Page
  items?: T[];
  data?: T[];
  total?: number;
  page?: number;
  pageSize?: number;
  limit?: number;
}

/**
 * Tham số query phân trang & tìm kiếm
 */
export interface PaginationParams {
  page?: number;
  size?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  keyword?: string;
  search?: string;
}

/**
 * Tùy chọn cấu hình riêng cho từng request
 */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null | (string | number)[]>;
  skipAuth?: boolean;
  timeoutMs?: number;
  unwrapData?: boolean;
}

