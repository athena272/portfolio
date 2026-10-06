import { readFileSync } from "node:fs";
import { join } from "node:path";

const workflow = readFileSync(join(process.cwd(), ".github", "workflows", "ci.yml"), "utf8");

// Lowest release of each action whose runtime is node24. GitHub flags actions still running on
// node20 as deprecated. pnpm/action-setup also needs 6.1.0 to support pnpm v12 ("packageManager").
const MINIMUM_NODE24_ACTION_VERSIONS: Record<string, string> = {
  "actions/checkout": "5.0.0",
  "actions/setup-node": "5.0.0",
  "pnpm/action-setup": "6.1.0",
};

interface UsedAction {
  name: string;
  ref: string;
}

type Version = [major: number, minor: number, patch: number];

function parseUsedActions(source: string): UsedAction[] {
  return [...source.matchAll(/^\s*-?\s*uses:\s*(?<name>[^@\s]+)@(?<ref>\S+)/gm)].map(
    ({ groups }) => ({ name: groups?.name ?? "", ref: groups?.ref ?? "" }),
  );
}

function parseVersion(ref: string): Version {
  const match = /^v?(?<major>\d+)(?:\.(?<minor>\d+))?(?:\.(?<patch>\d+))?$/.exec(ref);
  if (!match?.groups) {
    throw new Error(`"${ref}" is not a version tag (expected e.g. v6 or v6.1.0)`);
  }
  const { major, minor = "0", patch = "0" } = match.groups;
  return [Number(major), Number(minor), Number(patch)];
}

function isAtLeast(ref: string, minimum: string): boolean {
  const [major, minor, patch] = parseVersion(ref);
  const [minMajor, minMinor, minPatch] = parseVersion(minimum);
  if (major !== minMajor) return major > minMajor;
  if (minor !== minMinor) return minor > minMinor;
  return patch >= minPatch;
}

const usedActions = parseUsedActions(workflow);

describe("CI workflow", () => {
  it("uses at least one action", () => {
    expect(usedActions.length).toBeGreaterThan(0);
  });

  it("only uses actions with a known node24 minimum version", () => {
    const unknown = usedActions
      .map(({ name }) => name)
      .filter((name) => !(name in MINIMUM_NODE24_ACTION_VERSIONS));
    expect(unknown).toEqual([]);
  });

  it.each(usedActions)("runs $name@$ref on node24", ({ name, ref }) => {
    const minimum = MINIMUM_NODE24_ACTION_VERSIONS[name];
    if (!minimum) throw new Error(`${name} has no known node24 minimum version`);
    expect(isAtLeast(ref, minimum), `${name}@${ref} is below ${minimum}`).toBe(true);
  });

  it("sets up Node.js 24", () => {
    expect(workflow).toMatch(/^\s*node-version:\s*24\s*$/m);
  });

  it("cancels superseded runs only for pull requests, never for pushes to main", () => {
    expect(workflow).toMatch(
      /^\s*cancel-in-progress:\s*\$\{\{\s*github\.event_name\s*==\s*'pull_request'\s*\}\}\s*$/m,
    );
  });
});
