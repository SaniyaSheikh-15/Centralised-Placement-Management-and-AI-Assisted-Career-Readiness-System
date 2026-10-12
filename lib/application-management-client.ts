import type { ApplicationRecord } from "@/types/placement";

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000").replace(/\/+$/, "");
  const path = url.replace(/^\/api\/v1(?=\/)/, "");
  const token = typeof window === "undefined" ? null : (
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
  );
  if (typeof window !== "undefined" && !token) {
    throw new ApiError("Sign in to continue.", 401);
  }

  let response: Response;
  try {
    response = await fetch(`${apiBase}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError("Unable to reach the application service. Check that the app is running and try again.", 0);
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("authUser");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("authUser");
      window.dispatchEvent(new Event("campusconnect:auth-expired"));
      throw new ApiError("Your session has expired. Please sign in again.", 401);
    }
    const message = getErrorMessage(payload, response.status);
    throw new ApiError(message, response.status);
  }
  return payload as T;
}

function getErrorMessage(payload: unknown, status: number) {
  if (!payload || typeof payload !== "object") return `Request failed (${status}).`;
  if ("message" in payload && typeof payload.message === "string") return payload.message;
  if ("detail" in payload && typeof payload.detail === "string") return payload.detail;
  if ("detail" in payload && Array.isArray(payload.detail)) {
    return payload.detail.map((item) => item && typeof item === "object" && "msg" in item ? String(item.msg) : String(item)).join(". ");
  }
  return `Request failed (${status}).`;
}

export interface ApplicationResponse { application: ApplicationRecord }
export interface ApplicationsResponse { applications: ApplicationRecord[] }
