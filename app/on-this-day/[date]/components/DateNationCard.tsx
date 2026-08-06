import Link from "next/link";
import { styled } from "@linaria/react";
import { ArrowRight } from "lucide-react";

import FlagDisc, { buildBands } from "@/app/components/FlagDisc";
import { getRegion, type DatedCountry } from "@/lib/countries";
import { routes } from "@/lib/routes";

export interface DateNationCardProps {
  country: DatedCountry;
}

/**
 * The wide link row in the date page's "Celebrating on this day" grid — a flag
 * stripe, a large flag disc, the nation's name and a one-line factual summary.
 */
export default function DateNationCard({ country }: DateNationCardProps) {
  const region = getRegion(country.region);

  return (
    <Card href={routes.country(country.slug)}>
      <Stripe
        aria-hidden="true"
        style={{ backgroundImage: buildBands(country.palette.flagStops, "90deg") }}
      />
      <Body>
        <FlagDisc palette={country.palette} size={56} />
        <Text>
          <Name>{country.name}</Name>
          <Meta>
            {region?.name} · {country.independence.year} · from {country.nameBeforeBritish}
          </Meta>
        </Text>
        <Arrow aria-hidden="true">
          <ArrowRight size={22} />
        </Arrow>
      </Body>
    </Card>
  );
}

const Card = styled(Link)`
  display: block;
  overflow: hidden;
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

const Stripe = styled.div`
  height: 8px;
`;

const Body = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s-4);
  padding: 18px 20px;
`;

const Text = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.p`
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 22px;
  line-height: 1.15;
`;

const Meta = styled.p`
  margin: var(--s-1) 0 0;
  font-size: 13px;
  color: var(--ink-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Arrow = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: var(--empire-500);
`;
