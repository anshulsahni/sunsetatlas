# Sunset Atlas

An atlas of every nation that gained independence from the British Empire — a world
map, a calendar of independence days, and a page for every country and every date.

> The empire was red. The nations are every colour.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

### Environment

| Variable | Required | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | For deploys | Absolute origin used for canonicals, Open Graph and the sitemap. Defaults to `https://sunsetatlas.com`. |
| `NEXT_PUBLIC_MIXPANEL_TOKEN` | No | Enables analytics. Unset locally, so development is silent. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | For the map | Draws the world map on `/`. Unset, the home page shows the nation index alone. Restrict the key to your referrers and to the Maps JavaScript API — `NEXT_PUBLIC_` values are inlined into the browser bundle. |

## How it is put together

- **Next.js 16** (App Router) + React 19, TypeScript strict. Every page is prerendered.
- **Linaria** for zero-runtime CSS-in-JS, over CSS custom properties in `app/globals.css`.
- **Google Maps JavaScript API** for the world map on `/`, restyled from the same tokens
  and drawn with pins of our own. See `app/_home/WorldMap/AGENT_GUIDE.md`.
- **No database.** The 66 nations live in `lib/countries/data.ts`, transcribed from
  `british-empire-independence.csv` at the repo root, which stays the sourced record.

```
app/          routes and UI          → app/AGENT_GUIDE.md
  components/ shared components      → app/components/AGENT_GUIDE.md
lib/          data, queries, SEO     → lib/AGENT_GUIDE.md
  countries/  the dataset            → lib/countries/AGENT_GUIDE.md
```

`AGENTS.md` at the root holds the coding guidelines. They are binding for humans and
coding agents alike; read them before changing anything.

## The site's shape

The atlas has two whole-dataset views — the world map on `/` and the year grid on
`/calendar` — and one central hub, five mini hubs and two kinds of spoke beneath them,
laid out for search, so that nothing is more than two clicks from anything else. The full map is in
`app/AGENT_GUIDE.md`. Every route is listed in `app/sitemap.ts`; a route that is not in
the sitemap does not exist.

## What is deliberately not finished

- **The written histories.** Every nation's narrative sections render clearly-labelled
  lorem ipsum. Writing them is a research job, and half-researched prose about a
  partition or a massacre would be worse than an obvious blank.
- **Tests.** Planned. Logic is kept in pure helpers so they can be added without a
  refactor.
