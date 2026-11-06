import { describe, expect, it } from "vitest";
import {
  createPaginatedResult,
  getPaginationRange,
  normalizePage,
  normalizePageSize,
} from "@/lib/pagination";

describe("pagination", () => {
  it("normalizes invalid pages and page sizes", () => {
    expect(normalizePage(0)).toBe(1);
    expect(normalizePage(2.8)).toBe(2);
    expect(normalizePageSize(100)).toBe(48);
    expect(normalizePageSize(0)).toBe(1);
  });

  it("computes inclusive ranges", () => {
    expect(getPaginationRange(1, 12)).toEqual({
      from: 0,
      to: 11,
      page: 1,
      pageSize: 12,
    });
    expect(getPaginationRange(2, 12)).toEqual({
      from: 12,
      to: 23,
      page: 2,
      pageSize: 12,
    });
  });

  it("builds paginated metadata", () => {
    const result = createPaginatedResult(["a", "b"], 25, 2, 12);
    expect(result.totalPages).toBe(3);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(true);
  });
});
