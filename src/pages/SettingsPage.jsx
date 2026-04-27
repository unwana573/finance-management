import React, { useState, useEffect } from "react";
import { getNotifications, updateNotifications } from "../services/settings";
import { enable2FA, verify2FA } from "../services/auth";
import { changePassword } from "../services/user";

function Toggle({ checked, onChange }) {
  return (
    <button className={`toggle ${checked ? "toggle--on" : ""}`} onClick={() => onChange(!checked)} role="switch" aria-checked={checked} />
  );
}

export default function SettingsPage({ user }) {
  const [notifs,   setNotifs]   = useState({ budget_alerts: true, transaction_alerts: true, weekly_digest: true });
  const [twoFA,    setTwoFA]    = useState(user?.two_fa_enabled || false);
  const [qrUri,    setQrUri]    = useState(null);
  const [otpCode,  setOtpCode]  = useState("");
  const [saved,    setSaved]    = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  // Password change
  const [pwForm,   setPwForm]   = useState({ current: "", next: "", confirm: "" });
  const [pwSaved,  setPwSaved]  = useState(false);
  const [pwError,  setPwError]  = useState("");

  useEffect(() => {
    getNotifications()
      .then(setNotifs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleNotif = (key) => setNotifs((p) => ({ ...p, [key]: !p[key] }));

  const handleSaveNotifs = async () => {
    try {
      await updateNotifications(notifs);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEnable2FA = async () => {
    try {
      const { otp_uri } = await enable2FA();
      setQrUri(otp_uri);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerify2FA = async () => {
    try {
      await verify2FA(otpCode);
      setTwoFA(true);
      setQrUri(null);
      setOtpCode("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    if (pwForm.next.length < 6)           return setPwError("New password must be at least 6 characters.");
    if (pwForm.next !== pwForm.confirm)    return setPwError("Passwords do not match.");
    try {
      await changePassword(pwForm.current, pwForm.next);
      setPwForm({ current: "", next: "", confirm: "" });
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 2500);
    } catch (err) {
      setPwError(err.message);
    }
  };

  if (loading) return <div className="page"><p className="loading-text">Loading settings…</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure your account &amp; preferences.</p>
      </div>

      {error && <div className="form-error">{error}</div>}

      {/* Currency */}
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

      {/* Notifications */}
      <div className="card settings-section">
        <div className="settings-section__title">🔔 Notifications</div>
        {[
          { label: "Budget alerts",          key: "budget_alerts"       },
          { label: "Transaction alerts",     key: "transaction_alerts"  },
          { label: "Weekly digest emails",   key: "weekly_digest"       },
        ].map(({ label, key }) => (
          <div key={key} className="settings-row">
            <span>{label}</span>
            <Toggle checked={notifs[key] ?? true} onChange={() => toggleNotif(key)} />
          </div>
        ))}
        <div style={{ marginTop: 16 }}>
          <button className="btn-primary" onClick={handleSaveNotifs}>
            {saved ? "✓ Saved" : "Save Preferences"}
          </button>
        </div>
      </div>

      {/* Security — 2FA */}
      <div className="card settings-section">
        <div className="settings-section__title">🛡 Security</div>
        <div className="settings-row">
          <div>
            <div style={{ fontWeight: 500 }}>Two-factor authentication</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              {twoFA ? "2FA is enabled on your account" : "Add an extra layer of security"}
            </div>
          </div>
          {twoFA
            ? <span style={{ color: "var(--green)", fontSize: 13, fontWeight: 600 }}>✓ Enabled</span>
            : <button className="btn-outline" onClick={handleEnable2FA}>Enable</button>
          }
        </div>
        {qrUri && (
          <div style={{ marginTop: 16, padding: 16, background: "var(--bg-input)", borderRadius: 8 }}>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>
              Scan this QR code with Google Authenticator, then enter the 6-digit code below:
            </p>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrUri)}&size=160x160`} alt="2FA QR" style={{ borderRadius: 8, marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 10 }}>
              <input className="tx-input" placeholder="123456" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} style={{ maxWidth: 120 }} />
              <button className="btn-primary" onClick={handleVerify2FA}>Verify</button>
            </div>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="card settings-section">
        <div className="settings-section__title">🔑 Change Password</div>
        {pwError && <div className="form-error">{pwError}</div>}
        {pwSaved && <div className="profile-saved">✓ Password updated successfully</div>}
        <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="auth-field">
            <label className="form-label">Current Password</label>
            <input className="tx-input full-width" type="password" placeholder="••••••••" value={pwForm.current} onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))} />
          </div>
          <div className="auth-field">
            <label className="form-label">New Password</label>
            <input className="tx-input full-width" type="password" placeholder="Min. 6 characters" value={pwForm.next} onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))} />
          </div>
          <div className="auth-field">
            <label className="form-label">Confirm New Password</label>
            <input className="tx-input full-width" type="password" placeholder="Re-enter new password" value={pwForm.confirm} onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>Update Password</button>
        </form>
      </div>

      {/* Payment integrations */}
      <div className="card settings-section">
        <div className="settings-section__title">💳 Payment Integrations</div>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
          Direct integrations with Nigerian payment providers are on the way. You'll be able to automatically sync transactions from your connected accounts.
        </p>
        <div className="integrations-grid">
          {[
            { name: "Paystack",     desc: "Auto-sync Paystack transactions",     color: "#00c3f7", letter: "P" },
            { name: "Flutterwave", desc: "Auto-sync Flutterwave transactions", color: "#f5a623", letter: "F" },
          ].map(({ name, desc, color, letter }) => (
            <div key={name} className="integration-card">
              <div className="integration-card__logo" style={{ background: color + "18", border: `1px solid ${color}33` }}>
                <span style={{ color, fontWeight: 700, fontSize: 15 }}>{letter}</span>
              </div>
              <div className="integration-card__info">
                <div className="integration-name">{name}</div>
                <div className="integration-sub">{desc}</div>
              </div>
              <span className="badge-soon">Coming soon</span>
            </div>
          ))}
        </div>
        <div className="integration-notice">
          <span>🔔</span>
          <span>We'll notify you when integrations are available.</span>
        </div>
      </div>
    </div>
  );
}