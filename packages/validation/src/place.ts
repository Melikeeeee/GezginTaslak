import { z } from "zod";

export const placeCategories = [
  "historical",
  "museum",
  "restaurant",
  "cafe",
  "nature",
  "shopping",
  "activity",
  "viewpoint",
  "culture",
] as const;

export const placeCategorySchema = z.enum(placeCategories);

export const placeFilterSchema = z.object({
  category: placeCategorySchema.optional(),
  search: z.string().trim().optional(),
});

export type PlaceFilterInput = z.infer<typeof placeFilterSchema>;
