import { Award, GraduationCap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { certifications, education } from "@/content/education";
import { formatPeriod, formatYearMonth } from "@/lib/dates";
import { localize } from "@/lib/localize";

export function Education() {
  const t = useTranslations("education");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  return (
    <Section id="education" eyebrow={t("eyebrow")} title={t("title")}>
      <div className="grid gap-10 lg:grid-cols-2">
        <Reveal>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <GraduationCap className="size-5 text-primary" aria-hidden="true" />
            {t("degrees")}
          </h3>
          <ul className="mt-5 space-y-4">
            {education.map((item) => (
              <li key={item.id} className="rounded-xl border bg-card p-5 shadow-xs">
                <p className="font-mono text-xs text-muted-foreground">
                  {formatPeriod(item.period, locale, tCommon("present"))}
                </p>
                <p className="mt-1 font-semibold">{localize(item.degree, locale)}</p>
                <p className="text-sm text-primary">{item.institution}</p>
                {item.note && (
                  <p className="mt-2 text-sm text-pretty text-muted-foreground">
                    {localize(item.note, locale)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08}>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Award className="size-5 text-primary" aria-hidden="true" />
            {t("certifications")}
          </h3>
          <ul className="mt-5 divide-y rounded-xl border bg-card shadow-xs">
            {certifications.map((certification) => (
              <li
                key={certification.id}
                className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                <div>
                  <p className="text-sm font-medium">{certification.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("issuedBy", { issuer: certification.issuer })}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-xs text-muted-foreground">
                  {formatYearMonth(certification.issued, locale)}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
