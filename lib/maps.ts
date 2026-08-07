/**
 * Google Maps configuration for the world map on the home page.
 *
 * Everything here is data, not React: the API key, the camera the map opens on, and
 * the style array that repaints Google's default map in the atlas palette. The map
 * itself is built in `app/_home/WorldMap/`.
 */

import { rawColors } from "@/lib/theme";

/**
 * Inlined into the browser bundle at build time (that is what `NEXT_PUBLIC_` means),
 * so it is a *restricted* key, not a secret: lock it to the site's HTTP referrers and
 * to the Maps JavaScript API in the Google Cloud console.
 *
 * Unset is a supported state. Without a key the home page renders the country index
 * on its own rather than an error — see `WorldMap`.
 */
export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export function hasGoogleMapsKey(): boolean {
  return GOOGLE_MAPS_API_KEY.length > 0;
}

/** The Maps JavaScript API release the loader pins to. */
export const GOOGLE_MAPS_VERSION = "weekly";

/**
 * The opening camera: the whole world, centred on the Indian Ocean.
 *
 * Not on Greenwich. The empire's departures happened between the Caribbean and the
 * Pacific, and centring on Britain would push half the atlas off both edges.
 */
export const WORLD_CAMERA = {
  center: { lat: 12, lng: 46 },
  zoom: 2,
} as const;

/** How far the map may be zoomed. Past 6 there is nothing left to see but a pin. */
export const ZOOM_RANGE = { min: 2, max: 6 } as const;

/**
 * The atlas map style.
 *
 * Straight transcription of the design system's palette into Google's style schema:
 * `--paper` land, `--ocean` sea, `--line` borders, `--ink-2` labels. Roads, transit
 * and points of interest are switched off outright — this map is about which nations
 * exist and when they left, and a motorway junction is noise against that.
 *
 * Colours come from `rawColors` rather than `var(--token)` because this array is
 * handed to a canvas renderer that cannot resolve CSS custom properties.
 */
export const ATLAS_MAP_STYLE: google.maps.MapTypeStyle[] = [
  /* Sea. */
  { featureType: "water", elementType: "geometry", stylers: [{ color: rawColors.ocean }] },
  { featureType: "water", elementType: "labels", stylers: [{ visibility: "off" }] },

  /* Land: the same paper every card in the site is drawn on. */
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: rawColors.paper }] },
  {
    featureType: "landscape.man_made",
    elementType: "geometry",
    stylers: [{ color: rawColors.paper2 }],
  },

  /* Borders: the design's hairline, at the one weight that survives a world view. */
  {
    featureType: "administrative",
    elementType: "geometry.fill",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: rawColors.line }, { weight: 1.2 }],
  },
  {
    featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [{ color: rawColors.lineSoft }, { weight: 0.6 }],
  },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },

  /* Labels: country names only, in body ink on a paper halo. */
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: rawColors.ink2 }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.stroke",
    stylers: [{ color: rawColors.paper }, { weight: 2 }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.neighborhood",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },

  /* Everything the atlas has no use for. */
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

/**
 * Options the map is created with.
 *
 * Two deliberate choices. `gestureHandling: "greedy"` is *not* used — a full-width
 * map that swallows the page scroll is a trap on a touch device, so a one-finger
 * drag scrolls the page and two fingers pan the map. And no `mapId`: a cloud map ID
 * would override `styles` entirely, and the palette above is the whole point.
 */
export function buildMapOptions(): google.maps.MapOptions {
  return {
    center: { ...WORLD_CAMERA.center },
    zoom: WORLD_CAMERA.zoom,
    minZoom: ZOOM_RANGE.min,
    maxZoom: ZOOM_RANGE.max,
    styles: ATLAS_MAP_STYLE,
    backgroundColor: rawColors.ocean,
    gestureHandling: "cooperative",
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    rotateControl: false,
    scaleControl: false,
    zoomControl: true,
    clickableIcons: false,
    keyboardShortcuts: true,
    /* Stop the world repeating sideways, so a nation has exactly one pin. */
    restriction: {
      latLngBounds: { north: 83, south: -70, west: -180, east: 180 },
      strictBounds: false,
    },
  };
}
