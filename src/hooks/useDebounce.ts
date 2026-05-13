import { useEffect, useState } from "react";

/**
 * Debounces a value — only returns the latest value after `delay` ms of no changes.
 * Great for search inputs to avoid spamming API calls.
 *
 * @param value  The value to debounce
 * @param delay  Milliseconds to wait (default: 400)
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
