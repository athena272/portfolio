import { existsSync } from "node:fs";
import { join } from "node:path";

import en from "@messages/en.json";
import pt from "@messages/pt.json";
import { routing } from "@/i18n/routing";
import { isValidYearMonth, parseYearMonth, periodSortKey } from "@/lib/dates";
import { siteConfig } from "@/lib/site-config";
import type { Period } from "@/types/content";

import { certifications, education } from "./education";
import { experiences } from "./experiences";
import { profile } from "./profile";
import { projects } from "./projects";
import { skillGroups } from "./skills";
import { socialLinks, whatsappUrl } from "./socials";

const allContent = { profile, experiences, projects, skillGroups, education, certifications };

function isLocalizedText(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  return Object.keys(value).some((key) => (routing.locales as readonly string[]).includes(key));
}

/** Walks any structure and collects every localized text with its path, for readable failures. */
function collectLocalizedTexts(
  value: unknown,
  path = "content",
): [string, Record<string, unknown>][] {
  if (isLocalizedText(value)) return [[path, value]];
  if (Array.isArray(value))
    return value.flatMap((item, index) => collectLocalizedTexts(item, `${path}[${index}]`));
  if (typeof value === "object" && value !== null) {
    return Object.entries(value).flatMap(([key, item]) =>
      collectLocalizedTexts(item, `${path}.${key}`),
    );
  }
  return [];
}

function expectUniqueIds(items: { id: string }[]) {
  const ids = items.map((item) => item.id);
  expect(new Set(ids).size).toBe(ids.length);
}

function expectValidPeriod(period: Period) {
  expect(isValidYearMonth(period.start)).toBe(true);
  if (period.end !== "present") {
    expect(isValidYearMonth(period.end)).toBe(true);
    const start = parseYearMonth(period.start);
    const end = parseYearMonth(period.end);
    expect(end.year * 12 + end.month).toBeGreaterThanOrEqual(start.year * 12 + start.month);
  }
}

function expectHttpsUrl(value: string) {
  expect(() => new URL(value)).not.toThrow();
  expect(new URL(value).protocol).toBe("https:");
}

describe("content", () => {
  it("has a non-empty translation for every locale", () => {
    const texts = collectLocalizedTexts(allContent);
    expect(texts.length).toBeGreaterThan(0);

    for (const [path, text] of texts) {
      for (const locale of routing.locales) {
        const value = text[locale];
        expect(typeof value === "string" && value.trim().length > 0, `${path}.${locale}`).toBe(
          true,
        );
      }
    }
  });

  it("uses unique ids in every collection", () => {
    expectUniqueIds(profile.highlights);
    expectUniqueIds(experiences);
    expectUniqueIds(projects);
    expectUniqueIds(skillGroups);
    expectUniqueIds(education);
    expectUniqueIds(certifications);
    expectUniqueIds(socialLinks);
  });

  it("has valid periods", () => {
    [...experiences, ...projects, ...education].forEach((item) => expectValidPeriod(item.period));
    certifications.forEach((item) => expect(isValidYearMonth(item.issued)).toBe(true));
  });

  it("lists experiences from the most recent to the oldest", () => {
    const keys = experiences.map((experience) => periodSortKey(experience.period));
    expect(keys).toEqual([...keys].sort((a, b) => b - a));
  });

  it("only links to valid https URLs", () => {
    projects.forEach((project) => Object.values(project.links).forEach(expectHttpsUrl));
    socialLinks.forEach((link) => expectHttpsUrl(link.href));
    [siteConfig.cvUrl, siteConfig.githubRepositoriesUrl].forEach(expectHttpsUrl);
  });

  it("points the contact form at the route handler that exists in the app", () => {
    expect(siteConfig.contactEndpoint).toBe("/api/contact");
    expect(existsSync(join(process.cwd(), "src", "app", "api", "contact", "route.ts"))).toBe(true);
  });

  it("lists WhatsApp, LinkedIn and GitHub in this order", () => {
    expect(socialLinks.map((link) => [link.label, link.href])).toEqual([
      ["WhatsApp", "https://wa.me/5579999007075"],
      ["LinkedIn", "https://www.linkedin.com/in/guigorosario/"],
      ["GitHub", "https://github.com/athena272"],
    ]);
  });

  it("references images that exist in public/", () => {
    const publicDir = join(process.cwd(), "public");
    const images = [
      "/images/avatar.png",
      ...projects.flatMap((project) => project.image?.src ?? []),
    ];

    images.forEach((src) => expect(existsSync(join(publicDir, src)), src).toBe(true));
  });
});

type MessageTree = { [key: string]: string | MessageTree };

function flattenMessages(tree: MessageTree, prefix = ""): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((flat, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string"
      ? { ...flat, [path]: value }
      : { ...flat, ...flattenMessages(value, path) };
  }, {});
}

function placeholders(message: string): string[] {
  return [...message.matchAll(/\{(\w+)\}/g)].map((match) => match[1] ?? "").sort();
}

describe("messages", () => {
  const ptMessages = flattenMessages(pt);
  const enMessages = flattenMessages(en);

  it("have the same keys in every locale", () => {
    expect(Object.keys(enMessages).sort()).toEqual(Object.keys(ptMessages).sort());
  });

  it("have no empty values", () => {
    for (const [key, value] of [...Object.entries(ptMessages), ...Object.entries(enMessages)]) {
      expect(value.trim().length > 0, key).toBe(true);
    }
  });

  it("use the same placeholders in every locale", () => {
    for (const [key, value] of Object.entries(ptMessages)) {
      expect(placeholders(enMessages[key] ?? ""), key).toEqual(placeholders(value));
    }
  });
});

describe("whatsappUrl", () => {
  it("keeps only the digits, as wa.me requires", () => {
    expect(whatsappUrl("+55 (79) 99900-7075")).toBe("https://wa.me/5579999007075");
  });

  it("leaves a number that is already digits-only unchanged", () => {
    expect(whatsappUrl("5579999007075")).toBe("https://wa.me/5579999007075");
  });
});
