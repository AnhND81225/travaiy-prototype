/**
 * Core API Configuration & Token Storage
 */

export const API_CONFIG = {
  // Base URL của Backend API. Mặc định dùng proxy '/api/v1' ở local hoặc cấu hình qua env
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  
  // Thời gian chờ tối đa (mặc định: 15s)
  TIMEOUT_MS: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,

  // Các key lưu trữ token
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'travaiy_access_token',
    REFRESH_TOKEN: 'travaiy_refresh_token',
    USER: 'travaiy_user_info',
  },

  // Endpoint refresh token trên Backend TravAIy
  REFRESH_TOKEN_URL: '/auth/refresh',
};

/**
 * Tiện ích quản lý Token xác thực
 */
export const TokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  },

  setAccessToken(token: string): void {
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken(token: string): void {
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  setTokens(accessToken: string, refreshToken?: string): void {
    this.setAccessToken(accessToken);
    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }
  },

  clearTokens(): void {
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER);
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};

