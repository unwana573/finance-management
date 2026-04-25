import React from "react";

const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",    icon: "⊞" },
  { id: "transactions", label: "Transactions", icon: "⇄" },
  { id: "budget",       label: "Budget",       icon: "◎" },
  { id: "analytics",    label: "Analytics",    icon: "▦" },
  { id: "profile",      label: "Profile",      icon: "◉" },
  { id: "settings",     label: "Settings",     icon: "⚙" },
];

export default function Sidebar({ activePage, setActivePage, isOpen, onClose, onLogout, onSignIn, user }) {
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <aside className={`sidebar ${isOpen ? "" : "sidebar--hidden"}`}>
      <div className="sidebar-logo">
        <span className="logo-icon">₦</span>
        <span className="logo-text">NairaFlow</span>
        <button className="sidebar-close" onClick={onClose} title="Close">✕</button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? "nav-item--active" : ""}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <>
            <div className="sidebar-user">
              <div className="sidebar-avatar">
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} className="sidebar-avatar-img" />
                  : <span>{initials}</span>
                }
              </div>
              <span className="sidebar-email">{user?.name || "Account"}</span>
            </div>
            <button className="sidebar-logout-btn" onClick={onLogout} title="Sign out">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </>
        ) : (
          <button className="btn-primary full-width" onClick={onSignIn}>Sign In</button>
        )}
      </div>
    </aside>
  );
}