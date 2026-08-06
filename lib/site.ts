/**
 * Site-wide constants. Anything that would otherwise be typed twice lives here.
 */

/**
 * Production origin, with no trailing slash. Used for canonical URLs, Open Graph
 * URLs, the sitemap and JSON-LD, so it must be absolute. Set NEXT_PUBLIC_SITE_URL
 * in the deployment environment; the fallback only keeps local builds working.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sunsetatlas.com").replace(
  /\/$/,
  "",
);

export const site = {
  name: "Sunset Atlas",
  tagline: "The empire was red. The nations are every colour.",
  description:
    "An atlas of every nation that gained independence from the British Empire — a calendar of independence days, and a page for every country and every date.",
  locale: "en_GB",
  twitter: "@sunsetatlas",
} as const;

/** Turns a site-relative path into the absolute URL search engines should index. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
