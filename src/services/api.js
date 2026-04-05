/**
 * NairaFlow API Service
 * =====================
 * Central place for all backend HTTP calls.
 * 
 * HOW TO CONNECT YOUR BACKEND:
 *   1. Set REACT_APP_API_URL in your .env file:
 *      REACT_APP_API_URL=https://your-api.com/api/v1
 *   2. Replace mock functions with real fetch calls (each mock is clearly marked).
 *   3. Adjust the shape of returned data to match your API responses.
 */

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

// ─── Auth helpers ───────────────────────────────────────────────────────────

/** Read JWT from localStorage (set during login). */
const getToken = () => localStorage.getItem("nairaflow_token");

/** Attach Authorization header to every authenticated request. */
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

/**
 * Generic fetch wrapper.
 * Throws an Error with the server's message on non-2xx responses.
 */
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: authHeaders(),
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }

  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Expected body:  { email, password }
 * Expected return: { access_token, token_type, user: { id, email, name } }
 */
export async function login(email, password) {
  // ── MOCK (remove when backend is ready) ──────────────────────────────────
  await delay(600);
  if (email === "orokunwana@gmail.com" && password === "password") {
    const token = "mock-jwt-token";
    localStorage.setItem("nairaflow_token", token);
    return { access_token: token, user: { id: 1, email, name: "Orok" } };
  }
  throw new Error("Invalid credentials");
  // ── REAL (uncomment when backend is ready) ───────────────────────────────
  // const data = await request("/auth/login", {
  //   method: "POST",
  //   body: JSON.stringify({ email, password }),
  // });
  // localStorage.setItem("nairaflow_token", data.access_token);
  // return data;
}

