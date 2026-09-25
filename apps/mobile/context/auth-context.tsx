import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { User, Session, SupabaseClient } from "@supabase/supabase-js";
import { getMobileSupabaseClient } from "@gezgin/supabase-mobile";
import { getProfileById } from "@gezgin/supabase-queries";
import type { Database, Profile } from "@gezgin/types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
    username: string,
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  supabase: SupabaseClient<Database> | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabaseClient, setSupabaseClient] =
    useState<SupabaseClient<Database> | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize Mobile Supabase client safely
  useEffect(() => {
    try {
      const client = getMobileSupabaseClient();
      setSupabaseClient(client);
    } catch (err) {
      console.warn(
        "Supabase credentials not configured in mobile environment.",
        err,
      );
      setIsLoading(false);
    }
  }, []);

  const loadProfile = useCallback(
    async (client: SupabaseClient<Database>, userId: string) => {
      try {
        const userProfile = await getProfileById(client, userId);
        setProfile(userProfile);
      } catch (err) {
        console.error("Failed to load user profile in mobile app:", err);
      }
    },
    [],
  );

  const refreshProfile = useCallback(async () => {
    if (supabaseClient && user?.id) {
      await loadProfile(supabaseClient, user.id);
    }
  }, [supabaseClient, user?.id, loadProfile]);

  useEffect(() => {
    if (!supabaseClient) return;

    let mounted = true;

    // Get current session from AsyncStorage
    supabaseClient.auth
      .getSession()
      .then(async ({ data: { session: initialSession } }) => {
        if (!mounted) return;
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        if (initialSession?.user) {
          await loadProfile(supabaseClient, initialSession.user.id);
        }
      })
      .catch((err) => {
        console.error("Error getting mobile session:", err);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await loadProfile(supabaseClient, newSession.user.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabaseClient, loadProfile]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      if (!supabaseClient) {
        return {
          error: "Supabase client is not configured. Check environment variables.",
        };
      }
      setIsLoading(true);
      try {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          return { error: error.message };
        }
        return {};
      } catch (err) {
        return {
          error:
            err instanceof Error ? err.message : "An unexpected error occurred",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [supabaseClient],
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
      username: string,
    ): Promise<{ error?: string }> => {
      if (!supabaseClient) {
        return {
          error: "Supabase client is not configured. Check environment variables.",
        };
      }
      setIsLoading(true);
      try {
        const { error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
              username: username,
            },
          },
        });
        if (error) {
          return { error: error.message };
        }
        return {};
      } catch (err) {
        return {
          error:
            err instanceof Error ? err.message : "An unexpected error occurred",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [supabaseClient],
  );

  const signOut = useCallback(async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  }, [supabaseClient]);

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      isLoading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      supabase: supabaseClient,
    }),
    [
      user,
      session,
      profile,
      isLoading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      supabaseClient,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
