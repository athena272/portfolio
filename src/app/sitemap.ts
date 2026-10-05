import type { MetadataRoute } from "next";

import { getLocalizedHomePath, localeTags, routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const absoluteUrl = (path: string) => new URL(path, siteConfig.url).toString();
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [
      localeTags[locale],
      absoluteUrl(getLocalizedHomePath(locale)),
    ]),
  );

  return routing.locales.map((locale) => ({
    url: absoluteUrl(getLocalizedHomePath(locale)),
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
