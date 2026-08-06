import type { Metadata } from "next";
import { MapPinned } from "lucide-react";

import Container from "@/app/components/Container";
import JsonLd from "@/app/components/JsonLd";
import PageHero from "@/app/components/PageHero";
import SectionHeading from "@/app/components/SectionHeading";
import CardGrid from "@/app/components/CardGrid";
import RegionCard from "./components/RegionCard";
import Section from "@/app/components/Section";
import { REGIONS, getAtlasTotals, getCountriesByRegion } from "@/lib/countries";
import { routes } from "@/lib/routes";
import { buildCrumbs, buildMetadata, itemListJsonLd } from "@/lib/seo";

const PATH = routes.regions();

export const metadata: Metadata = buildMetadata({
  title: "Independence by region — 8 regions of the former empire",
  description:
    "Browse every nation that left the British Empire grouped into eight regions, from Africa to the Caribbean, with counts and dates for each.",
  path: PATH,
});

export default function RegionsPage() {
  const totals = getAtlasTotals();
  const regions = REGIONS.map((region) => ({
    region,
    countries: [...getCountriesByRegion(region.slug)].sort(
      (a, b) => a.independence.year - b.independence.year,
    ),
  }));

  return (
    <>
      <PageHero
        eyebrow={
          <>
            <MapPinned size={14} aria-hidden="true" /> Regions
          </>
        }
        title="Independence by region"
        lede={`${totals.countries} nations, grouped into the eight regions the atlas uses for browsing — from the ${totals.earliestYear} to ${totals.latestYear} spread of the whole dataset.`}
        crumbs={buildCrumbs({ name: "Regions", path: PATH })}
      />

      <JsonLd
        data={itemListJsonLd(
          "Regions of the atlas",
          REGIONS.map((region) => ({ name: region.name, path: routes.region(region.slug) })),
        )}
      />

      <Section>
        <Container>
          <SectionHeading
            icon={<MapPinned size={22} aria-hidden="true" />}
            description="Each region groups the nations the atlas considers editorially close for browsing — not a political statement."
          >
            The eight regions
          </SectionHeading>

          <CardGrid as="ul" data-columns="3">
            {regions.map(({ region, countries }) => (
              <li key={region.slug}>
                <RegionCard region={region} countries={countries} />
              </li>
            ))}
          </CardGrid>
        </Container>
      </Section>
    </>
  );
}
