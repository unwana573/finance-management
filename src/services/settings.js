import api from "./client";

// ── Categories ────────────────────────────────────────────────
// Returns: [{ id, name, is_custom }]
export const getCategories = () => api.get("/categories");

// Create a custom category for the current user
export const createCategory = (name) => api.post("/categories", { name });

// Delete a custom category (only is_custom: true categories can be deleted)
export const deleteCategory = (categoryId) => api.delete(`/categories/${categoryId}`);

// ── Notification settings ─────────────────────────────────────
export const getNotifications    = ()      => api.get("/settings/notifications");
export const updateNotifications = (prefs) => api.put("/settings/notifications", prefs);