import { useCallback, useEffect, useState } from "react";

/**
 * useState persisted to localStorage. SSR-safe.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  /* Lazy initialiser — only reads from storage on mount */
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  /* Sync to localStorage on value change */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (err) {
      console.warn(`[useLocalStorage] Failed to persist "${key}":`, err);
    }
  }, [key, storedValue]);

  /* Remove from localStorage */
  const remove = useCallback(() => {
    if (typeof window !== "undefined") window.localStorage.removeItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setStoredValue, remove];
}

export default useLocalStorage;
