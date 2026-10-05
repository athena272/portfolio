"use client";

import { useEffect, useState } from "react";

/** Band in the middle of the viewport that decides which section counts as "current". */
const OBSERVER_ROOT_MARGIN = "-40% 0px -55% 0px";

/** Returns the id of the section currently crossing the middle of the viewport, if any. */
export function useActiveSection(sectionIds: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: OBSERVER_ROOT_MARGIN },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
