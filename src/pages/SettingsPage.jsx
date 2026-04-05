import React, { useState } from "react";

function Toggle({ checked, onChange }) {
  return (
    <button
      className={`toggle ${checked ? "toggle--on" : ""}`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    />
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    budgetAlerts:             true,
    transactionNotifications: true,
    weeklySummaryEmails:      true,
  });
  const [twoFactor, setTwoFactor] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (key) =>
    setNotifications((p) => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure your account &amp; integrations.</p>
      </div>

      <div className="card settings-section">
        <div className="settings-section__title">🌐 Currency</div>
        <div className="settings-currency">
          <span className="currency-flag">NG</span>
          <div>
            <div className="currency-name">Nigerian Naira (₦)</div>
            <div className="currency-sub">NGN — Default currency</div>
          </div>
        </div>
      </div>

      <div className="card settings-section">
        <div className="settings-section__title">💳 Payment Integrations</div>
        <div className="integrations-grid">
          {["Paystack", "Flutterwave"].map((name) => (
            <div key={name} className="integration-item">
              <div>
                <div className="integration-name">{name}</div>
                <div className="integration-sub">Accept payments via {name}</div>
              </div>
              <button className="btn-outline">Connect</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card settings-section">
        <div className="settings-section__title">🔔 Notifications</div>
        {[
          { label: "Budget alerts",             key: "budgetAlerts"              },
          { label: "Transaction notifications", key: "transactionNotifications"  },
          { label: "Weekly summary emails",     key: "weeklySummaryEmails"       },
        ].map(({ label, key }) => (
          <div key={key} className="settings-row">
            <span>{label}</span>
            <Toggle checked={notifications[key]} onChange={() => toggle(key)} />
          </div>
        ))}
      </div>

      <div className="card settings-section">
        <div className="settings-section__title">🛡 Security</div>
        <div className="settings-row">
          <span>Two-factor authentication</span>
          <Toggle checked={twoFactor} onChange={setTwoFactor} />
        </div>
      </div>

      <button className="btn-primary save-btn" onClick={handleSave}>
        {saved ? "✓ Saved" : "Save Settings"}
      </button>
    </div>
  );
}