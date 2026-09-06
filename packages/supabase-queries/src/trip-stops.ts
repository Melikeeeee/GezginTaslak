import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TripStop, Place } from "@gezgin/types";
import type { AddStopInput } from "@gezgin/validation";

export async function addStopToTripDay(
  supabase: SupabaseClient<Database>,
  input: AddStopInput,
): Promise<TripStop> {
  // 1. Determine next position for this day
  const { data: existingStops, error: fetchError } = await supabase
    .from("trip_stops")
    .select("position")
    .eq("trip_day_id", input.tripDayId)
    .order("position", { ascending: false })
    .limit(1);

  if (fetchError) {
    throw new Error(`Failed to check existing stops: ${fetchError.message}`);
  }

  const existingList =
    (existingStops as unknown as { position: number }[]) ?? [];
  const nextPosition =
    existingList.length > 0 ? existingList[0].position + 1 : 0;

  const insertPayload: Database["public"]["Tables"]["trip_stops"]["Insert"] = {
    trip_day_id: input.tripDayId,
    place_id: input.placeId,
    start_time: input.startTime ?? null,
    duration_minutes: input.durationMinutes ?? null,
    position: nextPosition,
    notes: input.notes ?? null,
  };

  const { data: stop, error: insertError } = await supabase
    .from("trip_stops")
    .insert(insertPayload)
    .select("*, place:places(*)")
    .single();

  if (insertError || !stop) {
    throw new Error(`Failed to add stop: ${insertError?.message}`);
  }

  const rawStop = stop as unknown as TripStop & { place: Place };
  return {
    id: rawStop.id,
    trip_day_id: rawStop.trip_day_id,
    place_id: rawStop.place_id,
    start_time: rawStop.start_time,
    duration_minutes: rawStop.duration_minutes,
    position: rawStop.position,
    notes: rawStop.notes,
    created_at: rawStop.created_at,
    updated_at: rawStop.updated_at,
    place: rawStop.place as Place,
  };
}

export async function removeStopFromTripDay(
  supabase: SupabaseClient<Database>,
  stopId: string,
): Promise<void> {
  // First, find the stop to know its day
  const { data: stop, error: fetchError } = await supabase
    .from("trip_stops")
    .select("trip_day_id")
    .eq("id", stopId)
    .single();

  if (fetchError || !stop) {
    throw new Error(`Stop not found: ${fetchError?.message}`);
  }

  const tripDayId = (stop as { trip_day_id: string }).trip_day_id;

  // Delete the stop
  const { error: deleteError } = await supabase
    .from("trip_stops")
    .delete()
    .eq("id", stopId);

  if (deleteError) {
    throw new Error(`Failed to remove stop: ${deleteError.message}`);
  }

  // Re-index remaining stops for contiguous 0..N positions
  const { data: remainingStops } = await supabase
    .from("trip_stops")
    .select("id")
    .eq("trip_day_id", tripDayId)
    .order("position", { ascending: true });

  const stopList = (remainingStops as unknown as { id: string }[]) ?? [];
  if (stopList.length > 0) {
    await reorderTripDayStops(
      supabase,
      tripDayId,
      stopList.map((s) => s.id),
    );
  }
}

export async function reorderTripDayStops(
  supabase: SupabaseClient<Database>,
  tripDayId: string,
  stopIds: string[],
): Promise<void> {
  // Use temporary offset to avoid unique constraint collisions during batch update
  const offset = 10000;

  // Phase 1: Shift to high offset
  for (let i = 0; i < stopIds.length; i++) {
    const updateOffset: Database["public"]["Tables"]["trip_stops"]["Update"] = {
      position: offset + i,
    };

    const { error } = await supabase
      .from("trip_stops")
      .update(updateOffset)
      .eq("id", stopIds[i])
      .eq("trip_day_id", tripDayId);

    if (error) {
      throw new Error(`Failed to stage reordering: ${error.message}`);
    }
  }

  // Phase 2: Set final 0-indexed positions
  for (let i = 0; i < stopIds.length; i++) {
    const updateFinal: Database["public"]["Tables"]["trip_stops"]["Update"] = {
      position: i,
    };

    const { error } = await supabase
      .from("trip_stops")
      .update(updateFinal)
      .eq("id", stopIds[i])
      .eq("trip_day_id", tripDayId);

    if (error) {
      throw new Error(`Failed to finalize reordering: ${error.message}`);
    }
  }
}

export async function assignStopToTripDay(
  supabase: SupabaseClient<Database>,
  stopId: string,
  targetTripDayId: string,
  targetPosition?: number,
): Promise<void> {
  let position = targetPosition;

  if (position === undefined) {
    const { data: targetStops } = await supabase
      .from("trip_stops")
      .select("position")
      .eq("trip_day_id", targetTripDayId)
      .order("position", { ascending: false })
      .limit(1);

    const existingList =
      (targetStops as unknown as { position: number }[]) ?? [];
    position = existingList.length > 0 ? existingList[0].position + 1 : 0;
  }

  const updatePayload: Database["public"]["Tables"]["trip_stops"]["Update"] = {
    trip_day_id: targetTripDayId,
    position,
  };

  const { error } = await supabase
    .from("trip_stops")
    .update(updatePayload)
    .eq("id", stopId);

  if (error) {
    throw new Error(`Failed to move stop to new day: ${error.message}`);
  }
}
