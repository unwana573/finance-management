import React, { useState, useRef } from "react";
import { updateProfile, deleteAccount } from "../services/user";
import { getTransactions } from "../services/transactions";
import { getSummary } from "../services/analytics";

const fmtNaira = (v) => "₦" + Math.abs(Number(v)).toLocaleString("en-NG");

export default function ProfilePage({ user = {}, onUserUpdate }) {
  const [profile, setProfile] = useState({
    name:     user.full_name || user.name || "",
    email:    user.email || "",
    currency: user.currency || "NGN",
  });
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(profile);
  const [avatar,  setAvatar]  = useState(user.avatar || user.avatar_url || null);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");
  const fileRef = useRef();

  const [stats, setStats] = useState(null);
  React.useEffect(() => {
    Promise.all([getSummary(), getTransactions({ limit: 1 })])
      .then(([s, t]) => setStats({ summary: s, totalTx: t.total }))
      .catch(() => {});
  }, []);

  const income      = stats?.summary?.income    || 0;
  const expenses    = stats?.summary?.expenses  || 0;
  const savings     = stats?.summary?.savings   || 0;
  const balance     = stats?.summary?.total_balance || 0;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
  const totalTx     = stats?.totalTx ?? 0;

  const STATS = [
    { label: "Total Transactions", value: stats === null ? "…" : totalTx || "—" },
    { label: "Savings Rate",       value: stats === null ? "…" : income > 0 ? `${savingsRate}%` : "—" },
    { label: "Net Balance",        value: stats === null ? "…" : income > 0 ? fmtNaira(balance) : "—" },
    { label: "Total Expenses",     value: stats === null ? "…" : expenses > 0 ? fmtNaira(expenses) : "—" },
  ];

  const handleEdit   = () => { setDraft(profile); setEditing(true); };
  const handleCancel = () => setEditing(false);

  const handleSave = async () => {
    setError("");
    try {
      const updated = await updateProfile({ full_name: draft.name, currency: draft.currency });
      const next = { name: updated.full_name, email: updated.email, currency: updated.currency };
      setProfile(next);
      onUserUpdate?.({ ...user, ...next, full_name: updated.full_name, avatar: avatar || user.avatar });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) =>
    setDraft((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Permanently delete your account? This cannot be undone.")) return;
    try {
      await deleteAccount();
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const initials = (profile.name || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your personal information.</p>
      </div>

      {saved  && <div className="profile-saved">✓ Profile updated successfully</div>}
      {error  && <div className="form-error">{error}</div>}

      <div className="card profile-hero">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar" onClick={() => editing && fileRef.current.click()}>
            {avatar ? <img src={avatar} alt="avatar" className="avatar-img" /> : <span className="avatar-initials">{initials}</span>}
            {editing && <div className="avatar-overlay"><span>Change</span></div>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
        </div>
        <div className="profile-hero-info">
          <div className="profile-name">{profile.name || "—"}</div>
          <div className="profile-email-display">{profile.email}</div>
          <div className="profile-joined">
            Member since {user.created_at ? new Date(user.created_at).toLocaleString("default", { month: "long", year: "numeric" }) : "—"}
          </div>
        </div>
        <div className="profile-hero-actions">
          {!editing
            ? <button className="btn-primary" onClick={handleEdit}>Edit Profile</button>
            : <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-outline" onClick={handleCancel}>Cancel</button>
                <button className="btn-primary" onClick={handleSave}>Save Changes</button>
              </div>
          }
        </div>
      </div>

      <div className="profile-stats">
        {STATS.map((s) => (
          <div key={s.label} className="profile-stat-card">
            <div className="profile-stat-value">{s.value}</div>
            <div className="profile-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="card-title">Personal Information</h3>
        <div className="profile-fields">
          <div className="profile-field">
            <label className="profile-field-label">Full Name</label>
            {editing
              ? <input className="tx-input" name="name" value={draft.name} onChange={handleChange} />
              : <div className="profile-field-value">{profile.name || <span style={{ color: "var(--text-muted)" }}>Not set</span>}</div>
            }
          </div>
          <div className="profile-field">
            <label className="profile-field-label">Email Address</label>
            <div className="profile-field-value">{profile.email}</div>
          </div>
          <div className="profile-field">
            <label className="profile-field-label">Currency</label>
            {editing
              ? (
                <select className="tx-select" name="currency" value={draft.currency} onChange={handleChange}>
                  <option value="NGN">Nigerian Naira (₦)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              )
              : <div className="profile-field-value">{profile.currency}</div>
            }
          </div>
          <div className="profile-field">
            <label className="profile-field-label">Account Type</label>
            <div className="profile-field-value">{user.two_fa_enabled ? "2FA Enabled" : "Standard"}</div>
          </div>
        </div>
      </div>

      <div className="card profile-danger">
        <h3 className="card-title" style={{ color: "var(--red)" }}>Danger Zone</h3>
        <div className="danger-row">
          <div>
            <div className="danger-title">Delete account</div>
            <div className="danger-sub">Permanently remove your account and all data</div>
          </div>
          <button className="btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
        </div>
      </div>
    </div>
  );
}