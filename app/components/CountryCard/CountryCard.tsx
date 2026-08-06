import Link from "next/link";
import { styled } from "@linaria/react";
import { Flag } from "lucide-react";

import FlagDisc, { buildBands } from "@/app/components/FlagDisc";
import { getRegion } from "@/lib/countries";
import type { Country } from "@/lib/countries";
import { formatLongDate } from "@/lib/dates";
import { routes } from "@/lib/routes";

export interface CountryCardProps {
  country: Country;
  /**
   * What to show in the footer strip. `rule` (default) gives the length of British
   * rule; `predecessor` gives the name the territory had before. Region and date
   * pages use `rule`; the countries hub uses `predecessor` because the region is
   * already implied.
   */
  footer?: "rule" | "predecessor";
}

/**
 * The standard link to a country page, used on every hub.
 *
 * The whole card is one link — nothing else inside is focusable — so keyboard users
 * tab through a list of countries rather than through three targets per card.
 */
export default function CountryCard({ country, footer = "rule" }: CountryCardProps) {
  const region = getRegion(country.region);
  const { day, month, year } = country.independence;

  return (
    <Card href={routes.country(country.slug)}>
      <Stripe
        aria-hidden="true"
        style={{ backgroundImage: buildBands(country.palette.flagStops, "90deg") }}
      />
      <Body>
        <Head>
          <div>
            <Name>{country.name}</Name>
            <Region>{region?.name}</Region>
          </div>
          <FlagDisc palette={country.palette} size={34} />
        </Head>

        <DateRow>
          <Flag size={16} aria-hidden="true" />
          <DateText>{day && month ? formatLongDate(day, month, year) : year}</DateText>
        </DateRow>

        <Footer>
          {footer === "rule" ? (
            <>
              <FooterLabel>Under British rule</FooterLabel>
              <FooterValue>{country.yearsOfBritishRule} years</FooterValue>
            </>
          ) : (
            <>
              <FooterLabel>Before</FooterLabel>
              <FooterValue title={country.nameBeforeBritish}>
                {country.nameBeforeBritish}
              </FooterValue>
            </>
          )}
        </Footer>
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
  padding: var(--s-4) var(--s-5) var(--s-5);
`;

const Head = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--s-3);
`;

const Name = styled.span`
  display: block;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 22px;
  line-height: 1.1;
`;

const Region = styled.span`
  display: block;
  margin-top: var(--s-1);
  font-size: 13px;
  color: var(--ink-3);
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s-2);
  margin-top: var(--s-4);
  color: var(--empire-500);
`;

const DateText = styled.span`
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 15px;
  color: var(--ink);
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-3);
  margin-top: var(--s-4);
  padding-top: var(--s-4);
  border-top: 1px solid var(--line-softer);
  font-size: 12.5px;
`;

const FooterLabel = styled.span`
  color: var(--ink-3);
  flex-shrink: 0;
`;

const FooterValue = styled.span`
  font-weight: 700;
  color: var(--ink-2);
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
