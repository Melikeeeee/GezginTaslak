import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/context/auth-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0284c7",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "🧭 Gezgin",
          }}
        />
        <Stack.Screen
          name="(auth)/login"
          options={{
            title: "Sign In",
          }}
        />
        <Stack.Screen
          name="(auth)/register"
          options={{
            title: "Create Account",
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: "My Profile",
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
