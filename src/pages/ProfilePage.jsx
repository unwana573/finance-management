import React, { useState, useRef } from "react";

const fmtNaira = (v) => "₦" + Math.abs(v).toLocaleString("en-NG");

export default function ProfilePage({ user = {}, summary = {}, transactions = [], budgets = {} }) {
  const [profile, setProfile] = useState({
    name:     user.name  || "",
    email:    user.email || "",
    phone:    "",
    location: "",
    currency: "NGN",
    bio:      "",
    joined:   new Date().toLocaleString("default", { month: "long", year: "numeric" }),
  });
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(profile);
  const [avatar,  setAvatar]  = useState(null);
  const [saved,   setSaved]   = useState(false);
  const fileRef = useRef();

  // ── Compute real stats from props ──────────────────────────────
  const totalTx        = transactions.length;
  const income         = summary.income    || 0;
  const expenses       = summary.expenses  || 0;
  const savings        = summary.savings   || 0;
  const balance        = summary.balance   || 0;
  const savingsRate    = income > 0 ? Math.round((savings / income) * 100) : 0;
  const budgetsSet     = Object.values(budgets).filter((v) => v > 0).length;

  // How many distinct calendar months have transactions
  const monthsTracked = transactions.length === 0 ? 0 : (() => {
    const keys = new Set(transactions.map((t) => t.date.slice(0, 7)));
    return keys.size;
  })();

  const STATS = [
    {
      label: "Total Transactions",
      value: totalTx === 0 ? "—" : totalTx,
    },
    {
      label: "Months Tracked",
      value: monthsTracked === 0 ? "—" : monthsTracked,
    },
    {
      label: "Savings Rate",
      value: income === 0 ? "—" : `${savingsRate}%`,
    },
    {
      label: "Net Balance",
      value: income === 0 ? "—" : fmtNaira(balance),
    },
  ];

  // ── Handlers ───────────────────────────────────────────────────
  const handleEdit   = () => { setDraft(profile); setEditing(true); };
  const handleCancel = () => setEditing(false);
  const handleSave   = () => {
    setProfile(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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

  const initials = (profile.name || "?")
    .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your personal information.</p>
      </div>

      {saved && <div className="profile-saved">✓ Profile updated successfully</div>}

      {/* Avatar + name hero */}
      <div className="card profile-hero">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar" onClick={() => editing && fileRef.current.click()}>
            {avatar
              ? <img src={avatar} alt="avatar" className="avatar-img" />
              : <span className="avatar-initials">{initials}</span>
            }
            {editing && <div className="avatar-overlay"><span>Change</span></div>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
        </div>

        <div className="profile-hero-info">
          <div className="profile-name">{profile.name || "—"}</div>
          <div className="profile-email-display">{profile.email || "—"}</div>
          <div className="profile-joined">Member since {profile.joined}</div>
        </div>

        <div className="profile-hero-actions">
          {!editing
            ? <button className="btn-primary" onClick={handleEdit}>Edit Profile</button>
            : (
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-outline" onClick={handleCancel}>Cancel</button>
                <button className="btn-primary" onClick={handleSave}>Save Changes</button>
              </div>
            )
          }
        </div>
      </div>

      {/* Live stats */}
      <div className="profile-stats">
        {STATS.map((s) => (
          <div key={s.label} className="profile-stat-card">
            <div className="profile-stat-value">{s.value}</div>
            <div className="profile-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Financial snapshot */}
      {income > 0 && (
        <div className="card profile-snapshot">
          <h3 className="card-title">Financial Snapshot</h3>
          <div className="snapshot-grid">
            <div className="snapshot-item">
              <span className="snapshot-label">Total Income</span>
              <span className="snapshot-value color-income">{fmtNaira(income)}</span>
            </div>
            <div className="snapshot-item">
              <span className="snapshot-label">Total Expenses</span>
              <span className="snapshot-value color-expense">{fmtNaira(expenses)}</span>
            </div>
            <div className="snapshot-item">
              <span className="snapshot-label">Total Savings</span>
              <span className="snapshot-value color-income">{fmtNaira(savings)}</span>
            </div>
            <div className="snapshot-item">
              <span className="snapshot-label">Budgets Set</span>
              <span className="snapshot-value">{budgetsSet} / {Object.keys(budgets).length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Editable info */}
      <div className="card">
        <h3 className="card-title">Personal Information</h3>
        <div className="profile-fields">

          <div className="profile-field">
            <label className="profile-field-label">Full Name</label>
            {editing
              ? <input className="tx-input" name="name" value={draft.name} onChange={handleChange} />
              : <div className="profile-field-value">{profile.name || <span style={{color:"var(--text-muted)"}}>Not set</span>}</div>
            }
          </div>

          <div className="profile-field">
            <label className="profile-field-label">Email Address</label>
            {editing
              ? <input className="tx-input" name="email" type="email" value={draft.email} onChange={handleChange} />
              : <div className="profile-field-value">{profile.email || <span style={{color:"var(--text-muted)"}}>Not set</span>}</div>
            }
          </div>

          <div className="profile-field">
            <label className="profile-field-label">Phone Number</label>
            {editing
              ? <input className="tx-input" name="phone" placeholder="+234 800 000 0000" value={draft.phone} onChange={handleChange} />
              : <div className="profile-field-value">{profile.phone || <span style={{color:"var(--text-muted)"}}>Not set</span>}</div>
            }
          </div>

          <div className="profile-field">
            <label className="profile-field-label">Location</label>
            {editing
              ? <input className="tx-input" name="location" placeholder="Lagos, Nigeria" value={draft.location} onChange={handleChange} />
              : <div className="profile-field-value">{profile.location || <span style={{color:"var(--text-muted)"}}>Not set</span>}</div>
            }
          </div>

          <div className="profile-field profile-field--full">
            <label className="profile-field-label">Bio</label>
            {editing
              ? <textarea className="tx-input profile-bio-input" name="bio" placeholder="Tell us about yourself..." value={draft.bio} onChange={handleChange} rows={3} />
              : <div className="profile-field-value">{profile.bio || <span style={{color:"var(--text-muted)"}}>Not set</span>}</div>
            }
          </div>

        </div>
      </div>

      {/* Danger zone */}
      <div className="card profile-danger">
        <h3 className="card-title" style={{ color: "var(--red)" }}>Danger Zone</h3>
        <div className="danger-row">
          <div>
            <div className="danger-title">Clear all transactions</div>
            <div className="danger-sub">Permanently delete your transaction history</div>
          </div>
          <button className="btn-danger" onClick={() => window.confirm("Are you sure? This cannot be undone.") && alert("Transactions cleared (demo only)")}>
            Clear Data
          </button>
        </div>
        <div className="danger-row">
          <div>
            <div className="danger-title">Delete account</div>
            <div className="danger-sub">Permanently remove your account and all data</div>
          </div>
          <button className="btn-danger" onClick={() => window.confirm("Delete your account? This cannot be undone.") && alert("Account deleted (demo only)")}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}