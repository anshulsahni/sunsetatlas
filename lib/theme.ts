/**
 * TypeScript mirror of the CSS custom properties declared in `app/globals.css`.
 *
 * Use these constants wherever a token has to be read from TypeScript rather than
 * written in a Linaria block — most often for `<meta name="theme-color">`, canvas
 * or SVG fills, and structured-data payloads. Inside Linaria, always write the
 * `var(--token)` form directly.
 */

/** Empire reds. Red always means the empire — never use it as decoration. */
export const empire = {
  50: "var(--empire-50)",
  100: "var(--empire-100)",
  300: "var(--empire-300)",
  500: "var(--empire-500)",
  600: "var(--empire-600)",
  700: "var(--empire-700)",
  900: "var(--empire-900)",
} as const;

/**
 * Literal hex values, for the few places CSS variables cannot reach.
 *
 * The Google Maps style array is one of them: it is JSON handed to a canvas
 * renderer that has never heard of `var(--ocean)`. Keep every value here identical
 * to its counterpart in `app/globals.css` — they are the same token written twice.
 */
export const rawColors = {
  empire50: "#fcebec",
  empire300: "#e8697a",
  empire500: "#c8102e",
  empire700: "#85091e",
  empire900: "#4a0812",
  paper: "#ffffff",
  paper2: "#eef1f4",
  line: "#e2e5ea",
  lineSoft: "#e6e9ee",
  ink: "#1b1d21",
  ink2: "#4b5563",
  ink3: "#6b7280",
  gold: "#e4a11b",
  ocean: "#bfd6d2",
  oceanInk: "#4b6e69",
} as const;

export const radius = {
  sm: "var(--r-sm)",
  md: "var(--r-md)",
  lg: "var(--r-lg)",
  xl: "var(--r-xl)",
  pill: "var(--r-pill)",
} as const;

export const space = {
  1: "var(--s-1)",
  2: "var(--s-2)",
  3: "var(--s-3)",
  4: "var(--s-4)",
  5: "var(--s-5)",
  6: "var(--s-6)",
  8: "var(--s-8)",
  12: "var(--s-12)",
  16: "var(--s-16)",
} as const;
