import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/slugify";

describe("slugify", () => {
  it("creates kebab-case slugs", () => {
    expect(slugify("First Tattoo Board")).toBe("first-tattoo-board");
  });

  it("strips invalid characters and trims dashes", () => {
    expect(slugify("  Hello!!! World??  ")).toBe("hello-world");
  });
});
