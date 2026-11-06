export type PaginationInput = {
  page: number;
  pageSize: number;
};

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export function normalizePage(page: number, fallback = 1): number {
  if (!Number.isFinite(page) || page < 1) {
    return fallback;
  }

  return Math.floor(page);
}

export function normalizePageSize(
  pageSize: number,
  { min = 1, max = 48, fallback = 12 } = {},
): number {
  if (!Number.isFinite(pageSize)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.floor(pageSize)));
}

export function getPaginationRange(page: number, pageSize: number) {
  const safePage = normalizePage(page);
  const safePageSize = normalizePageSize(pageSize);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  return { from, to, page: safePage, pageSize: safePageSize };
}

export function createPaginatedResult<T>(
  items: T[],
  totalCount: number,
  page: number,
  pageSize: number,
): PaginatedResult<T> {
  const safePage = normalizePage(page);
  const safePageSize = normalizePageSize(pageSize);
  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));

  return {
    items,
    page: safePage,
    pageSize: safePageSize,
    totalCount,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };
}
