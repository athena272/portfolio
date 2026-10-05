import { Award, ExternalLink as ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { GitHubIcon } from "@/components/shared/brand-icons";
import { ExternalLink } from "@/components/shared/external-link";
import { TechList } from "@/components/shared/tech-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPeriod } from "@/lib/dates";
import { localize } from "@/lib/localize";
import type { Project, ProjectLinks } from "@/types/content";

const COVER_GRADIENTS = [
  "from-violet-500/80 via-fuchsia-500/60 to-rose-400/60",
  "from-sky-500/80 via-cyan-500/60 to-emerald-400/60",
  "from-amber-500/80 via-orange-500/60 to-rose-500/60",
  "from-emerald-500/80 via-teal-500/60 to-sky-500/60",
  "from-indigo-500/80 via-violet-500/60 to-sky-400/60",
  "from-rose-500/80 via-pink-500/60 to-violet-500/60",
  "from-teal-500/80 via-emerald-500/60 to-lime-400/60",
] as const;

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const titleId = `project-${project.id}`;

  return (
    <Card
      role="article"
      aria-labelledby={titleId}
      className="group h-full overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/7] overflow-hidden border-b">
        {project.image ? (
          <Image
            src={project.image.src}
            alt={localize(project.image.alt, locale)}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          />
        ) : (
          <div
            aria-hidden="true"
            className={`relative flex size-full items-center justify-center bg-linear-to-br ${COVER_GRADIENTS[index % COVER_GRADIENTS.length]}`}
          >
            <div className="absolute inset-0 bg-grid opacity-40 mix-blend-overlay" />
            <span className="relative font-mono text-2xl font-bold tracking-tight text-white drop-shadow-sm transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none">
              {project.name}
            </span>
          </div>
        )}
      </div>

      <CardHeader>
        <p className="font-mono text-xs text-muted-foreground">
          {formatPeriod(project.period, locale, tCommon("present"))}
        </p>
        <CardTitle id={titleId} className="text-lg">
          {project.name}
        </CardTitle>
        <CardDescription className="font-medium text-foreground/80">
          {localize(project.tagline, locale)}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-sm text-pretty text-muted-foreground">
          {localize(project.description, locale)}
        </p>
        <TechList items={project.stack} label={t("stack")} className="mt-auto" />
      </CardContent>

      <ProjectActions links={project.links} projectName={project.name} />
    </Card>
  );
}

const LINK_ICONS: Record<keyof ProjectLinks, ReactNode> = {
  live: <ExternalLinkIcon aria-hidden="true" />,
  repo: <GitHubIcon aria-hidden="true" />,
  certificate: <Award aria-hidden="true" />,
};

const LINK_ORDER: (keyof ProjectLinks)[] = ["live", "repo", "certificate"];

type ProjectActionsProps = {
  links: ProjectLinks;
  /** Read after each label so screen readers can tell the links of different cards apart. */
  projectName: string;
};

function ProjectActions({ links, projectName }: ProjectActionsProps) {
  const t = useTranslations("projects");
  const available = LINK_ORDER.flatMap((kind) => {
    const href = links[kind];
    return href ? [{ kind, href }] : [];
  });

  if (available.length === 0) return null;

  return (
    <CardFooter className="flex-wrap gap-2">
      {available.map(({ kind, href }, position) => (
        <Button key={kind} asChild size="sm" variant={position === 0 ? "default" : "outline"}>
          <ExternalLink href={href}>
            {LINK_ICONS[kind]}
            {t(kind)}
            <span className="sr-only">{projectName}</span>
          </ExternalLink>
        </Button>
      ))}
    </CardFooter>
  );
}
