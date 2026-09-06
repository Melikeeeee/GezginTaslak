import type { PlaceCategory } from "./place";
import type { TripType, TripPace, TripBudget } from "./trip";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      destinations: {
        Row: {
          id: string;
          name: string;
          country: string;
          slug: string;
          description: string;
          latitude: number;
          longitude: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          country: string;
          slug: string;
          description: string;
          latitude: number;
          longitude: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          country?: string;
          slug?: string;
          description?: string;
          latitude?: number;
          longitude?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      places: {
        Row: {
          id: string;
          destination_id: string;
          name: string;
          slug: string;
          category: PlaceCategory;
          description: string;
          address: string;
          latitude: number;
          longitude: number;
          opening_hours: string;
          price_level: number;
          rating: number;
          image_url: string;
          estimated_visit_minutes: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          destination_id: string;
          name: string;
          slug: string;
          category: PlaceCategory;
          description: string;
          address: string;
          latitude: number;
          longitude: number;
          opening_hours: string;
          price_level: number;
          rating: number;
          image_url: string;
          estimated_visit_minutes: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          destination_id?: string;
          name?: string;
          slug?: string;
          category?: PlaceCategory;
          description?: string;
          address?: string;
          latitude?: number;
          longitude?: number;
          opening_hours?: string;
          price_level?: number;
          rating?: number;
          image_url?: string;
          estimated_visit_minutes?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "places_destination_id_fkey";
            columns: ["destination_id"];
            isOneToOne: false;
            referencedRelation: "destinations";
            referencedColumns: ["id"];
          },
        ];
      };
      trips: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          destination_id: string;
          title: string;
          trip_type?: TripType;
          start_date: string;
          end_date: string;
          start_time?: string | null;
          end_time?: string | null;
          pace?: TripPace;
          budget_level?: TripBudget;
          transport_mode?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          destination_id?: string;
          title?: string;
          trip_type?: TripType;
          start_date?: string;
          end_date?: string;
          start_time?: string | null;
          end_time?: string | null;
          pace?: TripPace;
          budget_level?: TripBudget;
          transport_mode?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trips_destination_id_fkey";
            columns: ["destination_id"];
            isOneToOne: false;
            referencedRelation: "destinations";
            referencedColumns: ["id"];
          },
        ];
      };
      trip_days: {
        Row: {
          id: string;
          trip_id: string;
          trip_date: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          trip_date: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          trip_date?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trip_days_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      trip_stops: {
        Row: {
          id: string;
          trip_day_id: string;
          place_id: string;
          start_time: string | null;
          duration_minutes: number | null;
          position: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_day_id: string;
          place_id: string;
          start_time?: string | null;
          duration_minutes?: number | null;
          position: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trip_day_id?: string;
          place_id?: string;
          start_time?: string | null;
          duration_minutes?: number | null;
          position?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trip_stops_place_id_fkey";
            columns: ["place_id"];
            isOneToOne: false;
            referencedRelation: "places";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trip_stops_trip_day_id_fkey";
            columns: ["trip_day_id"];
            isOneToOne: false;
            referencedRelation: "trip_days";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      place_category: PlaceCategory;
      trip_type: TripType;
      trip_pace: TripPace;
      trip_budget: TripBudget;
    };
    CompositeTypes: Record<string, never>;
  };
}
