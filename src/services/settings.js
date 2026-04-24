import api from "./client";

// ── Categories ────────────────────────────────────────────────
export const getCategories    = ()     => api.get("/categories");
export const createCategory   = (name) => api.post("/categories", { name });

// ── Notification settings ─────────────────────────────────────
export const getNotifications    = ()      => api.get("/settings/notifications");
export const updateNotifications = (prefs) => api.put("/settings/notifications", prefs);
// prefs: { budget_alerts, transaction_alerts, weekly_digest }