export type UserRole = "student" | "recruiter" | "tpo";

/* ---------------------------------------------------------
   Frontend Form Types (UI state)
--------------------------------------------------------- */
export interface StudentRegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export interface RecruiterRegistrationForm {
  companyName: string;
  firstName: string;
  lastName: string;
  designation: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export interface TpoAccessForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  institution: string;
  designation: string;
  reason: string;
}

export interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

/* ---------------------------------------------------------
   Backend API Schemas (FastAPI / Pydantic Source of Truth)
--------------------------------------------------------- */
export interface RegisterRequest {
  first_name: string;
  last_name?: string | null;
  email: string;
  phone?: string | null;
  password: string;
  role?: "student" | "recruiter" | "placement_officer";
}

export interface RecruiterRegisterRequest {
  company_name: string;
  first_name: string;
  last_name?: string | null;
  designation?: string | null;
  official_email: string;
  contact_number?: string | null;
  password: string;
  confirm_password?: string | null;
  terms_accepted?: boolean;
}

export interface TPAccessRequestCreate {
  first_name: string;
  last_name?: string | null;
  official_email: string;
  contact_number?: string | null;
  institution_name: string;
  designation?: string | null;
  reason_for_access?: string | null;
}

export interface TPAccessRequestResponse {
  request_id: string;
  first_name: string;
  last_name: string | null;
  official_email: string;
  contact_number: string | null;
  institution_name: string;
  designation: string | null;
  reason_for_access: string | null;
  status: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserResponse {
  user_id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  is_verified: boolean;
  is_active: boolean;
  role: string | null;
}

export interface AuthResponse {
  user: UserResponse;
  tokens: TokenResponse;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
  purpose?: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
  confirm_password?: string | null;
}

export interface ApiMessageResponse {
  message: string;
  valid?: boolean;
}
