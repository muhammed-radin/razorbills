import { useEffect, useRef } from "react";

/**
 * Performs shallow equality comparison between two dependency arrays.
 */
function areDepsEqual(prevDeps, nextDeps) {
  if (prevDeps === nextDeps) return true;
  if (!prevDeps || !nextDeps) return false;
  if (prevDeps.length !== nextDeps.length) return false;
  for (let i = 0; i < prevDeps.length; i++) {
    if (!Object.is(prevDeps[i], nextDeps[i])) return false;
  }
  return true;
}

/**
 * useStrictEffect
 *
 * Enterprise hook to enforce idempotent execution of side-effects under React 18 & 19
 * Strict Mode (which mounts, unmounts, and re-mounts components in development).
 *
 * Guarantees that expensive operations (like initial API fetches or socket initializations)
 * execute strictly ONCE per dependency set, eliminating duplicate network calls while
 * seamlessly supporting dynamic dependencies (such as route param changes: [id]).
 *
 * @param {Function} effect - Callback returning an optional cleanup function
 * @param {Array} deps - Dependency array.
 */
export function useStrictEffect(effect, deps = []) {
  const lastExecutedDepsRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    // Check if the current deps match the deps from the last execution (StrictMode simulation)
    const isStrictModeDoubleInvoke =
      lastExecutedDepsRef.current !== null &&
      areDepsEqual(lastExecutedDepsRef.current, deps);

    if (!isStrictModeDoubleInvoke) {
      lastExecutedDepsRef.current = deps;

      if (typeof cleanupRef.current === "function") {
        cleanupRef.current();
      }

      cleanupRef.current = effect();
    }

    return () => {
      // In development Strict Mode, React immediately unmounts on pass 2, but leaves
      // the fiber ref intact. We do NOT clear lastExecutedDepsRef so pass 3 is recognized as duplicate deps.
      if (typeof cleanupRef.current === "function") {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * useStrictFetchEffect
 *
 * Specialization for asynchronous data fetching. Integrates an AbortController
 * with dependency tracking, ensuring in-flight request cancellation if dependencies change.
 *
 * @param {(signal: AbortSignal) => Promise<void> | void} fetchFn
 * @param {Array} deps
 */
export function useStrictFetchEffect(fetchFn, deps = []) {
  const lastExecutedDepsRef = useRef(null);

  useEffect(() => {
    const isStrictModeDoubleInvoke =
      lastExecutedDepsRef.current !== null &&
      areDepsEqual(lastExecutedDepsRef.current, deps);

    if (isStrictModeDoubleInvoke) return;
    lastExecutedDepsRef.current = deps;

    const controller = new AbortController();

    Promise.resolve(fetchFn(controller.signal)).catch((err) => {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        console.error("[useStrictFetchEffect] Request error:", err);
      }
    });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
