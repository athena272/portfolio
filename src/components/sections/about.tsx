import { useLocale, useTranslations } from "next-intl";

import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { profile } from "@/content/profile";
import { localize } from "@/lib/localize";

export function About() {
  const t = useTranslations("about");
  const locale = useLocale();

  return (
    <Section id="about" eyebrow={t("eyebrow")} title={t("title")}>
      <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
        <Reveal className="space-y-4 text-lg leading-relaxed text-pretty text-muted-foreground">
          {profile.summary.map((paragraph) => (
            <p key={paragraph.pt}>{localize(paragraph, locale)}</p>
          ))}
        </Reveal>

        <ul className="grid grid-cols-2 gap-4 self-start">
          {profile.highlights.map((highlight, index) => (
            <li key={highlight.id}>
              <Reveal
                delay={index * 0.08}
                className="h-full rounded-xl border bg-card p-5 shadow-xs"
              >
                <p className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                  {highlight.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {localize(highlight.label, locale)}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
