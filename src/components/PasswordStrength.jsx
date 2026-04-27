import React, { useMemo } from "react";

const CHECKS = [
  { id: "length",  label: "At least 8 characters",      test: (p) => p.length >= 8 },
  { id: "upper",   label: "One uppercase letter (A-Z)",  test: (p) => /[A-Z]/.test(p) },
  { id: "lower",   label: "One lowercase letter (a-z)",  test: (p) => /[a-z]/.test(p) },
  { id: "number",  label: "One number (0-9)",            test: (p) => /[0-9]/.test(p) },
  { id: "special", label: "One special character (!@#$)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const LEVELS = [
  { label: "Too weak",  color: "#ef4444", bg: "rgba(239,68,68,0.15)",   min: 0 },
  { label: "Weak",      color: "#f97316", bg: "rgba(249,115,22,0.15)",  min: 1 },
  { label: "Fair",      color: "#eab308", bg: "rgba(234,179,8,0.15)",   min: 2 },
  { label: "Good",      color: "#22d3ee", bg: "rgba(34,211,238,0.15)",  min: 3 },
  { label: "Strong",    color: "#22c55e", bg: "rgba(34,197,94,0.15)",   min: 4 },
  { label: "Very strong",color:"#22c55e", bg: "rgba(34,197,94,0.2)",    min: 5 },
];

export default function PasswordStrength({ password }) {
  const results = useMemo(() => CHECKS.map((c) => ({ ...c, passed: c.test(password) })), [password]);
  const score   = results.filter((r) => r.passed).length;
  const level   = LEVELS[Math.min(score, LEVELS.length - 1)];
  const pct     = (score / CHECKS.length) * 100;

  if (!password) return null;

  return (
    <div className="pw-strength">
      <div className="pw-bar-track">
        <div
          className="pw-bar-fill"
          style={{ width: `${pct}%`, background: level.color, transition: "width 0.3s ease, background 0.3s ease" }}
        />
      </div>

      <div className="pw-label" style={{ color: level.color, background: level.bg }}>
        {level.label}
      </div>

      <ul className="pw-checklist">
        {results.map((r) => (
          <li key={r.id} className={`pw-check ${r.passed ? "pw-check--pass" : "pw-check--fail"}`}>
            <span className="pw-check-icon">{r.passed ? "✓" : "○"}</span>
            <span>{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}