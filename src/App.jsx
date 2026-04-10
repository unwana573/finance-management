import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar  from "./components/Navbar";
import DashboardPage    from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetPage       from "./pages/BudgetPage";
import AnalyticsPage    from "./pages/AnalyticsPage";
import SettingsPage     from "./pages/SettingsPage";
import "./styles.css";

export default function App() {
  const [activePage,  setActivePage]  = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNavClick = (page) => {
    setActivePage(page);
    // on mobile, close drawer after selecting a page
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      {/* Overlay – only visible on mobile when sidebar is open */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        activePage={activePage}
        setActivePage={handleNavClick}
        isOpen={sidebarOpen}
      />

      <div className="content-wrapper">
        <Navbar onToggleSidebar={() => setSidebarOpen((p) => !p)} />
        <main className="main-content">
          {activePage === "dashboard"    && <DashboardPage />}
          {activePage === "transactions" && <TransactionsPage />}
          {activePage === "budget"       && <BudgetPage />}
          {activePage === "analytics"    && <AnalyticsPage />}
          {activePage === "settings"     && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
