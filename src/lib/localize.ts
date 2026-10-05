import { routing, type Locale } from "@/i18n/routing";
import type { LocalizedText } from "@/types/content";

/** Picks the text for `locale`, falling back to the default locale if it is blank. */
export function localize(text: LocalizedText, locale: Locale): string {
  return text[locale].trim() || text[routing.defaultLocale];
}

/** Like `localize`, but also accepts plain strings for values that don't need translation. */
export function resolveText(value: string | LocalizedText, locale: Locale): string {
  return typeof value === "string" ? value : localize(value, locale);
}
