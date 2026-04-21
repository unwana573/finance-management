import React, { useState } from "react";

const fmt = (v) => "₦" + v.toLocaleString("en-NG");

const DEFAULT_CATEGORIES = [
  "Housing","Food","Transport","Utilities","Shopping","Entertainment","Savings",
];

function BudgetBar({ name, spent, budget, onEdit }) {
  const pct    = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const isOver = budget > 0 && spent >= budget;

  return (
    <div className="budget-row">
      <div className="budget-row__header">
        <span className="budget-row__name">{name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="budget-row__amounts">
            {fmt(spent)} / {budget > 0 ? fmt(budget) : "Not set"}
          </span>
          <button className="budget-edit-btn" onClick={() => onEdit(name)}>Edit</button>
        </div>
      </div>
      <div className="budget-bar-track">
        {budget > 0 && (
          <div className="budget-bar-fill" style={{ width: `${pct}%`, background: isOver ? "#ef4444" : "#22c55e" }} />
        )}
      </div>
    </div>
  );
}

export default function BudgetPage({ summary = {}, budgets = {}, onUpdateBudget }) {
  const [editing,   setEditing]  = useState(null);
  const [editValue, setEditValue] = useState("");

  const spentByCategory = summary.spentByCategory || {};

  const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0);
  const totalSpent  = Object.values(spentByCategory).reduce((s, v) => s + v, 0);
  const remaining   = Math.max(totalBudget - totalSpent, 0);

  const handleEditSave = () => {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val >= 0) onUpdateBudget(editing, val);
    setEditing(null);
    setEditValue("");
  };

  const noBudgetsSet = totalBudget === 0;
  const noSpending   = totalSpent === 0;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Budget</h1>
        <p>{new Date().toLocaleString("default", { month: "long", year: "numeric" })} budget allocation &amp; spending.</p>
      </div>

      <div className="stat-grid stat-grid--3">
        <div className="stat-card">
          <div className="stat-card__label">TOTAL BUDGET</div>
          <div className="stat-card__value">{fmt(totalBudget)}</div>
          {noBudgetsSet && <div className="stat-empty-hint">Click Edit to set budgets</div>}
        </div>
        <div className="stat-card">
          <div className="stat-card__label">TOTAL SPENT</div>
          <div className="stat-card__value">{fmt(totalSpent)}</div>
          {noSpending && <div className="stat-empty-hint">No spending recorded</div>}
        </div>
        <div className="stat-card">
          <div className="stat-card__label">REMAINING</div>
          <div className={`stat-card__value ${remaining > 0 ? "color-income" : ""}`}>{fmt(remaining)}</div>
        </div>
      </div>

      {/* Inline edit modal */}
      {editing && (
        <div className="budget-edit-modal">
          <div className="budget-edit-inner">
            <h3 className="card-title" style={{ marginBottom: 12 }}>Set {editing} Budget</h3>
            <input
              className="tx-input full-width"
              type="number"
              placeholder="Enter amount in ₦"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              autoFocus
            />
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleEditSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="card-title">Category Breakdown</h3>
        <div className="budget-list">
          {DEFAULT_CATEGORIES.map((name) => (
            <BudgetBar
              key={name}
              name={name}
              budget={budgets[name] || 0}
              spent={spentByCategory[name] || 0}
              onEdit={(n) => { setEditing(n); setEditValue(String(budgets[n] || "")); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}