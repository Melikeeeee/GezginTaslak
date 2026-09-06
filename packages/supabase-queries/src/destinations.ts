import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Destination } from "@gezgin/types";

export async function getDestinations(
  supabase: SupabaseClient<Database>,
): Promise<Destination[]> {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch destinations: ${error.message}`);
  }

  return data ?? [];
}

export async function getDestinationBySlug(
  supabase: SupabaseClient<Database>,
  slug: string,
): Promise<Destination | null> {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(
      `Failed to fetch destination by slug (${slug}): ${error.message}`,
    );
  }

  return data;
}
