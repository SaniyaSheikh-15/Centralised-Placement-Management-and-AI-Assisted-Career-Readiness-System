const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export function formatValidationErrors(details: unknown): string {
  if (typeof details === "string") return details;
  if (Array.isArray(details)) {
    const messages = details.map((err) => {
      if (err && typeof err === "object" && "msg" in err) {
        const field = Array.isArray(err.loc) ? err.loc.slice(1).join(".") : "";
        return field ? `${field}: ${err.msg}` : `${err.msg}`;
      }
      return String(err);
    });
    return messages.join(". ");
  }
  return "Validation error occurred";
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, headers: customHeaders, ...restOptions } = options;

  const url = `${API_BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(customHeaders as Record<string, string>),
  };

  // Inject Bearer token if provided explicitly or from browser storage
  const effectiveToken =
    token ||
    (typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
      : null);

  if (effectiveToken && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${effectiveToken}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...restOptions,
      headers,
    });
  } catch {
    throw new ApiError(
      0,
      "Unable to connect to the server. Please ensure the backend is running at " + API_BASE_URL
    );
  }

  // Parse JSON response or empty body
  let data: unknown = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await response.text();
      data = text ? { message: text } : null;
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    if (data && typeof data === "object") {
      const dataObj = data as Record<string, unknown>;
      if (dataObj.detail) {
        if (typeof dataObj.detail === "string") {
          errorMessage = dataObj.detail;
        } else if (Array.isArray(dataObj.detail)) {
          errorMessage = formatValidationErrors(dataObj.detail);
        }
      } else if (typeof dataObj.message === "string") {
        errorMessage = dataObj.message;
      }
    }

    throw new ApiError(response.status, errorMessage, data);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
