import React, { useState, useEffect, useRef } from "react";
import { loginEmail, register, loginGoogle, loginApple } from "../services/auth";
import { getMe } from "../services/user";
import PasswordStrength from "./PasswordStrength";

// ── Put your Google Client ID here or in .env ─────────────────
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const GOOGLE_ICON = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const APPLE_ICON = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <path d="M14.26 9.55c-.02-2.23 1.82-3.31 1.9-3.36-1.04-1.52-2.65-1.73-3.22-1.75-1.37-.14-2.68.81-3.38.81-.7 0-1.77-.79-2.91-.77-1.49.02-2.87.87-3.64 2.21-1.56 2.7-.4 6.69 1.11 8.88.74 1.07 1.62 2.27 2.77 2.23 1.12-.05 1.54-.72 2.89-.72 1.35 0 1.73.72 2.91.7 1.2-.02 1.96-1.09 2.69-2.17.85-1.24 1.2-2.45 1.22-2.51-.03-.01-2.33-.89-2.34-3.55zM12.13 3.1c.62-.75 1.03-1.79.92-2.83-.89.04-1.96.59-2.6 1.33-.57.66-1.07 1.71-.93 2.72.99.08 2-.5 2.61-1.22z"/>
  </svg>
);

export default function AuthModal({ onLogin, onClose }) {
  const [mode,         setMode]         = useState("login");
  const [form,         setForm]         = useState({ name: "", email: "", password: "", confirm: "" });
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const googleBtnRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Load Google Identity Services and render button
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const initGoogle = () => {
      if (!window.google || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async ({ credential }) => {
          setLoading("google");
          setError("");
          try {
            await loginGoogle(credential);
            const u = await getMe();
            onLogin({ name: u.full_name, email: u.email, avatar: u.avatar_url || null, ...u });
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(null);
          }
        },
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: "100%",
      });
    };

    // If Google script already loaded
    if (window.google) { initGoogle(); return; }

    // Otherwise inject the script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.head.appendChild(script);
  }, [GOOGLE_CLIENT_ID, onLogin]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const afterAuth = async () => {
    const u = await getMe();
    onLogin({ name: u.full_name, email: u.email, avatar: u.avatar_url || null, ...u });
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    if (mode === "signup") {
      if (!form.name.trim())              return setError("Please enter your name.");
      if (!form.email.trim())             return setError("Please enter your email.");
      if (form.password.length < 8)       return setError("Password must be at least 8 characters.");
      const score = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(form.password)).length;
      if (score < 2)                      return setError("Password is too weak. Add uppercase, numbers or symbols.");
      if (form.password !== form.confirm) return setError("Passwords do not match.");
    } else {
      if (!form.email.trim()) return setError("Please enter your email.");
      if (!form.password)     return setError("Please enter your password.");
    }
    setLoading("email");
    try {
      if (mode === "signup") {
        await register(form.email, form.password, form.name);
      } else {
        await loginEmail(form.email, form.password);
      }
      await afterAuth();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleApple = () => {
    setError("Apple Sign In is unavailable at the moment. Please use Google or email.");
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError("");
    setForm({ name: "", email: "", password: "", confirm: "" });
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">

        <div className="modal-header">
          <div className="auth-logo">
            <span className="logo-icon">₦</span>
            <span className="logo-text">NairaFlow</span>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="auth-sub">
          {mode === "login" ? "Sign in to your account" : "Create a free account"}
        </p>

        <div className="social-btns">
          {/* Google button rendered by Google Identity Services SDK */}
          {GOOGLE_CLIENT_ID ? (
            <div ref={googleBtnRef} className="google-btn-wrapper" />
          ) : (
            <div className="social-btn-disabled">
              {GOOGLE_ICON}
              <span>Google Sign In (add VITE_GOOGLE_CLIENT_ID)</span>
            </div>
          )}
          <button className="social-btn social-btn--apple" onClick={handleApple} disabled={!!loading}>
            {loading === "apple" ? <span className="spinner spinner--light" /> : APPLE_ICON}
            <span>Continue with Apple</span>
          </button>
        </div>

        <div className="auth-divider">
          <span className="auth-divider-line" />
          <span className="auth-divider-text">or</span>
          <span className="auth-divider-line" />
        </div>

        {error && (
          <div className={error.includes("unavailable") ? "form-info" : "form-error"}>
            {error.includes("unavailable") ? "ℹ️ " : "⚠ "}{error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="auth-form">
          {mode === "signup" && (
            <div className="auth-field">
              <label className="form-label">Full Name</label>
              <input className="tx-input full-width" name="name" placeholder="Orok Unwana" value={form.name} onChange={handleChange} />
            </div>
          )}
          <div className="auth-field">
            <label className="form-label">Email</label>
            <input className="tx-input full-width" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>
          <div className="auth-field">
            <label className="form-label">Password</label>
            <div className="pw-input-wrap">
              <input
                className="tx-input full-width"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={mode === "signup" ? "Min. 8 characters" : "••••••••"}
                value={form.password}
                onChange={handleChange}
              />
              <button type="button" className="pw-eye" onClick={() => setShowPassword(p => !p)} tabIndex={-1}>
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {mode === "signup" && <PasswordStrength password={form.password} />}
          </div>
          {mode === "signup" && (
            <div className="auth-field">
              <label className="form-label">Confirm Password</label>
              <div className="pw-input-wrap">
                <input
                  className="tx-input full-width"
                  name="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={form.confirm}
                  onChange={handleChange}
                />
                <button type="button" className="pw-eye" onClick={() => setShowConfirm(p => !p)} tabIndex={-1}>
                  {showConfirm ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
          {mode === "login" && (
            <div className="auth-forgot">
              <button type="button" className="auth-link">Forgot password?</button>
            </div>
          )}
          <button type="submit" className="btn-primary full-width auth-submit" disabled={!!loading}>
            {loading === "email"
              ? (mode === "login" ? "Signing in…" : "Creating account…")
              : (mode === "login" ? "Sign In" : "Create Account")}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button className="auth-link" onClick={switchMode}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>

      </div>
    </div>
  );
}