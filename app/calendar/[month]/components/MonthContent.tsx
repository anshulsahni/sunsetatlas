import { styled } from "@linaria/react";

import CardGrid from "@/app/components/CardGrid";
import Container from "@/app/components/Container";
import CountryCard from "@/app/components/CountryCard";
import JsonLd from "@/app/components/JsonLd";
import PageHero from "@/app/components/PageHero";
import SectionHeading from "@/app/components/SectionHeading";
import { getAllIndependenceDays, getCountriesInMonth, type IndependenceDay } from "@/lib/countries";
import { formatDayMonth, monthName, type MonthNumber } from "@/lib/dates";
import { routes } from "@/lib/routes";
import { buildCrumbs, itemListJsonLd } from "@/lib/seo";

import MonthDateList from "./MonthDateList";
import MonthNeighbourTiles from "./MonthNeighbourTiles";

export interface MonthContentProps {
  month: MonthNumber;
}

/** The `/calendar/[month]` page body: every date in the month, then the month's nations. */
export default function MonthContent({ month }: MonthContentProps) {
  const name = monthName(month);
  const days: IndependenceDay[] = getAllIndependenceDays().filter((entry) => entry.month === month);
  const countries = getCountriesInMonth(month);
  const distinctDays = days.length;

  const previous = month === 1 ? 12 : ((month - 1) as MonthNumber);
  const next = month === 12 ? 1 : ((month + 1) as MonthNumber);

  const crumbs = buildCrumbs(
    { name: "Calendar", path: routes.calendar() },
    { name, path: routes.month(month) },
  );

  return (
    <>
      <PageHero
        eyebrow="A month in the atlas"
        title={`Independence days in ${name}`}
        lede={`${countries.length === 1 ? "One nation" : `${countries.length} nations`} became independent in ${name}, across ${distinctDays === 1 ? "a single date" : `${distinctDays} distinct dates`}.`}
        crumbs={crumbs}
      />

      <Section>
        <Container>
          <MonthDateList days={days} />
        </Container>
      </Section>

      <Section>
        <Container>
          <MonthNeighbourTiles previous={previous} next={next} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading description={`Every nation whose independence falls in ${name}.`}>
            Nations of {name}
          </SectionHeading>
          <CardGrid as="ul" data-columns="3">
            {countries.map((country) => (
              <li key={country.slug}>
                <CountryCard country={country} />
              </li>
            ))}
          </CardGrid>
        </Container>
      </Section>

      <JsonLd
        data={itemListJsonLd(
          `Independence days in ${name}`,
          days.map((entry) => ({
            name: `${formatDayMonth(entry.day, entry.month)} — ${entry.countries.map((c) => c.name).join(", ")}`,
            path: routes.day(entry.day, entry.month),
          })),
        )}
      />
    </>
  );
}

const Section = styled.section`
  padding: var(--s-12) 0;

  &:first-of-type {
    padding-top: var(--s-8);
  }
`;
