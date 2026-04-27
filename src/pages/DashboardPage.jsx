import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "../components/StatCard";
import { getSummary, getTrends } from "../services/analytics";
import { getRecentTransactions } from "../services/transactions";

const fmt     = (v) => "₦" + (v / 1000).toFixed(0) + "k";
const fmtFull = (v) => "₦" + Math.abs(Number(v)).toLocaleString("en-NG");

const monthLabel = ({ month }) =>
  new Date(2000, month - 1, 1).toLocaleString("default", { month: "short" });

export default function DashboardPage({ user, onSignIn, isActive }) {
  const [summary,  setSummary]  = useState(null);
  const [trends,   setTrends]   = useState([]);
  const [recent,   setRecent]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const isGuest = !user;

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    setError("");
    Promise.all([getSummary(), getTrends(6), getRecentTransactions()])
      .then(([s, t, r]) => {
        setSummary(s);
        setTrends(t.map((d) => ({ ...d, month: monthLabel(d) })));
        setRecent(r.items || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, isActive]); 

  const CARDS = summary ? [
    { label: "TOTAL BALANCE", value: summary.total_balance,  change: summary.total_balance_change_pct, icon: "▣", accent: "#22c55e" },
    { label: "INCOME",        value: summary.income,         change: summary.income_change_pct,        icon: "↗", accent: "#3b82f6" },
    { label: "EXPENSES",      value: summary.expenses,       change: summary.expenses_change_pct,      icon: "↘", accent: "#ef4444" },
    { label: "SAVINGS",       value: summary.savings,        change: summary.savings_change_pct,       icon: "◑", accent: "#8b5cf6" },
  ] : [
    { label: "TOTAL BALANCE", value: 0, change: null, icon: "▣", accent: "#22c55e" },
    { label: "INCOME",        value: 0, change: null, icon: "↗", accent: "#3b82f6" },
    { label: "EXPENSES",      value: 0, change: null, icon: "↘", accent: "#ef4444" },
    { label: "SAVINGS",       value: 0, change: null, icon: "◑", accent: "#8b5cf6" },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back — here's your financial overview.</p>
      </div>

      {isGuest && (
        <div className="guest-banner">
          <div className="guest-banner-text">
            <strong>You're viewing a preview.</strong> Sign in to track your real finances, add transactions, and set budgets.
          </div>
          <button className="btn-primary" onClick={onSignIn}>Sign In</button>
        </div>
      )}

      {error && <div className="form-error" style={{ marginBottom: 20 }}>⚠ {error}</div>}

      <div className="stat-grid">
        {CARDS.map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      <div className="dashboard-bottom">
        <div className="card chart-card">
          <h3 className="card-title">Spending Trend</h3>
          {isGuest || trends.length === 0 ? (
            <div className="empty-chart">
              <span className="empty-icon">📊</span>
              <p>{isGuest ? "Sign in to see your spending trend." : "Add transactions to see your spending trend."}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="month" stroke="#555" tick={{ fontSize: 12 }} />
                <YAxis stroke="#555" tick={{ fontSize: 11 }} tickFormatter={fmt} />
                <Tooltip
                  contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }}
                  formatter={(v, name) => [fmtFull(v), name === "income" ? "Income" : "Expenses"]}
                />
                <Line type="monotone" dataKey="income"   stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expenses" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card recent-card">
          <h3 className="card-title">Recent Transactions</h3>
          {isGuest || recent.length === 0 ? (
            <div className="empty-list">
              <span className="empty-icon">💳</span>
              <p>{isGuest ? "Sign in to see your transactions." : "No transactions yet."}</p>
            </div>
          ) : (
            <ul className="recent-list">
              {recent.map((t) => (
                <li key={t.id} className="recent-item">
                  <div>
                    <div className="recent-desc">{t.description}</div>
                    <div className="recent-cat">{t.category_name || t.category_id}</div>
                  </div>
                  <span className={t.type === "income" ? "color-income" : "color-expense"}>
                    {t.type === "income" ? "+" : "-"}{fmtFull(t.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}