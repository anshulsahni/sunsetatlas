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

/** Literal hex values, for the few places CSS variables cannot reach. */
export const rawColors = {
  empire500: "#c8102e",
  empire700: "#85091e",
  empire900: "#4a0812",
  paper: "#ffffff",
  ink: "#1b1d21",
  gold: "#e4a11b",
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
