import { act, renderHook } from "@testing-library/react";

import { usePagination } from "@/hooks/usePagination";

describe("usePagination", () => {
  it("starts with defaults", () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(10);
  });

  it("respects custom initial values", () => {
    const { result } = renderHook(() =>
      usePagination({ initialPage: 3, initialLimit: 25 })
    );
    expect(result.current.page).toBe(3);
    expect(result.current.limit).toBe(25);
  });

  it("increments page with nextPage", () => {
    const { result } = renderHook(() => usePagination());
    act(() => result.current.nextPage());
    expect(result.current.page).toBe(2);
  });

  it("never decrements page below 1", () => {
    const { result } = renderHook(() => usePagination());
    act(() => result.current.prevPage());
    expect(result.current.page).toBe(1);
  });

  it("resets page to 1 when limit changes", () => {
    const { result } = renderHook(() => usePagination({ initialPage: 5 }));
    act(() => result.current.setLimit(20));
    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(20);
  });

  it("resetPage returns to 1", () => {
    const { result } = renderHook(() => usePagination({ initialPage: 4 }));
    act(() => result.current.resetPage());
    expect(result.current.page).toBe(1);
  });
});
