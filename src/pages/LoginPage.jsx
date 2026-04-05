import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email,    setEmail]    = useState("orokunwana@gmail.com");
  const [password, setPassword] = useState("password");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">
          <span className="logo-icon">₦</span>
          <span className="logo-text">NairaFlow</span>
        </div>
        <p className="login-sub">Personal finance for Nigerians</p>

        {error && <div className="form-error">{error}</div>}

        <label className="form-label">Email</label>
        <input
          className="tx-input full-width"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="form-label" style={{ marginTop: 12 }}>Password</label>
        <input
          className="tx-input full-width"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn-primary full-width" style={{ marginTop: 20 }} disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <p className="login-hint">Demo: orokunwana@gmail.com / password</p>
      </form>
    </div>
  );
}
