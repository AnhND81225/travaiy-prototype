import { API_CONFIG, TokenStorage } from './apiConfig';
import { ApiError } from './apiError';
import type { ApiResponse, RequestOptions } from './common.types';

// Hàng đợi cho các request đang chờ refresh token khi gặp mã lỗi 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

function buildQueryString(params?: RequestOptions['params']): string {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Core HTTP Request Function
 */
async function httpRequest<T = unknown>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const {
    params,
    skipAuth = false,
    timeoutMs = API_CONFIG.TIMEOUT_MS,
    unwrapData = true,
    headers: customHeaders = {},
    ...restOptions
  } = options;

  // 1. Tạo Full URL
  const queryString = buildQueryString(params);
  const isAbsoluteUrl = /^https?:\/\//i.test(endpoint);
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '');
  const url = `${isAbsoluteUrl ? endpoint : `${baseUrl}${cleanEndpoint}`}${queryString}`;

  // 2. Thiết lập Headers
  const headers = new Headers(customHeaders);
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (!isFormData && !headers.has('Content-Type') && body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  // Tự động gắn Bearer Token
  if (!skipAuth) {
    const token = TokenStorage.getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // 3. Quản lý Timeout qua AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const requestBody = isFormData
      ? (body as FormData)
      : body !== undefined
      ? JSON.stringify(body)
      : undefined;

    const response = await fetch(url, {
      method,
      headers,
      body: requestBody,
      signal: controller.signal,
      ...restOptions,
    });

    clearTimeout(timeoutId);

    // 4. Xử lý 401 Unauthorized (Auto Refresh Token)
    if (response.status === 401 && !skipAuth && endpoint !== API_CONFIG.REFRESH_TOKEN_URL) {
      const refreshToken = TokenStorage.getRefreshToken();

      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            // Gọi endpoint refresh token (Backend nhận TokenRequest { token })
            const refreshRes = await fetch(`${baseUrl}${API_CONFIG.REFRESH_TOKEN_URL}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: refreshToken }),
            });

            if (!refreshRes.ok) {
              throw new Error('Refresh token expired');
            }

            const refreshData = await refreshRes.json();
            const newAccessToken =
              refreshData.data?.accessToken ||
              refreshData.result?.accessToken ||
              refreshData.accessToken;

            if (!newAccessToken) {
              throw new Error('Token not found in refresh response');
            }

            TokenStorage.setTokens(newAccessToken, refreshData.refreshToken || refreshData.data?.refreshToken || refreshData.result?.refreshToken);
            processQueue(null, newAccessToken);

            return httpRequest<T>(endpoint, method, body, {
              ...options,
              headers: {
                ...customHeaders,
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
          } catch (refreshErr) {
            processQueue(refreshErr, null);
            TokenStorage.clearTokens();
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            }
            throw new ApiError({
              message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!',
              status: 401,
            });
          } finally {
            isRefreshing = false;
          }
        } else {
          return new Promise<T>((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                resolve(
                  httpRequest<T>(endpoint, method, body, {
                    ...options,
                    headers: {
                      ...customHeaders,
                      Authorization: `Bearer ${token}`,
                    },
                  })
                );
              },
              reject: (err: unknown) => {
                reject(err);
              },
            });
          });
        }
      } else {
        TokenStorage.clearTokens();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
      }
    }

    // 5. Parse phản hồi từ Backend
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json') || contentType.includes('+json');
    const responsePayload = isJson ? await response.json() : await response.text();

    // 6. Xử lý lỗi HTTP status >= 400
    if (!response.ok) {
      let errorMessage = response.statusText || 'Lỗi kết nối máy chủ';
      let errorCode: string | number | undefined;
      let errorDetails: unknown = undefined;

      if (isJson && responsePayload && typeof responsePayload === 'object') {
        const payload = responsePayload as Record<string, unknown>;
        errorMessage =
          (payload.detail as string) ||
          (payload.message as string) ||
          (payload.error as string) ||
          (payload.title as string) ||
          errorMessage;
        errorCode = (payload.code as string | number) || (payload.status as string | number);
        errorDetails = payload.errors || payload.data || payload.details;
      }

      throw new ApiError({
        message: errorMessage,
        status: response.status,
        code: errorCode,
        errors: errorDetails,
        rawResponse: responsePayload,
      });
    }

    // 7. Unwrap data nếu backend đóng gói trong ApiResponse
    if (unwrapData && isJson && responsePayload && typeof responsePayload === 'object') {
      const envelope = responsePayload as ApiResponse<T>;
      if ('data' in envelope && envelope.data !== undefined) {
        return envelope.data as T;
      }
      if ('result' in envelope && envelope.result !== undefined) {
        return envelope.result as T;
      }
    }

    return responsePayload as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError({
        message: `Yêu cầu quá thời gian chờ (${timeoutMs}ms)`,
        status: 408,
        isTimeout: true,
      });
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError({
        message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng!',
        status: 0,
        isNetworkError: true,
      });
    }

    throw new ApiError({
      message: error instanceof Error ? error.message : 'Lỗi không xác định',
      status: 0,
      rawResponse: error,
    });
  }
}

/**
 * HTTP Client tiện ích chuẩn RESTful
 */
export const httpClient = {
  get<T = unknown>(endpoint: string, params?: RequestOptions['params'], options?: Omit<RequestOptions, 'params'>): Promise<T> {
    return httpRequest<T>(endpoint, 'GET', undefined, { ...options, params });
  },

  post<T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return httpRequest<T>(endpoint, 'POST', body, options);
  },

  put<T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return httpRequest<T>(endpoint, 'PUT', body, options);
  },

  patch<T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return httpRequest<T>(endpoint, 'PATCH', body, options);
  },

  delete<T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> {
    return httpRequest<T>(endpoint, 'DELETE', undefined, options);
  },

  upload<T = unknown>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T> {
    return httpRequest<T>(endpoint, 'POST', formData, options);
  },
};

