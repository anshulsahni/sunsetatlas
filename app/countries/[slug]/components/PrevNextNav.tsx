import Link from "next/link";
import { styled } from "@linaria/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { Country } from "@/lib/countries";
import { routes } from "@/lib/routes";

export interface PrevNextNavProps {
  previous?: Country;
  next?: Country;
}

/** The "previous / next nation" pair at the very bottom of a country page. */
export default function PrevNextNav({ previous, next }: PrevNextNavProps) {
  if (!previous && !next) return null;

  return (
    <Grid>
      {previous ? (
        <Tile href={routes.country(previous.slug)} data-direction="previous">
          <ArrowLeft size={18} aria-hidden="true" />
          <div>
            <Kicker>Previous nation</Kicker>
            <Name>{previous.name}</Name>
          </div>
        </Tile>
      ) : (
        <span />
      )}

      {next ? (
        <Tile href={routes.country(next.slug)} data-direction="next">
          <div>
            <Kicker>Next nation</Kicker>
            <Name>{next.name}</Name>
          </div>
          <ArrowRight size={18} aria-hidden="true" />
        </Tile>
      ) : (
        <span />
      )}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-4);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Tile = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--s-3);
  padding: var(--s-5);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  background: var(--surface);
  color: var(--ink);
  transition:
    box-shadow var(--dur) var(--ease),
    transform var(--dur) var(--ease);

  &[data-direction="next"] {
    justify-content: space-between;
  }

  &:hover {
    color: var(--ink);
    box-shadow: var(--sh-card);
    transform: translateY(-2px);
  }

  svg {
    flex-shrink: 0;
    color: var(--empire-500);
  }
`;

const Kicker = styled.p`
  margin: 0 0 2px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
`;

const Name = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 16px;
`;
