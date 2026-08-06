<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

# Coding Guidelines

Welcome to the coding guidelines for **Sunset Atlas**. Treat these guidelines as your bible while writing code for this project. They apply to every contributor — humans and coding agents alike (Claude Code, Cursor, Copilot, Codex, and any other agent reading this file).

Do not violate these guidelines without reason. If you feel a specific guideline doesn't make sense, propose the change/addition/deletion to @anshulsahni. While your proposal is under review, continue following the guideline.

Violation of these guidelines is allowed only in two conditions:
  - There is an urgent hotfix required to solve a bug or a time-sensitive feature needs to be deployed. In this case, the violation should be fixed within a reasonable amount of time.
  - Following a guideline is preventing you from implementing a required feature.

## Project at a glance

Sunset Atlas is a **content and SEO-driven atlas of every nation that gained independence from the British Empire**. It is a mostly-static, statically generated site: one page per country, one per shared independence date, plus month, region, decade and themed collection hubs. Interactivity is limited (calendar navigation, search, countdowns), so **server components are the default** and `"use client"` is the exception.

- **Framework:** Next.js 16 (App Router) + React 19, TypeScript (`strict`).
- **Styling:** [Linaria](https://github.com/callstack/linaria) (`@linaria/react`) zero-runtime CSS-in-JS, with CSS custom properties for design tokens.
- **Icons:** `lucide-react`.
- **Analytics:** Mixpanel (auto-instrumented) + Vercel Analytics/Speed Insights.
- **Path alias:** `@/*` maps to the repo root (e.g. `@/app/components/SiteHeader`, `@/lib/countries`).

> There is **no `src/` directory** in this project. Application code lives at the repo root under `app/` (routes & UI) and `lib/` (non-UI logic, data, services).

Let's dive into the guidelines.

## Guidelines

### 1.1 File/Folder Structure
_Purpose:_ A standard file/folder structure improves discovery of modules while debugging an issue or building a feature.

- All pages must be built using the Next.js **App Router**, following the official routing conventions (read the local docs in `node_modules/next/dist/docs/`).
- A `page.tsx` file should contain only Next.js-specific code, such as:
  - The `metadata` object (and `generateMetadata`/`generateStaticParams` where needed).
  - The root component to be rendered.
  - Minimal component imports to keep the file focused.
- For pages that mix server and client components:
  - Keep `page.tsx` as a **Server Component** by default; only the leaf components that need interactivity carry `"use client"`.
  - Wrap client components in `<Suspense>` boundaries when they read search params or stream.
- **Page-specific** components are co-located with their route in a `components` folder inside the route directory.
- **Shared/reusable** components live under `app/components/<Name>/` (one folder per component — see 1.2).
- A typical route looks like:
  ```
  app
  └── about
      ├── components
      │   └── AboutContent.tsx
      └── page.tsx
  ```
- Dynamic routes follow the App Router convention, e.g. `app/countries/[slug]/page.tsx`.

### 1.2 Building components
Separate **behavior** from the **view**.

Each UI unit lives in `app/components/<Name>/` (folder name = main component name, or a logical parent grouping its subcomponents) with these standard files:

- **`<Name>.tsx` — rendering only.** Consume a view-model from the local `hooks.ts` and wire props/handlers to JSX. Avoid business rules and side effects here (trivial DOM wiring is fine).
- **`hooks.ts` — all behavior.** State, effects, derived data, event handlers, and **pure** `computeXxxViewModel` helpers exported for unit tests.
- **`index.ts` — the public surface.** Re-export the default component and its public types:
  ```ts
  export { default } from "./CountryCard";
  export type { CountryCardProps } from "./CountryCard";
  ```
- **Additional pure helpers** that don't belong in `hooks.ts` are co-located as their own files (e.g. `calendarGrid.ts`). Large components may split hooks into focused files and subcomponents.

A purely presentational server component needs no `hooks.ts` — do not create an empty one.

Example component structure:
```
app/components/YearCalendar
├── YearCalendar.tsx           # render only
├── MonthCard.tsx              # subcomponent
├── DayCell.tsx                # subcomponent
├── hooks.ts                   # behavior + compute* helpers
├── calendarGrid.ts            # pure helpers
└── index.ts                   # barrel
```

- **Do not** add a repo-root `hooks/` bucket — colocate hooks with the component that owns them.
- Keep state and effects as local to the owning component as possible; lift state only when it's genuinely shared.

### 1.3 Styling & design tokens
- Style components with **Linaria** (`styled` from `@linaria/react`, or the `css` tag) — keep styled definitions in the same `<Name>.tsx` file as the component they style.
- **Never hard-code a design value.** Use the CSS custom properties (e.g. `var(--ink)`, `var(--empire-500)`, `var(--r-lg)`, `var(--s-4)`). The token source of truth is `app/globals.css`, mirrored for TypeScript consumers in `lib/theme.ts`.
- The one sanctioned exception is **per-country national colour**, which is data, not a token. It is passed in as an inline CSS custom property (`--country-primary`) — see `app/components/NationalTheme`.
- When you need a new design token, add it to `app/globals.css` and `lib/theme.ts` rather than introducing a one-off literal in a component.
- There is no separate `design-system/` folder: CSS custom properties are our shared design language. A component qualifying for reuse goes in `app/components/` (see 1.2) — reusability alone does not justify a new token.

### 1.4 Non-UI code (`lib/`)
Anything that isn't a route or a React component lives under `lib/`, organized by nature:
- **Pure logic / utilities** — e.g. `lib/countries/queries.ts`, `lib/dates.ts`. Keep these framework-agnostic and easily unit-testable.
- **Services** — small focused integrations used across the app, e.g. `lib/analytics.ts` (Mixpanel). These are the "mini frameworks" of the app.
- **Data** — the country dataset under `lib/countries/`. See `lib/countries/AGENT_GUIDE.md`.
- **Shared constants/config** — e.g. `lib/site.ts`, `lib/theme.ts`, `lib/seo.ts`.

### 1.5 Testing
There is **no test suite in the repo yet** — it is planned, not skipped permanently. Until it lands:
- Keep logic in pure, exported functions (`compute*` helpers, `lib/` utilities) so tests can be added later without refactoring.
- Do not add tests unless asked; do not add test tooling config speculatively.

When tests do land they will live under `__tests__/`, mirroring the source path.

### 1.6 SEO
This site lives or dies by search. Treat SEO as a functional requirement, not a polish step.

- **Hub and spoke.** `/` is the central hub. `/calendar`, `/countries`, `/regions`, `/timeline` and `/collections` are mini hubs. Country and date pages are spokes. Every spoke links back to at least two hubs; every hub links to all of its spokes. See `app/AGENT_GUIDE.md` for the full map.
- Every page exports `metadata` or `generateMetadata` with a unique `title`, `description`, and `alternates.canonical`.
- Every page renders **exactly one `<h1>`** and a `<Breadcrumbs>` trail.
- Structured data (JSON-LD) is emitted through `lib/seo.ts` helpers — never hand-rolled in a page.
- New routes must be added to `app/sitemap.ts`. A route that is not in the sitemap does not exist.

### 1.7 Recommended practices
- **Links:** render all navigation with [`next/link`](https://nextjs.org/docs), regardless of CTA design. Links matter for SEO and accessibility; navigation must go through `href`, even when an `onClick` is also attached for analytics.
- **Buttons:** for interactive elements that trigger actions (not navigation), use semantic `<button>` elements — never click handlers on `<div>`, `<p>`, or `<span>`.
- **Semantic HTML:** use `<header>`, `<nav>`, `<main>`, `<section>`, etc. where appropriate. They don't change layout but improve SEO and accessibility by giving the document clear structure.
- **`"use client"` boundaries:** add `"use client"` to the smallest leaf that needs it; don't mark a whole page client just because one child is interactive.
- **TypeScript:** the project is `strict`. Type component props and hook return shapes explicitly; avoid `any`.
- **Imports:** use the `@/*` alias for cross-directory imports (`@/app/...`, `@/lib/...`) rather than long relative chains.
- **Placeholder copy:** narrative history sections are intentionally lorem ipsum until researched. Generate them through `lib/placeholderContent.ts` — never write half-researched prose that could be mistaken for fact.

### 1.8 AGENT_GUIDE.md files
Directories that hold a non-obvious library or subsystem carry an `AGENT_GUIDE.md` explaining what lives there and how to use it. Keep it current when you change the directory's public surface. Do not add one to a directory that is just a route with a couple of components.

## Change is permanent
This document is a living reference — it will evolve as our practices improve and new standards emerge. Refer back to it frequently while writing code, and use it as the objective standard during code reviews.
