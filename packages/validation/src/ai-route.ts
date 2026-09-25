import { z } from "zod";

export const aiRoutePlanSchema = z.object({
  destination: z.string().trim().min(2).default("Istanbul"),
  categories: z
    .array(z.string())
    .min(1, { message: "At least one category is required" })
    .default(["historical", "restaurant", "nature"]),
  pace: z.enum(["relaxed", "balanced", "intense"]).default("balanced"),
  budget: z.enum(["low", "medium", "high"]).default("medium"),
  daysCount: z.number().int().min(1).max(7).default(1),
  guestCount: z.number().int().min(1).max(20).default(2),
});

export type AiRoutePlanInput = z.infer<typeof aiRoutePlanSchema>;

export interface GeneratedStop {
  id?: string;
  name: string;
  category: string;
  description: string;
  timeSlot: string;
  durationMinutes: number;
  tip?: string;
  estimatedCost?: string;
}

export interface GeneratedDay {
  dayNumber: number;
  title: string;
  summary: string;
  stops: GeneratedStop[];
}

export interface GeneratedItinerary {
  id: string;
  title: string;
  destination: string;
  summary: string;
  pace: "relaxed" | "balanced" | "intense";
  budget: "low" | "medium" | "high";
  totalDurationHours: number;
  days: GeneratedDay[];
  createdAt: string;
}
