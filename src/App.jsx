import React, { useState, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Navbar  from "./components/Navbar";
import AuthPage         from "./pages/AuthPage";
import DashboardPage    from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetPage       from "./pages/BudgetPage";
import AnalyticsPage    from "./pages/AnalyticsPage";
import SettingsPage     from "./pages/SettingsPage";
import ProfilePage      from "./pages/ProfilePage";
import "./styles.css";

export default function App() {
  const [user,         setUser]         = useState(null);
  const [activePage,   setActivePage]   = useState("dashboard");
  const [sidebarOpen,  setSidebarOpen]  = useState(window.innerWidth >= 768);

  // ── Global state: all pages derive from this ──────────────────
  const [transactions, setTransactions] = useState([]);
  const [budgets,      setBudgets]      = useState({
    Housing: 0, Food: 0, Transport: 0, Utilities: 0,
    Shopping: 0, Entertainment: 0, Savings: 0,
  });

  // ── Derived financial summary (recalculated on every tx change) ─
  const summary = useMemo(() => {
    const income   = transactions.filter(t => t.amount > 0).reduce((s, t) =>  s + t.amount, 0);
    const expenses = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const savings  = transactions.filter(t => t.category === "Savings" && t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const balance  = income - expenses;

    // Spending per category (for budget page)
    const spentByCategory = {};
    transactions.filter(t => t.amount < 0).forEach(t => {
      spentByCategory[t.category] = (spentByCategory[t.category] || 0) + Math.abs(t.amount);
    });

    // Monthly chart data (last 6 months)
    const monthlyData = buildMonthlyData(transactions);

    return { income, expenses, savings, balance, spentByCategory, monthlyData };
  }, [transactions]);

  const handleLogin  = (userData) => setUser(userData);
  const handleLogout = () => { setUser(null); setActivePage("dashboard"); setTransactions([]); };

  const handleNavClick = (page) => {
    setActivePage(page);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const addTransaction = (tx) => setTransactions(prev => [tx, ...prev]);
  const deleteTransaction = (id) => setTransactions(prev => prev.filter(t => t.id !== id));
  const updateBudget = (category, value) => setBudgets(prev => ({ ...prev, [category]: value }));

  if (!user) return <AuthPage onLogin={handleLogin} />;

  return (
    <div className="app-layout">
      {sidebarOpen && window.innerWidth < 768 && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar
        activePage={activePage}
        setActivePage={handleNavClick}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="content-wrapper">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(p => !p)}
          user={user}
          onLogout={handleLogout}
        />
        <main className="main-content">
          {activePage === "dashboard"    && <DashboardPage    summary={summary} transactions={transactions} />}
          {activePage === "transactions" && <TransactionsPage transactions={transactions} onAdd={addTransaction} onDelete={deleteTransaction} />}
          {activePage === "budget"       && <BudgetPage       summary={summary} budgets={budgets} onUpdateBudget={updateBudget} />}
          {activePage === "analytics"    && <AnalyticsPage    summary={summary} transactions={transactions} />}
          {activePage === "profile"      && <ProfilePage      user={user} />}
          {activePage === "settings"     && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

// ── Helper: group transactions into last 6 calendar months ──────
function buildMonthlyData(transactions) {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: d.toLocaleString("default", { month: "short" }),
      year:  d.getFullYear(),
      monthNum: d.getMonth(),
      income: 0,
      expenses: 0,
    });
  }
  transactions.forEach(tx => {
    const d = new Date(tx.date);
    const entry = months.find(m => m.monthNum === d.getMonth() && m.year === d.getFullYear());
    if (!entry) return;
    if (tx.amount > 0) entry.income   += tx.amount;
    else               entry.expenses += Math.abs(tx.amount);
  });
  return months;
}