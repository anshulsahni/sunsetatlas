import Link from "next/link";
import { styled } from "@linaria/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { monthName } from "@/lib/dates";
import { routes } from "@/lib/routes";

export interface MonthNeighbourTilesProps {
  previous: number;
  next: number;
}

/** Bordered previous/next tiles that page between the twelve month spokes. */
export default function MonthNeighbourTiles({ previous, next }: MonthNeighbourTilesProps) {
  return (
    <Grid>
      <Tile href={routes.month(previous)}>
        <ChevronLeft size={18} aria-hidden="true" />
        <TileBody>
          <Label>Previous month</Label>
          <Value>{monthName(previous)}</Value>
        </TileBody>
      </Tile>
      <Tile href={routes.month(next)}>
        <TileBody data-align="end">
          <Label>Next month</Label>
          <Value>{monthName(next)}</Value>
        </TileBody>
        <ChevronRight size={18} aria-hidden="true" />
      </Tile>
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--s-4);

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Tile = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--s-3);
  padding: var(--s-4) var(--s-5);
  border: 1px solid var(--line);
  border-radius: 14px;
  color: var(--ink);
  background: var(--surface);
  transition:
    box-shadow var(--dur) var(--ease),
    transform var(--dur) var(--ease);

  &:last-child {
    justify-content: flex-end;
    text-align: right;
  }

  &:hover {
    color: var(--ink);
    box-shadow: var(--sh-card);
    transform: translateY(-2px);
  }
`;

const TileBody = styled.div`
  &[data-align="end"] {
    text-align: right;
  }
`;

const Label = styled.p`
  margin: 0;
  font-size: 12px;
  color: var(--ink-3);
`;

const Value = styled.p`
  margin: var(--s-1) 0 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
`;
