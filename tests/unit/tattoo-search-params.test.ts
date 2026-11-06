import { describe, expect, it } from "vitest";
import { parseTattooSearchParams } from "@/features/tattoos/schemas";

describe("parseTattooSearchParams", () => {
  it("applies defaults and trims empty filters", () => {
    const parsed = parseTattooSearchParams({
      q: "  moon  ",
      category: "",
      page: "2",
    });

    expect(parsed).toMatchObject({
      q: "moon",
      category: undefined,
      page: 2,
      pageSize: 12,
    });
  });

  it("falls back safely for invalid page values", () => {
    const parsed = parseTattooSearchParams({ page: "nope", pageSize: "999" });
    expect(parsed.page).toBe(1);
    expect(parsed.pageSize).toBe(12);
  });
});
