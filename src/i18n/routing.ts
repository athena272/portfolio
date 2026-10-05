import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "pt",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

/** BCP 47 tags used for `<html lang>`, `Intl` formatting and `hreflang`. */
export const localeTags = {
  pt: "pt-BR",
  en: "en-US",
} as const satisfies Record<Locale, string>;

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "pt" ? "en" : "pt";
}

/** Public path of the home page for a locale, honoring `localePrefix: "as-needed"`. */
export function getLocalizedHomePath(locale: Locale): string {
  return locale === routing.defaultLocale ? "/" : `/${locale}`;
}
