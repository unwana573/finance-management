import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "./tokens";

const BASE_URL = import.meta.env.VITE_API_URL || "https://fina-mag.onrender.com/v1";

let _onLogout = () => {};
export const setLogoutHandler = (fn) => { _onLogout = fn; };

async function request(path, options = {}, isRetry = false) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

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
      return request(path, options, true);
    } else {
      clearTokens();
      _onLogout();
      return;
    }
  }

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || `Request failed (${res.status})`);
  }

  return data;
}

const api = {
  get:    (path, opts)         => request(path, { method: "GET",    ...opts }),
  post:   (path, body, opts)   => request(path, { method: "POST",   body: JSON.stringify(body), ...opts }),
  put:    (path, body, opts)   => request(path, { method: "PUT",    body: JSON.stringify(body), ...opts }),
  patch:  (path, body, opts)   => request(path, { method: "PATCH",  body: JSON.stringify(body), ...opts }),
  delete: (path, opts)         => request(path, { method: "DELETE", ...opts }),

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