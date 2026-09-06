import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  displayName: z
    .string()
    .trim()
    .min(2, { message: "Display name must be at least 2 characters" })
    .max(50, { message: "Display name must not exceed 50 characters" }),
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must not exceed 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const profileUpdateSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, { message: "Display name must be at least 2 characters" })
    .max(50, { message: "Display name must not exceed 50 characters" })
    .optional(),
  bio: z
    .string()
    .max(300, { message: "Bio must not exceed 300 characters" })
    .optional()
    .nullable(),
  avatarUrl: z
    .string()
    .url({ message: "Invalid avatar URL" })
    .optional()
    .nullable(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
