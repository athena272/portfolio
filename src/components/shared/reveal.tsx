"use client";

import { useRef, type ReactNode } from "react";

import { useInViewOnce } from "@/hooks/use-in-view-once";
import { cn } from "@/lib/cn";

/** Reveals slightly before the element reaches the bottom edge, so the motion is noticed. */
const REVEAL_ROOT_MARGIN = "0px 0px -64px 0px";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before animating, useful to stagger items in a list. */
  delay?: number;
};

/**
 * Fades and slides its content in the first time it scrolls into view.
 * With reduced motion requested, only the fade remains.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isRevealed = useInViewOnce(ref, { rootMargin: REVEAL_ROOT_MARGIN });

  return (
    <div
      ref={ref}
      data-reveal=""
      data-revealed={isRevealed}
      style={delay > 0 ? { transitionDelay: `${delay}s` } : undefined}
      className={cn(
        "transition-[opacity,translate] duration-500 ease-out motion-reduce:translate-y-0",
        isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
