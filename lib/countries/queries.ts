import { COUNTRIES } from "./data";
import type { Country, RegionSlug } from "./types";
import { dayMonthSlug, decadeOf } from "@/lib/dates";

/**
 * A country whose independence date is known to the day, so it can be placed on
 * the calendar. Narrowing to this type removes the optional-day checks that would
 * otherwise litter every calendar component.
 */
export type DatedCountry = Country & {
  independence: Country["independence"] & { day: number; month: number };
};

/** One calendar date, and every nation that celebrates on it. */
export interface IndependenceDay {
  day: number;
  month: number;
  /** "15-august" — the `/on-this-day/[date]` segment. */
  slug: string;
  /** Sorted oldest independence first. Never empty. */
  countries: readonly DatedCountry[];
}

function hasFullDate(country: Country): country is DatedCountry {
  return country.independence.day !== undefined && country.independence.month !== undefined;
}

const DATED_COUNTRIES: readonly DatedCountry[] = COUNTRIES.filter(hasFullDate);

const BY_SLUG = new Map(COUNTRIES.map((country) => [country.slug, country]));

/**
 * Every independence date that at least one nation celebrates, in calendar order.
 * Dates nobody celebrates are absent — there is no page for an empty day.
 */
const INDEPENDENCE_DAYS: readonly IndependenceDay[] = (() => {
  const byDate = new Map<string, DatedCountry[]>();

  for (const country of DATED_COUNTRIES) {
    const { day, month } = country.independence;
    const key = dayMonthSlug(day, month);
    const existing = byDate.get(key);
    if (existing) existing.push(country);
    else byDate.set(key, [country]);
  }

  return [...byDate.values()]
    .map((countries) => {
      const { day, month } = countries[0].independence;
      return {
        day,
        month,
        slug: dayMonthSlug(day, month),
        countries: [...countries].sort(
          (a, b) => a.independence.year - b.independence.year || a.name.localeCompare(b.name),
        ),
      };
    })
    .sort((a, b) => a.month - b.month || a.day - b.day);
})();

/* -- Lookups --------------------------------------------------------------- */

export function getAllCountries(): readonly Country[] {
  return COUNTRIES;
}

/** Only the nations that can be placed on a calendar. */
export function getDatedCountries(): readonly DatedCountry[] {
  return DATED_COUNTRIES;
}

export function getCountryBySlug(slug: string): Country | undefined {
  return BY_SLUG.get(slug);
}

export function getAllIndependenceDays(): readonly IndependenceDay[] {
  return INDEPENDENCE_DAYS;
}

export function getIndependenceDay(day: number, month: number): IndependenceDay | undefined {
  return INDEPENDENCE_DAYS.find((entry) => entry.day === day && entry.month === month);
}

/** Dates shared by more than one nation — the ones worth a "together" story. */
export function getSharedIndependenceDays(): readonly IndependenceDay[] {
  return INDEPENDENCE_DAYS.filter((entry) => entry.countries.length > 1);
}

/* -- Groupings ------------------------------------------------------------- */

export function getCountriesByRegion(region: RegionSlug): readonly Country[] {
  return COUNTRIES.filter((country) => country.region === region);
}

/** Sorted by date within the month, then by name. */
export function getCountriesInMonth(month: number): readonly DatedCountry[] {
  return DATED_COUNTRIES.filter((country) => country.independence.month === month).sort(
    (a, b) => a.independence.day - b.independence.day || a.name.localeCompare(b.name),
  );
}

export function getCountriesInDecade(decade: number): readonly Country[] {
  return COUNTRIES.filter((country) => decadeOf(country.independence.year) === decade).sort(
    (a, b) => a.independence.year - b.independence.year || a.name.localeCompare(b.name),
  );
}

/** Every decade that saw at least one independence, earliest first. */
export function getDecades(): readonly number[] {
  const decades = new Set(COUNTRIES.map((country) => decadeOf(country.independence.year)));
  return [...decades].sort((a, b) => a - b);
}

/** All nations in chronological order — the spine of the timeline hub. */
export function getCountriesChronologically(): readonly Country[] {
  return [...COUNTRIES].sort(
    (a, b) => a.independence.year - b.independence.year || a.name.localeCompare(b.name),
  );
}

/* -- Relationships --------------------------------------------------------- */

/**
 * Nations to surface at the bottom of a country page: those that share its date
 * first, then others from its region. Never includes the country itself.
 */
export function getRelatedCountries(country: Country, limit = 6): readonly Country[] {
  const { day, month } = country.independence;

  const sharingDate =
    day !== undefined && month !== undefined
      ? (getIndependenceDay(day, month)?.countries ?? []).filter(
          (other) => other.slug !== country.slug,
        )
      : [];

  const seen = new Set([country.slug, ...sharingDate.map((other) => other.slug)]);
  const sameRegion = getCountriesByRegion(country.region).filter((other) => !seen.has(other.slug));

  return [...sharingDate, ...sameRegion].slice(0, limit);
}

/** The previous and next nation alphabetically, for country-page paging. */
export function getCountryNeighbours(slug: string): {
  previous?: Country;
  next?: Country;
} {
  const index = COUNTRIES.findIndex((country) => country.slug === slug);
  if (index === -1) return {};

  return { previous: COUNTRIES[index - 1], next: COUNTRIES[index + 1] };
}

/** The previous and next date in the calendar, wrapping around the year. */
export function getIndependenceDayNeighbours(slug: string): {
  previous?: IndependenceDay;
  next?: IndependenceDay;
} {
  const index = INDEPENDENCE_DAYS.findIndex((entry) => entry.slug === slug);
  if (index === -1) return {};

  const count = INDEPENDENCE_DAYS.length;
  return {
    previous: INDEPENDENCE_DAYS[(index - 1 + count) % count],
    next: INDEPENDENCE_DAYS[(index + 1) % count],
  };
}

/* -- Aggregates ------------------------------------------------------------ */

export interface AtlasTotals {
  countries: number;
  distinctDays: number;
  sharedDays: number;
  commonwealthRealms: number;
  earliestYear: number;
  latestYear: number;
}

export function getAtlasTotals(): AtlasTotals {
  const years = COUNTRIES.map((country) => country.independence.year);

  return {
    countries: COUNTRIES.length,
    distinctDays: INDEPENDENCE_DAYS.length,
    sharedDays: getSharedIndependenceDays().length,
    commonwealthRealms: COUNTRIES.filter((country) => country.isCommonwealthRealm).length,
    earliestYear: Math.min(...years),
    latestYear: Math.max(...years),
  };
}
