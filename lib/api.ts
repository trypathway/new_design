const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiError {
  message: string;
  status: number;
}

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  data?: any,
  headers: Record<string, string> = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Get auth token from wherever you store it (localStorage, cookies, etc.)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new ApiRequestError(
        error.message || "An error occurred",
        response.status,
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }
    throw new ApiRequestError("Network error", 500);
  }
}

// Typed helper functions
export const api = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, "GET", undefined, headers),

  post: <T>(endpoint: string, data?: any, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, "POST", data, headers),

  put: <T>(endpoint: string, data?: any, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, "PUT", data, headers),

  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, "DELETE", undefined, headers),
};
