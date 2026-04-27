import api from "./client";

export const getSummary = () => api.get("/analytics/summary");

export const getTrends = (months = 6) =>
  api.get(`/analytics/trends?months=${months}`);

export const getBreakdown = () => api.get("/analytics/breakdown");

export const getInsights = () => api.get("/analytics/insights");