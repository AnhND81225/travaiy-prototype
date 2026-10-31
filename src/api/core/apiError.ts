/**
 * Lớp lỗi chuẩn hóa cho toàn bộ các cuộc gọi API
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string | number;
  public readonly errors?: Record<string, string | string[]> | unknown;
  public readonly isNetworkError: boolean;
  public readonly isTimeout: boolean;
  public readonly rawResponse?: unknown;

  constructor({
    message,
    status = 0,
    code,
    errors,
    isNetworkError = false,
    isTimeout = false,
    rawResponse,
  }: {
    message: string;
    status?: number;
    code?: string | number;
    errors?: Record<string, string | string[]> | unknown;
    isNetworkError?: boolean;
    isTimeout?: boolean;
    rawResponse?: unknown;
  }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
    this.isNetworkError = isNetworkError;
    this.isTimeout = isTimeout;
    this.rawResponse = rawResponse;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getApiErrorMessage(error: unknown, fallbackMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại!'): string {
  if (isApiError(error)) {
    if (error.isTimeout) return 'Yêu cầu vượt quá thời gian chờ (Timeout). Vui lòng thử lại!';
    if (error.isNetworkError) return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng hoặc Backend!';
    return error.message || fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
}

