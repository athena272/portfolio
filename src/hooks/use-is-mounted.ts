import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` during SSR and hydration, `true` afterwards. Lets client-only UI (such as the
 * resolved theme) render a stable placeholder first, avoiding hydration mismatches.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
