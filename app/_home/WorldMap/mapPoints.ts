import { getAllCountries, getIndependenceDay, getRegion } from "@/lib/countries";
import type { Coordinates, NationalPalette, RegionSlug } from "@/lib/countries";
import { formatDayMonth, formatLongDate } from "@/lib/dates";
import { routes } from "@/lib/routes";

/**
 * Everything one pin needs, and nothing else.
 *
 * `WorldMap` is a client component, so every field here crosses the server/client
 * boundary and lands in the RSC payload. A whole `Country` carries the source URL,
 * the partition prose and the rest of the record — none of which a pin renders — so
 * the map takes this flattened shape instead. Strings are pre-formatted for the same
 * reason: the date helpers stay on the server.
 */
export interface MapPointViewModel {
  slug: string;
  name: string;
  region: RegionSlug;
  /** "The Caribbean" — the region's display name. */
  regionName: string;
  /** Capital city coordinates. See `Coordinates` in `lib/countries/types`. */
  position: Coordinates;
  /** The nation's flag colours — the pin face and the callout's disc. */
  palette: NationalPalette;
  /** "15 August 1947", or "1951" for the entries documented only to the year. */
  dateLabel: string;
  year: number;
  yearsOfBritishRule: number;
  /** Link to the nation's page. Always present. */
  countryHref: string;
  /**
   * Link to `/on-this-day/[date]`. Absent for a nation with no day and month —
   * Oman is the current example. See `lib/countries/AGENT_GUIDE.md`.
   */
  dayHref?: string;
  /** "15 August" — only set when `dayHref` is. */
  anniversaryLabel?: string;
  /** Names of the other nations that celebrate on the same date. */
  sharesDateWith: readonly string[];
}

/** One region, and how many pins it accounts for — the filter bar's view model. */
export interface RegionFilterViewModel {
  slug: RegionSlug;
  name: string;
  count: number;
}

export interface WorldMapViewModel {
  points: readonly MapPointViewModel[];
  regions: readonly RegionFilterViewModel[];
}

/**
 * Flattens the dataset into pins and their region filters.
 *
 * Every nation gets a pin, including the year-only entries the calendar has to leave
 * out: a place exists on a map whether or not its date is known to the day.
 */
export function computeWorldMapViewModel(): WorldMapViewModel {
  const points = getAllCountries().map(toMapPoint);

  const counts = new Map<RegionSlug, number>();
  for (const point of points) {
    counts.set(point.region, (counts.get(point.region) ?? 0) + 1);
  }

  const regions = [...counts.entries()]
    .map(([slug, count]) => ({ slug, name: getRegion(slug)?.name ?? slug, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return { points, regions };
}

function toMapPoint(country: ReturnType<typeof getAllCountries>[number]): MapPointViewModel {
  const { day, month, year } = country.independence;
  const hasFullDate = day !== undefined && month !== undefined;

  const sharesDateWith = hasFullDate
    ? (getIndependenceDay(day, month)?.countries ?? [])
        .filter((other) => other.slug !== country.slug)
        .map((other) => other.name)
    : [];

  return {
    slug: country.slug,
    name: country.name,
    region: country.region,
    regionName: getRegion(country.region)?.name ?? country.region,
    position: country.coordinates,
    palette: country.palette,
    dateLabel: hasFullDate ? formatLongDate(day, month, year) : String(year),
    year,
    yearsOfBritishRule: country.yearsOfBritishRule,
    countryHref: routes.country(country.slug),
    dayHref: hasFullDate ? routes.day(day, month) : undefined,
    anniversaryLabel: hasFullDate ? formatDayMonth(day, month) : undefined,
    sharesDateWith,
  };
}
