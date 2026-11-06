import { z } from "zod";

export const collectionVisibilitySchema = z.enum(["private", "public"]);

export const createCollectionSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  visibility: collectionVisibilitySchema.default("private"),
});

export const updateCollectionSchema = createCollectionSchema.extend({
  id: z.string().uuid(),
});

export const collectionItemSchema = z
  .object({
    collectionId: z.string().uuid(),
    tattooId: z.string().uuid().optional(),
    aiGenerationId: z.string().uuid().optional(),
    notes: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .refine(
    (value) =>
      Boolean(value.tattooId) !== Boolean(value.aiGenerationId),
    { message: "Provide exactly one of tattooId or aiGenerationId." },
  );
