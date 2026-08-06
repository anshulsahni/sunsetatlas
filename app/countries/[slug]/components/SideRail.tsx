import { styled } from "@linaria/react";

import { getIndependenceDay } from "@/lib/countries";
import type { Country } from "@/lib/countries";

import AfterBritishLeftPanel from "./AfterBritishLeftPanel";
import FastFactsPanel from "./FastFactsPanel";
import NationalColoursPanel from "./NationalColoursPanel";
import SharedDayPanel from "./SharedDayPanel";
import SourcePanel from "./SourcePanel";

export interface SideRailProps {
  country: Country;
}

/** The stacked panels beside the narrative: fast facts, aftermath, colours, source. */
export default function SideRail({ country }: SideRailProps) {
  const { day, month } = country.independence;
  const sharedDay = day && month ? getIndependenceDay(day, month) : undefined;
  const otherCountries = sharedDay?.countries.filter((other) => other.slug !== country.slug) ?? [];

  return (
    <Stack>
      <FastFactsPanel country={country} />

      <AfterBritishLeftPanel country={country} />

      <NationalColoursPanel palette={country.palette} />

      {day && month && otherCountries.length > 0 && (
        <SharedDayPanel day={day} month={month} otherCountries={otherCountries} />
      )}

      <SourcePanel sourceUrl={country.sourceUrl} />
    </Stack>
  );
}

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--s-5);
`;
