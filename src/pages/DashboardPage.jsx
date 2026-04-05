import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import StatCard from "../components/StatCard";

const SUMMARY = {
  totalBalance: 1542300,
  income:       1015000,
  expenses:      253700,
  savings:       488600,
  changes: { balance: 12.5, income: 8.2, expenses: -3.1, savings: 15.4 },
};

const TREND = [
  { month: "Oct", income: 780000, expenses: 410000 },
  { month: "Nov", income: 820000, expenses: 430000 },
  { month: "Dec", income: 870000, expenses: 530000 },
  { month: "Jan", income: 790000, expenses: 410000 },
  { month: "Feb", income: 860000, expenses: 430000 },
  { month: "Mar", income: 980000, expenses: 460000 },
];

const RECENT = [
  { description: "Salary Credit",     category: "Salary",    amount:  850000 },
  { description: "Rent Payment",      category: "Housing",   amount: -150000 },
  { description: "Grocery Shopping",  category: "Food",      amount:  -25000 },
  { description: "Freelance Project", category: "Freelance", amount:  120000 },
  { description: "Electricity Bill",  category: "Utilities", amount:  -18000 },
  { description: "Restaurant",        category: "Food",      amount:   -8500 },
];

const fmt = (v) => "₦" + (v / 1000).toFixed(0) + "k";
const fmtFull = (v) => "₦" + Math.abs(v).toLocaleString("en-NG");

const CARDS = [
  { label: "TOTAL BALANCE", value: SUMMARY.totalBalance, change: SUMMARY.changes.balance,  icon: "▣", accent: "#22c55e" },
  { label: "INCOME",        value: SUMMARY.income,       change: SUMMARY.changes.income,   icon: "↗", accent: "#3b82f6" },
  { label: "EXPENSES",      value: SUMMARY.expenses,     change: SUMMARY.changes.expenses, icon: "↘", accent: "#ef4444" },
  { label: "SAVINGS",       value: SUMMARY.savings,      change: SUMMARY.changes.savings,  icon: "◑", accent: "#8b5cf6" },
];

export default function DashboardPage() {
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
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={TREND}>
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
        </div>

        <div className="card recent-card">
          <h3 className="card-title">Recent Transactions</h3>
          <ul className="recent-list">
            {RECENT.map((t, i) => (
              <li key={i} className="recent-item">
                <div>
                  <div className="recent-desc">{t.description}</div>
                  <div className="recent-cat">{t.category}</div>
                </div>
                <span className={t.amount >= 0 ? "color-income" : "color-expense"}>
                  {t.amount >= 0 ? "" : "-"}{fmtFull(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}