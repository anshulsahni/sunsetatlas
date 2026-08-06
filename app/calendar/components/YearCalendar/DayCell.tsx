import Link from "next/link";
import { styled } from "@linaria/react";

import { formatDayMonth } from "@/lib/dates";
import { routes } from "@/lib/routes";

import type { DayCellViewModel } from "./calendarGrid";

export interface DayCellProps {
  cell: DayCellViewModel;
}

/**
 * One day of a month cell. A day nobody celebrates on is a plain, unlinked number —
 * there is no page for an empty day. A day with an independence links to
 * `/on-this-day/[date]`, shaded to say at a glance whether it is one nation or several.
 */
export default function DayCell({ cell }: DayCellProps) {
  const { day, month, status, countries } = cell;

  if (status === "empty") {
    return <Empty aria-hidden="true">{day}</Empty>;
  }

  const label = `${formatDayMonth(day, month)} — ${countries.map((country) => country.name).join(", ")}`;

  return (
    <Cell href={routes.day(day, month)} data-status={status} aria-label={label}>
      {day}
    </Cell>
  );
}

const Empty = styled.span`
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--ink-disabled);
`;

const Cell = styled(Link)`
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border-radius: 5px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  color: var(--paper);
  background: var(--empire-500);
  transition: transform var(--dur) var(--ease);

  &:hover,
  &:focus-visible {
    color: var(--paper);
    transform: translateY(-1px);
  }

  &[data-status="shared"] {
    background: var(--empire-900);
  }
`;
