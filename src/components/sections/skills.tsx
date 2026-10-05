import { useLocale, useTranslations } from "next-intl";

import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { TechList } from "@/components/shared/tech-list";
import { skillGroups } from "@/content/skills";
import { localize, resolveText } from "@/lib/localize";

export function Skills() {
  const t = useTranslations("skills");
  const locale = useLocale();

  return (
    <Section id="skills" eyebrow={t("eyebrow")} title={t("title")}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, index) => {
          const title = localize(group.title, locale);
          return (
            <li key={group.id}>
              <Reveal
                delay={(index % 3) * 0.06}
                className="h-full rounded-xl border bg-card p-5 shadow-xs"
              >
                <h3 className="font-semibold">{title}</h3>
                <TechList
                  items={group.items.map((item) => resolveText(item, locale))}
                  label={title}
                  className="mt-3"
                />
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
