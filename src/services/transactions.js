import api from "./client";

// ── List transactions ─────────────────────────────────────────
// Options: { skip, limit, category_id, type, date_from, date_to }
export function getTransactions(opts = {}) {
  const params = new URLSearchParams();
  if (opts.skip        != null) params.set("skip",        opts.skip);
  if (opts.limit       != null) params.set("limit",       opts.limit);
  if (opts.category_id != null) params.set("category_id", opts.category_id);
  if (opts.type        != null) params.set("type",        opts.type);
  if (opts.date_from   != null) params.set("date_from",   opts.date_from);
  if (opts.date_to     != null) params.set("date_to",     opts.date_to);
  const qs = params.toString();
  return api.get(`/transactions${qs ? "?" + qs : ""}`);
}

// ── Recent 6 for dashboard ────────────────────────────────────
export const getRecentTransactions = () => getTransactions({ limit: 6 });

// ── Create ────────────────────────────────────────────────────
// { description, amount, type: "income"|"expense", category_id, date? }
export const createTransaction = (body) => api.post("/transactions", body);

// ── Update ────────────────────────────────────────────────────
export const updateTransaction = (id, body) => api.put(`/transactions/${id}`, body);

// ── Delete ────────────────────────────────────────────────────
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

// ── Export CSV ────────────────────────────────────────────────
export async function exportTransactionsCSV() {
  const { getAccessToken } = await import("./tokens");
  const BASE_URL = import.meta.env.VITE_API_URL || "https://fina-mag.onrender.com/v1";
  const res = await fetch(`${BASE_URL}/transactions/export`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
}