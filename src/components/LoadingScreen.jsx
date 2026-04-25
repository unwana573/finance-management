import React from "react";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo-wrap">
          <span className="loading-logo-icon">₦</span>
          <div className="loading-rings">
            <div className="loading-ring loading-ring--1" />
            <div className="loading-ring loading-ring--2" />
            <div className="loading-ring loading-ring--3" />
          </div>
        </div>
        <div className="loading-wordmark">NairaFlow</div>
        <div className="loading-bar-track">
          <div className="loading-bar-fill" />
        </div>
      </div>
    </div>
  );
}