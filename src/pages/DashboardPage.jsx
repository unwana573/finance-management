import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import StatCard from "../components/StatCard";

const fmt     = (v) => "₦" + (v / 1000).toFixed(0) + "k";
const fmtFull = (v) => "₦" + Math.abs(v).toLocaleString("en-NG");

export default function DashboardPage({ summary = {}, transactions = [] }) {
  const { income = 0, expenses = 0, savings = 0, balance = 0, monthlyData = [] } = summary;
  const recent = transactions.slice(0, 6);
  const isEmpty = transactions.length === 0;

  const CARDS = [
    { label: "TOTAL BALANCE", value: balance,   change: null, icon: "▣", accent: "#22c55e" },
    { label: "INCOME",        value: income,    change: null, icon: "↗", accent: "#3b82f6" },
    { label: "EXPENSES",      value: expenses,  change: null, icon: "↘", accent: "#ef4444" },
    { label: "SAVINGS",       value: savings,   change: null, icon: "◑", accent: "#8b5cf6" },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back — here's your financial overview.</p>
      </div>

      <div className="stat-grid">
        {CARDS.map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      <div className="dashboard-bottom">
        <div className="card chart-card">
          <h3 className="card-title">Spending Trend</h3>
          {isEmpty ? (
            <div className="empty-chart">
              <span className="empty-icon">📊</span>
              <p>No data yet. Add transactions to see your spending trend.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyData}>
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
          {isEmpty ? (
            <div className="empty-list">
              <span className="empty-icon">💳</span>
              <p>No transactions yet. Head to Transactions to add one.</p>
            </div>
          ) : (
            <ul className="recent-list">
              {recent.map((t, i) => (
                <li key={i} className="recent-item">
                  <div>
                    <div className="recent-desc">{t.description}</div>
                    <div className="recent-cat">{t.category}</div>
                  </div>
                  <span className={t.amount >= 0 ? "color-income" : "color-expense"}>
                    {t.amount >= 0 ? "+" : "-"}{fmtFull(t.amount)}
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