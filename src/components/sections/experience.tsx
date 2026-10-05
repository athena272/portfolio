import { MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { TechList } from "@/components/shared/tech-list";
import { experiences } from "@/content/experiences";
import { countMonths, formatDuration, formatPeriod } from "@/lib/dates";
import { localize } from "@/lib/localize";

export function Experience() {
  const t = useTranslations("experience");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  return (
    <Section id="experience" eyebrow={t("eyebrow")} title={t("title")}>
      <ol className="relative space-y-10 border-l border-border pl-6 sm:pl-8">
        {experiences.map((experience) => {
          const isCurrent = experience.period.end === "present";
          return (
            <li key={experience.id} className="relative">
              <span
                aria-hidden="true"
                className={
                  isCurrent
                    ? "absolute top-1.5 -left-[calc(1.5rem+5px)] size-2.5 rounded-full bg-primary ring-4 ring-primary/20 sm:-left-[calc(2rem+5px)]"
                    : "absolute top-1.5 -left-[calc(1.5rem+5px)] size-2.5 rounded-full border-2 border-border bg-background sm:-left-[calc(2rem+5px)]"
                }
              />
              <Reveal>
                <article aria-labelledby={`experience-${experience.id}`}>
                  <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <div>
                      <h3 id={`experience-${experience.id}`} className="text-lg font-semibold">
                        {localize(experience.role, locale)}
                      </h3>
                      <p className="font-medium text-primary">{experience.company}</p>
                    </div>
                    <p className="shrink-0 font-mono text-sm text-muted-foreground">
                      {formatPeriod(experience.period, locale, tCommon("present"))}
                      <span aria-hidden="true"> · </span>
                      <span className="sr-only">, </span>
                      {formatDuration(countMonths(experience.period), locale)}
                    </p>
                  </header>

                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {localize(experience.location, locale)}
                  </p>

                  <p className="mt-4 text-pretty text-muted-foreground">
                    {localize(experience.summary, locale)}
                  </p>

                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-pretty text-muted-foreground marker:text-primary">
                    {experience.highlights.map((highlight) => (
                      <li key={highlight.pt}>{localize(highlight, locale)}</li>
                    ))}
                  </ul>

                  <TechList items={experience.stack} label={t("stack")} className="mt-4" />
                </article>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
