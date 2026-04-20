import React from "react";

export default function Navbar({ onToggleSidebar, user, onLogout }) {
  return (
    <header className="navbar">
      <button className="navbar-toggle" onClick={onToggleSidebar} title="Toggle sidebar">
        <span className="toggle-bar" />
        <span className="toggle-bar" />
        <span className="toggle-bar" />
      </button>
      <div className="navbar-right">
        {user && <span className="navbar-username">{user.name}</span>}
        {onLogout && (
          <button className="navbar-logout navbar-logout--mobile" onClick={onLogout} title="Sign out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}