import { z } from "zod";

export const consultationRequestSchema = z.object({
  artistId: z.string().uuid(),
  requesterName: z.string().trim().min(1).max(80),
  requesterEmail: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(2000),
  preferredPlacement: z.string().trim().max(80).optional().or(z.literal("")),
});