/** Clears the stored JWT. Call on logout. */
export function logout() {
  localStorage.removeItem("nairaflow_token");
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

/**
 * GET /dashboard/summary
 * Returns: { totalBalance, income, expenses, savings, changes: { ... } }
 */
export async function fetchDashboardSummary() {
  // ── MOCK ──────────────────────────────────────────────────────────────────
  await delay(400);
  return {
    totalBalance: 1542300,
    income: 1015000,
    expenses: 253700,
    savings: 488600,
    changes: {
      balance: +12.5,
      income: +8.2,
      expenses: -3.1,
      savings: +15.4,
    },
  };
  // ── REAL ──────────────────────────────────────────────────────────────────
  // return request("/dashboard/summary");
}

/**
 * GET /dashboard/spending-trend?months=6
 * Returns: [{ month: "Oct", income: 780000, expenses: 320000 }, ...]
 */
export async function fetchSpendingTrend(months = 6) {
  // ── MOCK ──────────────────────────────────────────────────────────────────
  await delay(300);
  return [
    { month: "Oct", income: 780000, expenses: 410000 },
    { month: "Nov", income: 820000, expenses: 430000 },
    { month: "Dec", income: 870000, expenses: 530000 },
    { month: "Jan", income: 790000, expenses: 410000 },
    { month: "Feb", income: 860000, expenses: 430000 },
    { month: "Mar", income: 980000, expenses: 460000 },
  ];
  // ── REAL ──────────────────────────────────────────────────────────────────
  // return request(`/dashboard/spending-trend?months=${months}`);
}

// ─── Transactions ────────────────────────────────────────────────────────────

/**
 * GET /transactions?page=1&limit=20
 * Returns: { items: [...], total, page, pages }
 */
export async function fetchTransactions({ page = 1, limit = 20 } = {}) {
  // ── MOCK ──────────────────────────────────────────────────────────────────
  await delay(400);
  return {
    items: MOCK_TRANSACTIONS,
    total: MOCK_TRANSACTIONS.length,
    page,
    pages: 1,
  };
  // ── REAL ──────────────────────────────────────────────────────────────────
  // return request(`/transactions?page=${page}&limit=${limit}`);
}

/**
 * POST /transactions
 * Body: { description, amount, category, type: "income"|"expense", date }
 * Returns: the created transaction object
 */
export async function createTransaction(payload) {
  // ── MOCK ──────────────────────────────────────────────────────────────────
  await delay(500);
  return {
    id: Date.now(),
    date: new Date().toISOString().split("T")[0],
    ...payload,
  };
  // ── REAL ──────────────────────────────────────────────────────────────────
  // return request("/transactions", {
  //   method: "POST",
  //   body: JSON.stringify(payload),
  // });
}

/**
 * DELETE /transactions/:id
 */
export async function deleteTransaction(id) {
  // ── MOCK ──────────────────────────────────────────────────────────────────
  await delay(300);
  return { success: true };
  // ── REAL ──────────────────────────────────────────────────────────────────
  // return request(`/transactions/${id}`, { method: "DELETE" });
}

// ─── Budget ──────────────────────────────────────────────────────────────────

/**
 * GET /budget?month=2026-04
 * Returns: { totalBudget, totalSpent, remaining, categories: [...] }
 */
export async function fetchBudget(month) {
  // ── MOCK ──────────────────────────────────────────────────────────────────
  await delay(400);
  return {
    totalBudget: 555000,
    totalSpent: 465700,
    remaining: 89300,
    categories: [
      { name: "Housing",       budget: 150000, spent: 150000 },
      { name: "Food",          budget: 60000,  spent: 33500  },
      { name: "Transport",     budget: 30000,  spent: 5200   },
      { name: "Utilities",     budget: 40000,  spent: 30000  },
      { name: "Shopping",      budget: 50000,  spent: 35000  },
      { name: "Entertainment", budget: 25000,  spent: 12000  },
      { name: "Savings",       budget: 200000, spent: 200000 },
    ],
  };
  // ── REAL ──────────────────────────────────────────────────────────────────
  // return request(`/budget?month=${month}`);
}

/**
 * PUT /budget/categories/:name
 * Body: { budget: number }
 */
export async function updateBudgetCategory(name, budget) {
  // ── MOCK ──────────────────────────────────────────────────────────────────
  await delay(300);
  return { name, budget };
  // ── REAL ──────────────────────────────────────────────────────────────────
  // return request(`/budget/categories/${encodeURIComponent(name)}`, {
  //   method: "PUT",
  //   body: JSON.stringify({ budget }),
  // });
}

// ─── Analytics ───────────────────────────────────────────────────────────────

/**
 * GET /analytics/income-vs-expenses?months=6
 */
export async function fetchIncomeVsExpenses(months = 6) {
  // ── MOCK ──────────────────────────────────────────────────────────────────
  await delay(400);
  return [
    { month: "Oct", income: 780000, expenses: 320000 },
    { month: "Nov", income: 820000, expenses: 390000 },
    { month: "Dec", income: 870000, expenses: 530000 },
    { month: "Jan", income: 790000, expenses: 310000 },
    { month: "Feb", income: 860000, expenses: 380000 },
    { month: "Mar", income: 980000, expenses: 430000 },
  ];
  // ── REAL ──────────────────────────────────────────────────────────────────
  // return request(`/analytics/income-vs-expenses?months=${months}`);
}

/**
 * GET /analytics/spending-breakdown
 * Returns: [{ category, amount, percentage }]
 */
export async function fetchSpendingBreakdown() {
  // ── MOCK ──────────────────────────────────────────────────────────────────
  await delay(300);
  return [
    { category: "Housing",       amount: 150000, percentage: 58 },
    { category: "Food",          amount: 33500,  percentage: 13 },
    { category: "Utilities",     amount: 30000,  percentage: 12 },
    { category: "Shopping",      amount: 35000,  percentage: 9  },
    { category: "Transport",     amount: 5200,   percentage: 2  },
    { category: "Entertainment", amount: 12000,  percentage: 6  },
  ];
  // ── REAL ──────────────────────────────────────────────────────────────────
  // return request("/analytics/spending-breakdown");
}

/**
 * GET /analytics/insights
 * Returns: [{ type: "positive"|"warning"|"tip", message: string }]
 */
export async function fetchInsights() {
  // ── MOCK ──────────────────────────────────────────────────────────────────
  await delay(200);
  return [
    { type: "positive", message: "Your income grew 13.8% over the last 6 months — keep it up!" },
    { type: "warning",  message: "Housing takes 58% of your expenses. Consider negotiating rent." },
    { type: "tip",      message: "You're saving ₦488,600 — aim for 6 months emergency fund." },
  ];
  // ── REAL ──────────────────────────────────────────────────────────────────
  // return request("/analytics/insights");
}

// ─── Settings ────────────────────────────────────────────────────────────────

/**
 * GET /settings
 * Returns: { currency, notifications: { ... }, security: { twoFactor } }
 */
export async function fetchSettings() {
  // ── MOCK ──────────────────────────────────────────────────────────────────
  await delay(300);
  return {
    currency: { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
    notifications: {
      budgetAlerts: true,
      transactionNotifications: true,
      weeklySummaryEmails: true,
    },
    security: { twoFactor: false },
  };
  // ── REAL ──────────────────────────────────────────────────────────────────
  // return request("/settings");
}

/**
 * PATCH /settings
 * Body: partial settings object
 */
export async function updateSettings(payload) {
  // ── MOCK ──────────────────────────────────────────────────────────────────
  await delay(400);
  return payload;
  // ── REAL ──────────────────────────────────────────────────────────────────
  // return request("/settings", {
  //   method: "PATCH",
  //   body: JSON.stringify(payload),
  // });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const MOCK_TRANSACTIONS = [
  { id: 1,  date: "2026-04-01", description: "Salary Credit",        category: "Salary",     type: "income",  amount: 850000  },
  { id: 2,  date: "2026-04-01", description: "Rent Payment",         category: "Housing",    type: "expense", amount: -150000 },
  { id: 3,  date: "2026-03-30", description: "Grocery Shopping",     category: "Food",       type: "expense", amount: -25000  },
  { id: 4,  date: "2026-03-28", description: "Freelance Project",    category: "Freelance",  type: "income",  amount: 120000  },
  { id: 5,  date: "2026-03-27", description: "Electricity Bill",     category: "Utilities",  type: "expense", amount: -18000  },
  { id: 6,  date: "2026-03-25", description: "Restaurant",           category: "Food",       type: "expense", amount: -8500   },
  { id: 7,  date: "2026-03-24", description: "Transport (Uber)",     category: "Transport",  type: "expense", amount: -5200   },
  { id: 8,  date: "2026-03-22", description: "Investment Returns",   category: "Investment", type: "income",  amount: 45000   },
  { id: 9,  date: "2026-03-20", description: "Internet Subscription",category: "Utilities",  type: "expense", amount: -12000  },
  { id: 10, date: "2026-03-18", description: "Clothing",             category: "Shopping",   type: "expense", amount: -35000  },
];
