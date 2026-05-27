import React, { useState, useEffect } from "react";
import { getAuditLog, ACTION_LABELS, ACTION_ICONS } from "../services/audit";

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
    + " · "
    + d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
};

export default function AuditLogPage() {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [page,    setPage]    = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  const fetchLogs = async (skip = 0, append = false) => {
    setLoading(true);
    try {
      const data = await getAuditLog({ skip, limit: LIMIT });
      if (append) {
        setLogs((prev) => [...prev, ...data]);
      } else {
        setLogs(data);
      }
      setHasMore(data.length === LIMIT);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(0); }, []);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchLogs(next * LIMIT, true);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Activity Log</h1>
        <p>Your recent account activity.</p>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="card">
        {loading && logs.length === 0 ? (
          <p className="loading-text">Loading activity…</p>
        ) : logs.length === 0 ? (
          <div className="empty-list">
            <span className="empty-icon">📋</span>
            <p>No activity recorded yet.</p>
          </div>
        ) : (
          <>
            <div className="audit-list">
              {logs.map((log) => (
                <div key={log.id} className="audit-item">
                  <span className="audit-icon">{ACTION_ICONS[log.action] ?? "📌"}</span>
                  <div className="audit-body">
                    <div className="audit-action">{ACTION_LABELS[log.action] ?? log.action}</div>
                    {log.detail && <div className="audit-detail">{log.detail}</div>}
                    <div className="audit-time">{formatDate(log.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button className="btn-outline" onClick={loadMore} disabled={loading}>
                  {loading ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}