import api from "./client";

// ── Dashboard summary cards ───────────────────────────────────
// Returns: { total_balance, total_balance_change_pct, income,
//            income_change_pct, expenses, expenses_change_pct,
//            savings, savings_change_pct }
export const getSummary = () => api.get("/analytics/summary");

// ── Spending trends (line/bar chart) ─────────────────────────
// Returns: [{ year, month, income, expenses, savings }]
export const getTrends = (months = 6) =>
  api.get(`/analytics/trends?months=${months}`);

// ── Spending breakdown (donut chart) ─────────────────────────
// Returns: [{ category_id, category_name, total }]
export const getBreakdown = () => api.get("/analytics/breakdown");

// ── Financial insights ────────────────────────────────────────
// Returns: [{ type, icon, message }]
export const getInsights = () => api.get("/analytics/insights");