import Link from "next/link";
import { styled } from "@linaria/react";
import { Flag, PartyPopper } from "lucide-react";

import CardGrid from "@/app/components/CardGrid";
import Container from "@/app/components/Container";
import FactList, { type Fact } from "@/app/components/FactList";
import JsonLd from "@/app/components/JsonLd";
import PageHero from "@/app/components/PageHero";
import { Panel, PanelHeading } from "@/app/components/Panel";
import PlaceholderProse from "@/app/components/PlaceholderProse";
import SectionHeading from "@/app/components/SectionHeading";
import { getIndependenceDayNeighbours, type IndependenceDay } from "@/lib/countries";
import { formatDayMonth, formatLongDate } from "@/lib/dates";
import { getDatePlaceholderSection } from "@/lib/placeholderContent";
import { routes } from "@/lib/routes";
import { buildCrumbs, independenceDayJsonLd } from "@/lib/seo";

import DateNationCard from "./DateNationCard";
import DateNeighbourTiles from "./DateNeighbourTiles";
import FlagDiscStack from "./FlagDiscStack";
import { capitalize, spellCount } from "./spellCount";

export interface DateContentProps {
  entry: IndependenceDay;
}

/** The `/on-this-day/[date]` page body: the shared (or solo) independence day. */
export default function DateContent({ entry }: DateContentProps) {
  const { day, month, countries, slug } = entry;
  const count = countries.length;
  const isShared = count > 1;

  const earliestYear = countries[0].independence.year;
  const latestYear = countries[countries.length - 1].independence.year;
  const yearsApart = latestYear - earliestYear;
  const regionsRepresented = new Set(countries.map((country) => country.region)).size;

  const headline = isShared
    ? `${capitalize(spellCount(count))} nations, one date`
    : `${countries[0].name} — ${formatDayMonth(day, month)}`;

  const lede = isShared
    ? `${count} nations mark their independence on this date${
        yearsApart > 0
          ? `, ${yearsApart} years apart — from ${earliestYear} to ${latestYear}`
          : ` in ${earliestYear}`
      }.`
    : `${countries[0].name} became independent on ${formatLongDate(day, month, countries[0].independence.year)}, from ${countries[0].nameBeforeBritish}.`;

  const facts: Fact[] = [
    { label: "Nations independent", value: count },
    ...(isShared ? [{ label: "Years apart", value: `${earliestYear} → ${latestYear}` }] : []),
    { label: "Regions represented", value: regionsRepresented },
  ];

  const { previous, next } = getIndependenceDayNeighbours(slug);
  const crumbs = buildCrumbs({ name: formatDayMonth(day, month), path: routes.day(day, month) });
  const placeholder = getDatePlaceholderSection(slug);

  return (
    <>
      <PageHero
        eyebrow={
          <>
            <PartyPopper size={14} aria-hidden="true" style={{ color: "var(--gold)" }} />
            {isShared ? "A shared day of independence" : "One nation's independence day"}
          </>
        }
        title={
          <>
            <DateLabel>{formatDayMonth(day, month).toUpperCase()}</DateLabel>
            <Headline>{headline}</Headline>
          </>
        }
        lede={lede}
        crumbs={crumbs}
      >
        <FlagDiscStack countries={countries} />
      </PageHero>

      <Section>
        <Container>
          <SectionHeading icon={<Flag size={22} aria-hidden="true" />}>
            Celebrating on this day
          </SectionHeading>
          <CardGrid as="ul" data-columns="2">
            {countries.map((country) => (
              <li key={country.slug}>
                <DateNationCard country={country} />
              </li>
            ))}
          </CardGrid>
        </Container>
      </Section>

      <Section>
        <Container>
          <Grid>
            <Panel>
              <PanelHeading as="h2">On this day</PanelHeading>
              <FactList facts={facts} />
            </Panel>

            <RightRail>
              <PlaceholderProse paragraphs={placeholder.paragraphs} label={placeholder.heading} />
              <DateNeighbourTiles previous={previous} next={next} />
            </RightRail>
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container>
          <Explore>
            Continue exploring: <Link href={routes.calendar()}>the full calendar</Link> ·{" "}
            <Link href={routes.countries()}>all 66 countries</Link>
          </Explore>
        </Container>
      </Section>

      <JsonLd data={independenceDayJsonLd(day, month, countries)} />
    </>
  );
}

const Section = styled.section`
  padding: var(--s-12) 0;

  &:first-of-type {
    padding-top: var(--s-8);
  }
`;

const DateLabel = styled.span`
  display: block;
  margin-bottom: var(--s-3);
  font-family: var(--font-mono);
  font-size: 15px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.75);
`;

const Headline = styled.span`
  display: block;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--s-5);
  align-items: start;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const RightRail = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--s-6);
`;

const Explore = styled.p`
  margin: 0;
  font-size: 14px;
  color: var(--ink-2);
`;
