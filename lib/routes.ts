/**
 * Every internal URL in the site is built here.
 *
 * Hub-and-spoke linking only works if a page is always reached by the same URL, so
 * never hand-write an `href` in a component — import the builder. Adding a route
 * means adding a builder here and an entry in `app/sitemap.ts`.
 */

import { dayMonthSlug, decadeSlug, monthSlug } from "@/lib/dates";

export const routes = {
  /** The central hub. */
  home: () => "/",

  /* Calendar mini hub and its spokes. */
  calendar: () => "/calendar",
  month: (month: number) => `/calendar/${monthSlug(month)}`,
  day: (day: number, month: number) => `/on-this-day/${dayMonthSlug(day, month)}`,

  /* Countries mini hub and its spokes. */
  countries: () => "/countries",
  country: (slug: string) => `/countries/${slug}`,

  /* Regions mini hub and its spokes. */
  regions: () => "/regions",
  region: (slug: string) => `/regions/${slug}`,

  /* Timeline mini hub and its spokes. */
  timeline: () => "/timeline",
  decade: (decade: number) => `/timeline/${decadeSlug(decade)}`,

  /* Collections mini hub and its spokes. */
  collections: () => "/collections",
  collection: (slug: string) => `/collections/${slug}`,

  about: () => "/about",
} as const;
