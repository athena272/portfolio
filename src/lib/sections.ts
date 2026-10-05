export const HOME_SECTION_ID = "home";

/** Page sections in display order. Each id is also a key under `nav` in the messages files. */
export const SECTION_IDS = [
  "about",
  "experience",
  "projects",
  "skills",
  "education",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** Every section the header tracks while scrolling, including the hero at the top. */
export const OBSERVED_SECTION_IDS = [HOME_SECTION_ID, ...SECTION_IDS] as const;

/** The hero is not a nav item, so reaching it means no nav item is active. */
export function toNavSection(id: string | null): SectionId | null {
  return SECTION_IDS.find((sectionId) => sectionId === id) ?? null;
}
