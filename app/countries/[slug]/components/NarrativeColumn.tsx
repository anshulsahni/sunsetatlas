import { styled } from "@linaria/react";
import { ScrollText } from "lucide-react";

import PlaceholderProse from "@/app/components/PlaceholderProse";
import SectionHeading from "@/app/components/SectionHeading";
import type { Country } from "@/lib/countries";
import { getCountryPlaceholderSections } from "@/lib/placeholderContent";

import Timeline from "./Timeline";

export interface NarrativeColumnProps {
  country: Country;
}

/** The left column: the unwritten narrative sections, plus the real dataset timeline. */
export default function NarrativeColumn({ country }: NarrativeColumnProps) {
  const sections = getCountryPlaceholderSections(country.slug);

  return (
    <div>
      <SectionHeading icon={<ScrollText size={22} />}>The road to independence</SectionHeading>

      {sections.map((section) => (
        <SectionBlock key={section.id}>
          <SectionTitle>{section.heading}</SectionTitle>
          <PlaceholderProse paragraphs={section.paragraphs} label={section.heading} />
        </SectionBlock>
      ))}

      <Timeline country={country} />
    </div>
  );
}

const SectionBlock = styled.div`
  margin-bottom: var(--s-8);

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 var(--s-3);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 19px;
`;
