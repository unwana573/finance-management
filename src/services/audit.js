import api from "./client";

// ── Get audit log for the current user ───────────────────────
// Returns: [{ id, action, entity, entity_id, detail, created_at }]
export const getAuditLog = ({ skip = 0, limit = 50 } = {}) =>
  api.get(`/audit?skip=${skip}&limit=${limit}`);

// Human-readable labels for each action type
export const ACTION_LABELS = {
  "user.registered":       "Account created",
  "user.login":            "Signed in",
  "user.login_failed":     "Failed login attempt",
  "user.logout":           "Signed out",
  "user.profile_updated":  "Profile updated",
  "user.password_changed": "Password changed",
  "user.password_set":     "Password set",
  "user.2fa_enabled":      "2FA setup started",
  "user.2fa_verified":     "2FA enabled",
  "user.2fa_failed":       "Wrong 2FA code",
  "user.deleted":          "Account deleted",
  "transaction.created":   "Transaction added",
  "transaction.updated":   "Transaction edited",
  "transaction.deleted":   "Transaction deleted",
  "transaction.exported":  "Transactions exported",
  "budget.created":        "Budget created",
  "budget.updated":        "Budget updated",
  "budget.deleted":        "Budget deleted",
  "category.created":      "Custom category created",
  "category.deleted":      "Custom category deleted",
};

// Icon for each action group
export const ACTION_ICONS = {
  "user.registered":       "🎉",
  "user.login":            "🔐",
  "user.login_failed":     "⚠️",
  "user.logout":           "👋",
  "user.profile_updated":  "✏️",
  "user.password_changed": "🔑",
  "user.password_set":     "🔑",
  "user.2fa_enabled":      "🛡",
  "user.2fa_verified":     "✅",
  "user.2fa_failed":       "❌",
  "user.deleted":          "🗑️",
  "transaction.created":   "💰",
  "transaction.updated":   "✏️",
  "transaction.deleted":   "🗑️",
  "transaction.exported":  "📥",
  "budget.created":        "📋",
  "budget.updated":        "📋",
  "budget.deleted":        "🗑️",
  "category.created":      "🏷️",
  "category.deleted":      "🗑️",
};