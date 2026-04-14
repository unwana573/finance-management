import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar  from "./components/Navbar";
import DashboardPage    from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetPage       from "./pages/BudgetPage";
import AnalyticsPage    from "./pages/AnalyticsPage";
import SettingsPage     from "./pages/SettingsPage";
import ProfilePage      from "./pages/ProfilePage";
import "./styles.css";

export default function App() {
  const [activePage,  setActivePage]  = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  const handleNavClick = (page) => {
    setActivePage(page);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

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
        <Navbar onToggleSidebar={() => setSidebarOpen((p) => !p)} />
        <main className="main-content">
          {activePage === "dashboard"    && <DashboardPage />}
          {activePage === "transactions" && <TransactionsPage />}
          {activePage === "budget"       && <BudgetPage />}
          {activePage === "analytics"    && <AnalyticsPage />}
          {activePage === "profile"      && <ProfilePage />}
          {activePage === "settings"     && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}