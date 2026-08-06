import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarClock } from "lucide-react";

import Container from "@/app/components/Container";
import JsonLd from "@/app/components/JsonLd";
import PageHero from "@/app/components/PageHero";
import SectionHeading from "@/app/components/SectionHeading";
import CardGrid from "@/app/components/CardGrid";
import CountryCard from "@/app/components/CountryCard";
import DecadeNeighbour from "./components/DecadeNeighbour";
import NeighbourGrid from "./components/NeighbourGrid";
import Section from "@/app/components/Section";
import { getCountriesInDecade, getDecades } from "@/lib/countries";
import { decadeFromSlug, decadeSlug } from "@/lib/dates";
import { routes } from "@/lib/routes";
import { buildCrumbs, buildMetadata, itemListJsonLd } from "@/lib/seo";

interface DecadePageParams {
  decade: string;
}

export const dynamicParams = false;

export function generateStaticParams(): DecadePageParams[] {
  return getDecades().map((decade) => ({ decade: decadeSlug(decade) }));
}

/** True when this decade has strictly more nations than every other decade. */
function isBusiestDecade(decade: number): boolean {
  const rows = getDecades().map((d) => ({ decade: d, count: getCountriesInDecade(d).length }));
  const maxCount = Math.max(...rows.map((row) => row.count));
  const atMax = rows.filter((row) => row.count === maxCount);
  return atMax.length === 1 && atMax[0].decade === decade;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<DecadePageParams>;
}): Promise<Metadata> {
  const { decade: slug } = await params;
  const decade = decadeFromSlug(slug);
  const countries = decade !== undefined ? getCountriesInDecade(decade) : [];

  if (decade === undefined || countries.length === 0) {
    return buildMetadata({
      title: "Decade not found",
      description: "This decade has no nations in the atlas.",
      path: `/timeline/${slug}`,
      noIndex: true,
    });
  }

  const title = isBusiestDecade(decade)
    ? `The ${decadeSlug(decade)} — the busiest decade in the atlas`
    : `The ${decadeSlug(decade)} — ${countries.length} ${countries.length === 1 ? "nation" : "nations"} independent`;

  return buildMetadata({
    title,
    description: `${countries.length} nations gained independence from the British Empire in the ${decadeSlug(decade)}: ${countries.map((country) => country.name).join(", ")}.`,
    path: routes.decade(decade),
  });
}

export default async function DecadePage({ params }: { params: Promise<DecadePageParams> }) {
  const { decade: slug } = await params;
  const decade = decadeFromSlug(slug);
  const countries = decade !== undefined ? getCountriesInDecade(decade) : [];
  if (decade === undefined || countries.length === 0) notFound();

  const decades = getDecades();
  const index = decades.indexOf(decade);
  const previous = index > 0 ? decades[index - 1] : undefined;
  const next = index < decades.length - 1 ? decades[index + 1] : undefined;

  const years = countries.map((country) => country.independence.year);
  const earliest = Math.min(...years);
  const latest = Math.max(...years);
  const busiest = isBusiestDecade(decade);

  const lede =
    countries.length === 1
      ? `One nation became independent in the ${decadeSlug(decade)}: ${countries[0].name}, in ${countries[0].independence.year}.`
      : `${countries.length} nations became independent in the ${decadeSlug(decade)}, from ${earliest} to ${latest}.${busiest ? " The busiest decade in the atlas." : ""}`;

  const crumbs = buildCrumbs(
    { name: "Timeline", path: routes.timeline() },
    { name: `The ${decadeSlug(decade)}`, path: routes.decade(decade) },
  );

  return (
    <>
      <PageHero
        eyebrow={
          <>
            <CalendarClock size={14} aria-hidden="true" /> {decadeSlug(decade)}
          </>
        }
        title={`The ${decadeSlug(decade)}`}
        lede={lede}
        crumbs={crumbs}
      />

      <JsonLd
        data={itemListJsonLd(
          `The ${decadeSlug(decade)}`,
          countries.map((country) => ({ name: country.name, path: routes.country(country.slug) })),
        )}
      />

      <Section>
        <Container>
          <SectionHeading
            icon={<CalendarClock size={22} aria-hidden="true" />}
            description="Ordered by independence date within the decade."
          >
            Nations of the {decadeSlug(decade)}
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

      {(previous || next) && (
        <Section>
          <Container>
            <NeighbourGrid>
              {previous && (
                <DecadeNeighbour
                  direction="previous"
                  decade={previous}
                  count={getCountriesInDecade(previous).length}
                />
              )}
              {next && (
                <DecadeNeighbour
                  direction="next"
                  decade={next}
                  count={getCountriesInDecade(next).length}
                />
              )}
            </NeighbourGrid>
          </Container>
        </Section>
      )}
    </>
  );
}
