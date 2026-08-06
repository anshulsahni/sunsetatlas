# `app/_home/WorldMap/` — the world map

The map on `/`. It is the atlas's other whole-dataset view, opposite the year grid at
`/calendar` (see `app/AGENT_GUIDE.md` on why they are two pages and not two tabs).

Read the root `AGENTS.md` first. This file covers only what is peculiar to the map.

## Files

```
WorldMap/
├── WorldMap.tsx        — the card: header, region filters, canvas, legend. "use client"
├── hooks.ts            — all behaviour: loading, camera, filtering, selection
├── mapOverlay.ts       — the OverlayView the pins live in. No React
├── MapPin.tsx          — one nation
├── CountryCallout.tsx  — the card that opens when a pin is chosen
├── MapUnavailable.tsx  — stands in when there is no API key
├── mapPoints.ts        — pure: dataset → pins. Runs on the server
└── index.ts            — the barrel
```

Configuration — key, camera, zoom range, style array, map options — is **not** here.
It lives in `lib/maps.ts`, because it is data rather than UI.

## Three decisions worth knowing before you change anything

### 1. The pins are ours, so the map cannot have a `mapId`

Google offers two ways to style a map, and they are mutually exclusive:

- a **`styles` array** passed to the map, which is JSON we write; or
- a **cloud `mapId`**, which silently overrides `styles` entirely.

`AdvancedMarkerElement`, the current marker API, requires a `mapId`. The older `Marker`
is deprecated. So there is no combination of Google's own markers and our own palette.

We keep the palette — it is the design, and `lib/maps.ts` builds the style array out of
the same tokens as the rest of the site — and draw the pins ourselves as ordinary DOM
inside a custom `OverlayView`. **Do not add a `mapId`.** It would blank the styling.

### 2. One overlay, 66 pins, no React renders while panning

`mapOverlay.ts` creates a *single* `OverlayView` whose container React portals every
pin into. `draw()` fires on every frame of a pan or zoom; it calls back into
`hooks.ts`, which writes `transform` straight onto the pin elements it holds refs to.

React is not involved in movement, only in *which* pins exist. An overlay per pin, or
positions held in state, would re-render sixty-six components per frame.

The consequence: after any change to the rendered set of pins, the overlay has to be
told to `redraw()` — `hooks.ts` does this in an effect keyed on the visible points.

### 3. Keyframes and sibling selectors do not work the way they look

Two Linaria/wyw-in-js traps, both of which fail *silently* in the browser while the
build stays green:

- **A global `@keyframes` cannot be named from inside a styled block.** Linaria emits
  each file as a CSS module, which rewrites `animation-name` to a scoped identifier, so
  `animation: atlas-pulse …` resolves to a keyframe that does not exist. Declare the
  keyframes inside the block that uses them — `MapPin`'s `pin-pulse` shows the shape.
- **Interpolating one styled component into another's selector deletes both.**
  `` `${Anchor}:hover &` `` makes the transform drop the `Anchor` declaration from the
  client bundle, and the page dies with `Anchor is not defined`. Match on a data
  attribute instead, the way the rest of this codebase does.

## The API key, and life without one

`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is inlined into the browser bundle at build time, so
it is a restricted key rather than a secret — lock it to the site's referrers and to
the Maps JavaScript API.

Unset is a supported state, and local development runs that way by default, the same
choice `lib/analytics.ts` makes about the Mixpanel token. `MapView` checks the key on
the server and renders `MapUnavailable` instead of the map.

Either way, `app/_home/MapNationIndex` lists all 66 nations beneath the map as
server-rendered links. That is not a fallback — it is always there, and it is what
lets the map be canvas at all. **No link out of the home page may depend on the map
having drawn.**

## Testing it without a key

There is no test suite yet (root `AGENTS.md` §1.5). The parts worth checking are pure
and exported for when there is one: `computeWorldMapViewModel` in `mapPoints.ts`, and
`selectRegionPoints` in `hooks.ts`.

For the interactive parts, the loader honours a pre-existing
`window.google.maps.importLibrary`, so a stub of `Map`, `OverlayView`, `LatLng` and
`LatLngBounds` installed before page load exercises the overlay, the pins, the callout
and the filters end to end without a network call or a key.
