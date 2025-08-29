import { envConfig } from "../../config";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const API_URL = envConfig.NEXT_PUBLIC_API_URL;
async function request<T>(
  endpoint: string,
  method: HttpMethod,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store", // tránh cache khi dùng trong Next.js
  });

  if (!res.ok) {
    // Parse lỗi trả về từ server
    const errorData = await res.json().catch(() => ({}));
    throw {
      status: res.status,
      message: errorData.message || "Request failed",
      errors: errorData.errors || [],
    };
  }

  return res.json();
}

export const http = {
  get: <T>(endpoint: string) => request<T>(endpoint, "GET"),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, "POST", body),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, "PUT", body),
  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, "PATCH", body),
  delete: <T>(endpoint: string, body?: number[]) =>
    request<T>(endpoint, "DELETE", body),
};
