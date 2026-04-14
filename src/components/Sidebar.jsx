import React from "react";

const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",    icon: "⊞" },
  { id: "transactions", label: "Transactions", icon: "⇄" },
  { id: "budget",       label: "Budget",       icon: "◎" },
  { id: "analytics",    label: "Analytics",    icon: "▦" },
  { id: "profile",      label: "Profile",      icon: "◉" },
  { id: "settings",     label: "Settings",     icon: "⚙" },
];

export default function Sidebar({ activePage, setActivePage, isOpen, onClose }) {
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
        <span className="sidebar-email">orokunwana@gmail.com</span>
      </div>
    </aside>
  );
}