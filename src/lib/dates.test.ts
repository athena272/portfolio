import {
  countMonths,
  formatDuration,
  formatPeriod,
  formatYearMonth,
  isValidYearMonth,
  parseYearMonth,
  periodSortKey,
} from "./dates";

describe("parseYearMonth", () => {
  it("parses a valid value", () => {
    expect(parseYearMonth("2026-03")).toEqual({ year: 2026, month: 3 });
  });

  it("throws on malformed values", () => {
    // @ts-expect-error: month 13 does not exist
    expect(() => parseYearMonth("2026-13")).toThrow(/Invalid YearMonth/);
  });
});

describe("isValidYearMonth", () => {
  it.each(["2026-01", "1999-12"])("accepts %s", (value) => {
    expect(isValidYearMonth(value)).toBe(true);
  });

  it.each(["2026-1", "2026-00", "26-01", "2026/01", ""])("rejects %s", (value) => {
    expect(isValidYearMonth(value)).toBe(false);
  });
});

describe("formatYearMonth", () => {
  it("formats in Portuguese without the abbreviation dot and capitalized", () => {
    expect(formatYearMonth("2026-03", "pt")).toBe("Mar 2026");
    expect(formatYearMonth("2025-05", "pt")).toBe("Mai 2025");
  });

  it("formats in English", () => {
    expect(formatYearMonth("2026-03", "en")).toBe("Mar 2026");
    expect(formatYearMonth("2025-05", "en")).toBe("May 2025");
  });
});

describe("formatPeriod", () => {
  it("uses the label for ongoing periods", () => {
    expect(formatPeriod({ start: "2026-09", end: "present" }, "pt", "Atual")).toBe(
      "Set 2026 – Atual",
    );
  });

  it("formats closed periods", () => {
    expect(formatPeriod({ start: "2022-09", end: "2025-09" }, "en", "Present")).toBe(
      "Sep 2022 – Sep 2025",
    );
  });
});

describe("countMonths", () => {
  it("counts both ends of the period", () => {
    expect(countMonths({ start: "2026-05", end: "2026-08" })).toBe(4);
    expect(countMonths({ start: "2022-09", end: "2025-09" })).toBe(37);
  });

  it("uses the injected date for ongoing periods", () => {
    const now = new Date(Date.UTC(2026, 9, 4));
    expect(countMonths({ start: "2026-09", end: "present" }, now)).toBe(2);
  });

  it("never returns less than one month", () => {
    const now = new Date(Date.UTC(2026, 0, 1));
    expect(countMonths({ start: "2026-09", end: "present" }, now)).toBe(1);
  });
});

describe("formatDuration", () => {
  it.each([
    [1, "1 mês"],
    [4, "4 meses"],
    [12, "1 ano"],
    [13, "1 ano e 1 mês"],
    [37, "3 anos e 1 mês"],
    [26, "2 anos e 2 meses"],
  ])("formats %i months in Portuguese as %s", (months, expected) => {
    expect(formatDuration(months, "pt")).toBe(expected);
  });

  it.each([
    [1, "1 mo"],
    [4, "4 mos"],
    [12, "1 yr"],
    [37, "3 yrs 1 mo"],
  ])("formats %i months in English as %s", (months, expected) => {
    expect(formatDuration(months, "en")).toBe(expected);
  });
});

describe("periodSortKey", () => {
  it("places ongoing periods first and then the most recent", () => {
    const keys = [
      periodSortKey({ start: "2021-06", end: "2021-09" }),
      periodSortKey({ start: "2026-09", end: "present" }),
      periodSortKey({ start: "2022-09", end: "2025-09" }),
    ];
    expect([...keys].sort((a, b) => b - a)).toEqual([keys[1], keys[2], keys[0]]);
  });
});
