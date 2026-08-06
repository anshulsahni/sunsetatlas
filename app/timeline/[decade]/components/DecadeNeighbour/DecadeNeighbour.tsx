import Link from "next/link";
import { styled } from "@linaria/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { decadeSlug } from "@/lib/dates";
import { routes } from "@/lib/routes";

export interface DecadeNeighbourProps {
  direction: "previous" | "next";
  decade: number;
  count: number;
}

/** One bordered link tile pointing to the adjacent decade, used in a pair at the foot of a decade page. */
export default function DecadeNeighbour({ direction, decade, count }: DecadeNeighbourProps) {
  const Icon = direction === "previous" ? ArrowLeft : ArrowRight;

  return (
    <Tile href={routes.decade(decade)} data-direction={direction}>
      {direction === "previous" && <Icon size={18} aria-hidden="true" />}
      <Copy>
        <Label>{direction === "previous" ? "Previous decade" : "Next decade"}</Label>
        <DecadeName>The {decadeSlug(decade)}</DecadeName>
        <Meta>
          {count} {count === 1 ? "nation" : "nations"}
        </Meta>
      </Copy>
      {direction === "next" && <Icon size={18} aria-hidden="true" />}
    </Tile>
  );
}

const Tile = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--s-4);
  padding: var(--s-5);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  background: var(--surface);
  color: var(--ink);
  transition: box-shadow var(--dur) var(--ease);

  &:hover {
    box-shadow: var(--sh-card);
  }

  &[data-direction="next"] {
    justify-content: space-between;
  }

  &[data-direction="previous"] {
    justify-content: flex-start;
  }
`;

const Copy = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Label = styled.span`
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
`;

const DecadeName = styled.span`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 19px;
`;

const Meta = styled.span`
  font-size: 12.5px;
  color: var(--ink-3);
`;
