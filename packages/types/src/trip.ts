import { Place } from "./place";

export type TripType = "day_trip" | "multi_day";
export type TripPace = "relaxed" | "balanced" | "intense";
export type TripBudget = "low" | "medium" | "high";

export interface Trip {
  id: string;
  user_id: string;
  destination_id: string;
  title: string;
  trip_type: TripType;
  start_date: string;
  end_date: string;
  start_time: string | null;
  end_time: string | null;
  pace: TripPace;
  budget_level: TripBudget;
  transport_mode: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TripDay {
  id: string;
  trip_id: string;
  trip_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  stops?: TripStop[];
}

export interface TripStop {
  id: string;
  trip_day_id: string;
  place_id: string;
  start_time: string | null;
  duration_minutes: number | null;
  position: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  place?: Place;
}

export interface TripWithDays extends Trip {
  days: (TripDay & {
    stops: (TripStop & {
      place: Place;
    })[];
  })[];
}
