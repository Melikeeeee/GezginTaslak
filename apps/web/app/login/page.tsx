"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema } from "@gezgin/validation";
import { useAuth } from "@/context/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/profile";
  const callbackError = searchParams.get("error");

  const { user, signIn, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [generalError, setGeneralError] = useState<string | null>(
    callbackError ? "Authentication session could not be established." : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to destination
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirectTo);
    }
  }, [user, authLoading, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    // Zod schema validation
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors: { email?: string; password?: string } = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === "email" && !errors.email) {
          errors.email = issue.message;
        } else if (issue.path[0] === "password" && !errors.password) {
          errors.password = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(result.data.email, result.data.password);
    setIsSubmitting(false);

    if (error) {
      setGeneralError(error);
    } else {
      router.push(redirectTo);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🧭</div>
        <h1>Welcome Back</h1>
        <p>Sign in to plan and discover your city adventures</p>
      </div>

      {generalError && (
        <div className="alert alert-danger" role="alert">
          <span>⚠️</span>
          <span>{generalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">
            Email Address
          </label>
          <input
            id="login-email"
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
          <label className="form-label" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
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
              <span>Signing In...</span>
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="auth-footer">
        Don&apos;t have an account yet?{" "}
        <Link
          href={`/register${
            redirectTo !== "/profile"
              ? `?redirectTo=${encodeURIComponent(redirectTo)}`
              : ""
          }`}
        >
          Create one
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="auth-page-wrapper">
      <Suspense
        fallback={
          <div className="auth-card" style={{ textAlign: "center", padding: "3rem" }}>
            <div className="spinner spinner-primary" style={{ width: 32, height: 32 }} />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
