import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { GitHubIcon } from "@/components/shared/brand-icons";
import { ExternalLink } from "@/components/shared/external-link";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { projects } from "@/content/projects";
import { siteConfig } from "@/lib/site-config";

import { ProjectCard } from "./project-card";

export function Projects() {
  const t = useTranslations("projects");

  return (
    <Section id="projects" eyebrow={t("eyebrow")} title={t("title")} description={t("description")}>
      <ul className="grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <li key={project.id}>
            <Reveal delay={(index % 2) * 0.08} className="h-full">
              <ProjectCard project={project} index={index} />
            </Reveal>
          </li>
        ))}

        <li>
          <Reveal className="h-full">
            <div className="flex h-full flex-col items-start justify-center gap-4 rounded-xl border border-dashed bg-muted/40 p-8">
              <GitHubIcon className="size-10 text-foreground" />
              <h3 className="text-lg font-semibold">{t("moreTitle")}</h3>
              <p className="text-sm text-pretty text-muted-foreground">{t("moreDescription")}</p>
              <Button asChild variant="outline">
                <ExternalLink href={siteConfig.githubRepositoriesUrl}>
                  {t("moreCta")}
                  <ArrowUpRight aria-hidden="true" />
                </ExternalLink>
              </Button>
            </div>
          </Reveal>
        </li>
      </ul>
    </Section>
  );
}
