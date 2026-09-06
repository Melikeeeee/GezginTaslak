import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Profile } from "@gezgin/types";
import type { ProfileUpdateInput } from "@gezgin/validation";

export async function getProfileById(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch profile (${userId}): ${error.message}`);
  }

  return data as Profile;
}

export async function updateProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: ProfileUpdateInput,
): Promise<Profile> {
  const updatePayload: Database["public"]["Tables"]["profiles"]["Update"] = {};

  if (input.displayName !== undefined)
    updatePayload.display_name = input.displayName;
  if (input.bio !== undefined) updatePayload.bio = input.bio;
  if (input.avatarUrl !== undefined) updatePayload.avatar_url = input.avatarUrl;

  const { data, error } = await supabase
    .from("profiles")
    .update(updatePayload)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile (${userId}): ${error.message}`);
  }

  return data as Profile;
}
