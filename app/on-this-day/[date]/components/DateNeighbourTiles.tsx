import Link from "next/link";
import { styled } from "@linaria/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { IndependenceDay } from "@/lib/countries";
import { formatDayMonth } from "@/lib/dates";
import { routes } from "@/lib/routes";

export interface DateNeighbourTilesProps {
  previous?: IndependenceDay;
  next?: IndependenceDay;
}

function headline(entry: IndependenceDay): string {
  return entry.countries.length === 1
    ? entry.countries[0].name
    : `${entry.countries[0].name} +${entry.countries.length - 1}`;
}

/** Bordered previous/next tiles that page between the calendar's distinct dates. */
export default function DateNeighbourTiles({ previous, next }: DateNeighbourTilesProps) {
  if (!previous && !next) return null;

  return (
    <Grid>
      {previous && (
        <Tile href={routes.day(previous.day, previous.month)}>
          <ChevronLeft size={18} aria-hidden="true" />
          <TileBody>
            <Label>{formatDayMonth(previous.day, previous.month)}</Label>
            <Value>{headline(previous)}</Value>
          </TileBody>
        </Tile>
      )}
      {next && (
        <Tile href={routes.day(next.day, next.month)}>
          <TileBody data-align="end">
            <Label>{formatDayMonth(next.day, next.month)}</Label>
            <Value>{headline(next)}</Value>
          </TileBody>
          <ChevronRight size={18} aria-hidden="true" />
        </Tile>
      )}
    </Grid>
  );
}

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
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
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-3);
`;

const Value = styled.p`
  margin: var(--s-1) 0 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
`;
