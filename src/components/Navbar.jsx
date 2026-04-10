import React from "react";

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="navbar">
      <button className="navbar-toggle" onClick={onToggleSidebar} title="Toggle sidebar">
        <span className="toggle-bar" />
        <span className="toggle-bar" />
        <span className="toggle-bar" />
      </button>
      <span className="navbar-email">orokunwana@gmail.com</span>
    </header>
  );
}