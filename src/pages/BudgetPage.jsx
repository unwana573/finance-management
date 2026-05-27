import React, { useState, useEffect } from "react";
import { getBudgetSummary, createBudget, updateCategoryLimit, deleteBudget } from "../services/budget";

const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return "₦0";
  return "₦" + n.toLocaleString("en-NG");
};

const barColor = (pct) => {
  if (pct >= 100) return "#ef4444";
  if (pct >= 80)  return "#f97316";
  return "#22c55e";
};

function BudgetBar({ item }) {
  const pct = Math.min(item.percent_used || 0, 100);
  return (
    <div className="budget-row">
      <div className="budget-row__header">
        <span className="budget-row__name">{item.category_name}</span>
        <span className="budget-row__amounts">
          {fmt(item.spent)} / {item.limit > 0 ? fmt(item.limit) : "Not set"}
        </span>
      </div>
      <div className="budget-bar-track">
        <div
          className="budget-bar-fill"
          style={{
            width: item.limit > 0 ? `${pct}%` : "0%",
            background: barColor(item.percent_used || 0),
          }}
        />
      </div>
    </div>
  );
}

export default function BudgetPage({ categories = [], isActive }) {
  const [budget,      setBudget]      = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [editing,     setEditing]     = useState(null);
  const [editValue,   setEditValue]   = useState("");
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");
  // Setup form — limits keyed by category_id
  const [setupLimits, setSetupLimits] = useState({});
  const [showSetup,   setShowSetup]   = useState(false);

  const fetchBudget = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getBudgetSummary();
      console.log("BUDGET RAW:", data);
      console.log("total_budget:", data.total_budget, typeof data.total_budget);
      console.log("total_spent:", data.total_spent, typeof data.total_spent);
      console.log("remaining:", data.remaining, typeof data.remaining);
      console.log("categories:", data.categories);
      setBudget(data);
    } catch (err) {
      console.error("BUDGET ERROR:", err);
      setError(err.message);
      setBudget(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBudget(); }, [isActive]);

  // Pre-fill setup form with 0 for each category
  useEffect(() => {
    if (categories.length > 0) {
      const initial = {};
      categories.forEach((c) => { initial[c.id] = ""; });
      setSetupLimits(initial);
    }
  }, [categories]);

  const handleCreateBudget = async () => {
    const now   = new Date();
    const items = categories.map((c) => ({
      category_id: c.id,
      limit: parseFloat(setupLimits[c.id]) || 0,
    }));
    setSaving(true);
    try {
      // If a broken empty budget exists, delete it first then recreate
      if (budget?.budget_exists && budget?.id && rows.length === 0) {
        await deleteBudget(budget.id);
      }
      await createBudget(now.getMonth() + 1, now.getFullYear(), items);
      setShowSetup(false);
      await fetchBudget();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async () => {
    const val = parseFloat(editValue);
    if (isNaN(val) || val < 0) return;
    setSaving(true);
    try {
      await updateCategoryLimit(budget.id, editing.category_id, val);
      await fetchBudget();
      setEditing(null);
      setEditValue("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page"><p className="loading-text">Loading budget…</p></div>;

  const now        = new Date();
  const monthLabel = now.toLocaleString("default", { month: "long", year: "numeric" });
  const rows       = budget?.categories || [];
  const hasRows    = rows.length > 0;

  // Always compute from categories — most reliable source
  const totalBudget = rows.reduce((s, c) => s + parseFloat(c.limit || 0), 0);
  const totalSpent  = rows.reduce((s, c) => s + parseFloat(c.spent || 0), 0);
  const remaining   = totalBudget - totalSpent;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Budget</h1>
        <p>{monthLabel} budget allocation &amp; spending.</p>
      </div>

      {error && <div className="form-error">{error}</div>}

      {/* ── No budget yet ── */}
      {!budget?.budget_exists ? (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>
            No budget set for this month yet.
          </p>
          <button className="btn-primary" onClick={() => setShowSetup(true)}>
            Set Up This Month's Budget
          </button>
        </div>
      ) : (
        <>
          {/* ── Summary cards ── */}
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
              <div className={`stat-card__value ${remaining >= 0 ? "color-income" : "color-expense"}`}>
                {fmt(remaining)}
              </div>
            </div>
          </div>

          {/* ── Category breakdown ── */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 className="card-title" style={{ marginBottom: 0 }}>Category Breakdown</h3>
            </div>

            {!hasRows ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: "var(--text-muted)", marginBottom: 8 }}>
                  No category limits set yet.
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 16 }}>
                  This budget was created without categories. Click below to set it up properly.
                </p>
                <button className="btn-primary" onClick={() => setShowSetup(true)}>
                  Set Category Limits
                </button>
              </div>
            ) : (
              <div className="budget-list">
                {rows.map((item) => (
                  <BudgetBar key={item.category_id} item={item} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Edit single category modal ── */}
      {editing && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="card-title" style={{ marginBottom: 0 }}>
                Set {editing.category_name} Limit
              </h3>
              <button className="modal-close" onClick={() => setEditing(null)}>✕</button>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "8px 0 16px" }}>
              Currently spent: {fmt(editing.spent)}
            </p>
            <input
              className="tx-input full-width"
              type="number"
              placeholder="Enter limit in ₦"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
            />
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleEditSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Budget setup modal ── */}
      {showSetup && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowSetup(false)}>
          <div className="modal-box" style={{ maxWidth: 480, maxHeight: "85vh", overflowY: "auto" }}>
            <div className="modal-header">
              <h3 className="card-title" style={{ marginBottom: 0 }}>
                {budget?.budget_exists ? "Edit Budget Limits" : "Set Up Budget"} — {monthLabel}
              </h3>
              <button className="modal-close" onClick={() => setShowSetup(false)}>✕</button>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "8px 0 16px" }}>
              Leave blank to set a category limit to ₦0.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {categories.map((c) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <label style={{ width: 120, fontSize: 13, color: "var(--text-secondary)", flexShrink: 0 }}>
                    {c.name}
                  </label>
                  <input
                    className="tx-input"
                    style={{ flex: 1 }}
                    type="number"
                    placeholder="₦0"
                    value={setupLimits[c.id] || ""}
                    onChange={(e) => setSetupLimits((p) => ({ ...p, [c.id]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setShowSetup(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleCreateBudget} disabled={saving}>
                {saving ? "Saving…" : budget?.budget_exists ? "Update Budget" : "Create Budget"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}