import api from "./client";
import { saveTokens, clearTokens, getRefreshToken } from "./tokens";

// ── Register ──────────────────────────────────────────────────
export async function register(email, password, fullName) {
  const data = await api.post("/auth/register", {
    email,
    password,
    full_name: fullName,
  });
  saveTokens(data.access_token, data.refresh_token);
  return data;
}

// ── Email login ───────────────────────────────────────────────
// ⚠️ Backend expects form data with "username" field (not JSON)
export async function loginEmail(email, password) {
  const data = await api.postForm("/auth/login", {
    username: email,
    password,
  });
  saveTokens(data.access_token, data.refresh_token);
  return data;
}

// ── Google sign-in ────────────────────────────────────────────
// Pass the id_token from Google SDK (e.g. Google One Tap / gsi)
export async function loginGoogle(idToken) {
  const data = await api.post("/auth/google", { id_token: idToken });
  saveTokens(data.access_token, data.refresh_token);
  return data;
}

// ── Apple sign-in ─────────────────────────────────────────────
// identityToken + full_name (only available on first sign-in from Apple)
export async function loginApple(identityToken, fullName = "") {
  const data = await api.post("/auth/apple", {
    identity_token: identityToken,
    full_name: fullName,
  });
  saveTokens(data.access_token, data.refresh_token);
  return data;
}

// ── Logout ────────────────────────────────────────────────────
export async function logout() {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      await api.post("/auth/logout", { refresh_token: refreshToken });
    } catch (_) {
      // Ignore errors on logout — clear tokens regardless
    }
  }
  clearTokens();
}

// ── 2FA ───────────────────────────────────────────────────────
export const enable2FA  = ()         => api.post("/auth/2fa/enable");
export const verify2FA  = (code)     => api.post("/auth/2fa/verify", { code });