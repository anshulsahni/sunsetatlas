import { styled } from "@linaria/react";
import { Clock, Flag, ScrollText } from "lucide-react";

import Pill from "@/app/components/Pill";
import type { Country } from "@/lib/countries";
import { formatLongDate } from "@/lib/dates";

export interface HeroFactsProps {
  country: Country;
}

/** The outline-pill row under the hero lede: full date, years of rule, and the basis line. */
export default function HeroFacts({ country }: HeroFactsProps) {
  const { day, month, year } = country.independence;
  const dateLabel = day && month ? formatLongDate(day, month, year) : String(year);

  return (
    <Row>
      <Pill data-tone="outline">
        <Flag size={14} aria-hidden="true" />
        {dateLabel}
      </Pill>
      <Pill data-tone="outline">
        <Clock size={14} aria-hidden="true" />
        {country.yearsOfBritishRule} years of British rule
      </Pill>
      <Pill data-tone="outline">
        <ScrollText size={14} aria-hidden="true" />
        {country.basisForStartDate}
      </Pill>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-3);
  margin-top: var(--s-5);
`;
