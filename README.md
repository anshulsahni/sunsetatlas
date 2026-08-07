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

Copy `.env.example` to `.env.local` and fill in what you need. Nothing here is
required to run the site.

| Variable | Required | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | For deploys | Absolute origin used for canonicals, Open Graph and the sitemap. Defaults to `https://sunsetatlas.com`. |
| `NEXT_PUBLIC_MIXPANEL_TOKEN` | No | Enables analytics. Unset locally, so development is silent. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | For the map | Draws the world map on `/`. Unset, the home page shows the nation index alone. |

Every one of these is `NEXT_PUBLIC_`, which means Next.js inlines it into the browser
bundle **at build time**. Two consequences: none of them can hold a secret, and
changing one has no effect until you restart `npm run dev` or redeploy.

### Running the map locally

Without a key the home page renders the nation index and a note where the map would
be. That is a supported state, not a broken one — you only need a key if you are
working on the map itself.

To get one, in the [Google Cloud console](https://console.cloud.google.com):

1. Create or select a project.
2. **Enable billing on it.** Maps Platform will not serve tiles to a project with no
   billing account attached, even inside the free monthly allowance. Current allowance
   and prices: <https://mapsplatform.google.com/pricing/>.
3. APIs & Services → Library → enable **Maps JavaScript API**. That one specifically;
   the map needs nothing else — no Places, no Geocoding, no Static Maps.
4. APIs & Services → Credentials → **Create credentials → API key**.
5. Restrict it, because the key ships to the browser and restriction is the only thing
   protecting it:
   - *Application restrictions* → **Websites** → `http://localhost:3000/*` and your
     deployed origin.
   - *API restrictions* → **Restrict key** → tick only **Maps JavaScript API**.

Then put it in `.env.local` and restart the dev server:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

If it still does not draw, the two failures look different:

- **"The map could not be loaded"** — Google rejected the key. The browser console
  carries the reason: `BillingNotEnabledMapError`, `ApiNotActivatedMapError`, or
  `RefererNotAllowedMapError` (your origin is missing from the website restrictions).
- **Still the dashed "needs a Google Maps key" panel** — the variable never reached the
  process. Almost always a missed restart, or a file named `.env` rather than
  `.env.local`.

> Do not add a cloud `mapId` to the map, however much Google's documentation suggests
> it. A map ID silently overrides the `styles` array, and that array is the entire
> design-system palette. See `app/_home/WorldMap/AGENT_GUIDE.md`.

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
