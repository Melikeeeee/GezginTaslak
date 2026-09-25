import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { profileUpdateSchema } from "@gezgin/validation";
import { updateProfile } from "@gezgin/supabase-queries";
import { useAuth } from "@/context/auth-context";
import { TripsList } from "@/components/TripsList";

export default function MobileProfileScreen() {
  const router = useRouter();
  const {
    user,
    profile,
    isLoading: authLoading,
    signOut,
    refreshProfile,
    supabase,
  } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    displayName?: string;
    bio?: string;
  }>({});
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
    } else if (user) {
      setDisplayName(user.user_metadata?.display_name || "");
    }
  }, [profile, user]);

  if (authLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>🧭</Text>
        <Text style={styles.emptyTitle}>Sign In Required</Text>
        <Text style={styles.emptySubtitle}>
          Sign in to view and edit your profile and saved trips.
        </Text>
        <View style={styles.emptyActions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleSave = async () => {
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
        type: "error",
        text: "Database client is not available.",
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(supabase, user.id, {
        displayName: result.data.displayName,
        bio: result.data.bio,
      });
      await refreshProfile();
      setStatusMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Failed to update profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  const initialLetter = (
    profile?.display_name ||
    user.email ||
    "U"
  )[0].toUpperCase();

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Profile Header Card */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initialLetter}</Text>
        </View>
        <View style={styles.profileMeta}>
          <Text style={styles.profileName}>
            {profile?.display_name || "Traveler"}
          </Text>
          <Text style={styles.profileUsername}>
            @{profile?.username || user.user_metadata?.username || "traveler"}
          </Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <Text style={styles.profileJoined}>Member since {memberSince}</Text>
        </View>
      </View>

      {statusMessage && (
        <View
          style={[
            styles.statusAlert,
            statusMessage.type === "success"
              ? styles.successAlert
              : styles.errorAlert,
          ]}
        >
          <Text style={styles.statusAlertIcon}>
            {statusMessage.type === "success" ? "✅" : "⚠️"}
          </Text>
          <Text
            style={[
              styles.statusAlertText,
              statusMessage.type === "success"
                ? styles.successAlertText
                : styles.errorAlertText,
            ]}
          >
            {statusMessage.text}
          </Text>
        </View>
      )}

      {/* Edit Profile Form */}
      <View style={styles.formCard}>
        <Text style={styles.formSectionTitle}>Edit Profile Details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={[
              styles.input,
              fieldErrors.displayName ? styles.inputError : null,
            ]}
            value={displayName}
            onChangeText={(text) => {
              setDisplayName(text);
              if (fieldErrors.displayName) {
                setFieldErrors((prev) => ({ ...prev, displayName: undefined }));
              }
            }}
            editable={!isSaving}
          />
          {fieldErrors.displayName && (
            <Text style={styles.fieldErrorText}>{fieldErrors.displayName}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio / Notes</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              fieldErrors.bio ? styles.inputError : null,
            ]}
            value={bio}
            placeholder="Share your travel interests or preferred destinations and spots..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            onChangeText={(text) => {
              setBio(text);
              if (fieldErrors.bio) {
                setFieldErrors((prev) => ({ ...prev, bio: undefined }));
              }
            }}
            editable={!isSaving}
          />
          {fieldErrors.bio ? (
            <Text style={styles.fieldErrorText}>{fieldErrors.bio}</Text>
          ) : (
            <Text style={styles.helperText}>Max 300 characters</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, isSaving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.primaryButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>

      <TripsList />

      {/* Sign Out Button */}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
        activeOpacity={0.8}
      >
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyActions: {
    width: "100%",
    gap: 12,
  },
  profileHeaderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0284c7",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
  },
  profileMeta: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 2,
  },
  profileUsername: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0284c7",
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 4,
  },
  profileJoined: {
    fontSize: 12,
    color: "#94a3b8",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#0f172a",
  },
  textArea: {
    height: 96,
    paddingTop: 12,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  fieldErrorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
  },
  primaryButton: {
    height: 48,
    backgroundColor: "#0284c7",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    height: 48,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signOutButton: {
    height: 48,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  signOutButtonText: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "600",
  },
  statusAlert: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  successAlert: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  errorAlert: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  statusAlertIcon: {
    fontSize: 16,
  },
  statusAlertText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  successAlertText: {
    color: "#065f46",
  },
  errorAlertText: {
    color: "#991b1b",
  },
});
