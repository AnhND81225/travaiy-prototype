import { useState, useEffect, useCallback } from 'react';
import { authApi } from './auth.api';
import { TokenStorage } from '../core/apiConfig';
import type { UserProfile, LoginPayload, RegisterPayload, ProfileUpdate } from './auth.types';
import { ApiError } from '../core/apiError';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('travaiy_user_info');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!TokenStorage.isAuthenticated()) return null;
    try {
      setLoading(true);
      const profile = await authApi.getProfile();
      setUser(profile);
      localStorage.setItem('travaiy_user_info', JSON.stringify(profile));
      return profile;
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError({ message: 'Lỗi lấy profile' }));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setLoading(true);
      setError(null);
      try {
        const tokens = await authApi.login(payload);
        const profile = await fetchProfile();
        return { tokens, profile };
      } catch (err) {
        const apiErr = err instanceof ApiError ? err : new ApiError({ message: 'Đăng nhập thất bại' });
        setError(apiErr);
        throw apiErr;
      } finally {
        setLoading(false);
      }
    },
    [fetchProfile]
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.register(payload);
      return res;
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError({ message: 'Đăng ký thất bại' });
      setError(apiErr);
      throw apiErr;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: ProfileUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await authApi.updateProfile(data);
      setUser(updated);
      localStorage.setItem('travaiy_user_info', JSON.stringify(updated));
      return updated;
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError({ message: 'Cập nhật thất bại' });
      setError(apiErr);
      throw apiErr;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authApi.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  return {
    user,
    isAuthenticated: !!user || TokenStorage.isAuthenticated(),
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    fetchProfile,
  };
}
