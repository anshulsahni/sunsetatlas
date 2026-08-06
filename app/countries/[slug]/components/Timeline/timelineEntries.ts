import type { Country } from "@/lib/countries";

export interface TimelineEntry {
  year: number;
  title: string;
  /** A line taken verbatim from the dataset — never invented prose. */
  detail: string;
  /** The final entry gets the pulsing dot in the nation's own colour. */
  isFinal: boolean;
}

/**
 * The two real, dataset-backed moments on a country page's timeline: the event the
 * British-rule count is measured from, and independence itself. Both years and both
 * detail lines come straight from `Country` fields — nothing here is invented.
 */
export function buildTimelineEntries(country: Country): TimelineEntry[] {
  const ruleStartYear = country.independence.year - country.yearsOfBritishRule;

  return [
    {
      year: ruleStartYear,
      title: "Start of British rule",
      detail: country.basisForStartDate,
      isFinal: false,
    },
    {
      year: country.independence.year,
      title: `${country.name} becomes independent`,
      detail: country.independence.raw,
      isFinal: true,
    },
  ];
}
