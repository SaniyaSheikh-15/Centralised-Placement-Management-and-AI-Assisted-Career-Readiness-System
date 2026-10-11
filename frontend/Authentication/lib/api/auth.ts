import { apiClient } from "./client";
import {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RecruiterRegisterRequest,
  RegisterRequest,
  ResetPasswordRequest,
  ResendVerificationRequest,
  TPAccessRequestCreate,
  TPAccessRequestResponse,
  UserResponse,
  VerifyEmailRequest,
  VerifyOTPRequest,
  ApiMessageResponse,
} from "@/types/auth";

export const authApi = {
  /**
   * Register a new student account.
   * FastAPI: POST /auth/register
   */
  registerStudent: (payload: RegisterRequest): Promise<UserResponse> => {
    return apiClient.post<UserResponse>("/auth/register", payload);
  },

  /**
   * Register a recruiter and company account.
   * FastAPI: POST /auth/register/recruiter
   */
  registerRecruiter: (
    payload: RecruiterRegisterRequest
  ): Promise<UserResponse> => {
    return apiClient.post<UserResponse>("/auth/register/recruiter", payload);
  },

  /**
   * Submit an institutional T&P Officer access request.
   * FastAPI: POST /auth/tp/request-access
   */
  requestTPAccess: (
    payload: TPAccessRequestCreate
  ): Promise<TPAccessRequestResponse> => {
    return apiClient.post<TPAccessRequestResponse>(
      "/auth/tp/request-access",
      payload
    );
  },

  /**
   * Authenticate user with email and password.
   * FastAPI: POST /auth/login
   */
  login: (payload: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/auth/login", payload);
  },

  /**
   * Retrieve the currently authenticated user profile using JWT Bearer token.
   * FastAPI: GET /auth/me
   */
  getMe: (token?: string | null): Promise<UserResponse> => {
    return apiClient.get<UserResponse>("/auth/me", { token });
  },

  /**
   * Verify email address with 6-digit OTP.
   * FastAPI: POST /auth/verify-email
   */
  verifyEmail: (payload: VerifyEmailRequest): Promise<UserResponse> => {
    return apiClient.post<UserResponse>("/auth/verify-email", payload);
  },

  /**
   * Resend email verification OTP code.
   * FastAPI: POST /auth/resend-verification
   */
  resendVerification: (
    payload: ResendVerificationRequest
  ): Promise<ApiMessageResponse> => {
    return apiClient.post<ApiMessageResponse>(
      "/auth/resend-verification",
      payload
    );
  },

  /**
   * Request password reset OTP for registered email.
   * FastAPI: POST /auth/forgot-password
   */
  forgotPassword: (
    payload: ForgotPasswordRequest
  ): Promise<ApiMessageResponse> => {
    return apiClient.post<ApiMessageResponse>("/auth/forgot-password", payload);
  },

  /**
   * Verify 6-digit OTP code before resetting password.
   * FastAPI: POST /auth/verify-otp
   */
  verifyOtp: (payload: VerifyOTPRequest): Promise<ApiMessageResponse> => {
    return apiClient.post<ApiMessageResponse>("/auth/verify-otp", {
      purpose: "PASSWORD_RESET",
      ...payload,
    });
  },

  /**
   * Reset user password using verified OTP.
   * FastAPI: POST /auth/reset-password
   */
  resetPassword: (
    payload: ResetPasswordRequest
  ): Promise<ApiMessageResponse> => {
    return apiClient.post<ApiMessageResponse>("/auth/reset-password", payload);
  },
};
