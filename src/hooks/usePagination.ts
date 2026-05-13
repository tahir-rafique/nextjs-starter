import { useCallback, useState } from "react";

interface UsePaginationOptions {
  initialPage?:  number;
  initialLimit?: number;
}

interface UsePaginationReturn {
  page:      number;
  limit:     number;
  setPage:   (page: number) => void;
  setLimit:  (limit: number) => void;
  nextPage:  () => void;
  prevPage:  () => void;
  resetPage: () => void;
}

/**
 * Manages pagination state (page index + page size).
 * Resets to page 1 automatically when limit changes.
 */
export function usePagination({
  initialPage  = 1,
  initialLimit = 10,
}: UsePaginationOptions = {}): UsePaginationReturn {
  const [page,  setPageState]  = useState(initialPage);
  const [limit, setLimitState] = useState(initialLimit);

  const setPage  = useCallback((p: number) => setPageState(Math.max(1, p)), []);
  const setLimit = useCallback((l: number) => { setLimitState(l); setPageState(1); }, []);
  const nextPage = useCallback(() => setPageState((p) => p + 1), []);
  const prevPage = useCallback(() => setPageState((p) => Math.max(1, p - 1)), []);
  const resetPage = useCallback(() => setPageState(1), []);

  return { page, limit, setPage, setLimit, nextPage, prevPage, resetPage };
}

export default usePagination;
