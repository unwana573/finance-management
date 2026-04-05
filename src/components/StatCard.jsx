import React from "react";

function formatNaira(amount) {
  return "₦" + Math.abs(amount).toLocaleString("en-NG");
}

export default function StatCard({ label, value, change, icon, accent }) {
  const isPositive = change >= 0;
  return (
    <div className="stat-card" style={{ "--accent": accent }}>
      <div className="stat-card__header">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__icon">{icon}</span>
      </div>
      <div className="stat-card__value">{formatNaira(value)}</div>
      <div className={`stat-card__change ${isPositive ? "positive" : "negative"}`}>
        <span>{isPositive ? "↗" : "↘"}</span>
        <span>{isPositive ? "+" : ""}{change}%</span>
        <span className="stat-card__change-label">vs last month</span>
      </div>
    </div>
  );
}