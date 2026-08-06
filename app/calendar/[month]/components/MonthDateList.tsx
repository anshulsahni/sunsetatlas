import Link from "next/link";
import { styled } from "@linaria/react";
import { ArrowRight } from "lucide-react";

import FlagDisc from "@/app/components/FlagDisc";
import Panel from "@/app/components/Panel";
import type { IndependenceDay } from "@/lib/countries";
import { routes } from "@/lib/routes";

export interface MonthDateListProps {
  /** One entry per distinct date in the month, in day order. */
  days: readonly IndependenceDay[];
}

/**
 * The month page's reading view: one row per date, each linking to its
 * `/on-this-day/[date]` page. Rows with more than one nation stack their flag discs
 * and say how many share the day instead of trying to fit every name.
 */
export default function MonthDateList({ days }: MonthDateListProps) {
  return (
    <List>
      {days.map((entry) => {
        const isShared = entry.countries.length > 1;
        const headline = entry.countries.map((country) => country.name).join(", ");
        const meta = isShared
          ? `${entry.countries.length} nations celebrate on this date`
          : `from ${entry.countries[0].nameBeforeBritish} · ${entry.countries[0].independence.year}`;

        return (
          <Row key={entry.slug} href={routes.day(entry.day, entry.month)}>
            <DayNumber>{entry.day}</DayNumber>
            <Discs aria-hidden="true">
              {entry.countries.map((country) => (
                <Disc key={country.slug} palette={country.palette} size={36} />
              ))}
            </Discs>
            <Body>
              <Headline>{headline}</Headline>
              <Meta>{meta}</Meta>
            </Body>
            <Arrow aria-hidden="true">
              <ArrowRight size={20} />
            </Arrow>
          </Row>
        );
      })}
    </List>
  );
}

const List = styled(Panel)`
  padding: 0;
  overflow: hidden;
`;

const Row = styled(Link)`
  display: grid;
  grid-template-columns: 52px auto 1fr auto;
  align-items: center;
  gap: var(--s-4);
  padding: 14px;
  color: var(--ink);
  transition: background var(--dur) var(--ease);

  & + & {
    border-top: 1px solid var(--line-softer);
  }

  &:hover {
    color: var(--ink);
    background: var(--empire-50);
  }
`;

const DayNumber = styled.span`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 26px;
  color: var(--empire-700);
  text-align: center;
`;

const Discs = styled.div`
  display: flex;
`;

const Disc = styled(FlagDisc)`
  &:not(:first-child) {
    margin-left: -14px;
  }
`;

const Body = styled.div`
  min-width: 0;
`;

const Headline = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.p`
  margin: var(--s-1) 0 0;
  font-size: 13px;
  color: var(--ink-3);
`;

const Arrow = styled.span`
  display: inline-flex;
  color: var(--empire-500);
`;
