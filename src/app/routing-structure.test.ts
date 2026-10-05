import { existsSync } from "node:fs";
import { join } from "node:path";

const localeSegment = join(process.cwd(), "src", "app", "[locale]");

describe("[locale] route segment", () => {
  it("has a catch-all route and a localized not-found page", () => {
    expect(existsSync(join(localeSegment, "[...rest]", "page.tsx"))).toBe(true);
    expect(existsSync(join(localeSegment, "not-found.tsx"))).toBe(true);
  });

  // A loading.tsx wraps the catch-all route in Suspense, so the response starts streaming with
  // status 200 before notFound() runs. Unknown URLs would then be served as 200 ("soft 404").
  it("has no loading.tsx, so unknown URLs keep returning HTTP 404", () => {
    expect(existsSync(join(localeSegment, "loading.tsx"))).toBe(false);
  });
});
