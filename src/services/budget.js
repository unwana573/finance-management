import api from "./client";

export const getBudgetSummary = () => api.get("/budget/summary");

export const getBudgetMonth = (year, month) =>
  api.get(`/budget/month?year=${year}&month=${month}`);

export const getBudget = () => api.get("/budget");

export const createBudget = (month, year, items) =>
  api.post("/budget", { month, year, items });

export const updateBudget = (budgetId, items) =>
  api.put(`/budget/${budgetId}`, { items });

export const updateCategoryLimit = (budgetId, categoryId, limit) =>
  api.patch(`/budget/categories/${budgetId}/${categoryId}?limit=${limit}`);