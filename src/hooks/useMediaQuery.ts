import { useEffect, useState } from "react";

/**
 * Returns true when the CSS media query matches.
 * SSR-safe — returns false on the server.
 *
 * @example
 * const isMobile  = useMediaQuery("(max-width: 768px)");
 * const isDark    = useMediaQuery("(prefers-color-scheme: dark)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export default useMediaQuery;
