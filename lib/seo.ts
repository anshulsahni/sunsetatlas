import type { Metadata } from "next";

import { absoluteUrl, site } from "@/lib/site";
import { formatDayMonth } from "@/lib/dates";
import { routes } from "@/lib/routes";
import type { Country } from "@/lib/countries";

/**
 * Metadata and structured-data builders.
 *
 * Every page goes through `buildMetadata` so that titles, canonicals and Open Graph
 * tags are shaped the same way everywhere. JSON-LD is built here too — never
 * hand-write a `<script type="application/ld+json">` in a page.
 */

export interface PageMetadataInput {
  /** Page title without the site suffix — the builder adds it. */
  title: string;
  description: string;
  /** Site-relative path; becomes the canonical URL. */
  path: string;
  /** Set on pages that exist for navigation but add nothing to the index. */
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const isHome = path === routes.home();

  /*
   * The root layout declares a `%s | Sunset Atlas` title template, and Next.js applies
   * it to any plain string `title` a page exports. So pages pass the bare title and let
   * the template add the suffix — appending it here too would produce
   * "India | Sunset Atlas | Sunset Atlas". The home page opts out with `absolute`.
   *
   * Open Graph titles do not inherit the template, so they get the full string.
   */
  const fullTitle = isHome ? title : `${title} | ${site.name}`;

  return {
    title: isHome ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      siteName: site.name,
      title: fullTitle,
      description,
      url,
      locale: site.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

/* -- Structured data ------------------------------------------------------- */

/** A crumb in the trail. The last one is the current page. */
export interface Crumb {
  name: string;
  path: string;
}

type JsonLd = Record<string, unknown>;

/**
 * The trail a spoke page shows, and feeds to search engines.
 * Always starts at the home hub, so callers pass only what comes after it.
 */
export function buildCrumbs(...trail: Crumb[]): Crumb[] {
  return [{ name: "Home", path: routes.home() }, ...trail];
}

export function breadcrumbJsonLd(crumbs: readonly Crumb[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** Emitted once, in the root layout. */
export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: absoluteUrl(routes.home()),
    description: site.description,
  };
}

/**
 * A country page describes a real place and a dated historical event, so it is
 * marked up as both — `Country` for the entity, `Event` for the independence.
 */
export function countryJsonLd(country: Country): JsonLd {
  const { day, month, year } = country.independence;
  const startDate =
    day !== undefined && month !== undefined
      ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      : `${year}`;

  return {
    "@context": "https://schema.org",
    "@type": "Country",
    name: country.name,
    url: absoluteUrl(routes.country(country.slug)),
    subjectOf: {
      "@type": "Event",
      name: `Independence of ${country.name}`,
      startDate,
      about: country.name,
    },
    sameAs: country.sourceUrl,
  };
}

/** Hub pages are lists; telling search engines what they list is most of the value. */
export function itemListJsonLd(
  name: string,
  items: readonly { name: string; path: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

/** A shared independence date, marked up as the recurring event it is. */
export function independenceDayJsonLd(
  day: number,
  month: number,
  countries: readonly Country[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Independence days on ${formatDayMonth(day, month)}`,
    numberOfItems: countries.length,
    itemListElement: countries.map((country, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: country.name,
      url: absoluteUrl(routes.country(country.slug)),
    })),
  };
}
