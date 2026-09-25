import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { registerSchema } from "@gezgin/validation";
import { useAuth } from "@/context/auth-context";

export default function MobileRegisterScreen() {
  const router = useRouter();
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

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  const handleRegister = async () => {
    setGeneralError(null);
    setFieldErrors({});
    setSuccessMessage(null);

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
        "Account successfully created! You are now logged in.",
      );
      setTimeout(() => {
        router.replace("/");
      }, 1000);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.icon}>🧭</Text>
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>
            Join Gezgin to build, customize, and save your travel plans.
          </Text>
        </View>

        {generalError && (
          <View style={styles.errorAlert}>
            <Text style={styles.errorAlertIcon}>⚠️</Text>
            <Text style={styles.errorAlertText}>{generalError}</Text>
          </View>
        )}

        {successMessage && (
          <View style={styles.successAlert}>
            <Text style={styles.successAlertIcon}>✅</Text>
            <Text style={styles.successAlertText}>{successMessage}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={[
                styles.input,
                fieldErrors.displayName ? styles.inputError : null,
              ]}
              placeholder="e.g. Leyla Yilmaz"
              placeholderTextColor="#94a3b8"
              value={displayName}
              onChangeText={(text) => {
                setDisplayName(text);
                if (fieldErrors.displayName) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    displayName: undefined,
                  }));
                }
              }}
              autoCapitalize="words"
              editable={!isSubmitting}
            />
            {fieldErrors.displayName && (
              <Text style={styles.fieldErrorText}>
                {fieldErrors.displayName}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[
                styles.input,
                fieldErrors.username ? styles.inputError : null,
              ]}
              placeholder="e.g. leyla_travels"
              placeholderTextColor="#94a3b8"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (fieldErrors.username) {
                  setFieldErrors((prev) => ({ ...prev, username: undefined }));
                }
              }}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />
            {fieldErrors.username ? (
              <Text style={styles.fieldErrorText}>{fieldErrors.username}</Text>
            ) : (
              <Text style={styles.helperText}>
                Letters, numbers, and underscores only
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[
                styles.input,
                fieldErrors.email ? styles.inputError : null,
              ]}
              placeholder="you@example.com"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />
            {fieldErrors.email && (
              <Text style={styles.fieldErrorText}>{fieldErrors.email}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[
                styles.input,
                fieldErrors.password ? styles.inputError : null,
              ]}
              placeholder="At least 6 characters"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              secureTextEntry
              autoCapitalize="none"
              editable={!isSubmitting}
            />
            {fieldErrors.password && (
              <Text style={styles.fieldErrorText}>{fieldErrors.password}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.primaryButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            disabled={isSubmitting}
          >
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    fontSize: 44,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  errorAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorAlertIcon: {
    fontSize: 16,
  },
  errorAlertText: {
    color: "#991b1b",
    fontSize: 14,
    flex: 1,
    fontWeight: "500",
  },
  successAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  successAlertIcon: {
    fontSize: 16,
  },
  successAlertText: {
    color: "#065f46",
    fontSize: 14,
    flex: 1,
    fontWeight: "500",
  },
  form: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
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
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fffbfa",
  },
  fieldErrorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
    fontWeight: "500",
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
    marginTop: 8,
    shadowColor: "#0284c7",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#64748b",
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0284c7",
  },
});
