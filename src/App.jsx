import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardPage    from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetPage       from "./pages/BudgetPage";
import AnalyticsPage    from "./pages/AnalyticsPage";
import SettingsPage     from "./pages/SettingsPage";
import "./styles.css";

const PAGES = {
  dashboard:    <DashboardPage />,
  transactions: <TransactionsPage />,
  budget:       <BudgetPage />,
  analytics:    <AnalyticsPage />,
  settings:     <SettingsPage />,
};

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        {PAGES[activePage]}
      </main>
    </div>
  );
}