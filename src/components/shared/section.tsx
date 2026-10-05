import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { SectionId } from "@/lib/sections";

import { Reveal } from "./reveal";

type SectionProps = {
  id: SectionId;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

export function Section({ id, eyebrow, title, description, className, children }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className={cn("py-20 sm:py-28", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mb-12 max-w-2xl">
          <p className="font-mono text-sm font-medium text-primary">{eyebrow}</p>
          <h2
            id={headingId}
            className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {title}
          </h2>
          {description && <p className="mt-4 text-pretty text-muted-foreground">{description}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
