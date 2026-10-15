import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  AuthUser,
} from "@/types/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      typeof data === "object" &&
      data !== null &&
      "detail" in data &&
      typeof data.detail === "string"
        ? data.detail
        : "Something went wrong. Please try again.";

    throw new Error(errorMessage);
  }

  return data as T;
}

export async function login(
  credentials: LoginRequest
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
      role: credentials.role,
    }),
  });
}

export async function register(
  credentials: RegisterRequest
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      confirmPassword: credentials.confirmPassword,
      role: credentials.role,
    }),
  });
}

export async function getCurrentUser(): Promise<AuthUser> {
  return apiRequest<AuthUser>("/api/v1/auth/me", {
    method: "GET",
  });
}

export async function logout(): Promise<void> {
  await apiRequest<{ message?: string }>("/api/v1/auth/logout", {
    method: "POST",
  });
}