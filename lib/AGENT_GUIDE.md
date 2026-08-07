# `lib/` — non-UI code

Everything that is not a route or a React component. Framework-agnostic where it can
be, so it stays easy to reason about and, later, to test.

## Files

| Module | What it owns |
| --- | --- |
| `countries/` | The dataset and every query over it. Has its own guide — read it before touching country data. |
| `dates.ts` | Month names and slugs, date formatting, decades, anniversary arithmetic. |
| `routes.ts` | **Every internal URL in the site.** |
| `seo.ts` | `buildMetadata`, breadcrumb helpers, and all JSON-LD builders. |
| `site.ts` | Site name, description, and `absoluteUrl` / `SITE_URL`. |
| `theme.ts` | TypeScript mirror of the CSS custom properties in `app/globals.css`. |
| `maps.ts` | Google Maps config: the API key, the opening camera, and the style array that repaints the map in the atlas palette. |
| `analytics.ts` | The Mixpanel service. |
| `placeholderContent.ts` | Deterministic lorem ipsum for unwritten narrative sections. |

## `routes.ts` — never hand-write an href

Hub-and-spoke linking only works if a page is always reached by one URL. A stray
hand-written `href` that differs by a trailing slash splits the page in two as far as a
crawler is concerned.

```ts
import { routes } from "@/lib/routes";

routes.country("india");     // /countries/india
routes.day(15, 8);           // /on-this-day/15-august
routes.month(8);             // /calendar/august
routes.decade(1960);         // /timeline/1960s
```

Adding a route means adding a builder here **and** an entry in `app/sitemap.ts`.

## `dates.ts` — historical dates are not instants

Independence dates are facts, not moments: they are handled as plain
`{ day, month, year }` numbers and never as `Date` objects, so no timezone can shift
15 August 1947 into 14 August.

The only functions that touch the real clock — `yearsSince`, `nextAnniversary`,
`daysUntilAnniversary` — take "today" as an argument rather than calling `new Date()`
themselves. That keeps them pure, and it forces the caller to decide *where* the clock
is read, which matters on a statically prerendered site.

> **Anything clock-dependent must be computed on the client.** A countdown rendered at
> build time is wrong by the time anyone reads it. See
> `app/components/AnniversaryCountdown/hooks.ts` for the pattern: placeholder first,
> real values after mount.

## `analytics.ts` — the service, not the wiring

This module is the Mixpanel integration, ported from the CSV Preview project so both
apps report the same event shapes. It is deliberately dumb: it initialises the SDK and
exposes `track` plus a few named helpers.

The *automatic* part lives in `app/components/Analytics`, which installs one delegated
click listener and a route-change page-view hook. **Every link and button is already
tracked — do not add an `onClick` to log a click.** Add a helper here only for
something the DOM cannot describe on its own.

Nothing is sent unless `NEXT_PUBLIC_MIXPANEL_TOKEN` is set, so local development is
silent by default.

## `placeholderContent.ts` — why lorem ipsum, deliberately

The per-nation histories are being researched and written by hand. Until a section is
written it renders lorem ipsum, never plausible-sounding prose — a half-researched
paragraph about a partition or a massacre is worse than an obvious blank.

The generator is seeded from the slug, so the same page produces the same text on every
build and diffs stay quiet. Always render the output through
`app/components/PlaceholderProse`, which labels it in the UI and sets `data-nosnippet`
so the filler cannot end up in a search result.

## `seo.ts` — build metadata, don't hand-roll it

Every page goes through `buildMetadata` so titles, canonicals and Open Graph tags are
shaped identically everywhere. JSON-LD is built here and rendered through the `JsonLd`
component; never write a `<script type="application/ld+json">` by hand in a page.

`Breadcrumbs` already emits its own `BreadcrumbList` — a page that renders it must not
add breadcrumb structured data a second time.
