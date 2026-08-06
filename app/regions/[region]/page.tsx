import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPinned, Flag, Globe2, CalendarClock } from "lucide-react";

import Container from "@/app/components/Container";
import JsonLd from "@/app/components/JsonLd";
import PageHero from "@/app/components/PageHero";
import SectionHeading from "@/app/components/SectionHeading";
import CardGrid from "@/app/components/CardGrid";
import CountryCard from "@/app/components/CountryCard";
import Pill from "@/app/components/Pill";
import Section from "@/app/components/Section";
import PillRow from "@/app/components/PillRow";
import { REGIONS, getCountriesByRegion, getRegion } from "@/lib/countries";
import { routes } from "@/lib/routes";
import { buildCrumbs, buildMetadata, itemListJsonLd } from "@/lib/seo";

interface RegionPageParams {
  region: string;
}

export const dynamicParams = false;

export function generateStaticParams(): RegionPageParams[] {
  return REGIONS.map((region) => ({ region: region.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RegionPageParams>;
}): Promise<Metadata> {
  const { region: slug } = await params;
  const region = getRegion(slug);

  if (!region) {
    return buildMetadata({
      title: "Region not found",
      description: "This region does not exist in the atlas.",
      path: `/regions/${slug}`,
      noIndex: true,
    });
  }

  const nations = getCountriesByRegion(region.slug);

  return buildMetadata({
    title: `Independence in ${region.title} — ${nations.length} nations`,
    description: region.blurb,
    path: routes.region(region.slug),
  });
}

export default async function RegionPage({ params }: { params: Promise<RegionPageParams> }) {
  const { region: slug } = await params;
  const region = getRegion(slug);
  if (!region) notFound();

  const nations = [...getCountriesByRegion(region.slug)].sort(
    (a, b) => a.independence.year - b.independence.year || a.name.localeCompare(b.name),
  );
  const years = nations.map((country) => country.independence.year);
  const earliest = Math.min(...years);
  const latest = Math.max(...years);
  const otherRegions = REGIONS.filter((candidate) => candidate.slug !== region.slug);

  const crumbs = buildCrumbs(
    { name: "Regions", path: routes.regions() },
    { name: region.name, path: routes.region(region.slug) },
  );

  return (
    <>
      <PageHero
        eyebrow={
          <>
            <MapPinned size={14} aria-hidden="true" /> {region.name}
          </>
        }
        title={`Independence in ${region.title}`}
        lede={`${region.blurb} ${nations.length} ${nations.length === 1 ? "nation" : "nations"} in this atlas, spanning ${earliest} to ${latest}.`}
        crumbs={crumbs}
      />

      <JsonLd
        data={itemListJsonLd(
          `Independence in ${region.title}`,
          nations.map((country) => ({ name: country.name, path: routes.country(country.slug) })),
        )}
      />

      <Section>
        <Container>
          <SectionHeading
            icon={<Flag size={22} aria-hidden="true" />}
            description={`Every nation the atlas places in ${region.title}, ordered by independence date.`}
          >
            {nations.length} nations
          </SectionHeading>

          <CardGrid as="ul" data-columns="3">
            {nations.map((country) => (
              <li key={country.slug}>
                <CountryCard country={country} />
              </li>
            ))}
          </CardGrid>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading icon={<Globe2 size={22} aria-hidden="true" />}>
            Other regions
          </SectionHeading>
          <PillRow>
            {otherRegions.map((other) => (
              <Link key={other.slug} href={routes.region(other.slug)}>
                <Pill>{other.name}</Pill>
              </Link>
            ))}
          </PillRow>

          <PillRow>
            <Link href={routes.countries()}>
              <Pill data-tone="empire">
                <Flag size={13} aria-hidden="true" /> All 66 countries
              </Pill>
            </Link>
            <Link href={routes.timeline()}>
              <Pill data-tone="empire">
                <CalendarClock size={13} aria-hidden="true" /> Browse by decade
              </Pill>
            </Link>
          </PillRow>
        </Container>
      </Section>
    </>
  );
}
