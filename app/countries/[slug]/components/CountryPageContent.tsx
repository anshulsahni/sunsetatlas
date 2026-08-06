import { styled } from "@linaria/react";
import { Crown } from "lucide-react";

import AnniversaryCountdown from "@/app/components/AnniversaryCountdown";
import CardGrid from "@/app/components/CardGrid";
import CountryCard from "@/app/components/CountryCard";
import JsonLd from "@/app/components/JsonLd";
import PageHero from "@/app/components/PageHero";
import SectionHeading from "@/app/components/SectionHeading";
import { getCountryNeighbours, getRelatedCountries, getRegion } from "@/lib/countries";
import type { Country } from "@/lib/countries";
import { formatLongDate } from "@/lib/dates";
import { routes } from "@/lib/routes";
import { buildCrumbs, countryJsonLd } from "@/lib/seo";

import HeroFacts from "./HeroFacts";
import HeroFlag from "./HeroFlag";
import NarrativeColumn from "./NarrativeColumn";
import PrevNextNav from "./PrevNextNav";
import SideRail from "./SideRail";

export interface CountryPageContentProps {
  country: Country;
}

/** The full `/countries/[slug]` spoke: national hero, narrative, panels, and paging. */
export default function CountryPageContent({ country }: CountryPageContentProps) {
  const { day, month, year } = country.independence;
  const region = getRegion(country.region);
  const dateLabel = day && month ? formatLongDate(day, month, year) : String(year);
  const dateClause = day && month ? `on ${dateLabel}` : `in ${dateLabel}`;

  const related = getRelatedCountries(country);
  const { previous, next } = getCountryNeighbours(country.slug);

  const gradient = `linear-gradient(150deg, ${country.palette.primary} 0%, ${country.palette.primary} 44%, ${country.palette.secondary} 100%)`;

  return (
    <>
      <PageHero
        background={gradient}
        crumbs={buildCrumbs(
          { name: "Countries", path: routes.countries() },
          { name: country.name, path: routes.country(country.slug) },
        )}
        eyebrow={
          <>
            <Crown size={14} aria-hidden="true" /> Independent from {country.nameBeforeBritish}
          </>
        }
        title={country.name}
        lede={`Formerly ${country.nameBeforeBritish}, ${country.name} became independent from Britain ${dateClause}${
          region ? `, in ${region.title}` : ""
        }.`}
        aside={<HeroFlag palette={country.palette} countryName={country.name} />}
      >
        <HeroFacts country={country} />
      </PageHero>

      {day && month && <AnniversaryCountdown independenceYear={year} month={month} day={day} />}

      <BodySection>
        <Body>
          <NarrativeColumn country={country} />
          <SideRail country={country} />
        </Body>
      </BodySection>

      {related.length > 0 && (
        <RelatedSection>
          <SectionHeading>Nearby in the atlas</SectionHeading>
          <CardGrid as="ul" data-columns="3">
            {related.map((relatedCountry) => (
              <li key={relatedCountry.slug}>
                <CountryCard country={relatedCountry} />
              </li>
            ))}
          </CardGrid>
        </RelatedSection>
      )}

      <PagingSection>
        <PrevNextNav previous={previous} next={next} />
      </PagingSection>

      <JsonLd data={countryJsonLd(country)} />
    </>
  );
}

const SectionShell = styled.section`
  max-width: var(--content-width);
  margin: 0 auto;
  padding-inline: var(--s-8);

  @media (max-width: 640px) {
    padding-inline: 20px;
  }
`;

const BodySection = styled(SectionShell)`
  padding-block: var(--s-12);
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 36px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const RelatedSection = styled(SectionShell)`
  padding-bottom: var(--s-12);
`;

const PagingSection = styled(SectionShell)`
  padding-bottom: var(--s-16);
`;
