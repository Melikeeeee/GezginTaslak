"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { profileUpdateSchema } from "@gezgin/validation";
import { updateProfile } from "@gezgin/supabase-queries";
import { useAuth } from "@/context/auth-context";
import { TripsList } from "@/components/TripsList";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, isLoading, signOut, refreshProfile, supabase } =
    useAuth();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    displayName?: string;
    bio?: string;
  }>({});
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state with loaded profile
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
    } else if (user) {
      setDisplayName(user.user_metadata?.display_name || "");
    }
  }, [profile, user]);

  // Auth guard: redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login?redirectTo=/profile");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <div className="spinner spinner-primary" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setFieldErrors({});

    const result = profileUpdateSchema.safeParse({
      displayName,
      bio: bio || null,
    });

    if (!result.success) {
      const errors: { displayName?: string; bio?: string } = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === "displayName") {
          errors.displayName = issue.message;
        } else if (issue.path[0] === "bio") {
          errors.bio = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    if (!supabase) {
      setStatusMessage({
        type: "danger",
        text: "Database client is not available.",
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(supabase as any, user.id, {
        displayName: result.data.displayName,
        bio: result.data.bio,
      });
      await refreshProfile();
      setStatusMessage({
        type: "success",
        text: "Your profile has been updated successfully!",
      });
    } catch (err) {
      setStatusMessage({
        type: "danger",
        text:
          err instanceof Error
            ? err.message
            : "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently joined";

  const initialLetter = (
    profile?.display_name ||
    user.email ||
    "U"
  )[0].toUpperCase();

  return (
    <div className="container" style={{ padding: "2.5rem 1rem" }}>
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-circle">{initialLetter}</div>
          <div className="profile-meta">
            <h2>{profile?.display_name || "Traveler"}</h2>
            <div className="profile-username">
              @{profile?.username || user.user_metadata?.username || "traveler"}
            </div>
            <div className="profile-email">{user.email}</div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "var(--text-dim)",
                marginTop: "0.25rem",
              }}
            >
              Member since {memberSince}
            </div>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`alert ${
              statusMessage.type === "success" ? "alert-success" : "alert-danger"
            }`}
          >
            <span>{statusMessage.type === "success" ? "✅" : "⚠️"}</span>
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-display-name">
              Display Name
            </label>
            <input
              id="profile-display-name"
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (fieldErrors.displayName) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    displayName: undefined,
                  }));
                }
              }}
              className={`form-input ${
                fieldErrors.displayName ? "has-error" : ""
              }`}
              disabled={isSaving}
            />
            {fieldErrors.displayName && (
              <span className="form-error">{fieldErrors.displayName}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-bio">
              Bio / Travel Notes
            </label>
            <textarea
              id="profile-bio"
              rows={4}
              value={bio}
              placeholder="Tell other travelers about your favorite spots or travel style..."
              onChange={(e) => {
                setBio(e.target.value);
                if (fieldErrors.bio) {
                  setFieldErrors((prev) => ({ ...prev, bio: undefined }));
                }
              }}
              className={`form-textarea ${fieldErrors.bio ? "has-error" : ""}`}
              disabled={isSaving}
            />
            {fieldErrors.bio ? (
              <span className="form-error">{fieldErrors.bio}</span>
            ) : (
              <span className="form-helper">
                Max 300 characters ({bio.length}/300)
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--border)",
            }}
          >
            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.push("/login");
              }}
              className="btn btn-secondary"
            >
              Sign Out
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </form>
      </div>

      <TripsList />
    </div>
  );
}
