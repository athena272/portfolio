import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const SRC_DIR = join(process.cwd(), "src");
const SOURCE_EXTENSIONS = [".ts", ".tsx"];

/**
 * Packages too heavy for the initial page load. Zod is fetched on demand by the contact form
 * (dynamic `import()`), and entrance animations are plain CSS instead of an animation library.
 */
const FORBIDDEN_CLIENT_PACKAGES = ["zod", "motion", "framer-motion"];

/** Static `import`/`export ... from` statements. Dynamic `import()` is intentionally not matched. */
const STATIC_IMPORT_PATTERN =
  /^\s*(?:import|export)\s+(?<clause>[\s\S]*?)\s+from\s+["'](?<specifier>[^"']+)["']/gm;
const SIDE_EFFECT_IMPORT_PATTERN = /^\s*import\s+["'](?<specifier>[^"']+)["']/gm;

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((file) => SOURCE_EXTENSIONS.some((extension) => file.endsWith(extension)))
    .filter((file) => !/\.test\.tsx?$/.test(file))
    .map((file) => join(dir, file));
}

function isClientEntry(source: string): boolean {
  return /^\s*["']use client["']/.test(source);
}

/** `import type { A }` and `import { type A, type B }` are erased at compile time. */
function isTypeOnly(clause: string): boolean {
  if (/^type\s/.test(clause)) return true;
  const named = /^\{(?<specifiers>[\s\S]*)\}$/.exec(clause.trim())?.groups?.specifiers;
  if (named === undefined) return false;
  const specifiers = named
    .split(",")
    .map((specifier) => specifier.trim())
    .filter(Boolean);
  return specifiers.length > 0 && specifiers.every((specifier) => specifier.startsWith("type "));
}

function runtimeSpecifiers(source: string): string[] {
  const fromStatements = [...source.matchAll(STATIC_IMPORT_PATTERN)]
    .filter(({ groups }) => !isTypeOnly(groups?.clause ?? ""))
    .map(({ groups }) => groups?.specifier ?? "");
  const sideEffects = [...source.matchAll(SIDE_EFFECT_IMPORT_PATTERN)].map(
    ({ groups }) => groups?.specifier ?? "",
  );
  return [...fromStatements, ...sideEffects];
}

function resolveLocalFile(fromFile: string, specifier: string): string | null {
  const base = specifier.startsWith("@/")
    ? join(SRC_DIR, specifier.slice(2))
    : resolve(dirname(fromFile), specifier);
  const candidates = [
    ...SOURCE_EXTENSIONS.map((extension) => `${base}${extension}`),
    ...SOURCE_EXTENSIONS.map((extension) => join(base, `index${extension}`)),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function packageName(specifier: string): string {
  const [scopeOrName = "", name] = specifier.split("/");
  return scopeOrName.startsWith("@") ? `${scopeOrName}/${name}` : scopeOrName;
}

function toSrcPath(file: string): string {
  return relative(SRC_DIR, file).replaceAll("\\", "/");
}

function isLocalSpecifier(specifier: string): boolean {
  return specifier.startsWith(".") || specifier.startsWith("@/");
}

/** Follows runtime imports from every client entry, like the bundler does for the browser. */
function collectClientGraph() {
  const entries = listSourceFiles(SRC_DIR).filter((file) =>
    isClientEntry(readFileSync(file, "utf8")),
  );
  const files = new Set<string>();
  const packages = new Map<string, string>();
  const queue = [...entries];

  while (queue.length > 0) {
    const file = queue.pop()!;
    if (files.has(file)) continue;
    files.add(file);

    for (const specifier of runtimeSpecifiers(readFileSync(file, "utf8"))) {
      if (!isLocalSpecifier(specifier)) {
        packages.set(packageName(specifier), toSrcPath(file));
        continue;
      }
      const resolved = resolveLocalFile(file, specifier);
      if (resolved) queue.push(resolved);
    }
  }

  return {
    entries: entries.map(toSrcPath),
    files: [...files].map(toSrcPath),
    packages,
  };
}

const clientGraph = collectClientGraph();

describe("client bundle", () => {
  it("finds the client entries and follows their imports", () => {
    expect(clientGraph.entries).toContain("features/contact/contact-form.tsx");
    expect(clientGraph.files).toContain("features/contact/contact-fields.ts");
    expect(clientGraph.packages.has("next-intl")).toBe(true);
  });

  it.each(FORBIDDEN_CLIENT_PACKAGES)("does not statically import %s from client code", (name) => {
    expect(
      clientGraph.packages.has(name),
      `"${name}" is imported by ${clientGraph.packages.get(name)}`,
    ).toBe(false);
  });

  it("only reaches the Zod contact schema through a dynamic import", () => {
    expect(clientGraph.files).not.toContain("features/contact/contact-schema.ts");
  });
});

describe("isTypeOnly", () => {
  it.each([
    ["type { A }", true],
    ["{ type A, type B }", true],
    ["{ type A, B }", false],
    ["{ A }", false],
    ["A, { type B }", false],
    ["* as z", false],
  ])("treats %s as type-only: %s", (clause, expected) => {
    expect(isTypeOnly(clause)).toBe(expected);
  });
});
