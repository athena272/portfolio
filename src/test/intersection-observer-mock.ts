import { act } from "@testing-library/react";

type ObserverRecord = {
  observer: IntersectionObserver;
  callback: IntersectionObserverCallback;
  options: IntersectionObserverInit | undefined;
  targets: Set<Element>;
};

/**
 * Replaces `IntersectionObserver` with a controllable fake. Call `vi.unstubAllGlobals()` after each test.
 * `intersect(element)` notifies every observer currently watching that element, like scrolling it into view.
 */
export function installIntersectionObserverMock() {
  const records = new Set<ObserverRecord>();

  class MockIntersectionObserver {
    readonly root = null;
    readonly rootMargin: string;
    readonly thresholds: readonly number[] = [0];
    private readonly record: ObserverRecord;

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      this.rootMargin = options?.rootMargin ?? "0px";
      this.record = {
        observer: this as unknown as IntersectionObserver,
        callback,
        options,
        targets: new Set(),
      };
      records.add(this.record);
    }
    observe(element: Element) {
      this.record.targets.add(element);
    }
    unobserve(element: Element) {
      this.record.targets.delete(element);
    }
    disconnect() {
      this.record.targets.clear();
    }
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

  const watchersOf = (element: Element) =>
    [...records].filter((record) => record.targets.has(element));

  return {
    isObserved: (element: Element) => watchersOf(element).length > 0,
    optionsFor: (element: Element) => watchersOf(element)[0]?.options,
    intersect: (element: Element) =>
      act(() => {
        for (const { observer, callback } of watchersOf(element)) {
          callback(
            [{ target: element, isIntersecting: true } as unknown as IntersectionObserverEntry],
            observer,
          );
        }
      }),
  };
}
