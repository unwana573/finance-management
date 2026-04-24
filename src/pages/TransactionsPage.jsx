import React, { useState, useEffect } from "react";
import { getTransactions, createTransaction, deleteTransaction, exportTransactionsCSV } from "../services/transactions";

const CATEGORY_COLORS = {
  Salary: "#22c55e", Housing: "#ef4444", Food: "#f97316",
  Transport: "#3b82f6", Utilities: "#8b5cf6", Shopping: "#eab308",
  Investment: "#06b6d4", Freelance: "#10b981", Entertainment: "#ec4899",
  Savings: "#64748b", Healthcare: "#f43f5e", Education: "#a855f7",
};

const fmtFull = (v) => "₦" + Math.abs(Number(v)).toLocaleString("en-NG");
const EMPTY = { description: "", amount: "", category_id: "", type: "expense" };

export default function TransactionsPage({ categories = [] }) {
  const [transactions, setTransactions] = useState([]);
  const [form,         setForm]         = useState(EMPTY);
  const [error,        setError]        = useState("");
  const [saving,       setSaving]       = useState(false);
  const [loading,      setLoading]      = useState(true);

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
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="tx-select" name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button className="btn-primary" onClick={handleAdd} disabled={saving}>
            {saving ? "Adding…" : "+ Add"}
          </button>
        </div>
      </div>

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