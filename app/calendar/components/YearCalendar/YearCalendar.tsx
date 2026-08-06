import { styled } from "@linaria/react";

import type { AtlasTotals } from "@/lib/countries";

import MonthCard from "./MonthCard";
import { computeYearGridViewModel } from "./calendarGrid";

export interface YearCalendarProps {
  totals: AtlasTotals;
}

/**
 * The year-at-a-glance grid: the site's primary view. Twelve month cells, each a
 * miniature day grid with no weekday offset — these are anniversaries, not a
 * particular year's calendar, so only the day numbers carry meaning.
 */
export default function YearCalendar({ totals }: YearCalendarProps) {
  const months = computeYearGridViewModel();

  return (
    <Shell>
      <Header>
        <Mark aria-hidden="true">
          <Dot />
        </Mark>
        <TitleBlock>
          <Title>Independence Calendar</Title>
          <Subtitle>
            {totals.countries} nations · {totals.distinctDays} distinct days of celebration
          </Subtitle>
        </TitleBlock>
      </Header>

      <Grid>
        {months.map((month) => (
          <MonthCard key={month.month} month={month} />
        ))}
      </Grid>

      <Legend>
        <LegendItem>
          <Swatch data-tone="single" aria-hidden="true" />
          Independence day
        </LegendItem>
        <LegendItem>
          <Swatch data-tone="shared" aria-hidden="true" />
          Shared by several nations
        </LegendItem>
        <LegendItem>
          <Swatch data-tone="busiest" aria-hidden="true" />
          Busiest month
        </LegendItem>
      </Legend>
    </Shell>
  );
}

const Shell = styled.div`
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--surface);
  /* Heavier than --sh-card by design — this is the site's primary card. */
  box-shadow: 0 24px 60px rgba(20, 24, 31, 0.14);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s-4);
  padding: var(--s-5) var(--s-6);
  border-bottom: 1px solid var(--line);
`;

const Mark = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--empire-500);
  /* rgba mirrors --empire-500 — custom properties can't carry alpha on their own,
     same trick app/globals.css uses for the atlas-pulse keyframes. */
  box-shadow: 0 0 0 4px rgba(200, 16, 46, 0.16);
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--paper);
`;

const TitleBlock = styled.div``;

const Title = styled.p`
  margin: 0;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 20px;
`;

const Subtitle = styled.p`
  margin: var(--s-1) 0 0;
  font-size: 12.5px;
  color: var(--ink-3);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--line-soft);

  @media (max-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-5);
  padding: var(--s-4) var(--s-6);
  border-top: 1px solid var(--line);
  font-size: 12.5px;
  color: var(--ink-2);
`;

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
`;

const Swatch = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: var(--r-sm);
  background: var(--empire-500);

  &[data-tone="shared"] {
    background: var(--empire-900);
  }

  &[data-tone="busiest"] {
    background: var(--empire-50);
    box-shadow: inset 0 0 0 1.5px var(--empire-300);
  }
`;
