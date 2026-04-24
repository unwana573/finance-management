/**
 * NairaFlow API Client
 * ─────────────────────────────────────────────────────────────
 * Set your backend URL in .env:
 *   VITE_API_URL=https://your-app.onrender.com/v1
 *   (or leave blank to use localhost:8000/v1)
 */

import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "./tokens";

const BASE_URL = import.meta.env.VITE_API_URL || "https://fina-mag.onrender.com/v1";

// Called by App when refresh fails so user is sent back to login
let _onLogout = () => {};
export const setLogoutHandler = (fn) => { _onLogout = fn; };

// ── Core fetch wrapper with auto-refresh ──────────────────────
async function request(path, options = {}, isRetry = false) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // Access token expired — try to refresh once
  if (res.status === 401 && !isRetry) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) { _onLogout(); return; }

    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ refresh_token: refreshToken }),
    });

    if (refreshRes.ok) {
      const tokens = await refreshRes.json();
      saveTokens(tokens.access_token, tokens.refresh_token);
      // Retry original request with new token
      return request(path, options, true);
    } else {
      clearTokens();
      _onLogout();
      return;
    }
  }

  // 204 No Content — nothing to parse
  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || `Request failed (${res.status})`);
  }

  return data;
}

// Convenience methods
const api = {
  get:    (path, opts)         => request(path, { method: "GET",    ...opts }),
  post:   (path, body, opts)   => request(path, { method: "POST",   body: JSON.stringify(body), ...opts }),
  put:    (path, body, opts)   => request(path, { method: "PUT",    body: JSON.stringify(body), ...opts }),
  patch:  (path, body, opts)   => request(path, { method: "PATCH",  body: JSON.stringify(body), ...opts }),
  delete: (path, opts)         => request(path, { method: "DELETE", ...opts }),

  // Login uses form data, not JSON
  postForm: (path, params) => {
    const body = new URLSearchParams(params).toString();
    return request(path, {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
  },
};

export default api;