/** @vitest-environment node */
import { describe, expect, it } from "vitest";
import {
  getTattooBySlug,
  listPublishedTattoos,
  listStyles,
} from "@/features/tattoos/server/queries";

const hasLocalSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

describe.skipIf(!hasLocalSupabase)("tattoo query modules", () => {
  it("lists published tattoos with pagination", async () => {
    const result = await listPublishedTattoos({ page: 1, pageSize: 3 });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.length).toBeLessThanOrEqual(3);
    expect(result.totalCount).toBeGreaterThanOrEqual(result.items.length);
  });

  it("filters by style slug", async () => {
    const result = await listPublishedTattoos({ style: "fine-line" });
    expect(result.items.length).toBeGreaterThan(0);
    expect(
      result.items.every((item) =>
        item.styles.some((style) => style.slug === "fine-line"),
      ),
    ).toBe(true);
  });

  it("loads a tattoo by slug and returns null for missing", async () => {
    const tattoo = await getTattooBySlug("quiet-moon");
    expect(tattoo?.title).toBe("Quiet Moon");
    expect(await getTattooBySlug("does-not-exist")).toBeNull();
  });

  it("lists taxonomy styles", async () => {
    const styles = await listStyles();
    expect(styles.some((style) => style.slug === "minimal")).toBe(true);
  });
});
