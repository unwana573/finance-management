import api from "./client";

// ── Get budget summary (never 404 — safe on page load) ────────
export const getBudgetSummary = () => api.get("/budget/summary");

// ── Get budget for a specific month ───────────────────────────
export const getBudgetMonth = (year, month) =>
  api.get(`/budget/month?year=${year}&month=${month}`);

// ── Get current month budget ──────────────────────────────────
export const getBudget = () => api.get("/budget");

// ── Create budget for a month ─────────────────────────────────
export const createBudget = (month, year, items) =>
  api.post("/budget", { month, year, items });

// ── Update whole budget ───────────────────────────────────────
export const updateBudget = (budgetId, items) =>
  api.put(`/budget/${budgetId}`, { items });

// ── Update single category limit ─────────────────────────────
export const updateCategoryLimit = (budgetId, categoryId, limit) =>
  api.patch(`/budget/categories/${budgetId}/${categoryId}?limit=${limit}`);