import React from "react";

export function Skeleton({ width = "100%", height = 16, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: 4, ...style }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="stat-card">
      <Skeleton height={12} width="60%" />
      <Skeleton height={32} width="80%" style={{ marginTop: 12 }} />
      <Skeleton height={10} width="50%" style={{ marginTop: 8 }} />
    </div>
  );
}
