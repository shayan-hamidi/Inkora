import { z } from "zod";

export const tattooSearchParamsSchema = z.object({
  q: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((value) => value || undefined),
  category: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => value || undefined),
  style: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => value || undefined),
  placement: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => value || undefined),
  tag: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => value || undefined),
  page: z.coerce.number().int().min(1).catch(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).catch(12).default(12),
});

export type TattooSearchParams = z.infer<typeof tattooSearchParamsSchema>;

export function parseTattooSearchParams(
  input: Record<string, string | string[] | undefined>,
): TattooSearchParams {
  const normalized = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  );

  return tattooSearchParamsSchema.parse(normalized);
}
