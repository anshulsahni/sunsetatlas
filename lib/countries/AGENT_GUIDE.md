# `lib/countries/` — the dataset

Everything the site knows about the 66 nations that gained independence from the
British Empire. This is the only place country data lives.

## Files

| File | What it is |
| --- | --- |
| `types.ts` | `Country`, `IndependenceDate`, `NationalPalette`, `RegionSlug`, `TransferCharacter`. |
| `data.ts` | The 66 records, sorted by name. Plain source — read it, edit it, diff it. |
| `queries.ts` | Every lookup, grouping and sort the pages use. |
| `regions.ts` | The eight regional groupings and their blurbs. |
| `collections.ts` | Themed groupings for `/collections`, each derived from a dataset column. |
| `index.ts` | The public surface. **Import from here**, not from the files above. |

## Where the data came from

`data.ts` was transcribed from `british-empire-independence.csv` at the repo root,
which stays the research record — every row carries a source URL, and the notes at
the bottom of the CSV explain the judgement calls behind the harder columns.

Three things in `data.ts` are **not** in the CSV and were authored alongside it:

- `region` — an editorial grouping chosen for browsing, not a political statement.
- `palette` — colours taken from each nation's flag, used to theme its page.
- `coordinates` — the **capital city**, to two decimal places, for the world map. Not a
  landmass centroid: a centroid puts Kiribati in open water and Canada in the tundra.
  The map never zooms past country level, so more precision would be false precision.

Two rows needed a hand-set date, because their CSV cell does not lead with one:

- **Singapore** — the cell records both 1963 (from Britain) and 1965 (from Malaysia).
  The atlas uses 9 August 1965, the date Singapore itself observes.
- **Oman** — documented only to the year, 1951. It therefore has no `day` or `month`.

## The one trap: not every country has a date

`IndependenceDate.day` and `.month` are optional. Oman is documented only to the year,
and a future row may be too. **Never place a country on the calendar without checking.**

Use `getDatedCountries()` — it returns `DatedCountry`, a narrowed type whose `day` and
`month` are required, so the compiler stops you rather than a blank calendar cell.

```ts
import { getDatedCountries, getCountriesInMonth } from "@/lib/countries";

// Safe: both return DatedCountry, day and month guaranteed.
for (const country of getCountriesInMonth(8)) {
  console.log(country.independence.day); // number, not number | undefined
}
```

`getAllCountries()` returns the full 66 including year-only entries, and is the right
call for lists that are not calendar-shaped — regions, decades, collections.

## Derived fields

Three booleans on `Country` were computed from the CSV prose so collections can filter
cleanly. They only ever trust a leading "Yes"/"No":

- `isCommonwealthRealm` — the monarch is still head of state.
- `wasPartitioned` — the territory did not survive intact as one state.
- `transferCharacter` — `violent` | `peaceful` | `contested`.

`contested` exists on purpose. Several rows answer the violence question with a
qualified narrative rather than yes or no, and collapsing those into either extreme
would misrepresent them. The full prose is always kept in `violenceAtTransfer` and is
what the country page displays.

**`peaceful` describes the handover, not the empire.** A nation can have an orderly
transfer and a brutal colonial history — Nigeria and Kenya sit either side of that
line. Never label a country "peaceful" in copy on the strength of this field.

## Adding or changing a country

Edit `data.ts` directly. It is ordinary source, not generated output. If you add a
row, give it a `region` and a `palette` — both are required — and add its source URL.

Adding a country automatically adds its country page, and may add a new date page, a
new decade and new calendar entries: `generateStaticParams` and `app/sitemap.ts` both
read from these queries, so nothing else needs updating.
