import { localeTags, type Locale } from "@/i18n/routing";
import type { Period, YearMonth } from "@/types/content";

type ParsedYearMonth = { year: number; month: number };

const YEAR_MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;

export function parseYearMonth(value: YearMonth): ParsedYearMonth {
  const match = YEAR_MONTH_PATTERN.exec(value);
  if (!match) throw new Error(`Invalid YearMonth "${value}". Expected the YYYY-MM format.`);
  return { year: Number(match[1]), month: Number(match[2]) };
}

export function isValidYearMonth(value: string): value is YearMonth {
  return YEAR_MONTH_PATTERN.test(value);
}

/** `2026-03` becomes "Mar 2026" in both locales (Portuguese drops the trailing dot of "mar."). */
export function formatYearMonth(value: YearMonth, locale: Locale): string {
  const { year, month } = parseYearMonth(value);
  const date = new Date(Date.UTC(year, month - 1, 1));
  const monthName = new Intl.DateTimeFormat(localeTags[locale], {
    month: "short",
    timeZone: "UTC",
  })
    .format(date)
    .replace(".", "");

  return `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} ${year}`;
}

export function formatPeriod(period: Period, locale: Locale, presentLabel: string): string {
  const start = formatYearMonth(period.start, locale);
  const end = period.end === "present" ? presentLabel : formatYearMonth(period.end, locale);
  return `${start} – ${end}`;
}

/** Number of calendar months covered by the period, counting both ends (Mar–May = 3). */
export function countMonths(period: Period, now: Date = new Date()): number {
  const start = parseYearMonth(period.start);
  const end =
    period.end === "present"
      ? { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 }
      : parseYearMonth(period.end);

  const months = (end.year - start.year) * 12 + (end.month - start.month) + 1;
  return Math.max(months, 1);
}

const DURATION_UNITS: Record<
  Locale,
  { year: [string, string]; month: [string, string]; and: string }
> = {
  pt: { year: ["ano", "anos"], month: ["mês", "meses"], and: "e" },
  en: { year: ["yr", "yrs"], month: ["mo", "mos"], and: "" },
};

function pluralize(count: number, [singular, plural]: [string, string]): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** 15 months becomes "1 ano e 3 meses" / "1 yr 3 mos". */
export function formatDuration(totalMonths: number, locale: Locale): string {
  const units = DURATION_UNITS[locale];
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts = [
    years > 0 ? pluralize(years, units.year) : null,
    months > 0 ? pluralize(months, units.month) : null,
  ].filter((part): part is string => part !== null);

  return parts.join(units.and ? ` ${units.and} ` : " ");
}

/** Sort key that places ongoing periods first, then the most recent end date. */
export function periodSortKey(period: Period): number {
  if (period.end === "present") return Number.POSITIVE_INFINITY;
  const { year, month } = parseYearMonth(period.end);
  return year * 12 + month;
}
