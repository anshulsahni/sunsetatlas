import { styled } from "@linaria/react";

import FlagDisc from "@/app/components/FlagDisc";
import type { DatedCountry } from "@/lib/countries";

export interface FlagDiscStackProps {
  countries: readonly DatedCountry[];
}

/** The overlapping row of flag discs under the date hero's lede. */
export default function FlagDiscStack({ countries }: FlagDiscStackProps) {
  return (
    <Row aria-hidden="true">
      {countries.map((country) => (
        <Disc key={country.slug} palette={country.palette} size={52} ringColor="var(--empire-700)" />
      ))}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  margin-top: var(--s-6);
`;

const Disc = styled(FlagDisc)`
  &:not(:first-child) {
    margin-left: -16px;
  }
`;
