import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Place, PlaceFilter } from "@gezgin/types";

export async function getPlacesByDestination(
  supabase: SupabaseClient<Database>,
  destinationId: string,
  filter?: PlaceFilter,
): Promise<Place[]> {
  let query = supabase
    .from("places")
    .select("*")
    .eq("destination_id", destinationId)
    .eq("is_active", true);

  if (filter?.category) {
    query = query.eq("category", filter.category);
  }

  if (filter?.search) {
    query = query.ilike("name", `%${filter.search}%`);
  }

  query = query.order("rating", { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch places: ${error.message}`);
  }

  return (data as Place[]) ?? [];
}

export async function getPlaceBySlug(
  supabase: SupabaseClient<Database>,
  destinationId: string,
  slug: string,
): Promise<Place | null> {
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("destination_id", destinationId)
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(
      `Failed to fetch place by slug (${slug}): ${error.message}`,
    );
  }

  return data as Place;
}

export async function getPlaceById(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<Place | null> {
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch place by ID (${id}): ${error.message}`);
  }

  return data as Place;
}

export async function getAllActivePlaces(
  supabase: SupabaseClient<Database>,
  filter?: PlaceFilter,
): Promise<Place[]> {
  let query = supabase.from("places").select("*").eq("is_active", true);

  if (filter?.category) {
    query = query.eq("category", filter.category);
  }

  if (filter?.search) {
    query = query.ilike("name", `%${filter.search}%`);
  }

  query = query.order("rating", { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch all places: ${error.message}`);
  }

  return (data as Place[]) ?? [];
}

export async function getPlaceBySlugOnly(
  supabase: SupabaseClient<Database>,
  slug: string,
): Promise<Place | null> {
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch place by slug (${slug}): ${error.message}`);
  }

  return data as Place;
}
