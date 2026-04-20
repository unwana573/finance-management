import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const PIE_COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#eab308", "#ef4444", "#06b6d4", "#ec4899"];
const fmt     = (v) => "₦" + (v / 1000).toFixed(0) + "k";
const fmtFull = (v) => "₦" + Math.abs(v).toLocaleString("en-NG");

function buildInsights(summary) {
  const { income, expenses, savings, balance } = summary;
  const insights = [];

  if (income === 0 && expenses === 0) return [];

  if (income > 0) {
    const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
    if (savingsRate >= 20)
      insights.push({ type: "positive", message: `Great job! You're saving ${savingsRate}% of your income.` });
    else if (savingsRate > 0)
      insights.push({ type: "tip", message: `You're saving ${savingsRate}% of income. Try to hit 20% for financial security.` });
    else
      insights.push({ type: "warning", message: "No savings recorded yet. Consider setting aside a fixed amount each month." });
  }

  if (expenses > 0 && income > 0) {
    const expenseRatio = Math.round((expenses / income) * 100);
    if (expenseRatio > 80)
      insights.push({ type: "warning", message: `Your expenses are ${expenseRatio}% of income. Look for areas to cut back.` });
    else
      insights.push({ type: "positive", message: `Your expenses are ${expenseRatio}% of income — you're living within your means.` });
  }

  if (balance > 0)
    insights.push({ type: "tip", message: `You have ₦${balance.toLocaleString("en-NG")} net balance. Consider investing the surplus.` });

  return insights;
}

const ICONS    = { positive: "↗", warning: "⚠", tip: "💡" };
const CLASSES  = { positive: "insight--positive", warning: "insight--warning", tip: "insight--tip" };

export default function AnalyticsPage({ summary, transactions }) {
  const { monthlyData, spentByCategory } = summary;
  const isEmpty = transactions.length === 0;

  const pieData = Object.entries(spentByCategory)
    .filter(([, v]) => v > 0)
    .map(([category, amount]) => ({ category, amount }));

  const insights = buildInsights(summary);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Insights into your financial patterns.</p>
      </div>

      <div className="analytics-top">
        <div className="card chart-card">
          <h3 className="card-title">Income vs Expenses</h3>
          {isEmpty ? (
            <div className="empty-chart">
              <span className="empty-icon">📈</span>
              <p>Add transactions to see your income vs expenses chart.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="month" stroke="#555" tick={{ fontSize: 12 }} />
                <YAxis stroke="#555" tick={{ fontSize: 11 }} tickFormatter={fmt} />
                <Tooltip
                  contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }}
                  formatter={(v, name) => [fmtFull(v), name === "income" ? "Income" : "Expenses"]}
                />
                <Bar dataKey="income"   fill="#22c55e" radius={[4,4,0,0]} />
                <Bar dataKey="expenses" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card chart-card">
          <h3 className="card-title">Spending Breakdown</h3>
          {pieData.length === 0 ? (
            <div className="empty-chart">
              <span className="empty-icon">🍩</span>
              <p>Add expense transactions to see your spending breakdown.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="amount" nameKey="category" cx="50%" cy="50%" innerRadius={70} outerRadius={110}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" formatter={(v) => <span style={{ color: "#aaa", fontSize: 12 }}>{v}</span>} />
                <Tooltip
                  contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }}
                  formatter={(v) => fmtFull(v)}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Financial Insights</h3>
        {insights.length === 0 ? (
          <div className="empty-list">
            <span className="empty-icon">🧠</span>
            <p>Add transactions to get personalized financial insights.</p>
          </div>
        ) : (
          <div className="insights-list">
            {insights.map((ins, i) => (
              <div key={i} className={`insight-item ${CLASSES[ins.type]}`}>
                <span className="insight-icon">{ICONS[ins.type]}</span>
                <span>{ins.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}