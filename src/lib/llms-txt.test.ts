import { certifications, education } from "@/content/education";
import { experiences } from "@/content/experiences";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { profileLinks } from "@/content/socials";

import { buildLlmsTxt } from "./llms-txt";
import { siteConfig } from "./site-config";

const llmsTxt = buildLlmsTxt();
const lines = llmsTxt.split("\n");

describe("buildLlmsTxt", () => {
  it("follows the llms.txt layout: H1 title, then a blockquote summary", () => {
    expect(lines[0]).toBe(`# ${profile.name}`);
    expect(lines[1]).toBe("");
    expect(lines[2]).toMatch(/^> Full Stack Developer based in Aracaju/);
    expect(llmsTxt.endsWith("\n")).toBe(true);
  });

  it("has a section for every part of the portfolio", () => {
    const headings = lines.filter((line) => line.startsWith("## "));
    expect(headings).toEqual([
      "## Site",
      "## Experience",
      "## Projects",
      "## Skills",
      "## Education",
      "## Contact",
    ]);
  });

  it("lists every experience, project, degree and certification", () => {
    for (const { company } of experiences) expect(llmsTxt).toContain(company);
    for (const { name } of projects) expect(llmsTxt).toContain(name);
    for (const { institution } of education) expect(llmsTxt).toContain(institution);
    for (const { name } of certifications) expect(llmsTxt).toContain(name);
  });

  it("links both language versions of the site with absolute URLs", () => {
    expect(llmsTxt).toContain(`(${new URL("/", siteConfig.url).toString()})`);
    expect(llmsTxt).toContain(`(${new URL("/en", siteConfig.url).toString()})`);
  });

  it("only uses absolute links", () => {
    const targets = [...llmsTxt.matchAll(/\]\((?<target>[^)]+)\)/g)].map(
      ({ groups }) => groups?.target ?? "",
    );
    expect(targets.length).toBeGreaterThan(0);
    for (const target of targets) expect(target).toMatch(/^(https:\/\/|mailto:)/);
  });

  it("shares the email and public profiles, but not the phone number", () => {
    expect(llmsTxt).toContain(`mailto:${siteConfig.email}`);
    for (const { href } of profileLinks) expect(llmsTxt).toContain(href);
    expect(llmsTxt).not.toContain("wa.me");
  });

  it("is written in English", () => {
    expect(llmsTxt).toContain("Present");
    expect(llmsTxt).not.toContain("Atual");
  });
});
