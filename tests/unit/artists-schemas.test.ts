import { describe, expect, it } from "vitest";
import { consultationRequestSchema } from "@/features/artists/schemas";

describe("consultationRequestSchema", () => {
  it("rejects short messages", () => {
    expect(
      consultationRequestSchema.safeParse({
        artistId: "66666666-6666-4666-8666-666666666601",
        requesterName: "Casey",
        requesterEmail: "casey@example.com",
        message: "Hi",
      }).success,
    ).toBe(false);
  });

  it("accepts a valid store-only consultation", () => {
    const parsed = consultationRequestSchema.parse({
      artistId: "66666666-6666-4666-8666-666666666601",
      requesterName: "Casey",
      requesterEmail: "casey@example.com",
      message: "Looking for a quiet first tattoo on the forearm.",
      preferredPlacement: "Forearm",
    });
    expect(parsed.requesterEmail).toBe("casey@example.com");
  });
});
