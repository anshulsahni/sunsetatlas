import { Compass, PartyPopper } from "lucide-react";

import Container from "@/app/components/Container";
import CountryCard from "@/app/components/CountryCard";
import CardGrid from "@/app/components/CardGrid";
import JsonLd from "@/app/components/JsonLd";
import PageHero from "@/app/components/PageHero";
import SectionHeading from "@/app/components/SectionHeading";
import AtlasStats from "@/app/_home/AtlasStats";
import MiniHubCards from "@/app/_home/MiniHubCards";
import ComingUpAnniversaries from "@/app/_home/ComingUpAnniversaries";
import Section from "@/app/components/Section";
import StillWritingNote from "@/app/_home/StillWritingNote";
import {
  getAtlasTotals,
  getCollection,
  getCollectionCountries,
  getDatedCountries,
} from "@/lib/countries";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: `${site.name} — every nation that left the British Empire`,
  description: site.description,
  path: routes.home(),
});

/** A stable, calendar-ordered slice for the "coming up" fallback — no clock involved. */
function pickUpcomingFallback(limit: number) {
  return [...getDatedCountries()]
    .sort(
      (a, b) =>
        a.independence.month - b.independence.month || a.independence.day - b.independence.day,
    )
    .slice(0, limit);
}

/**
 * The central hub. Every mini hub and a sample of country pages are linked from
 * here, so crawlers always have a route from `/` to the whole dataset.
 */
export default function HomePage() {
  const totals = getAtlasTotals();
  const datedCountries = getDatedCountries();
  const upcomingFallback = pickUpcomingFallback(6);

  const longestRuled = getCollection("longest-under-british-rule");
  const sampleNations = longestRuled ? getCollectionCountries(longestRuled) : [];

  return (
    <>
      <PageHero
        eyebrow={
          <>
            <Compass size={14} aria-hidden="true" /> An atlas of independence
          </>
        }
        title={site.tagline}
        lede={site.description}
      >
        <AtlasStats totals={totals} />
      </PageHero>

      <Container>
        <Section data-divided="true">
          <SectionHeading
            icon={<PartyPopper size={22} aria-hidden="true" />}
            description="The next anniversaries on the calendar, ordered by how soon they fall."
          >
            Coming up
          </SectionHeading>
          <ComingUpAnniversaries countries={datedCountries} fallback={upcomingFallback} limit={6} />
        </Section>

        <Section data-divided="true">
          <SectionHeading description="Five ways into the same 66 nations.">
            Explore the atlas
          </SectionHeading>
          <MiniHubCards />
        </Section>

        {longestRuled && (
          <Section data-divided="true">
            <SectionHeading description={longestRuled.describe}>{longestRuled.name}</SectionHeading>
            <CardGrid as="ul" data-columns="3">
              {sampleNations.map((country) => (
                <li key={country.slug}>
                  <CountryCard country={country} />
                </li>
              ))}
            </CardGrid>
          </Section>
        )}

        <StillWritingNote />
      </Container>

      <JsonLd
        data={itemListJsonLd("Sunset Atlas hubs", [
          { name: "Calendar", path: routes.calendar() },
          { name: "Countries", path: routes.countries() },
          { name: "Regions", path: routes.regions() },
          { name: "Timeline", path: routes.timeline() },
          { name: "Collections", path: routes.collections() },
        ])}
      />
    </>
  );
}
