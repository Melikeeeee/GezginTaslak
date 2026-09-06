import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  Trip,
  TripWithDays,
  Place,
  TripDay,
  TripStop,
} from "@gezgin/types";
import type { CreateTripInput, UpdateTripInput } from "@gezgin/validation";

export async function getTripsByUser(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<Trip[]> {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", userId)
    .order("start_date", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch trips: ${error.message}`);
  }

  return (data as Trip[]) ?? [];
}

export async function getTripWithDetails(
  supabase: SupabaseClient<Database>,
  tripId: string,
): Promise<TripWithDays | null> {
  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  if (tripError) {
    if (tripError.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch trip (${tripId}): ${tripError.message}`);
  }

  const { data: days, error: daysError } = await supabase
    .from("trip_days")
    .select("*")
    .eq("trip_id", tripId)
    .order("trip_date", { ascending: true });

  if (daysError) {
    throw new Error(`Failed to fetch trip days: ${daysError.message}`);
  }

  const dayList = (days as TripDay[]) ?? [];
  const dayIds = dayList.map((d) => d.id);
  let stopsByDayId: Record<string, (TripStop & { place: Place })[]> = {};

  if (dayIds.length > 0) {
    const { data: stops, error: stopsError } = await supabase
      .from("trip_stops")
      .select("*, place:places(*)")
      .in("trip_day_id", dayIds)
      .order("position", { ascending: true });

    if (stopsError) {
      throw new Error(`Failed to fetch trip stops: ${stopsError.message}`);
    }

    stopsByDayId = (
      (stops as unknown as (TripStop & { place: Place })[]) ?? []
    ).reduce(
      (acc, stop) => {
        if (!acc[stop.trip_day_id]) {
          acc[stop.trip_day_id] = [];
        }
        acc[stop.trip_day_id].push({
          id: stop.id,
          trip_day_id: stop.trip_day_id,
          place_id: stop.place_id,
          start_time: stop.start_time,
          duration_minutes: stop.duration_minutes,
          position: stop.position,
          notes: stop.notes,
          created_at: stop.created_at,
          updated_at: stop.updated_at,
          place: stop.place as Place,
        });
        return acc;
      },
      {} as Record<string, (TripStop & { place: Place })[]>,
    );
  }

  return {
    ...(trip as Trip),
    days: dayList.map((day) => ({
      ...day,
      stops: stopsByDayId[day.id] || [],
    })),
  };
}

function getDatesBetween(startDateStr: string, endDateStr: string): string[] {
  const dates: string[] = [];
  const curr = new Date(startDateStr);
  const end = new Date(endDateStr);

  while (curr <= end) {
    dates.push(curr.toISOString().split("T")[0]);
    curr.setDate(curr.getDate() + 1);
  }

  return dates;
}

export async function createTrip(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: CreateTripInput,
): Promise<Trip> {
  const tripInsertPayload: Database["public"]["Tables"]["trips"]["Insert"] = {
    user_id: userId,
    destination_id: input.destinationId,
    title: input.title,
    trip_type: input.tripType,
    start_date: input.startDate,
    end_date: input.endDate,
    start_time: input.startTime ?? null,
    end_time: input.endTime ?? null,
    pace: input.pace,
    budget_level: input.budgetLevel,
    transport_mode: input.transportMode ?? null,
    notes: input.notes ?? null,
  };

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .insert(tripInsertPayload)
    .select()
    .single();

  if (tripError || !trip) {
    throw new Error(`Failed to create trip: ${tripError?.message}`);
  }

  // Create initial trip days
  const dateStrings =
    input.tripType === "day_trip"
      ? [input.startDate]
      : getDatesBetween(input.startDate, input.endDate);

  const daysToInsert: Database["public"]["Tables"]["trip_days"]["Insert"][] =
    dateStrings.map((date) => ({
      trip_id: trip.id,
      trip_date: date,
    }));

  const { error: daysError } = await supabase
    .from("trip_days")
    .insert(daysToInsert);

  if (daysError) {
    throw new Error(`Failed to initialize trip days: ${daysError.message}`);
  }

  return trip as Trip;
}

export async function updateTrip(
  supabase: SupabaseClient<Database>,
  tripId: string,
  input: UpdateTripInput,
): Promise<Trip> {
  const updatePayload: Database["public"]["Tables"]["trips"]["Update"] = {};

  if (input.title !== undefined) updatePayload.title = input.title;
  if (input.pace !== undefined) updatePayload.pace = input.pace;
  if (input.budgetLevel !== undefined)
    updatePayload.budget_level = input.budgetLevel;
  if (input.transportMode !== undefined)
    updatePayload.transport_mode = input.transportMode;
  if (input.notes !== undefined) updatePayload.notes = input.notes;
  if (input.startTime !== undefined) updatePayload.start_time = input.startTime;
  if (input.endTime !== undefined) updatePayload.end_time = input.endTime;

  const { data, error } = await supabase
    .from("trips")
    .update(updatePayload)
    .eq("id", tripId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update trip (${tripId}): ${error.message}`);
  }

  return data as Trip;
}

export async function deleteTrip(
  supabase: SupabaseClient<Database>,
  tripId: string,
): Promise<void> {
  const { error } = await supabase.from("trips").delete().eq("id", tripId);

  if (error) {
    throw new Error(`Failed to delete trip (${tripId}): ${error.message}`);
  }
}
