import { styled } from "@linaria/react";

import ViewSwitcher from "@/app/components/ViewSwitcher";
import { hasGoogleMapsKey } from "@/lib/maps";

import WorldMap, { MapUnavailable, computeWorldMapViewModel } from "./WorldMap";

/**
 * The map half of the home page: the view switcher, and the map itself.
 *
 * A server component. It builds the pins from the dataset and hands them to the
 * client map, which is the only part that needs JavaScript — and decides here, at
 * build time, whether there is a key to draw with at all.
 */
export default function MapView() {
  const { points, regions } = computeWorldMapViewModel();

  return (
    <>
      <SwitcherRow>
        <ViewSwitcher active="map" />
        <Hint>
          The same {points.length} nations, arranged by place here and by date on the calendar.
        </Hint>
      </SwitcherRow>

      {hasGoogleMapsKey() ? <WorldMap points={points} regions={regions} /> : <MapUnavailable />}
    </>
  );
}

const SwitcherRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-4);
  flex-wrap: wrap;
  margin-bottom: var(--s-5);
`;

const Hint = styled.p`
  margin: 0;
  font-size: 13.5px;
  color: var(--ink-3);

  @media (max-width: 640px) {
    display: none;
  }
`;
