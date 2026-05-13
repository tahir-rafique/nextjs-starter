import { useCallback, useState } from "react";

import type { AsyncState } from "@/types/api";

/**
 * Generic hook for wrapping any async operation with loading / error / data state.
 *
 * @example
 * const { data, loading, error, execute } = useAsync(fetchUser);
 * <button onClick={() => execute(userId)}>Load</button>
 */
export function useAsync<T, Args extends unknown[]>(
  asyncFn: (...args: Args) => Promise<T>
): AsyncState<T> & { execute: (...args: Args) => Promise<T | undefined> } {
  const [state, setState] = useState<AsyncState<T>>({
    data:    null,
    loading: false,
    error:   null,
  });

  const execute = useCallback(
    async (...args: Args): Promise<T | undefined> => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await asyncFn(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An error occurred.";
        setState({ data: null, loading: false, error: message });
        return undefined;
      }
    },
    [asyncFn]
  );

  return { ...state, execute };
}

export default useAsync;
