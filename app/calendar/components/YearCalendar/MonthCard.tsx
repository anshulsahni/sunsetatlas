import { styled } from "@linaria/react";

import DayCell from "./DayCell";
import type { MonthGridViewModel } from "./calendarGrid";

export interface MonthCardProps {
  month: MonthGridViewModel;
}

/** One cell of the year grid: a month's name, its nation count, and every day in it. */
export default function MonthCard({ month }: MonthCardProps) {
  return (
    <Cell data-busiest={month.isBusiest ? "true" : undefined}>
      <Header>
        <Name>{month.name}</Name>
        <Count>{month.count}</Count>
      </Header>
      <Days>
        {month.days.map((day) => (
          <DayCell key={day.day} cell={day} />
        ))}
      </Days>
    </Cell>
  );
}

const Cell = styled.div`
  background: var(--paper);
  padding: 14px 15px;

  &[data-busiest="true"] {
    background: var(--empire-50);
    box-shadow: inset 0 0 0 1.5px var(--empire-300);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--s-3);
`;

const Name = styled.h3`
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 15px;
`;

const Count = styled.span`
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--empire-600);
`;

const Days = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
`;
