"use client";

import Link from "next/link";
import { styled } from "@linaria/react";

import FlagDisc from "@/app/components/FlagDisc";
import type { DatedCountry } from "@/lib/countries";
import { formatDayMonth } from "@/lib/dates";
import { routes } from "@/lib/routes";

import { useUpcomingAnniversaries } from "./hooks";

export interface ComingUpAnniversariesProps {
  /** Every dated nation — the client sorts this by real proximity after mount. */
  countries: readonly DatedCountry[];
  /**
   * A deterministic, calendar-ordered slice shown before mount and if JS never
   * runs. It carries no "in N days" figure, because that number is clock-dependent
   * and this markup is generated once at build time.
   */
  fallback: readonly DatedCountry[];
  limit?: number;
}

/**
 * The next handful of upcoming independence anniversaries.
 *
 * This is a client leaf on purpose: "how many days until X" is wrong the moment it
 * is baked into static HTML, so the real ordering and the "in N days" figure only
 * ever appear after mount, computed from the visitor's own clock.
 */
export default function ComingUpAnniversaries({
  countries,
  fallback,
  limit = 6,
}: ComingUpAnniversariesProps) {
  const entries = useUpcomingAnniversaries(countries, limit);

  if (!entries) {
    return (
      <List>
        {fallback.slice(0, limit).map((country) => (
          <Item key={country.slug}>
            <Row href={routes.country(country.slug)}>
              <FlagDisc palette={country.palette} size={40} />
              <Text>
                <Name>{country.name}</Name>
                <Meta>
                  {formatDayMonth(country.independence.day, country.independence.month)}
                </Meta>
              </Text>
            </Row>
          </Item>
        ))}
      </List>
    );
  }

  return (
    <List>
      {entries.map(({ country, daysUntil }) => (
        <Item key={country.slug}>
          <Row href={routes.country(country.slug)}>
            <FlagDisc palette={country.palette} size={40} />
            <Text>
              <Name>{country.name}</Name>
              <Meta>
                {formatDayMonth(country.independence.day, country.independence.month)} ·{" "}
                {daysUntil === 0 ? "Today" : `in ${daysUntil} day${daysUntil === 1 ? "" : "s"}`}
              </Meta>
            </Text>
          </Row>
        </Item>
      ))}
    </List>
  );
}

const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--s-3);
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Item = styled.li``;

const Row = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--s-3);
  padding: var(--s-3) var(--s-4);
  border: 1px solid var(--line-soft);
  border-radius: var(--r-md);
  background: var(--surface);
  color: var(--ink);
  transition: border-color var(--dur) var(--ease);

  &:hover {
    color: var(--ink);
    border-color: var(--empire-300);
  }
`;

const Text = styled.span`
  min-width: 0;
`;

const Name = styled.span`
  display: block;
  font-weight: 700;
  font-size: 14.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.span`
  display: block;
  margin-top: 2px;
  font-size: 12.5px;
  color: var(--ink-3);
`;
