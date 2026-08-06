import type { MetadataRoute } from "next";

import {
  COLLECTIONS,
  REGIONS,
  getAllCountries,
  getAllIndependenceDays,
  getDecades,
} from "@/lib/countries";
import { MONTH_NUMBERS } from "@/lib/dates";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

/**
 * Every URL in the site, generated from the same queries the pages themselves read
 * — never hand-listed. A route that is not represented here does not exist as far
 * as a crawler is concerned (see `app/AGENT_GUIDE.md`).
 *
 * This is historical data: nothing here changes without a content edit, so every
 * entry uses `changeFrequency: "monthly"` rather than anything tighter.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const changeFrequency = "monthly" as const;

  const home: MetadataRoute.Sitemap = [
    { url: absoluteUrl(routes.home()), changeFrequency, priority: 1 },
  ];

  const about: MetadataRoute.Sitemap = [
    { url: absoluteUrl(routes.about()), changeFrequency, priority: 0.6 },
  ];

  const miniHubs: MetadataRoute.Sitemap = [
    { url: absoluteUrl(routes.calendar()), changeFrequency, priority: 0.8 },
    { url: absoluteUrl(routes.countries()), changeFrequency, priority: 0.8 },
    { url: absoluteUrl(routes.regions()), changeFrequency, priority: 0.8 },
    { url: absoluteUrl(routes.timeline()), changeFrequency, priority: 0.8 },
    { url: absoluteUrl(routes.collections()), changeFrequency, priority: 0.8 },
  ];

  const months: MetadataRoute.Sitemap = MONTH_NUMBERS.map((month) => ({
    url: absoluteUrl(routes.month(month)),
    changeFrequency,
    priority: 0.6,
  }));

  const days: MetadataRoute.Sitemap = getAllIndependenceDays().map((entry) => ({
    url: absoluteUrl(routes.day(entry.day, entry.month)),
    changeFrequency,
    priority: 0.6,
  }));

  const countries: MetadataRoute.Sitemap = getAllCountries().map((country) => ({
    url: absoluteUrl(routes.country(country.slug)),
    changeFrequency,
    priority: 0.6,
  }));

  const regions: MetadataRoute.Sitemap = REGIONS.map((region) => ({
    url: absoluteUrl(routes.region(region.slug)),
    changeFrequency,
    priority: 0.6,
  }));

  const decades: MetadataRoute.Sitemap = getDecades().map((decade) => ({
    url: absoluteUrl(routes.decade(decade)),
    changeFrequency,
    priority: 0.6,
  }));

  const collections: MetadataRoute.Sitemap = COLLECTIONS.map((collection) => ({
    url: absoluteUrl(routes.collection(collection.slug)),
    changeFrequency,
    priority: 0.6,
  }));

  return [
    ...home,
    ...about,
    ...miniHubs,
    ...months,
    ...days,
    ...countries,
    ...regions,
    ...decades,
    ...collections,
  ];
}
