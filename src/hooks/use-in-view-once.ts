"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

type UseInViewOnceOptions = {
  /** Same syntax as CSS margins; negative values wait until the element is further inside the viewport. */
  rootMargin?: string;
};

const subscribe = () => () => {};

/** Assumes support during SSR and hydration, so the server and client markup match. */
function useCanObserveIntersections(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => typeof IntersectionObserver !== "undefined",
    () => true,
  );
}

/**
 * Returns `true` once the element enters the viewport and stops observing afterwards.
 * Without IntersectionObserver support it reports `true`, so content is never left hidden.
 */
export function useInViewOnce<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin }: UseInViewOnceOptions = {},
): boolean {
  const canObserve = useCanObserveIntersections();
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!canObserve || !element || hasIntersected) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin, canObserve, hasIntersected]);

  return hasIntersected || !canObserve;
}
