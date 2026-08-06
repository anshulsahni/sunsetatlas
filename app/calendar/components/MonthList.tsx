import Link from "next/link";
import { styled } from "@linaria/react";

import { getCountriesInMonth } from "@/lib/countries";
import { MONTH_NUMBERS, monthName } from "@/lib/dates";
import { routes } from "@/lib/routes";

/**
 * The twelve links down to `/calendar/[month]`, below the year grid. This is what
 * makes the hub-and-spoke rule hold for the calendar: every hub links to all of its
 * spokes, no pagination.
 */
export default function MonthList() {
  return (
    <List>
      {MONTH_NUMBERS.map((month) => {
        const count = getCountriesInMonth(month).length;

        return (
          <Item key={month}>
            <Tile href={routes.month(month)}>
              <Name>{monthName(month)}</Name>
              <Count>{count === 1 ? "1 nation" : `${count} nations`}</Count>
            </Tile>
          </Item>
        );
      })}
    </List>
  );
}

const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--s-4);
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 460px) {
    grid-template-columns: 1fr;
  }
`;

const Item = styled.li`
  margin: 0;
`;

const Tile = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-3);
  padding: var(--s-4) var(--s-5);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--sh-flat);
  color: var(--ink);
  transition:
    box-shadow var(--dur) var(--ease),
    transform var(--dur) var(--ease);

  &:hover {
    color: var(--ink);
    box-shadow: var(--sh-card);
    transform: translateY(-2px);
  }
`;

const Name = styled.span`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
`;

const Count = styled.span`
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--empire-600);
`;
