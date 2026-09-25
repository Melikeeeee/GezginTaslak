"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export function Navbar() {
  const { user, profile, isLoading, signOut } = useAuth();

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="brand">
          <span style={{ fontSize: "1.5rem" }}>🧭</span>
          <span>Gezgin</span>
        </Link>

        <div className="nav-actions">
          {isLoading ? (
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <div className="spinner spinner-primary" />
            </div>
          ) : user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link
                href="/profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.35rem 0.65rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  backgroundColor: "#ffffff",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--text-main)",
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                  }}
                >
                  {(profile?.display_name || user.email || "U")[0].toUpperCase()}
                </div>
                <span>{profile?.display_name || user.email?.split("@")[0]}</span>
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="btn btn-secondary btn-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
