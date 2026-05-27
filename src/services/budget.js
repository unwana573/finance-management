import api from "./client";

// ── Get budget summary (never 404 — safe on page load) ────────
export const getBudgetSummary = () => api.get("/budgets/summary");

// ── Get budget for a specific month ───────────────────────────
export const getBudgetMonth = (year, month) =>
  api.get(`/budgets/month?year=${year}&month=${month}`);

// ── Get current month budget ──────────────────────────────────
export const getBudget = () => api.get("/budgets");

// ── Create budget for a month ─────────────────────────────────
export const createBudget = (month, year, items) =>
  api.post("/budgets", { month, year, items });

// ── Update whole budget ───────────────────────────────────────
export const updateBudget = (budgetId, items) =>
  api.put(`/budgets/${budgetId}`, { items });

// ── Update single category limit ─────────────────────────────
export const updateCategoryLimit = (budgetId, categoryId, limit) =>
  api.patch(`/budgets/categories/${budgetId}/${categoryId}?limit=${limit}`);

// ── Delete budget (use to fix empty budget then recreate) ─────
export const deleteBudget = (budgetId) =>
  api.delete(`/budgets/${budgetId}`);