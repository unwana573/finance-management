import React, { useState, useEffect } from "react";
import { getTransactions, createTransaction, deleteTransaction, exportTransactionsCSV } from "../services/transactions";
import { createCategory, deleteCategory } from "../services/settings";

const CATEGORY_COLORS = {
  Salary: "#22c55e", Housing: "#ef4444", Food: "#f97316",
  Transport: "#3b82f6", Utilities: "#8b5cf6", Shopping: "#eab308",
  Investment: "#06b6d4", Freelance: "#10b981", Entertainment: "#ec4899",
  Savings: "#64748b", Healthcare: "#f43f5e", Education: "#a855f7",
};

const fmtFull = (v) => "₦" + Math.abs(Number(v)).toLocaleString("en-NG");
const EMPTY = { description: "", amount: "", category_id: "", type: "expense" };

export default function TransactionsPage({ categories: initialCategories = [], onCategoriesUpdate }) {
  const [transactions,  setTransactions]  = useState([]);
  const [categories,    setCategories]    = useState(initialCategories);
  const [form,          setForm]          = useState(EMPTY);
  const [error,         setError]         = useState("");
  const [saving,        setSaving]        = useState(false);
  const [loading,       setLoading]       = useState(true);
  const [newCatName,    setNewCatName]    = useState("");
  const [showNewCat,    setShowNewCat]    = useState(false);
  const [savingCat,     setSavingCat]     = useState(false);

  // Sync when parent refreshes categories
  useEffect(() => { setCategories(initialCategories); }, [initialCategories]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const txRes = await getTransactions({ limit: 100 });
      setTransactions(txRes.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleAdd = async () => {
    if (!form.description || !form.amount || !form.category_id) {
      setError("Please fill all fields.");
      return;
    }
    const num = parseFloat(form.amount);
    if (isNaN(num) || num <= 0) { setError("Enter a valid amount."); return; }
    setError("");
    setSaving(true);
    try {
      await createTransaction({
        description: form.description,
        amount:      num,
        type:        form.type,
        category_id: parseInt(form.category_id),
      });
      setForm(EMPTY);
      fetchAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    setSavingCat(true);
    try {
      const created = await createCategory(newCatName.trim());
      const updated = [...categories, created];
      setCategories(updated);
      onCategoriesUpdate?.(updated);
      setForm((p) => ({ ...p, category_id: String(created.id) }));
      setNewCatName("");
      setShowNewCat(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingCat(false);
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm("Delete this custom category?")) return;
    try {
      await deleteCategory(catId);
      const updated = categories.filter((c) => c.id !== catId);
      setCategories(updated);
      onCategoriesUpdate?.(updated);
      if (form.category_id === String(catId)) setForm((p) => ({ ...p, category_id: "" }));
    } catch (err) {
      alert(err.message);
    }
  };

  const getCategoryName = (id) =>
    categories.find((c) => c.id === id)?.name || id;

  const getCategoryColor = (id) => {
    const name = getCategoryName(id);
    return CATEGORY_COLORS[name] || "#6b7280";
  };

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1>Transactions</h1>
            <p>Manage and track your financial activities.</p>
          </div>
          <button className="btn-outline" onClick={exportTransactionsCSV}>Export CSV</button>
        </div>
      </div>

      <div className="card form-card">
        <h3 className="card-title">Add Transaction</h3>
        {error && <div className="form-error">{error}</div>}
        <div className="tx-form">
          <input className="tx-input" name="description" placeholder="E.g. Grocery Shopping" value={form.description} onChange={handleChange} />
          <input className="tx-input" name="amount" type="number" placeholder="Amount (₦)" value={form.amount} onChange={handleChange} />
          <select className="tx-select" name="category_id" value={form.category_id} onChange={handleChange}>
            <option value="">Category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}{c.is_custom ? " (custom)" : ""}</option>)}
          </select>
          <select className="tx-select" name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button className="btn-primary" onClick={handleAdd} disabled={saving}>
            {saving ? "Adding…" : "+ Add"}
          </button>
        </div>

        {/* Custom category quick-create */}
        <div style={{ marginTop: 12 }}>
          {!showNewCat ? (
            <button className="auth-link" style={{ fontSize: 12 }} onClick={() => setShowNewCat(true)}>
              + Create custom category
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <input
                className="tx-input"
                style={{ flex: 1, minWidth: 160 }}
                placeholder="e.g. Church Offering"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                autoFocus
              />
              <button className="btn-primary" onClick={handleCreateCategory} disabled={savingCat}>
                {savingCat ? "Saving…" : "Create"}
              </button>
              <button className="btn-outline" onClick={() => { setShowNewCat(false); setNewCatName(""); }}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Custom categories management */}
      {categories.some((c) => c.is_custom) && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 className="card-title">Custom Categories</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {categories.filter((c) => c.is_custom).map((c) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-input)", padding: "5px 10px", borderRadius: 6, border: "1px solid var(--border)" }}>
                <span style={{ fontSize: 13 }}>{c.name}</span>
                <button className="delete-btn" style={{ padding: 2 }} onClick={() => handleDeleteCategory(c.id)}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card table-card">
        {loading ? (
          <p className="loading-text">Loading transactions…</p>
        ) : transactions.length === 0 ? (
          <div className="empty-list">
            <span className="empty-icon">💳</span>
            <p>No transactions yet. Add one above.</p>
          </div>
        ) : (
          <table className="tx-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>DESCRIPTION</th>
                <th>CATEGORY</th>
                <th>AMOUNT</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="tx-row">
                  <td className="tx-date">{t.date?.slice(0, 10)}</td>
                  <td className="tx-desc">{t.description}</td>
                  <td>
                    <span className="category-badge" style={{
                      background: getCategoryColor(t.category_id) + "22",
                      color: getCategoryColor(t.category_id),
                    }}>
                      {getCategoryName(t.category_id)}
                    </span>
                  </td>
                  <td className={t.type === "income" ? "color-income" : "color-expense"}>
                    {t.type === "income" ? "+" : "-"}{fmtFull(t.amount)}
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(t.id)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}