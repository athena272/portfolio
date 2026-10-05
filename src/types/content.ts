import type { Locale } from "@/i18n/routing";

/** The same text in every supported locale. Missing translations are caught by the content tests. */
export type LocalizedText = Record<Locale, string>;

type Month = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12";

/** Calendar month in `YYYY-MM` format, e.g. `2026-03`. */
export type YearMonth = `${number}-${Month}`;

export type Period = {
  start: YearMonth;
  end: YearMonth | "present";
};

export type Profile = {
  name: string;
  role: LocalizedText;
  headline: LocalizedText;
  location: LocalizedText;
  summary: LocalizedText[];
  highlights: ProfileHighlight[];
  photo: ProfilePhoto;
};

export type ProfilePhoto = {
  /** Path inside `public/`. PNG or JPEG only: the formats the Open Graph image renderer reads. */
  src: string;
  type: "image/png" | "image/jpeg";
  width: number;
  height: number;
  alt: LocalizedText;
};

export type ProfileHighlight = {
  id: string;
  value: string;
  label: LocalizedText;
};

export type Experience = {
  id: string;
  company: string;
  role: LocalizedText;
  location: LocalizedText;
  period: Period;
  summary: LocalizedText;
  highlights: LocalizedText[];
  stack: string[];
};

export type ProjectLinks = {
  live?: string;
  repo?: string;
  certificate?: string;
};

export type ProjectImage = {
  /** Path inside `public/`, e.g. `/projects/clinicroom.webp`. */
  src: string;
  alt: LocalizedText;
};

export type Project = {
  id: string;
  name: string;
  tagline: LocalizedText;
  description: LocalizedText;
  period: Period;
  stack: string[];
  links: ProjectLinks;
  image?: ProjectImage;
};

export type SkillGroup = {
  id: string;
  title: LocalizedText;
  /** Technology names stay as plain strings; descriptive items are localized. */
  items: (string | LocalizedText)[];
};

export type Education = {
  id: string;
  institution: string;
  degree: LocalizedText;
  period: Period;
  note?: LocalizedText;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  issued: YearMonth;
};

export type SocialLinkId = "whatsapp" | "linkedin" | "github";

export type SocialLink = {
  id: SocialLinkId;
  label: string;
  href: string;
};
