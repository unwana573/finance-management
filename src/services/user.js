import api from "./client";
export const getMe = () => api.get("/users/me");

export const updateProfile = (fields) => api.put("/users/me", fields);

export const changePassword = (currentPassword, newPassword) =>
  api.put("/users/me/password", {
    current_password: currentPassword,
    new_password:     newPassword,
  });

export const setPassword = (newPassword) =>
  api.post("/users/me/set-password", {
    current_password: "",
    new_password:     newPassword,
  });

export const deleteAccount = () => api.delete("/users/me");