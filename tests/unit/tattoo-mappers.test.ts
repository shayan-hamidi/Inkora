import { describe, expect, it } from "vitest";
import {
  mapTattooCard,
  mapTattooDetail,
} from "@/features/tattoos/server/mappers";

const row = {
  id: "55555555-5555-4555-8555-555555555504",
  title: "Quiet Moon",
  slug: "quiet-moon",
  description: "A quiet crescent.",
  image_path: "/demo/tattoos/minimal-moon.svg",
  image_alt: "Moon",
  image_width: 800,
  image_height: 1000,
  is_demo: true,
  is_featured: true,
  source: "INKORA demo assets",
  attribution: "Synthetic",
  license: "Demo content",
  created_at: "2026-11-06T00:00:00.000Z",
  categories: { id: "1", name: "Nature", slug: "nature" },
  tattoo_styles: [{ styles: { id: "2", name: "Minimal", slug: "minimal" } }],
  tattoo_placements: [
    { placements: { id: "3", name: "Ribs", slug: "ribs" } },
  ],
  tattoo_tags: [{ tags: { id: "4", name: "Moon", slug: "moon" } }],
};

describe("tattoo mappers", () => {
  it("maps card fields and nested taxonomies", () => {
    const card = mapTattooCard(row);
    expect(card.title).toBe("Quiet Moon");
    expect(card.imagePath).toBe("/demo/tattoos/minimal-moon.svg");
    expect(card.category?.slug).toBe("nature");
    expect(card.styles[0]?.slug).toBe("minimal");
    expect(card.placements[0]?.slug).toBe("ribs");
    expect(card.tags[0]?.slug).toBe("moon");
  });

  it("maps detail licensing fields", () => {
    const detail = mapTattooDetail(row);
    expect(detail.license).toBe("Demo content");
    expect(detail.source).toBe("INKORA demo assets");
    expect(detail.createdAt).toBe("2026-11-06T00:00:00.000Z");
  });
});
