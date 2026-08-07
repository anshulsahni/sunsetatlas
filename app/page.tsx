import { Compass, Globe2, PartyPopper } from "lucide-react";

import Container from "@/app/components/Container";
import CountryCard from "@/app/components/CountryCard";
import CardGrid from "@/app/components/CardGrid";
import JsonLd from "@/app/components/JsonLd";
import PageHero from "@/app/components/PageHero";
import SectionHeading from "@/app/components/SectionHeading";
import AtlasStats from "@/app/_home/AtlasStats";
import MapNationIndex from "@/app/_home/MapNationIndex";
import MapView from "@/app/_home/MapView";
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
  description:
    "A world map of every nation that gained independence from the British Empire — 66 pins, one per capital, each opening onto that nation's page. Or switch to the calendar and browse the same nations by date.",
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
 * The central hub, and the map view of the atlas.
 *
 * The map is the first thing below the hero — it is what the site is for. Every mini
 * hub and every country page is linked from here too, so crawlers always have a route
 * from `/` to the whole dataset without the map needing to have drawn.
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
        <Section>
          <MapView />
        </Section>

        <Section data-divided="true">
          <SectionHeading
            icon={<Globe2 size={22} aria-hidden="true" />}
            description="The same nations the map plots, in a form that needs no map: eight regions, sixty-six pages."
          >
            Every nation on the map
          </SectionHeading>
          <MapNationIndex />
        </Section>

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
