/*
 * `WorldMap` and `hooks` are client modules; `mapPoints` is not. Only the view-model
 * builder is re-exported from here as a value — a helper that lives inside a
 * `"use client"` file cannot be called from a server component, so `selectRegionPoints`
 * is deliberately left where it is rather than exposed through this barrel.
 */
export { default } from "./WorldMap";
export type { WorldMapProps } from "./WorldMap";
export { default as MapUnavailable } from "./MapUnavailable";
export { computeWorldMapViewModel } from "./mapPoints";
export type {
  MapPointViewModel,
  RegionFilterViewModel,
  WorldMapViewModel,
} from "./mapPoints";
