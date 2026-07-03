import { z } from "zod";

// ─── Create / Update Schema ────────────────────────────────────────────────────

export const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .trim(),

  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters")
    .trim(),

  category: z
    .string()
    .min(1, "Please select a category"),

  tags: z
    .string()
    .trim()
    .optional()
    .default(""),

  tools: z
    .string()
    .trim()
    .optional()
    .default(""),

  client: z
    .string()
    .trim()
    .optional()
    .default(""),

  featured: z.boolean().default(false),

  published: z.boolean().default(false),
});

export type ProjectFormSchema = z.infer<typeof projectSchema>;

// ─── Filter Schema ─────────────────────────────────────────────────────────────

export const projectFilterSchema = z.object({
  category: z.string().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type ProjectFilterSchema = z.infer<typeof projectFilterSchema>;