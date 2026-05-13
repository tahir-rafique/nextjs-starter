import { act, renderHook } from "@testing-library/react";

import { useDebounce } from "@/hooks/useDebounce";

jest.useFakeTimers();

describe("useDebounce", () => {
  afterEach(() => jest.clearAllTimers());

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 400));
    expect(result.current).toBe("hello");
  });

  it("does NOT update before the delay elapses", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 400),
      { initialProps: { value: "hello" } }
    );

    rerender({ value: "world" });
    jest.advanceTimersByTime(200);
    expect(result.current).toBe("hello");
  });

  it("updates after the delay elapses", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 400),
      { initialProps: { value: "hello" } }
    );

    rerender({ value: "world" });
    act(() => jest.advanceTimersByTime(400));
    expect(result.current).toBe("world");
  });

  it("resets timer when value changes rapidly", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 400),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "ab" });
    jest.advanceTimersByTime(200);
    rerender({ value: "abc" });
    jest.advanceTimersByTime(200);
    // Only 200ms since "abc", still debouncing
    expect(result.current).toBe("a");

    act(() => jest.advanceTimersByTime(200));
    expect(result.current).toBe("abc");
  });
});
