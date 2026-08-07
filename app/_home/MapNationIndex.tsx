import Link from "next/link";
import { styled } from "@linaria/react";

import { REGIONS, getCountriesByRegion } from "@/lib/countries";
import { routes } from "@/lib/routes";

/**
 * Every nation on the map, as text.
 *
 * The map is canvas and JavaScript: a crawler sees nothing on it, a reader without
 * JavaScript sees nothing on it, and a screen reader would have to tab 66 pins to
 * find one country. This list is the same 66 pins in the same eight groups, rendered
 * on the server, and it is the reason the map is allowed to be a map — no link out
 * of the home page depends on the map having drawn.
 */
export default function MapNationIndex() {
  return (
    <Groups>
      {REGIONS.map((region) => {
        const countries = getCountriesByRegion(region.slug);
        if (countries.length === 0) return null;

        return (
          <Group key={region.slug}>
            <GroupHead>
              <RegionLink href={routes.region(region.slug)}>{region.name}</RegionLink>
              <Count>{countries.length}</Count>
            </GroupHead>
            <Names>
              {countries.map((country) => (
                <li key={country.slug}>
                  <NameLink href={routes.country(country.slug)}>{country.name}</NameLink>
                </li>
              ))}
            </Names>
          </Group>
        );
      })}
    </Groups>
  );
}

const Groups = styled.div`
  display: grid;
  gap: var(--s-5);
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Group = styled.section`
  padding: var(--s-5);
  border: 1px solid var(--line-soft);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--sh-flat);
`;

const GroupHead = styled.h3`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--s-3);
  margin: 0 0 var(--s-3);
  padding-bottom: var(--s-3);
  border-bottom: 1px solid var(--line-softer);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 16px;
`;

const RegionLink = styled(Link)`
  color: var(--ink);

  &:hover {
    color: var(--empire-700);
  }
`;

const Count = styled.span`
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 400;
  color: var(--ink-3);
`;

const Names = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-2);
  margin: 0;
  padding: 0;
  list-style: none;
`;

const NameLink = styled(Link)`
  display: inline-flex;
  padding: 5px 11px;
  border-radius: var(--r-pill);
  background: var(--paper-2);
  color: var(--ink-2);
  font-size: 13px;
  font-weight: 600;
  transition:
    background var(--dur) var(--ease),
    color var(--dur) var(--ease);

  &:hover {
    background: var(--empire-50);
    color: var(--empire-700);
  }
`;
