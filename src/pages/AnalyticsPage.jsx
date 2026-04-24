import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { getSummary, getTrends, getBreakdown, getInsights } from "../services/analytics";

const PIE_COLORS = ["#22c55e","#3b82f6","#8b5cf6","#eab308","#ef4444","#06b6d4","#ec4899"];
const fmt     = (v) => "₦" + (v / 1000).toFixed(0) + "k";
const fmtFull = (v) => "₦" + Math.abs(Number(v)).toLocaleString("en-NG");

const monthLabel = ({ month }) =>
  new Date(2000, month - 1, 1).toLocaleString("default", { month: "short" });

const INSIGHT_ICONS    = { positive: "↗", warning: "⚠", info: "💡" };
const INSIGHT_CLASSES  = { positive: "insight--positive", warning: "insight--warning", info: "insight--tip" };

export default function AnalyticsPage({ isActive }) {
  const [trends,    setTrends]    = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [insights,  setInsights]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getTrends(6), getBreakdown(), getInsights()])
      .then(([t, b, i]) => {
        setTrends(t.map((d) => ({ ...d, month: monthLabel(d) })));
        setBreakdown(b || []);
        setInsights(i || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isActive]); // re-fetch every time page becomes active

  if (loading) return <div className="page"><p className="loading-text">Loading analytics…</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Insights into your financial patterns.</p>
      </div>

      <div className="analytics-top">
        <div className="card chart-card">
          <h3 className="card-title">Income vs Expenses</h3>
          {trends.length === 0 ? (
            <div className="empty-chart">
              <span className="empty-icon">📈</span>
              <p>Add transactions to see your income vs expenses chart.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={trends}>
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
          {breakdown.length === 0 ? (
            <div className="empty-chart">
              <span className="empty-icon">🍩</span>
              <p>Add expense transactions to see your spending breakdown.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={breakdown} dataKey="total" nameKey="category_name" cx="50%" cy="50%" innerRadius={70} outerRadius={110}>
                  {breakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
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
              <div key={i} className={`insight-item ${INSIGHT_CLASSES[ins.type] || "insight--tip"}`}>
                <span className="insight-icon">{INSIGHT_ICONS[ins.type] || "💡"}</span>
                <span>{ins.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}