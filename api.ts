const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
}

export const api = {
  get: <T>(url: string) => request<T>(url, { method: "GET" }),
  post: <T>(url: string, body: any) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(url: string, body: any) =>
    request<T>(url, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),

  // Image upload logic
  upload: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("image", file);

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    const response = await fetch(`${BASE_URL}/upload`, {
      // Assuming /api/upload endpoint
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || "Upload failed");
    }
    return response.json();
  },

  // Auth related
  login: <T>(body: any) =>
    request<T>("/auth/sign-in", { method: "POST", body: JSON.stringify(body) }),
  // Add other auth endpoints if needed, e.g., /auth/me, /auth/logout
};
