import { z } from "zod";

export const tripTypes = ["day_trip", "multi_day"] as const;
export const tripPaces = ["relaxed", "balanced", "intense"] as const;
export const tripBudgets = ["low", "medium", "high"] as const;

export const tripBaseSchema = z.object({
  destinationId: z.string().uuid({ message: "Valid destination is required" }),
  title: z
    .string()
    .trim()
    .min(2, { message: "Title must be at least 2 characters" })
    .max(100, { message: "Title must not exceed 100 characters" }),
  tripType: z.enum(tripTypes),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Invalid start date format (YYYY-MM-DD)",
  }),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Invalid end date format (YYYY-MM-DD)",
  }),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
      message: "Invalid start time (HH:MM)",
    })
    .optional()
    .nullable(),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, { message: "Invalid end time (HH:MM)" })
    .optional()
    .nullable(),
  pace: z.enum(tripPaces).default("balanced"),
  budgetLevel: z.enum(tripBudgets).default("medium"),
  transportMode: z.string().trim().max(50).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const createTripSchema = tripBaseSchema
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      if (data.tripType === "day_trip") {
        return data.startDate === data.endDate;
      }
      return true;
    },
    {
      message: "Day trips must start and end on the same date",
      path: ["endDate"],
    },
  );

export type CreateTripInput = z.infer<typeof createTripSchema>;

export const updateTripSchema = tripBaseSchema.partial();
export type UpdateTripInput = z.infer<typeof updateTripSchema>;

export const addStopSchema = z.object({
  tripDayId: z.string().uuid({ message: "Valid trip day ID required" }),
  placeId: z.string().uuid({ message: "Valid place ID required" }),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .optional()
    .nullable(),
  durationMinutes: z.number().int().positive().max(1440).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export type AddStopInput = z.infer<typeof addStopSchema>;

export const reorderStopsSchema = z.object({
  tripDayId: z.string().uuid(),
  stopIds: z
    .array(z.string().uuid())
    .min(1, { message: "At least one stop ID is required" }),
});

export type ReorderStopsInput = z.infer<typeof reorderStopsSchema>;
