import { styled } from "@linaria/react";

import { buildBands } from "@/app/components/FlagDisc";

import type { MapPointViewModel } from "./mapPoints";

export interface MapPinProps {
  point: MapPointViewModel;
  isSelected: boolean;
  onSelect: (slug: string) => void;
  /** Ref callback from `useWorldMap` — the overlay positions this element. */
  anchorRef: (element: HTMLDivElement | null) => void;
}

/**
 * One nation on the map.
 *
 * The pin face carries the nation's flag colours, not a token: "the empire was red,
 * the nations are every colour" is the palette's whole argument, and a map of the
 * places the empire left is the one screen where it can be shown all at once. Empire
 * red is kept for the ring on the selected pin, where it means the imperial layer
 * the reader is about to read about.
 *
 * `Anchor` carries no position of its own — `mapOverlay` writes a `transform` onto
 * it on every redraw.
 */
export default function MapPin({ point, isSelected, onSelect, anchorRef }: MapPinProps) {
  const label = `${point.name} — independence ${point.dateLabel}`;

  return (
    <Anchor ref={anchorRef} data-selected={isSelected ? "true" : undefined}>
      {isSelected && <Halo aria-hidden="true" />}
      <Pin
        type="button"
        aria-label={label}
        aria-pressed={isSelected}
        onClick={() => onSelect(point.slug)}
        style={{ backgroundImage: buildBands(point.palette.flagStops) }}
      />
      <Label data-pin-label="true" aria-hidden="true">
        {point.name}
      </Label>
    </Anchor>
  );
}

const Anchor = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  /* The overlay container opts out of pointer events; each pin opts back in. */
  pointer-events: auto;
  z-index: 1;

  &:hover,
  &:focus-within,
  &[data-selected="true"] {
    z-index: 3;
  }

  /* The name tag is addressed by attribute rather than by interpolating the Label
     styled component into this block. Interpolating one styled component into
     another's selector makes the wyw-in-js transform drop both declarations, and
     this codebase reaches for data attributes everywhere anyway. */
  &:hover [data-pin-label],
  &:focus-within [data-pin-label] {
    opacity: 1;
  }
`;

const Pin = styled.button`
  display: block;
  width: 16px;
  height: 16px;
  padding: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background-color: var(--paper);
  background-repeat: no-repeat;
  box-shadow:
    0 0 0 2px var(--paper),
    var(--sh-flat);
  transition:
    transform var(--dur) var(--ease),
    box-shadow var(--dur) var(--ease);

  &:hover,
  &:focus-visible {
    transform: scale(1.4);
    box-shadow:
      0 0 0 2px var(--paper),
      0 0 0 4px var(--empire-500);
  }

  [data-selected="true"] & {
    transform: scale(1.5);
    box-shadow:
      0 0 0 2px var(--paper),
      0 0 0 4px var(--empire-500);
  }
`;

/*
 * The selected pin's pulse, on a ring of its own so it does not fight the pin's own
 * box-shadow.
 *
 * The keyframes are declared here rather than reused from `globals.css`: Linaria
 * compiles each block into a CSS module, which rewrites `animation-name` to a scoped
 * identifier — a global keyframe cannot be reached by name from inside a styled
 * block. The rgba mirrors --empire-500, the same trick globals.css uses.
 */
const Halo = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border-radius: 50%;
  pointer-events: none;
  animation: pin-pulse 2s var(--ease) infinite;

  @keyframes pin-pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(200, 16, 46, 0.45);
    }
    70% {
      box-shadow: 0 0 0 14px rgba(200, 16, 46, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(200, 16, 46, 0);
    }
  }
`;

const Label = styled.span`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 9px;
  border-radius: var(--r-pill);
  background: var(--ink);
  color: var(--paper);
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  /* Shown by Anchor's :hover / :focus-within rules, matched on data-pin-label. */
  transition: opacity var(--dur) var(--ease);
`;
