import Link from "next/link";
import { styled } from "@linaria/react";
import { ArrowRight, CalendarHeart } from "lucide-react";

import type { Country } from "@/lib/countries";
import { formatDayMonth } from "@/lib/dates";
import { routes } from "@/lib/routes";

export interface SharedDayPanelProps {
  day: number;
  month: number;
  /** The other nations on this date — never includes the current country. */
  otherCountries: readonly Country[];
}

/** Only rendered when at least one other nation shares this independence date. */
export default function SharedDayPanel({ day, month, otherCountries }: SharedDayPanelProps) {
  return (
    <Card href={routes.day(day, month)}>
      <IconSlot aria-hidden="true">
        <CalendarHeart size={18} />
      </IconSlot>
      <Body>
        <Title>Also on {formatDayMonth(day, month)}</Title>
        <Names>{otherCountries.map((country) => country.name).join(", ")}</Names>
      </Body>
      <ArrowRight size={18} aria-hidden="true" />
    </Card>
  );
}

const Card = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--s-3);
  padding: var(--s-4);
  border: 1px solid var(--empire-300);
  border-radius: var(--r-lg);
  background: var(--empire-50);
  color: var(--empire-700);

  svg:last-child {
    flex-shrink: 0;
  }
`;

const IconSlot = styled.span`
  display: inline-flex;
  flex-shrink: 0;
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.p`
  margin: 0 0 2px;
  font-weight: 700;
  font-size: 14px;
`;

const Names = styled.p`
  margin: 0;
  font-size: 13px;
  color: var(--empire-700);
  opacity: 0.85;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
