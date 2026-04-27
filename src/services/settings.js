import api from "./client";

export const getCategories    = ()     => api.get("/categories");
export const createCategory   = (name) => api.post("/categories", { name });

export const getNotifications    = ()      => api.get("/settings/notifications");
export const updateNotifications = (prefs) => api.put("/settings/notifications", prefs);
