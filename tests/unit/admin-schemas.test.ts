import { describe, expect, it } from "vitest";
import { adminTattooSchema } from "@/features/admin/schemas";

describe("adminTattooSchema", () => {
  it("requires license attribution and source", () => {
    const parsed = adminTattooSchema.safeParse({
      title: "Test",
      slug: "test",
      imagePath: "/demo/tattoos/minimal-moon.svg",
      source: "",
      attribution: "",
      license: "",
    });
    expect(parsed.success).toBe(false);
  });

  it("accepts a fully attributed tattoo", () => {
    const parsed = adminTattooSchema.parse({
      title: "Test Moon",
      slug: "test-moon",
      imagePath: "/demo/tattoos/minimal-moon.svg",
      source: "INKORA demo",
      attribution: "Synthetic demo artwork",
      license: "Demo only",
      isDemo: true,
      isPublished: false,
      isFeatured: false,
    });
    expect(parsed.license).toBe("Demo only");
  });
});
