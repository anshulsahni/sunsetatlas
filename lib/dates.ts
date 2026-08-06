/**
 * Calendar helpers shared by the calendar, date and country pages.
 *
 * Everything here is pure and timezone-free: independence dates are historical
 * facts, not instants, so they are handled as plain {day, month, year} numbers and
 * never as `Date` objects. The only functions that touch the real clock are the
 * anniversary ones, and they take "today" as an argument so callers stay testable.
 */

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const MONTH_NUMBERS: readonly MonthNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/** "August" for 8. */
export function monthName(month: number): string {
  return MONTH_NAMES[month - 1] ?? "";
}

/** "august" for 8 — the `/calendar/[month]` segment. */
export function monthSlug(month: number): string {
  return monthName(month).toLowerCase();
}

/** 8 for "august"; `undefined` for anything that is not a month name. */
export function monthFromSlug(slug: string): MonthNumber | undefined {
  const index = MONTH_NAMES.findIndex((name) => name.toLowerCase() === slug.toLowerCase());
  return index === -1 ? undefined : ((index + 1) as MonthNumber);
}

/** "15-august" — the `/on-this-day/[date]` segment. */
export function dayMonthSlug(day: number, month: number): string {
  return `${day}-${monthSlug(month)}`;
}

/** Parses "15-august" back into its parts; `undefined` when the slug is malformed. */
export function parseDayMonthSlug(slug: string): { day: number; month: MonthNumber } | undefined {
  const match = slug.match(/^(\d{1,2})-([a-z]+)$/i);
  if (!match) return undefined;

  const day = Number(match[1]);
  const month = monthFromSlug(match[2]);
  if (!month || day < 1 || day > daysInMonth(month)) return undefined;

  return { day, month };
}

/** Uses a leap year so 29 February is always a valid day. */
export function daysInMonth(month: number): number {
  return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 0;
}

/** "15 August 1947". */
export function formatLongDate(day: number, month: number, year: number): string {
  return `${day} ${monthName(month)} ${year}`;
}

/** "15 August" — for anniversaries, which have no year. */
export function formatDayMonth(day: number, month: number): string {
  return `${day} ${monthName(month)}`;
}

/** The decade a year belongs to, e.g. 1947 -> 1940. */
export function decadeOf(year: number): number {
  return Math.floor(year / 10) * 10;
}

/** "1940s" — the `/timeline/[decade]` segment. */
export function decadeSlug(decade: number): string {
  return `${decade}s`;
}

/** 1940 for "1940s"; `undefined` for anything else. */
export function decadeFromSlug(slug: string): number | undefined {
  const match = slug.match(/^(\d{4})s$/);
  if (!match) return undefined;

  const decade = Number(match[1]);
  return decade % 10 === 0 ? decade : undefined;
}

/** Full anniversaries completed by `today`, e.g. 78 for India on 6 August 2026. */
export function yearsSince(year: number, month: number, day: number, today: Date): number {
  const elapsed = today.getUTCFullYear() - year;
  const beforeAnniversary =
    today.getUTCMonth() + 1 < month ||
    (today.getUTCMonth() + 1 === month && today.getUTCDate() < day);

  return beforeAnniversary ? elapsed - 1 : elapsed;
}

/**
 * The next time this day-and-month comes round, at UTC midnight.
 * Returns today's date when the anniversary is today.
 */
export function nextAnniversary(month: number, day: number, today: Date): Date {
  const thisYear = Date.UTC(today.getUTCFullYear(), month - 1, day);
  const startOfToday = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

  return new Date(
    thisYear >= startOfToday ? thisYear : Date.UTC(today.getUTCFullYear() + 1, month - 1, day),
  );
}

/** Whole days from `today` until the next anniversary; 0 when it is today. */
export function daysUntilAnniversary(month: number, day: number, today: Date): number {
  const startOfToday = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const target = nextAnniversary(month, day, today).getTime();

  return Math.round((target - startOfToday) / 86_400_000);
}

/** "1st", "2nd", "3rd", "78th" — for anniversary labels. */
export function ordinal(value: number): string {
  const lastTwo = value % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${value}th`;

  const suffix = { 1: "st", 2: "nd", 3: "rd" }[value % 10] ?? "th";
  return `${value}${suffix}`;
}
