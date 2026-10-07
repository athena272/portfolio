import messages from "@messages/en.json";
import { certifications, education } from "@/content/education";
import { experiences } from "@/content/experiences";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { profileLinks } from "@/content/socials";
import { getLocalizedHomePath, type Locale } from "@/i18n/routing";
import type { Project } from "@/types/content";

import { formatPeriod, formatYearMonth } from "./dates";
import { localize, resolveText } from "./localize";
import { siteConfig } from "./site-config";

/** English reaches the widest range of AI assistants; the site itself links both languages. */
const LLMS_LOCALE: Locale = "en";

const { nav, common } = messages;

function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

function period(value: Parameters<typeof formatPeriod>[0]): string {
  return formatPeriod(value, LLMS_LOCALE, common.present);
}

function projectUrl({ links }: Project): string | undefined {
  return links.live ?? links.repo ?? links.certificate;
}

function section(title: string, lines: string[]): string {
  return [`## ${title}`, "", ...lines].join("\n");
}

function siteSection(): string {
  return section("Site", [
    `- [Portfolio in Portuguese](${absoluteUrl(getLocalizedHomePath("pt"))}): default language`,
    `- [Portfolio in English](${absoluteUrl(getLocalizedHomePath("en"))})`,
  ]);
}

function experienceSection(): string {
  return section(
    nav.experience,
    experiences.map((experience) => {
      const role = localize(experience.role, LLMS_LOCALE);
      const location = localize(experience.location, LLMS_LOCALE);
      const summary = localize(experience.summary, LLMS_LOCALE);
      return `- **${role}** at ${experience.company} (${period(experience.period)}, ${location}): ${summary} Stack: ${experience.stack.join(", ")}.`;
    }),
  );
}

function projectsSection(): string {
  return section(
    nav.projects,
    projects.map((project) => {
      const url = projectUrl(project);
      const name = url ? `[${project.name}](${url})` : `**${project.name}**`;
      const tagline = localize(project.tagline, LLMS_LOCALE);
      const description = localize(project.description, LLMS_LOCALE);
      return `- ${name} (${period(project.period)}): ${tagline}. ${description} Stack: ${project.stack.join(", ")}.`;
    }),
  );
}

function skillsSection(): string {
  return section(
    nav.skills,
    skillGroups.map((group) => {
      const items = group.items.map((item) => resolveText(item, LLMS_LOCALE));
      return `- **${localize(group.title, LLMS_LOCALE)}**: ${items.join(", ")}`;
    }),
  );
}

function educationSection(): string {
  const degrees = education.map(
    (item) =>
      `- **${localize(item.degree, LLMS_LOCALE)}**, ${item.institution} (${period(item.period)})`,
  );
  const certificates = certifications.map(
    (item) => `- ${item.name}, ${item.issuer} (${formatYearMonth(item.issued, LLMS_LOCALE)})`,
  );
  return section(nav.education, [...degrees, ...certificates]);
}

function contactSection(): string {
  return section(nav.contact, [
    `- [Email](mailto:${siteConfig.email})`,
    ...profileLinks.map((link) => `- [${link.label}](${link.href})`),
    `- [Résumé (CV)](${siteConfig.cvUrl})`,
  ]);
}

/**
 * Markdown summary of the portfolio following the llms.txt proposal (https://llmstxt.org):
 * an H1 title, a blockquote summary, then sections of links and facts for AI assistants.
 */
export function buildLlmsTxt(): string {
  const header = [
    `# ${profile.name}`,
    "",
    `> ${localize(profile.role, LLMS_LOCALE)} based in ${localize(profile.location, LLMS_LOCALE)}. ${localize(profile.headline, LLMS_LOCALE)}`,
    "",
    profile.summary.map((paragraph) => localize(paragraph, LLMS_LOCALE)).join("\n\n"),
  ].join("\n");

  return (
    [
      header,
      siteSection(),
      experienceSection(),
      projectsSection(),
      skillsSection(),
      educationSection(),
      contactSection(),
    ].join("\n\n") + "\n"
  );
}
