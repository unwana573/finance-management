import api from "./client";

// ── Get logged-in user ────────────────────────────────────────
export const getMe = () => api.get("/users/me");

// ── Update profile (full_name, currency) ─────────────────────
export const updateProfile = (fields) => api.put("/users/me", fields);

// ── Change password ───────────────────────────────────────────
export const changePassword = (currentPassword, newPassword) =>
  api.put("/users/me/password", {
    current_password: currentPassword,
    new_password:     newPassword,
  });

// ── Set password (OAuth users who want email login too) ───────
export const setPassword = (newPassword) =>
  api.post("/users/me/set-password", {
    current_password: "",
    new_password:     newPassword,
  });

// ── Delete account ────────────────────────────────────────────
export const deleteAccount = () => api.delete("/users/me");