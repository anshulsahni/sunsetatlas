import Link from "next/link";
import { styled } from "@linaria/react";

import { REGIONS, getDecades } from "@/lib/countries";
import { MONTH_NUMBERS, decadeSlug, monthName } from "@/lib/dates";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * The footer doubles as the site's link map.
 *
 * Every month, region and decade spoke is linked from here, which means any page in
 * the atlas is at most two clicks from any other and crawlers reach the whole tree
 * without depending on the calendar rendering.
 */
export default function SiteFooter() {
  const decades = getDecades();

  return (
    <Footer>
      <Inner>
        <Columns>
          <Column>
            <ColumnHeading>Browse</ColumnHeading>
            <LinkList>
              <li>
                <Link href={routes.calendar()}>Independence calendar</Link>
              </li>
              <li>
                <Link href={routes.countries()}>All countries</Link>
              </li>
              <li>
                <Link href={routes.regions()}>By region</Link>
              </li>
              <li>
                <Link href={routes.timeline()}>By decade</Link>
              </li>
              <li>
                <Link href={routes.collections()}>Collections</Link>
              </li>
              <li>
                <Link href={routes.about()}>About the atlas</Link>
              </li>
            </LinkList>
          </Column>

          <Column>
            <ColumnHeading>Every month</ColumnHeading>
            <InlineList>
              {MONTH_NUMBERS.map((month) => (
                <li key={month}>
                  <Link href={routes.month(month)}>{monthName(month)}</Link>
                </li>
              ))}
            </InlineList>
          </Column>

          <Column>
            <ColumnHeading>Every region</ColumnHeading>
            <InlineList>
              {REGIONS.map((region) => (
                <li key={region.slug}>
                  <Link href={routes.region(region.slug)}>{region.name}</Link>
                </li>
              ))}
            </InlineList>
          </Column>

          <Column>
            <ColumnHeading>Every decade</ColumnHeading>
            <InlineList>
              {decades.map((decade) => (
                <li key={decade}>
                  <Link href={routes.decade(decade)}>{decadeSlug(decade)}</Link>
                </li>
              ))}
            </InlineList>
          </Column>
        </Columns>

        <Baseline>
          <span>
            {site.name} — {site.tagline}
          </span>
          <Note>
            Dates and figures come from a sourced dataset; every country page links to
            its source.
          </Note>
        </Baseline>
      </Inner>
    </Footer>
  );
}

const Footer = styled.footer`
  margin-top: var(--s-16);
  background: var(--empire-900);
  color: rgba(255, 255, 255, 0.8);
`;

const Inner = styled.div`
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--s-12) var(--s-8) var(--s-8);

  @media (max-width: 640px) {
    padding: var(--s-8) 20px;
  }
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--s-8);

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  a {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
  }

  a:hover {
    color: var(--paper);
    text-decoration: underline;
  }
`;

const ColumnHeading = styled.h2`
  margin: 0 0 var(--s-4);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--empire-300);
`;

const LinkList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
  margin: 0;
  padding: 0;
  list-style: none;
`;

const InlineList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-2) var(--s-3);
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Baseline = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
  margin-top: var(--s-12);
  padding-top: var(--s-6);
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  font-size: 13px;
`;

const Note = styled.span`
  color: rgba(255, 255, 255, 0.55);
`;
