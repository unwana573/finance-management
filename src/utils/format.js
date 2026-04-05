/** Format a number as Nigerian Naira: ₦1,542,300 */
export const formatNaira = (amount) => {
  const abs = Math.abs(amount);
  return `₦${abs.toLocaleString("en-NG")}`;
};

/** Format a number as compact Naira: ₦1.5M, ₦250k */
export const formatNairaCompact = (amount) => {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `₦${(amount / 1_000).toFixed(0)}k`;
  return `₦${amount}`;
};

/** Returns "text-green-400" or "text-red-400" based on sign */
export const amountColor = (amount) =>
  amount >= 0 ? "color-income" : "color-expense";

/** Category badge colors */
const CATEGORY_COLORS = {
  Salary:      "#22c55e",
  Housing:     "#ef4444",
  Food:        "#f97316",
  Transport:   "#3b82f6",
  Utilities:   "#8b5cf6",
  Shopping:    "#eab308",
  Investment:  "#06b6d4",
  Freelance:   "#10b981",
  Entertainment: "#ec4899",
  Savings:     "#64748b",
};

export const categoryColor = (category) =>
  CATEGORY_COLORS[category] || "#6b7280";

/** Chart palette for Recharts */
export const CHART_COLORS = {
  income:   "#22c55e",
  expenses: "#3b82f6",
  Housing:  "#22c55e",
  Food:     "#3b82f6",
  Utilities:"#8b5cf6",
  Shopping: "#eab308",
  Transport:"#ef4444",
  Entertainment: "#06b6d4",
};
