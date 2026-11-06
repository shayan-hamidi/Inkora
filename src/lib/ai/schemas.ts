import { z } from "zod";

export const tattooConceptPayloadSchema = z.object({
  title: z.string().trim().min(1).max(120),
  concept: z.string().trim().min(1).max(4000),
  symbolism: z.string().trim().min(1).max(4000),
  visualPrompt: z.string().trim().min(1).max(2000),
  suggestedStyles: z.array(z.string().trim().min(1).max(60)).max(8).default([]),
  suggestedPlacements: z
    .array(z.string().trim().min(1).max(60))
    .max(8)
    .default([]),
});

export const generateConceptRequestSchema = z.object({
  prompt: z.string().trim().min(8).max(2000),
  kind: z
    .enum(["concept", "refine", "symbolism", "visual_prompt"])
    .default("concept"),
  parentId: z.string().uuid().optional(),
});

export type GenerateConceptRequest = z.infer<
  typeof generateConceptRequestSchema
>;
