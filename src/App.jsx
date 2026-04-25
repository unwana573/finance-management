import React, { useState, useEffect, useCallback } from "react";
import Sidebar    from "./components/Sidebar";
import Navbar     from "./components/Navbar";
import AuthModal  from "./components/AuthModal";

import DashboardPage    from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetPage       from "./pages/BudgetPage";
import AnalyticsPage    from "./pages/AnalyticsPage";
import SettingsPage     from "./pages/SettingsPage";
import ProfilePage      from "./pages/ProfilePage";

import { setLogoutHandler }   from "./services/client";
import { logout as apiLogout } from "./services/auth";
import { getMe }               from "./services/user";
import { getAccessToken }      from "./services/tokens";
import { getCategories }       from "./services/settings";

import "./styles.css";

const PROTECTED = ["transactions", "budget", "analytics", "profile", "settings"];

const FALLBACK_CATEGORIES = [
  { id: 1,  name: "Salary" },
  { id: 2,  name: "Freelance" },
  { id: 3,  name: "Investment" },
  { id: 4,  name: "Housing" },
  { id: 5,  name: "Food" },
  { id: 6,  name: "Transport" },
  { id: 7,  name: "Utilities" },
  { id: 8,  name: "Shopping" },
  { id: 9,  name: "Entertainment" },
  { id: 10, name: "Savings" },
  { id: 11, name: "Healthcare" },
  { id: 12, name: "Education" },
];

export default function App() {
  const [user,          setUser]          = useState(null);
  const [authChecked,   setAuthChecked]   = useState(false);
  const [activePage,    setActivePage]    = useState("dashboard");
  const [sidebarOpen,   setSidebarOpen]   = useState(window.innerWidth >= 768);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [categories,    setCategories]    = useState(FALLBACK_CATEGORIES);

  // ── Restore session on load ───────────────────────────────
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      getMe()
        .then((u) => setUser({ name: u.full_name, email: u.email, avatar: u.avatar_url || null, ...u }))
        .catch(() => {})
        .finally(() => setAuthChecked(true));
    } else {
      setAuthChecked(true);
    }
  }, []);

  // ── Fetch categories once when user logs in ───────────────
  useEffect(() => {
    if (!user) return;
    getCategories()
      .then((cats) => { if (cats?.length) setCategories(cats); })
      .catch(() => {}); // keep fallback on error
  }, [user]);

  // ── Wire logout handler for auto-logout on 401 ───────────
  const handleLogout = useCallback(async () => {
    await apiLogout();
    setUser(null);
    setActivePage("dashboard");
  }, []);

  useEffect(() => {
    setLogoutHandler(handleLogout);
  }, [handleLogout]);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const [navCount, setNavCount] = useState(0);

  const handleNavClick = (page) => {
    if (!user && PROTECTED.includes(page)) {
      setShowAuthModal(true);
      return;
    }
    setActivePage(page);
    setNavCount((n) => n + 1); // increment so pages re-fetch on every visit
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  if (!authChecked) return null;

  return (
    <div className="app-layout">
      {sidebarOpen && window.innerWidth < 768 && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {showAuthModal && (
        <AuthModal
          onLogin={handleLogin}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      <Sidebar
        activePage={activePage}
        setActivePage={handleNavClick}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        onSignIn={() => setShowAuthModal(true)}
        user={user}
      />

      <div className="content-wrapper">
        <Navbar
          onToggleSidebar={() => setSidebarOpen((p) => !p)}
          user={user}
          onLogout={handleLogout}
          onSignIn={() => setShowAuthModal(true)}
        />
        <main className="main-content">
          {activePage === "dashboard"    && (
            <DashboardPage user={user} onSignIn={() => setShowAuthModal(true)} isActive={navCount} />
          )}
          {activePage === "transactions" && user && <TransactionsPage categories={categories} />}
          {activePage === "budget"       && user && <BudgetPage categories={categories} isActive={navCount} />}
          {activePage === "analytics"    && user && <AnalyticsPage isActive={navCount} />}
          {activePage === "profile"      && user && <ProfilePage user={user} onUserUpdate={setUser} />}
          {activePage === "settings"     && user && <SettingsPage user={user} />}
        </main>
      </div>
    </div>
  );
}