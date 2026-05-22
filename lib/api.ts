// Thin fetch wrapper around the backend REST API.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const ACCESS_KEY = "food_access_token";
const REFRESH_KEY = "food_refresh_token";

/** Reads/writes JWT tokens in localStorage. */
export const tokenStore = {
  getAccess(): string | null {
    return typeof window === "undefined" ? null : localStorage.getItem(ACCESS_KEY);
  },
  getRefresh(): string | null {
    return typeof window === "undefined" ? null : localStorage.getItem(REFRESH_KEY);
  },
  setTokens(accessToken: string, refreshToken?: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  /** Attach the stored access token (default: true). */
  auth?: boolean;
  /** Override the bearer token (e.g. a refresh token). */
  token?: string;
}

async function parseResponse(res: Response): Promise<unknown> {
  if (res.status === 204) return undefined;
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** Exchanges the refresh token for a fresh access token. */
async function tryRefresh(): Promise<string | null> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return null;

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    headers: { Authorization: `Bearer ${refreshToken}` },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { accessToken: string };
  tokenStore.setTokens(data.accessToken);
  return data.accessToken;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const isFormData = body instanceof FormData;

  const baseHeaders: Record<string, string> = {};
  if (body !== undefined && !isFormData) {
    baseHeaders["Content-Type"] = "application/json";
  }

  const send = (bearer: string | null) => {
    const headers = { ...baseHeaders };
    if (bearer) headers.Authorization = `Bearer ${bearer}`;
    return fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
    });
  };

  const token = options.token ?? (auth ? tokenStore.getAccess() : null);
  let res = await send(token);

  // Access token likely expired — refresh once and retry.
  if (res.status === 401 && auth && !options.token && tokenStore.getRefresh()) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await send(refreshed);
    }
  }

  const data = await parseResponse(res);
  if (!res.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : `Request failed (${res.status})`;
    throw new ApiError(res.status, message);
  }
  return data as T;
}
