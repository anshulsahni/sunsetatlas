"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

import type { RegionSlug } from "@/lib/countries";
import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_VERSION,
  WORLD_CAMERA,
  buildMapOptions,
} from "@/lib/maps";

import { createPinOverlay, type PinOverlay, type ProjectToPixel } from "./mapOverlay";
import type { MapPointViewModel } from "./mapPoints";

declare global {
  interface Window {
    /**
     * The Maps API calls this when the key is missing, invalid, or over quota. It is
     * not in `@types/google.maps` because it is a global the *page* provides, not
     * something the SDK exports.
     */
    gm_authFailure?: () => void;
  }
}

/** `all` is a state, not a region — hence the union rather than an optional slug. */
export type RegionFilter = RegionSlug | "all";

export type MapStatus = "loading" | "ready" | "error";

export interface WorldMapController {
  status: MapStatus;
  /** Attach to the element the map paints into. */
  mapNodeRef: React.RefObject<HTMLDivElement | null>;
  /** The overlay's element. Pins are portalled into it once it exists. */
  overlayContainer: HTMLDivElement | null;
  visiblePoints: readonly MapPointViewModel[];
  activeRegion: RegionFilter;
  showRegion: (region: RegionFilter) => void;
  selectedPoint: MapPointViewModel | null;
  selectPoint: (slug: string) => void;
  clearSelection: () => void;
  /** Ref callback for a pin element, so the overlay can position it. */
  pinRef: (slug: string) => (element: HTMLDivElement | null) => void;
}

/** Padding around a fitted region, in pixels. Keeps pins clear of the map's edges. */
const FIT_PADDING = 48;

/**
 * Filters the pins for a region. Exported so the filtering can be checked without
 * a map, a browser, or a Google API key.
 */
export function selectRegionPoints(
  points: readonly MapPointViewModel[],
  region: RegionFilter,
): readonly MapPointViewModel[] {
  return region === "all" ? points : points.filter((point) => point.region === region);
}

/**
 * Loads the Maps JavaScript API, builds the map, and owns everything that happens
 * on it: which pins are visible, which nation is selected, and where the camera is.
 *
 * The map is created exactly once, on mount. Nothing here runs on the server — the
 * API needs `window`, and the key is only inlined into the browser bundle.
 */
export function useWorldMap(points: readonly MapPointViewModel[]): WorldMapController {
  const [status, setStatus] = useState<MapStatus>("loading");
  const [overlayContainer, setOverlayContainer] = useState<HTMLDivElement | null>(null);
  const [activeRegion, setActiveRegion] = useState<RegionFilter>("all");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const overlayRef = useRef<PinOverlay | null>(null);
  const pinElements = useRef(new Map<string, HTMLDivElement>());
  const pinCallbacks = useRef(new Map<string, (element: HTMLDivElement | null) => void>());

  /* The positioner runs on every frame the map redraws, so it reads the points
     through a ref rather than closing over a value that would go stale. */
  const pointsRef = useRef(points);
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  const visiblePoints = useMemo(
    () => selectRegionPoints(points, activeRegion),
    [points, activeRegion],
  );

  const selectedPoint = useMemo(
    () => visiblePoints.find((point) => point.slug === selectedSlug) ?? null,
    [visiblePoints, selectedSlug],
  );

  /* -- Placing the pins ---------------------------------------------------- */

  /*
   * Runs on every frame the map redraws, so it writes `transform` straight onto the
   * pin elements. Routing this through React state would re-render 66 components
   * per frame of a pan.
   */
  const positionPins = useCallback((project: ProjectToPixel) => {
    const bySlug = new Map(pointsRef.current.map((point) => [point.slug, point]));

    for (const [slug, element] of pinElements.current) {
      const point = bySlug.get(slug);
      const pixel = point ? project(point.position) : null;

      if (!pixel) {
        element.style.visibility = "hidden";
        continue;
      }

      element.style.visibility = "";
      element.style.transform = `translate(${pixel.x}px, ${pixel.y}px) translate(-50%, -50%)`;
    }
  }, []);

  const pinRef = useCallback((slug: string) => {
    const existing = pinCallbacks.current.get(slug);
    if (existing) return existing;

    const callback = (element: HTMLDivElement | null) => {
      if (element) pinElements.current.set(slug, element);
      else pinElements.current.delete(slug);
    };

    pinCallbacks.current.set(slug, callback);
    return callback;
  }, []);

  /* -- The map itself ------------------------------------------------------ */

  useEffect(() => {
    let cancelled = false;

    async function build() {
      try {
        setOptions({ key: GOOGLE_MAPS_API_KEY, v: GOOGLE_MAPS_VERSION });
        const maps = await importLibrary("maps");
        if (cancelled || !mapNodeRef.current) return;

        const map = new maps.Map(mapNodeRef.current, buildMapOptions());
        mapRef.current = map;

        const overlay = createPinOverlay(maps, map, positionPins);
        overlayRef.current = overlay;

        /* Clicking bare sea or land dismisses the open nation. */
        map.addListener("click", () => setSelectedSlug(null));

        setOverlayContainer(overlay.container);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    /*
     * A bad or over-quota key fails *after* the script loads, through this global
     * hook rather than a rejected promise, so it needs catching separately.
     */
    const previousAuthFailure = window.gm_authFailure;
    window.gm_authFailure = () => {
      setStatus("error");
      previousAuthFailure?.();
    };

    void build();

    return () => {
      cancelled = true;
      window.gm_authFailure = previousAuthFailure;
      overlayRef.current?.destroy();
      overlayRef.current = null;
      mapRef.current = null;
    };
    /* Built once: the map is imperative from here on, and re-creating it would
       throw away the reader's camera. `positionPins` is stable by construction. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Pins are React's to render and the overlay's to place, so every change to the
     rendered set needs one redraw once the DOM has settled. */
  useEffect(() => {
    overlayRef.current?.redraw();
  }, [visiblePoints, overlayContainer]);

  /* -- Camera -------------------------------------------------------------- */

  /* Skips the first run: the map is already framed on the world when it is built. */
  const framedRegion = useRef<RegionFilter>("all");
  useEffect(() => {
    const map = mapRef.current;
    if (!map || framedRegion.current === activeRegion) return;
    framedRegion.current = activeRegion;

    if (activeRegion === "all" || visiblePoints.length === 0) {
      map.setCenter({ ...WORLD_CAMERA.center });
      map.setZoom(WORLD_CAMERA.zoom);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    for (const point of visiblePoints) bounds.extend(point.position);
    map.fitBounds(bounds, FIT_PADDING);
  }, [activeRegion, visiblePoints, status]);

  const showRegion = useCallback((region: RegionFilter) => {
    setActiveRegion(region);
    setSelectedSlug(null);
  }, []);

  const selectPoint = useCallback((slug: string) => {
    setSelectedSlug(slug);

    const point = pointsRef.current.find((entry) => entry.slug === slug);
    if (point) mapRef.current?.panTo(point.position);
  }, []);

  const clearSelection = useCallback(() => setSelectedSlug(null), []);

  /* Escape closes the open nation, the same as clicking the map. */
  useEffect(() => {
    if (!selectedSlug) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedSlug(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedSlug]);

  return {
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
  };
}
