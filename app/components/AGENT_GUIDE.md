# `app/components/` — the shared component library

Components used by more than one route. Anything used by exactly one route belongs in
that route's own `components/` folder instead.

Each component is a folder with `<Name>.tsx` (render), optional `hooks.ts` (behaviour),
and `index.ts` (the barrel you import from). See §1.2 of the root `AGENTS.md`.

## What is here

### Page structure

| Component | Use it for |
| --- | --- |
| `PageHero` | The banner every page opens with. Owns the page's single `<h1>` and renders `<Breadcrumbs>`. Pass `background` to re-theme it (country pages pass national colours). |
| `Container` | The 1080px measure. A plain `<div>` — put it inside your `<section>`, not around it. |
| `Section` | Vertical rhythm for a full-width block. Wraps a `Container`. `data-divided="true"` draws hairlines between adjacent sections. |
| `SectionHeading` | An `<h2>` with an optional Lucide icon and a right-hand action. |
| `Breadcrumbs` | The trail up the tree. **Emits its own BreadcrumbList JSON-LD** — do not add breadcrumb structured data separately. |
| `SiteHeader` / `SiteFooter` | Mounted once by the root layout. The footer links every month, region and decade. |
| `ViewSwitcher` | Toggles between the atlas's two whole-dataset views — the map on `/` and the year grid on `/calendar`. Both options are real links; see `app/AGENT_GUIDE.md`. |

### Content

| Component | Use it for |
| --- | --- |
| `CountryCard` | The standard link to a country page. The whole card is one link. |
| `FlagDisc` | The circular flag mark. Decorative and `aria-hidden` — always put the country's name beside it. |
| `Panel` / `PanelHeading` | The bordered white card that side rails and stat boxes are built from. |
| `FactList` | Label/value rows, rendered as a `<dl>`. |
| `Pill` | Small rounded label. Choose a tone with `data-tone`. |
| `PillRow` | A wrapping row of `Pill`s — the cross-link groups at the foot of a hub page. |
| `PlaceholderProse` | Unwritten narrative sections. **The only sanctioned way to render lorem ipsum.** |
| `AnniversaryCountdown` | The live countdown band. Client component. |

### Plumbing

| Component | Use it for |
| --- | --- |
| `JsonLd` | Serialises one structured-data object. Build the payload in `lib/seo`. |
| `Analytics` | Mounted once by the root layout. See below. |

## Colour: red means the empire

The palette carries one rule, and it is the whole idea of the design: **red is always
the empire** — British rule, the "before", history. Everything else belongs to the
nations. So:

- Use `--empire-*` for anything about British rule, and for brand chrome.
- Never reach for a red because a thing needs emphasis. Use `--ink` or `--gold`.
- A nation's own colours come from its `palette` and are passed as inline styles.
  They are data, not tokens, and are the one sanctioned exception to §1.3.

Everything else is a token from `app/globals.css`. No literal hex values in components.

## Analytics is automatic — do not add click handlers

`Analytics` installs one delegated, capture-phase click listener on `document`. Every
`<a href>` and `<button>` in the app is tracked the moment it renders, along with a
page view on each navigation. **Do not add an `onClick` just to log a click.**

Two escape hatches:

```tsx
<button data-analytics-label="Clear all filters">…</button>   {/* better name */}
<div data-analytics="off">…</div>                             {/* opt the subtree out */}
```

Add a semantic helper to `lib/analytics.ts` only for something the DOM cannot describe
on its own — what a control *meant*, not that it was clicked.

## Client components

Almost everything here is a server component, and should stay that way. Only
`AnniversaryCountdown` and `Analytics` carry `"use client"`.

If you need interactivity, put `"use client"` on the smallest leaf that needs it —
never on a page. And never render a clock-dependent value during SSR: a countdown
baked into static HTML is wrong by the time anyone reads it. `AnniversaryCountdown`
shows the pattern — placeholder dashes first, real values after mount.
