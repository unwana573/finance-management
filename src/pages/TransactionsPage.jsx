import React, { useState } from "react";

const CATEGORIES = [
  "Salary","Housing","Food","Transport","Utilities",
  "Shopping","Entertainment","Investment","Freelance","Savings","Other",
];

const CATEGORY_COLORS = {
  Salary: "#22c55e", Housing: "#ef4444", Food: "#f97316",
  Transport: "#3b82f6", Utilities: "#8b5cf6", Shopping: "#eab308",
  Investment: "#06b6d4", Freelance: "#10b981", Entertainment: "#ec4899",
  Savings: "#64748b", Other: "#888",
};

const fmtFull = (v) => "₦" + Math.abs(v).toLocaleString("en-NG");
const EMPTY = { description: "", amount: "", category: "", type: "expense" };

export default function TransactionsPage({ transactions, onAdd, onDelete }) {
  const [form,  setForm]  = useState(EMPTY);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleAdd = () => {
    if (!form.description || !form.amount || !form.category) {
      setError("Please fill all fields.");
      return;
    }
    const num = parseFloat(form.amount);
    if (isNaN(num) || num <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setError("");
    const amount = form.type === "expense" ? -num : num;
    onAdd({
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      description: form.description,
      category: form.category,
      type: form.type,
      amount,
    });
    setForm(EMPTY);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Transactions</h1>
        <p>Manage and track your financial activities.</p>
      </div>

      <div className="card form-card">
        <h3 className="card-title">Add Transaction</h3>
        {error && <div className="form-error">{error}</div>}
        <div className="tx-form">
          <input className="tx-input" name="description" placeholder="E.g. Grocery Shopping" value={form.description} onChange={handleChange} />
          <input className="tx-input" name="amount" type="number" placeholder="0.00" value={form.amount} onChange={handleChange} />
          <select className="tx-select" name="category" value={form.category} onChange={handleChange}>
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="tx-select" name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button className="btn-primary" onClick={handleAdd}>+ Add</button>
        </div>
      </div>

      <div className="card table-card">
        {transactions.length === 0 ? (
          <div className="empty-list" style={{ padding: "40px 0" }}>
            <span className="empty-icon">📋</span>
            <p>No transactions yet. Add your first one above.</p>
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
                  <td className="tx-date">{t.date}</td>
                  <td className="tx-desc">{t.description}</td>
                  <td>
                    <span className="category-badge" style={{
                      background: (CATEGORY_COLORS[t.category] || "#6b7280") + "22",
                      color: CATEGORY_COLORS[t.category] || "#6b7280",
                    }}>
                      {t.category}
                    </span>
                  </td>
                  <td className={t.amount >= 0 ? "color-income" : "color-expense"}>
                    {t.amount >= 0 ? "+" : "-"}{fmtFull(t.amount)}
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => onDelete(t.id)}>✕</button>
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