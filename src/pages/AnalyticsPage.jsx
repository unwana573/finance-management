import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const BAR_DATA = [
  { month: "Oct", income: 780000, expenses: 320000 },
  { month: "Nov", income: 820000, expenses: 390000 },
  { month: "Dec", income: 870000, expenses: 530000 },
  { month: "Jan", income: 790000, expenses: 310000 },
  { month: "Feb", income: 860000, expenses: 380000 },
  { month: "Mar", income: 980000, expenses: 430000 },
];

const PIE_DATA = [
  { category: "Housing",       amount: 150000 },
  { category: "Food",          amount:  33500 },
  { category: "Utilities",     amount:  30000 },
  { category: "Shopping",      amount:  35000 },
  { category: "Transport",     amount:   5200 },
  { category: "Entertainment", amount:  12000 },
];

const INSIGHTS = [
  { type: "positive", message: "Your income grew 13.8% over the last 6 months — keep it up!" },
  { type: "warning",  message: "Housing takes 58% of your expenses. Consider negotiating rent." },
  { type: "tip",      message: "You're saving ₦488,600 — aim for 6 months emergency fund." },
];

const PIE_COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#eab308", "#ef4444", "#06b6d4"];
const fmt   = (v) => "₦" + (v / 1000).toFixed(0) + "k";
const fmtFull = (v) => "₦" + Math.abs(v).toLocaleString("en-NG");

const ICONS    = { positive: "↗", warning: "⚠", tip: "💡" };
const CLASSES  = { positive: "insight--positive", warning: "insight--warning", tip: "insight--tip" };

export default function AnalyticsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Insights into your financial patterns.</p>
      </div>

      <div className="analytics-top">
        <div className="card chart-card">
          <h3 className="card-title">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={BAR_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="month" stroke="#555" tick={{ fontSize: 12 }} />
              <YAxis stroke="#555" tick={{ fontSize: 11 }} tickFormatter={fmt} />
              <Tooltip
                contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }}
                formatter={(v, name) => [fmtFull(v), name === "income" ? "Income" : "Expenses"]}
              />
              <Bar dataKey="income"   fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h3 className="card-title">Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={PIE_DATA} dataKey="amount" nameKey="category" cx="50%" cy="50%" innerRadius={70} outerRadius={110}>
                {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Legend iconType="circle" formatter={(v) => <span style={{ color: "#aaa", fontSize: 12 }}>{v}</span>} />
              <Tooltip
                contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }}
                formatter={(v) => fmtFull(v)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Financial Insights</h3>
        <div className="insights-list">
          {INSIGHTS.map((ins, i) => (
            <div key={i} className={`insight-item ${CLASSES[ins.type]}`}>
              <span className="insight-icon">{ICONS[ins.type]}</span>
              <span>{ins.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}