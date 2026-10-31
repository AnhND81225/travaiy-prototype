/**
 * Types cho Auth & User Profile khớp chính xác với OpenAPI schema của TravAIy Backend
 */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  displayName: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string; // Mặc định: "Bearer"
  expiresIn?: number;
}

export interface UserProfile {
  userId: string;
  businessName?: string;
  description?: string;
  status?: string;
  version?: number;
  displayName?: string;
  email?: string;
  role?: string;
}

export interface ProfileUpdate {
  displayName: string;
}

export interface EmailRequest {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}
