# `app/` — routes and UI

The App Router tree. Read `AGENTS.md` at the repo root first; this file covers only
what is specific to the route layer.

## The hub-and-spoke map

The site is deliberately shaped for search. There is one central hub, five mini hubs,
and two kinds of spoke. Nothing is more than two clicks from anything else.

```
/                                   central hub
├── /calendar                       mini hub — the year at a glance
│   └── /calendar/[month]           12 spokes — "Independence days in August"
├── /on-this-day/[date]             ~62 spokes — "15 August", every nation on it
├── /countries                      mini hub — all 66, searchable
│   └── /countries/[slug]           66 spokes — one nation
├── /regions                        mini hub
│   └── /regions/[region]           8 spokes — "Independence in Africa"
├── /timeline                       mini hub — chronological
│   └── /timeline/[decade]          spokes — "The 1960s"
├── /collections                    mini hub — themed lists
│   └── /collections/[slug]         6 spokes — "Still Commonwealth realms"
└── /about
```

`/on-this-day/[date]` deliberately sits at the top level rather than under `/calendar`.
A date page is about the date, not about browsing the calendar, and "what happened on
15 August" is a query people type — the shorter URL earns the click.

### Linking rules

These are what make the shape work. A page that breaks them leaks link equity.

1. **Every spoke links up to at least two hubs.** A country page links to its region,
   its decade, its date, and `/countries`. It does this through `<Breadcrumbs>` plus
   an explicit related-links section.
2. **Every hub links to all of its spokes.** No pagination, no "load more" that hides
   links from crawlers. The dataset is 66 rows; render all of them.
3. **`SiteFooter` links every month, region and decade** on every page, so the whole
   tree is reachable even from a page that failed to render its own body.
4. **Never hand-write an `href`.** Import a builder from `lib/routes`.

## Page conventions

Every `page.tsx`:

- is a **Server Component**, and exports `metadata` (static routes) or
  `generateMetadata` (dynamic routes) built with `buildMetadata` from `lib/seo`;
- exports `generateStaticParams` if it is dynamic — the whole site prerenders;
- renders `<PageHero>` for its single `<h1>` and its `<Breadcrumbs>` trail;
- adds `<JsonLd>` with the right helper from `lib/seo` — `itemListJsonLd` for a hub,
  `countryJsonLd` for a country;
- is added to `app/sitemap.ts`. **A route that is not in the sitemap does not exist.**

Route-specific components live in `<route>/components/`. Anything used by two routes
belongs in `app/components/` instead.

## What is intentionally missing

- **The map.** The design project includes a Google Maps view; it is not built yet.
  The calendar is the only view. Do not scaffold map routes or add a view switcher
  until the map actually exists — a toggle with one option is worse than no toggle.
- **Real history copy.** Narrative sections render lorem ipsum through
  `<PlaceholderProse>`. See `lib/placeholderContent.ts` for why.
- **Tests.** Planned, not written. Keep logic in pure helpers so they can be added.
