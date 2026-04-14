import React, { useState, useRef } from "react";

const INITIAL_PROFILE = {
  name:     "Orok Unwana",
  email:    "orokunwana@gmail.com",
  phone:    "+234 801 234 5678",
  location: "Lagos, Nigeria",
  currency: "NGN",
  bio:      "Tracking my finances and building toward financial freedom.",
  joined:   "January 2026",
};

const STATS = [
  { label: "Total Transactions", value: "47" },
  { label: "Months Tracked",     value: "6"  },
  { label: "Savings Rate",       value: "48%" },
  { label: "Budget Categories",  value: "7"  },
];

export default function ProfilePage() {
  const [profile, setProfile]   = useState(INITIAL_PROFILE);
  const [editing, setEditing]   = useState(false);
  const [draft,   setDraft]     = useState(INITIAL_PROFILE);
  const [avatar,  setAvatar]    = useState(null);
  const [saved,   setSaved]     = useState(false);
  const fileRef = useRef();

  const handleEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const handleCancel = () => setEditing(false);

  const handleSave = () => {
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

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
            {editing && (
              <div className="avatar-overlay">
                <span>Change</span>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </div>

        <div className="profile-hero-info">
          <div className="profile-name">{profile.name}</div>
          <div className="profile-email-display">{profile.email}</div>
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

      {/* Stats row */}
      <div className="profile-stats">
        {STATS.map((s) => (
          <div key={s.label} className="profile-stat-card">
            <div className="profile-stat-value">{s.value}</div>
            <div className="profile-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Editable info */}
      <div className="card">
        <h3 className="card-title">Personal Information</h3>
        <div className="profile-fields">

          <div className="profile-field">
            <label className="profile-field-label">Full Name</label>
            {editing
              ? <input className="tx-input" name="name" value={draft.name} onChange={handleChange} />
              : <div className="profile-field-value">{profile.name}</div>
            }
          </div>

          <div className="profile-field">
            <label className="profile-field-label">Email Address</label>
            {editing
              ? <input className="tx-input" name="email" type="email" value={draft.email} onChange={handleChange} />
              : <div className="profile-field-value">{profile.email}</div>
            }
          </div>

          <div className="profile-field">
            <label className="profile-field-label">Phone Number</label>
            {editing
              ? <input className="tx-input" name="phone" value={draft.phone} onChange={handleChange} />
              : <div className="profile-field-value">{profile.phone}</div>
            }
          </div>

          <div className="profile-field">
            <label className="profile-field-label">Location</label>
            {editing
              ? <input className="tx-input" name="location" value={draft.location} onChange={handleChange} />
              : <div className="profile-field-value">{profile.location}</div>
            }
          </div>

          <div className="profile-field profile-field--full">
            <label className="profile-field-label">Bio</label>
            {editing
              ? (
                <textarea
                  className="tx-input profile-bio-input"
                  name="bio"
                  value={draft.bio}
                  onChange={handleChange}
                  rows={3}
                />
              )
              : <div className="profile-field-value">{profile.bio}</div>
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
          <button
            className="btn-danger"
            onClick={() => window.confirm("Are you sure? This cannot be undone.") && alert("Transactions cleared (demo only)")}
          >
            Clear Data
          </button>
        </div>
        <div className="danger-row">
          <div>
            <div className="danger-title">Delete account</div>
            <div className="danger-sub">Permanently remove your account and all data</div>
          </div>
          <button
            className="btn-danger"
            onClick={() => window.confirm("Delete your account? This cannot be undone.") && alert("Account deleted (demo only)")}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}