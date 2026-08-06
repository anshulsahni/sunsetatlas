import { styled } from "@linaria/react";

import type { NationalPalette } from "@/lib/countries";

export interface FlagDiscProps {
  palette: NationalPalette;
  /** Diameter in pixels. The design uses 34 in cards, 56 in lists, 210 in heroes. */
  size?: number;
  /** Colour of the ring drawn around the disc — match it to the surface behind. */
  ringColor?: string;
  className?: string;
}

/**
 * The circular flag mark used wherever a nation is named.
 *
 * It is a stylised reduction of the flag to its colour bands, not the flag itself —
 * which is the point: no image assets, no licensing, and it stays legible at 14px.
 * It is decorative, so it carries `aria-hidden`; the country name always sits beside it.
 */
export default function FlagDisc({
  palette,
  size = 34,
  ringColor = "var(--paper)",
  className,
}: FlagDiscProps) {
  return (
    <Disc
      aria-hidden="true"
      className={className}
      style={{
        width: size,
        height: size,
        backgroundImage: buildBands(palette.flagStops),
        boxShadow: `0 0 0 3px ${ringColor}, 0 0 0 4px var(--line-soft)`,
      }}
    />
  );
}

/**
 * Turns flag colours into hard-edged bands of equal size.
 *
 * Each stop gets its own slice with no blending between them, so two adjacent
 * colours read as two bands rather than a gradient. `angle` is a CSS gradient
 * angle — 180deg stacks the bands (the disc), 90deg lays them side by side (the
 * stripe along the top of a country card).
 */
export function buildBands(stops: readonly string[], angle = "180deg"): string {
  if (stops.length === 0) return "none";
  if (stops.length === 1) return `linear-gradient(${stops[0]}, ${stops[0]})`;

  const bandSize = 100 / stops.length;
  const segments = stops.map(
    (color, index) => `${color} ${index * bandSize}% ${(index + 1) * bandSize}%`,
  );

  return `linear-gradient(${angle}, ${segments.join(", ")})`;
}

const Disc = styled.span`
  display: block;
  flex-shrink: 0;
  border-radius: 50%;
`;
