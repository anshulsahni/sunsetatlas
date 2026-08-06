import type { Coordinates } from "@/lib/countries";

/**
 * The custom overlay the pins live in.
 *
 * Google's own markers are not an option here. `Marker` is deprecated, and
 * `AdvancedMarkerElement` requires a cloud `mapId`, which in turn overrides the
 * `styles` array — and the palette in `lib/maps.ts` is the whole reason the map
 * exists in this design. So the pins are ordinary DOM: one `OverlayView` owns a
 * container, React renders the pins into it through a portal, and this module puts
 * them where they belong on every frame the map redraws.
 *
 * There is deliberately **one** overlay for all 66 pins rather than one each. An
 * `OverlayView` per pin means 66 `draw()` calls per frame; this way there is one,
 * and it moves the pins by writing `transform` directly — no React render is
 * involved in panning or zooming.
 */

/** Projects a nation's coordinates to pixels inside the overlay container. */
export type ProjectToPixel = (position: Coordinates) => { x: number; y: number } | null;

/** Called on every map redraw, and whenever the caller asks for one. */
export type PinPositioner = (project: ProjectToPixel) => void;

export interface PinOverlay {
  /** The element pins are portalled into. */
  readonly container: HTMLDivElement;
  /** Repositions the pins now, without waiting for the map to move. */
  redraw(): void;
  /** Detaches the overlay from the map. */
  destroy(): void;
}

/**
 * Creates and attaches the overlay.
 *
 * `google.maps.OverlayView` only exists once the Maps library has loaded, so the
 * subclass is declared inside this function rather than at module scope — importing
 * this file must not require the API to be present.
 */
export function createPinOverlay(
  maps: google.maps.MapsLibrary,
  map: google.maps.Map,
  position: PinPositioner,
): PinOverlay {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "0";
  container.style.height = "0";
  /* The container is a coordinate origin, not a surface — only pins take clicks. */
  container.style.pointerEvents = "none";

  class AtlasPinOverlay extends maps.OverlayView {
    onAdd(): void {
      /* overlayMouseTarget is the one pane whose children receive mouse events. */
      this.getPanes()?.overlayMouseTarget.appendChild(container);
    }

    draw(): void {
      const projection = this.getProjection();
      if (!projection) return;

      position((coordinates) => {
        const pixel = projection.fromLatLngToDivPixel(
          new google.maps.LatLng(coordinates.lat, coordinates.lng),
        );
        return pixel ? { x: pixel.x, y: pixel.y } : null;
      });
    }

    onRemove(): void {
      container.remove();
    }
  }

  const overlay = new AtlasPinOverlay();
  overlay.setMap(map);

  return {
    container,
    redraw: () => overlay.draw(),
    destroy: () => overlay.setMap(null),
  };
}
