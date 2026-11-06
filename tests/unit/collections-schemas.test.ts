import { describe, expect, it } from "vitest";
import {
  collectionItemSchema,
  createCollectionSchema,
} from "@/features/collections/schemas";

describe("collection schemas", () => {
  it("accepts a private collection create payload", () => {
    const parsed = createCollectionSchema.parse({
      name: "Quiet ideas",
      description: "",
      visibility: "private",
    });
    expect(parsed.visibility).toBe("private");
  });

  it("requires exactly one item target", () => {
    expect(
      collectionItemSchema.safeParse({
        collectionId: "11111111-1111-4111-8111-111111111101",
      }).success,
    ).toBe(false);

    expect(
      collectionItemSchema.safeParse({
        collectionId: "11111111-1111-4111-8111-111111111101",
        tattooId: "55555555-5555-4555-8555-555555555504",
      }).success,
    ).toBe(true);
  });
});
