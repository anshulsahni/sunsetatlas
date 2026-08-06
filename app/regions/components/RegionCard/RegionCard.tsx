import Link from "next/link";
import { styled } from "@linaria/react";
import { ArrowRight } from "lucide-react";

import FlagDisc from "@/app/components/FlagDisc";
import type { Country, Region } from "@/lib/countries";
import { routes } from "@/lib/routes";

export interface RegionCardProps {
  region: Region;
  /** All nations in this region, already sorted chronologically. */
  countries: readonly Country[];
}

/**
 * The card for one region on the `/regions` hub: name, blurb, a couple of
 * dataset-derived stats, and a strip of flag discs previewing its nations.
 */
export default function RegionCard({ region, countries }: RegionCardProps) {
  const years = countries.map((country) => country.independence.year);
  const earliest = Math.min(...years);
  const latest = Math.max(...years);
  const preview = countries.slice(0, 6);

  return (
    <Card href={routes.region(region.slug)}>
      <Name>{region.name}</Name>
      <Blurb>{region.blurb}</Blurb>

      <Stats>
        <Stat>
          <StatValue>{countries.length}</StatValue>
          <StatLabel>{countries.length === 1 ? "nation" : "nations"}</StatLabel>
        </Stat>
        <Stat>
          <StatValue>
            {earliest}–{latest}
          </StatValue>
          <StatLabel>span</StatLabel>
        </Stat>
      </Stats>

      <Preview aria-hidden="true">
        {preview.map((country, index) => (
          <PreviewDisc key={country.slug} style={{ marginLeft: index === 0 ? 0 : -12 }}>
            <FlagDisc palette={country.palette} size={30} />
          </PreviewDisc>
        ))}
      </Preview>

      <Footer>
        See all {countries.length}
        <ArrowRight size={15} aria-hidden="true" />
      </Footer>
    </Card>
  );
}

const Card = styled(Link)`
  display: block;
  padding: var(--s-5);
  border: 1px solid var(--line-soft);
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
  display: block;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 22px;
  line-height: 1.1;
`;

const Blurb = styled.p`
  margin: var(--s-3) 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink-2);
`;

const Stats = styled.div`
  display: flex;
  gap: var(--s-6);
  margin-top: var(--s-5);
  padding-top: var(--s-4);
  border-top: 1px solid var(--line-softer);
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatValue = styled.span`
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 15px;
  color: var(--empire-600);
`;

const StatLabel = styled.span`
  font-size: 11.5px;
  color: var(--ink-3);
`;

const Preview = styled.div`
  display: flex;
  align-items: center;
  margin-top: var(--s-4);
`;

const PreviewDisc = styled.div`
  display: flex;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s-2);
  margin-top: var(--s-4);
  font-size: 13px;
  font-weight: 600;
  color: var(--empire-600);
`;
