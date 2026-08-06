import Link from "next/link";
import { styled } from "@linaria/react";
import { ArrowRight } from "lucide-react";

import type { Country } from "@/lib/countries";
import { decadeSlug } from "@/lib/dates";
import { routes } from "@/lib/routes";

export interface DecadeRowProps {
  decade: number;
  /** Every nation in this decade, in year order — the row lists them all. */
  countries: readonly Country[];
  /** A short dataset-derived line, e.g. "the busiest decade in the atlas". Omitted when nothing is honestly derivable. */
  observation?: string;
}

/**
 * One row of the `/timeline` spine: the decade label in big display type, its
 * count, and every nation in it as a compact link, in year order.
 */
export default function DecadeRow({ decade, countries, observation }: DecadeRowProps) {
  return (
    <Row>
      <Label href={routes.decade(decade)}>
        <DecadeName>{decadeSlug(decade)}</DecadeName>
        <Count>
          {countries.length} {countries.length === 1 ? "nation" : "nations"}
        </Count>
        {observation && <Observation>{observation}</Observation>}
        <ViewLink>
          View the {decadeSlug(decade)} <ArrowRight size={14} aria-hidden="true" />
        </ViewLink>
      </Label>

      <Nations>
        {countries.map((country) => (
          <NationItem key={country.slug}>
            <Link href={routes.country(country.slug)}>
              {country.name} <Year>{country.independence.year}</Year>
            </Link>
          </NationItem>
        ))}
      </Nations>
    </Row>
  );
}

const Row = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: var(--s-6);
  padding-block: var(--s-6);
  border-bottom: 1px solid var(--line-softer);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: var(--s-3);
  }
`;

const Label = styled(Link)`
  display: block;
  color: var(--ink);
`;

const DecadeName = styled.span`
  display: block;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(30px, 3.4vw, 40px);
  line-height: 1;
  letter-spacing: -0.01em;
`;

const Count = styled.span`
  display: block;
  margin-top: var(--s-2);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 13px;
  color: var(--empire-600);
`;

const Observation = styled.p`
  margin: var(--s-2) 0 0;
  max-width: 22ch;
  font-size: 13px;
  color: var(--ink-3);
`;

const ViewLink = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  margin-top: var(--s-3);
  font-size: 13px;
  font-weight: 600;
  color: var(--empire-600);
`;

const Nations = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--s-1) var(--s-4);
  margin: 0;
  padding: 0;
  list-style: none;
`;

const NationItem = styled.li`
  font-size: 14.5px;
  font-weight: 600;

  a {
    color: var(--ink);
  }

  a:hover {
    color: var(--empire-600);
  }
`;

const Year = styled.span`
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 12px;
  color: var(--ink-3);
`;
