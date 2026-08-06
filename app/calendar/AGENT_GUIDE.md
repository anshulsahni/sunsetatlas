# `app/calendar/` — the calendar mini hub

`/calendar` and its two kinds of spoke: `/calendar/[month]` (12 pages, built here) and
`/on-this-day/[date]` (built under `app/on-this-day/`, linked from here but routed at
the top level — see `app/AGENT_GUIDE.md`).

## The year grid

`components/YearCalendar/` is the card that fills the `/calendar` hub — the site's
primary view, per `SCREEN-SPECS.md`. It follows the folder shape AGENTS.md §1.2
describes for a multi-part component:

```
YearCalendar/
├── YearCalendar.tsx   — shell: header, the 12-cell month grid, legend
├── MonthCard.tsx       — one month: its name, nation count, day grid
├── DayCell.tsx          — one day: empty / single nation / shared, linked or not
├── calendarGrid.ts       — pure helpers, no React
└── index.ts               — barrel
```

`calendarGrid.ts` is the only place that reasons about the data. It builds one
`MonthGridViewModel` per calendar month, each carrying an array of `DayCellViewModel`s
— one per day of that month, pre-classified as `"empty"`, `"single"`, or `"shared"`.
`YearCalendar.tsx` and its subcomponents only render that view model; they run no
lookups of their own.

### Why there is no weekday offset

A country's independence date is an anniversary, not an event pinned to a specific
2026 (or any other year's) weekday — India's is "15 August", full stop, not "15 August,
a Friday". So the day grid is `daysInMonth(month)` cells laid out 7-per-row with no
leading blanks for "what weekday did the 1st fall on". Treating this as a real
month-calendar (blank cells before day 1) would be actively wrong: it would imply the
grid depicts one particular year, which it doesn't.

### How a day cell is classified

For a given month, every dated country (`getCountriesInMonth`, which only returns
`DatedCountry` — see `lib/countries/AGENT_GUIDE.md`'s day/month trap) is bucketed by
its `independence.day`. A day with:

- **zero** countries is `"empty"` — rendered as a plain, unlinked, disabled-colour
  number. There is no page for a day nobody celebrates on.
- **one** country is `"single"` — white-on-`--empire-500`, links to `routes.day(...)`.
- **two or more** is `"shared"` — white-on-`--empire-900` (darker, not a second hue;
  the palette's one rule is that colour belongs to nations, not UI state), same link.

The busiest month (currently August, 9 nations, with no ties in the current dataset)
gets a highlighted cell background — `isBusiest` on `MonthGridViewModel`, computed by
comparing every month's count to the max.

## Other components here

- `components/MonthList.tsx` — the twelve links from `/calendar` down to
  `/calendar/[month]`, satisfying the hub-links-every-spoke rule. Flat file, no
  subfolder: it has no subcomponents or pure helpers of its own.
- `components/CalendarContent.tsx` — the `/calendar` page body (hero + grid + month
  list + JSON-LD). `app/calendar/page.tsx` only carries metadata and renders this.
- `[month]/components/MonthContent.tsx`, `MonthDateList.tsx`, `MonthNeighbourTiles.tsx`
  — the month spoke. `MonthDateList` is the Panel of date rows from the "Month page"
  design; `MonthNeighbourTiles` pages between adjacent months (wrapping December ↔
  January) — there's no `lib/countries` helper for month neighbours since it's simple
  modular arithmetic, so it's computed inline in `MonthContent`.

## A note on `/on-this-day/[date]`

That route deliberately lives outside `app/calendar/` (see `app/AGENT_GUIDE.md`) but
its components (`app/on-this-day/[date]/components/`) duplicate the small
`NeighbourTiles`-shaped tile pattern used here rather than importing from this
directory — route-local components in one route's `components/` folder shouldn't be
imported by another route. If a third route ends up needing the same tile shape,
that's the signal to promote it into `app/components/` instead.
