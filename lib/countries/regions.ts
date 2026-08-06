import type { RegionSlug } from "./types";

export interface Region {
  slug: RegionSlug;
  /** "Africa" — used in headings and breadcrumbs. */
  name: string;
  /** Reads naturally after "independence in …" or "nations of …". */
  title: string;
  /** One line of factual scene-setting for the region hub. Safe to display. */
  blurb: string;
}

/**
 * The regional groupings, in the order they appear on `/regions`.
 *
 * These are editorial groupings chosen for browsing, not political statements —
 * "Middle East" and "Oceania" in particular are conveniences, and a nation appears
 * in exactly one of them.
 */
export const REGIONS: readonly Region[] = [
  {
    slug: "africa",
    name: "Africa",
    title: "Africa",
    blurb:
      "The largest group in the atlas. Most of these nations became independent in a single nineteen-year stretch between 1956 and 1975.",
  },
  {
    slug: "asia",
    name: "Asia",
    title: "Asia",
    blurb:
      "From the 1947 partition of British India to Brunei in 1984 — the end of empire in Asia opened and closed the era.",
  },
  {
    slug: "caribbean",
    name: "The Caribbean",
    title: "the Caribbean",
    blurb:
      "Small islands, long occupations. Several of these colonies were held continuously for more than three centuries.",
  },
  {
    slug: "middle-east",
    name: "The Middle East",
    title: "the Middle East",
    blurb:
      "Mandates, protectorates and treaty states — British authority here was rarely called a colony, and rarely absent.",
  },
  {
    slug: "oceania",
    name: "Oceania",
    title: "Oceania",
    blurb:
      "Pacific island nations, several administered on Britain's behalf by Australia or New Zealand before independence.",
  },
  {
    slug: "north-america",
    name: "North America",
    title: "North America",
    blurb:
      "Where it began and where it was first undone: the thirteen colonies in 1776, Canadian confederation in 1867.",
  },
  {
    slug: "south-america",
    name: "South America",
    title: "South America",
    blurb: "Britain's single mainland South American colony, on the Guiana coast.",
  },
  {
    slug: "europe",
    name: "Europe",
    title: "Europe",
    blurb:
      "The colonies closest to London — and, in Ireland's case, the longest-held territory in the entire empire.",
  },
];

const REGIONS_BY_SLUG = new Map(REGIONS.map((region) => [region.slug, region]));

export function getRegion(slug: string): Region | undefined {
  return REGIONS_BY_SLUG.get(slug as RegionSlug);
}
