import React from "react";

const BUDGET_DATA = {
  totalBudget: 555000,
  totalSpent:  465700,
  remaining:    89300,
  categories: [
    { name: "Housing",       budget: 150000, spent: 150000 },
    { name: "Food",          budget:  60000, spent:  33500 },
    { name: "Transport",     budget:  30000, spent:   5200 },
    { name: "Utilities",     budget:  40000, spent:  30000 },
    { name: "Shopping",      budget:  50000, spent:  35000 },
    { name: "Entertainment", budget:  25000, spent:  12000 },
    { name: "Savings",       budget: 200000, spent: 200000 },
  ],
};

const fmt = (v) => "₦" + v.toLocaleString("en-NG");

function BudgetBar({ name, spent, budget }) {
  const pct   = Math.min((spent / budget) * 100, 100);
  const isOver = spent >= budget;
  return (
    <div className="budget-row">
      <div className="budget-row__header">
        <span className="budget-row__name">{name}</span>
        <span className="budget-row__amounts">{fmt(spent)} / {fmt(budget)}</span>
      </div>
      <div className="budget-bar-track">
        <div className="budget-bar-fill" style={{ width: `${pct}%`, background: isOver ? "#ef4444" : "#22c55e" }} />
      </div>
    </div>
  );
}

export default function BudgetPage() {
  const { totalBudget, totalSpent, remaining, categories } = BUDGET_DATA;
  return (
    <div className="page">
      <div className="page-header">
        <h1>Budget</h1>
        <p>April 2026 budget allocation &amp; spending.</p>
      </div>

      <div className="stat-grid stat-grid--3">
        <div className="stat-card">
          <div className="stat-card__label">TOTAL BUDGET</div>
          <div className="stat-card__value">{fmt(totalBudget)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">TOTAL SPENT</div>
          <div className="stat-card__value">{fmt(totalSpent)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">REMAINING</div>
          <div className="stat-card__value color-income">{fmt(remaining)}</div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Category Breakdown</h3>
        <div className="budget-list">
          {categories.map((c) => <BudgetBar key={c.name} {...c} />)}
        </div>
      </div>
    </div>
  );
}