export type PlaceCategory =
  | "historical"
  | "museum"
  | "restaurant"
  | "cafe"
  | "nature"
  | "shopping"
  | "activity"
  | "viewpoint"
  | "culture";

export type PriceLevel = 1 | 2 | 3 | 4;

export interface Place {
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
  price_level: PriceLevel;
  rating: number;
  image_url: string;
  estimated_visit_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlaceFilter {
  category?: PlaceCategory;
  search?: string;
}
