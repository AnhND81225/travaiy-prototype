import { httpClient } from '../core/httpClient';
import { TokenStorage } from '../core/apiConfig';
import type {
  LoginPayload,
  RegisterPayload,
  Tokens,
  UserProfile,
  ProfileUpdate,
  EmailRequest,
  ResetPasswordPayload,
} from './auth.types';

export const authApi = {
  /**
   * POST /api/v1/auth/login
   * Đăng nhập và tự động lưu Access/Refresh Token
   */
  async login(payload: LoginPayload): Promise<Tokens> {
    const response = await httpClient.post<Tokens>('/auth/login', payload, {
      skipAuth: true,
    });

    if (response.accessToken) {
      TokenStorage.setTokens(response.accessToken, response.refreshToken);
      // Lấy thêm thông tin user profile để lưu cache
      try {
        const profile = await httpClient.get<UserProfile>('/me');
        localStorage.setItem('travaiy_user_info', JSON.stringify(profile));
      } catch {
        // bỏ qua nếu lỗi
      }
    }

    return response;
  },

  /**
   * POST /api/v1/auth/register
   * Đăng ký tài khoản
   */
  register(payload: RegisterPayload): Promise<{ message?: string }> {
    return httpClient.post<{ message?: string }>('/auth/register', payload, {
      skipAuth: true,
    });
  },

  /**
   * POST /api/v1/auth/logout
   * Đăng xuất và dọn dẹp local storage
   */
  async logout(): Promise<void> {
    try {
      await httpClient.post('/auth/logout');
    } catch {
      // Dù BE lỗi vẫn tiến hành dọn dẹp client
    } finally {
      TokenStorage.clearTokens();
    }
  },

  /**
   * POST /api/v1/auth/refresh
   * Làm mới Access Token bằng refreshToken
   */
  async refresh(refreshToken: string): Promise<Tokens> {
    const response = await httpClient.post<Tokens>(
      '/auth/refresh',
      { token: refreshToken },
      { skipAuth: true }
    );
    if (response.accessToken) {
      TokenStorage.setTokens(response.accessToken, response.refreshToken);
    }
    return response;
  },

  /**
   * POST /api/v1/auth/forgot-password
   */
  forgotPassword(payload: EmailRequest): Promise<void> {
    return httpClient.post('/auth/forgot-password', payload, { skipAuth: true });
  },

  /**
   * POST /api/v1/auth/reset-password
   */
  resetPassword(payload: ResetPasswordPayload): Promise<void> {
    return httpClient.post('/auth/reset-password', payload, { skipAuth: true });
  },

  /**
   * GET /api/v1/me
   * Lấy thông tin tài khoản hiện tại
   */
  getProfile(): Promise<UserProfile> {
    return httpClient.get<UserProfile>('/me');
  },

  /**
   * PATCH /api/v1/me
   * Cập nhật thông tin profile
   */
  updateProfile(data: ProfileUpdate): Promise<UserProfile> {
    return httpClient.patch<UserProfile>('/me', data);
  },
};
