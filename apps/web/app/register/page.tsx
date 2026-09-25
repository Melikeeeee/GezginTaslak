"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { registerSchema } from "@gezgin/validation";
import { useAuth } from "@/context/auth-context";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/profile";

  const { user, signUp, isLoading: authLoading } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<{
    displayName?: string;
    username?: string;
    email?: string;
    password?: string;
  }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirectTo);
    }
  }, [user, authLoading, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});
    setSuccessMessage(null);

    // Zod validation
    const result = registerSchema.safeParse({
      displayName,
      username,
      email,
      password,
    });

    if (!result.success) {
      const errors: {
        displayName?: string;
        username?: string;
        email?: string;
        password?: string;
      } = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof typeof errors;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp(
      result.data.email,
      result.data.password,
      result.data.displayName,
      result.data.username,
    );
    setIsSubmitting(false);

    if (error) {
      setGeneralError(error);
    } else {
      setSuccessMessage(
        "Account successfully created! Redirecting to your profile...",
      );
      setTimeout(() => {
        router.push(redirectTo);
      }, 1200);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🧭</div>
        <h1>Create an Account</h1>
        <p>Start your travel journey today</p>
      </div>

      {generalError && (
        <div className="alert alert-danger" role="alert">
          <span>⚠️</span>
          <span>{generalError}</span>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success" role="alert">
          <span>✅</span>
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="register-displayName">
            Full Name / Display Name
          </label>
          <input
            id="register-displayName"
            type="text"
            autoComplete="name"
            placeholder="e.g. Leyla Yilmaz"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              if (fieldErrors.displayName) {
                setFieldErrors((prev) => ({ ...prev, displayName: undefined }));
              }
            }}
            className={`form-input ${fieldErrors.displayName ? "has-error" : ""}`}
            disabled={isSubmitting}
          />
          {fieldErrors.displayName && (
            <span className="form-error">{fieldErrors.displayName}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="register-username">
            Username
          </label>
          <input
            id="register-username"
            type="text"
            autoComplete="username"
            placeholder="e.g. leyla_travels"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (fieldErrors.username) {
                setFieldErrors((prev) => ({ ...prev, username: undefined }));
              }
            }}
            className={`form-input ${fieldErrors.username ? "has-error" : ""}`}
            disabled={isSubmitting}
          />
          {fieldErrors.username ? (
            <span className="form-error">{fieldErrors.username}</span>
          ) : (
            <span className="form-helper">
              Letters, numbers, and underscores only
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="register-email">
            Email Address
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            className={`form-input ${fieldErrors.email ? "has-error" : ""}`}
            disabled={isSubmitting}
          />
          {fieldErrors.email && (
            <span className="form-error">{fieldErrors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="register-password">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            className={`form-input ${fieldErrors.password ? "has-error" : ""}`}
            disabled={isSubmitting}
          />
          {fieldErrors.password && (
            <span className="form-error">{fieldErrors.password}</span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={isSubmitting}
          style={{ marginTop: "1rem" }}
        >
          {isSubmitting ? (
            <>
              <span className="spinner" />
              <span>Creating Account...</span>
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account?{" "}
        <Link
          href={`/login${
            redirectTo !== "/profile"
              ? `?redirectTo=${encodeURIComponent(redirectTo)}`
              : ""
          }`}
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="auth-page-wrapper">
      <Suspense
        fallback={
          <div className="auth-card" style={{ textAlign: "center", padding: "3rem" }}>
            <div className="spinner spinner-primary" style={{ width: 32, height: 32 }} />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
