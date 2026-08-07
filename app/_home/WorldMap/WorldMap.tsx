"use client";

import { createPortal } from "react-dom";
import { styled } from "@linaria/react";

import CountryCallout from "./CountryCallout";
import MapPin from "./MapPin";
import { useWorldMap, type RegionFilter } from "./hooks";
import type { MapPointViewModel, RegionFilterViewModel } from "./mapPoints";

export interface WorldMapProps {
  points: readonly MapPointViewModel[];
  regions: readonly RegionFilterViewModel[];
}

/**
 * The world map: the site's first view, and the only interactive one.
 *
 * Google paints the tiles; everything on top of them is ours. The pins are DOM
 * elements portalled into a custom overlay (see `mapOverlay.ts`) so they can be
 * styled with the same tokens as the rest of the site, and the tiles themselves are
 * restyled by the palette in `lib/maps.ts`.
 *
 * Behaviour lives in `hooks.ts`. This file only renders.
 */
export default function WorldMap({ points, regions }: WorldMapProps) {
  const {
    status,
    mapNodeRef,
    overlayContainer,
    visiblePoints,
    activeRegion,
    showRegion,
    selectedPoint,
    selectPoint,
    clearSelection,
    pinRef,
  } = useWorldMap(points);

  const filters: { key: RegionFilter; label: string; count: number }[] = [
    { key: "all", label: "Every nation", count: points.length },
    ...regions.map((region) => ({
      key: region.slug as RegionFilter,
      label: region.name,
      count: region.count,
    })),
  ];

  return (
    <Shell>
      <Header>
        <Mark aria-hidden="true">
          <Dot />
        </Mark>
        <TitleBlock>
          <Title>The Independence Map</Title>
          <Subtitle>
            {points.length} nations · {regions.length} regions · one pin per capital
          </Subtitle>
        </TitleBlock>
      </Header>

      <Filters aria-label="Filter the map by region">
        {filters.map((filter) => (
          <Filter
            key={filter.key}
            type="button"
            onClick={() => showRegion(filter.key)}
            data-active={activeRegion === filter.key ? "true" : undefined}
            aria-pressed={activeRegion === filter.key}
          >
            {filter.label}
            <Count>{filter.count}</Count>
          </Filter>
        ))}
      </Filters>

      <Canvas>
        <MapNode ref={mapNodeRef} role="application" aria-label="World map of independence" />

        {status !== "ready" && (
          <Notice role="status">
            {status === "loading"
              ? "Drawing the map…"
              : "The map could not be loaded. Every nation is listed below."}
          </Notice>
        )}

        {overlayContainer &&
          createPortal(
            visiblePoints.map((point) => (
              <MapPin
                key={point.slug}
                point={point}
                isSelected={selectedPoint?.slug === point.slug}
                onSelect={selectPoint}
                anchorRef={pinRef(point.slug)}
              />
            )),
            overlayContainer,
          )}

        {selectedPoint && <CountryCallout point={selectedPoint} onClose={clearSelection} />}
      </Canvas>

      <Legend>
        <LegendItem>
          <Swatch aria-hidden="true" />
          Each pin carries the nation&rsquo;s own flag colours
        </LegendItem>
        <LegendItem>
          <SwatchRing aria-hidden="true" />
          The nation currently open
        </LegendItem>
        <LegendNote>Two fingers to pan on a touch screen.</LegendNote>
      </Legend>
    </Shell>
  );
}

/* Matches YearCalendar's shell: these are the two views of the same atlas, and they
   are meant to read as the same object with different contents. */
const Shell = styled.div`
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--surface);
  box-shadow: 0 24px 60px rgba(20, 24, 31, 0.14);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s-4);
  padding: var(--s-5) var(--s-6);
  border-bottom: 1px solid var(--line);
`;

const Mark = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--empire-500);
  /* rgba mirrors --empire-500 — custom properties cannot carry alpha on their own. */
  box-shadow: 0 0 0 4px rgba(200, 16, 46, 0.16);
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--paper);
`;

const TitleBlock = styled.div``;

const Title = styled.p`
  margin: 0;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 20px;
`;

const Subtitle = styled.p`
  margin: var(--s-1) 0 0;
  font-size: 12.5px;
  color: var(--ink-3);
`;

const Filters = styled.div`
  display: flex;
  gap: var(--s-2);
  padding: var(--s-4) var(--s-6);
  border-bottom: 1px solid var(--line);
  overflow-x: auto;
  scrollbar-width: none;
`;

const Filter = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  flex-shrink: 0;
  padding: 6px 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-pill);
  background: var(--surface);
  color: var(--ink-2);
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.2;
  cursor: pointer;
  transition:
    background var(--dur) var(--ease),
    border-color var(--dur) var(--ease),
    color var(--dur) var(--ease);

  &:hover {
    border-color: var(--empire-100);
    color: var(--empire-700);
  }

  &[data-active="true"] {
    background: var(--empire-500);
    border-color: var(--empire-500);
    color: var(--paper);
  }
`;

const Count = styled.span`
  font-family: var(--font-mono);
  font-size: 11px;
  opacity: 0.7;
`;

const Canvas = styled.div`
  position: relative;
  height: clamp(380px, 62vh, 620px);
  background: var(--ocean);
`;

const MapNode = styled.div`
  width: 100%;
  height: 100%;
`;

const Notice = styled.p`
  position: absolute;
  inset: 0;
  z-index: 4;
  display: grid;
  place-items: center;
  margin: 0;
  padding: var(--s-8);
  text-align: center;
  background: var(--paper-2);
  color: var(--ink-2);
  font-size: 14.5px;
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-5);
  padding: var(--s-4) var(--s-6);
  border-top: 1px solid var(--line);
  font-size: 12.5px;
  color: var(--ink-2);
`;

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
`;

/* A sample pin: three arbitrary bands standing in for "a flag", not any one flag. */
const Swatch = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(
    180deg,
    var(--ocean) 0% 33%,
    var(--gold) 33% 66%,
    var(--success) 66% 100%
  );
  box-shadow: 0 0 0 2px var(--paper), var(--sh-flat);
`;

const SwatchRing = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--paper-2);
  box-shadow:
    0 0 0 2px var(--paper),
    0 0 0 4px var(--empire-500);
`;

const LegendNote = styled.span`
  color: var(--ink-3);

  @media (max-width: 640px) {
    display: none;
  }
`;
