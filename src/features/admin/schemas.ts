import { z } from "zod";

export const adminTattooSchema = z.object({
  title: z.string().trim().min(1).max(120),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use kebab-case slug"),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  imagePath: z.string().trim().min(1).max(500),
  imageAlt: z.string().trim().max(200).optional().or(z.literal("")),
  source: z.string().trim().min(1).max(200),
  attribution: z.string().trim().min(1).max(500),
  license: z.string().trim().min(1).max(500),
  isDemo: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export const adminTaxonomySchema = z.object({
  table: z.enum(["categories", "styles", "placements", "tags"]),
  name: z.string().trim().min(1).max(80),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use kebab-case slug"),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});

export type AdminTattooInput = z.infer<typeof adminTattooSchema>;
