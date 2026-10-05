import { profile } from "@/content/profile";
import { profileLinks } from "@/content/socials";
import { localeTags, type Locale } from "@/i18n/routing";

import { localize } from "./localize";
import { siteConfig } from "./site-config";

/** schema.org Person, rendered as JSON-LD so search engines can identify the site owner. */
export function buildPersonJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: localize(profile.role, locale),
    description: localize(profile.headline, locale),
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    image: new URL("/images/avatar.png", siteConfig.url).toString(),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Aracaju",
      addressRegion: "SE",
      addressCountry: "BR",
    },
    sameAs: profileLinks.map((link) => link.href),
    inLanguage: localeTags[locale],
  };
}

/** Serializes JSON for a `<script>` tag, escaping `<` so the content can't close the tag early. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
