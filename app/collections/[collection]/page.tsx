import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookMarked, Layers, Flag, MapPinned } from "lucide-react";

import Container from "@/app/components/Container";
import JsonLd from "@/app/components/JsonLd";
import PageHero from "@/app/components/PageHero";
import SectionHeading from "@/app/components/SectionHeading";
import CardGrid from "@/app/components/CardGrid";
import CountryCard from "@/app/components/CountryCard";
import { Panel, PanelHeading } from "@/app/components/Panel";
import Pill from "@/app/components/Pill";
import PillRow from "@/app/components/PillRow";
import Section from "@/app/components/Section";
import { COLLECTIONS, getCollection, getCollectionCountries } from "@/lib/countries";
import { routes } from "@/lib/routes";
import { buildCrumbs, buildMetadata, itemListJsonLd } from "@/lib/seo";

interface CollectionPageParams {
  collection: string;
}

export const dynamicParams = false;

export function generateStaticParams(): CollectionPageParams[] {
  return COLLECTIONS.map((collection) => ({ collection: collection.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CollectionPageParams>;
}): Promise<Metadata> {
  const { collection: slug } = await params;
  const collection = getCollection(slug);

  if (!collection) {
    return buildMetadata({
      title: "Collection not found",
      description: "This collection does not exist in the atlas.",
      path: `/collections/${slug}`,
      noIndex: true,
    });
  }

  const count = getCollectionCountries(collection).length;

  return buildMetadata({
    title: `${collection.name} — ${count} ${count === 1 ? "nation" : "nations"}`,
    description: collection.summary,
    path: routes.collection(collection.slug),
  });
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<CollectionPageParams>;
}) {
  const { collection: slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const countries = getCollectionCountries(collection);
  const otherCollections = COLLECTIONS.filter((candidate) => candidate.slug !== collection.slug);

  const crumbs = buildCrumbs(
    { name: "Collections", path: routes.collections() },
    { name: collection.name, path: routes.collection(collection.slug) },
  );

  return (
    <>
      <PageHero
        eyebrow={
          <>
            <BookMarked size={14} aria-hidden="true" /> Collection
          </>
        }
        title={collection.name}
        lede={`${collection.summary} ${countries.length} ${countries.length === 1 ? "nation" : "nations"} in this atlas meet the rule.`}
        crumbs={crumbs}
      />

      <JsonLd
        data={itemListJsonLd(
          collection.name,
          countries.map((country) => ({ name: country.name, path: routes.country(country.slug) })),
        )}
      />

      <Section>
        <Container>
          <Panel>
            <PanelHeading>How this list was built</PanelHeading>
            <p>{collection.describe}</p>
          </Panel>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading icon={<Flag size={22} aria-hidden="true" />}>
            {countries.length} nations
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

      <Section>
        <Container>
          <SectionHeading icon={<Layers size={22} aria-hidden="true" />}>
            Other collections
          </SectionHeading>
          <PillRow>
            {otherCollections.map((other) => (
              <Link key={other.slug} href={routes.collection(other.slug)}>
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
            <Link href={routes.regions()}>
              <Pill data-tone="empire">
                <MapPinned size={13} aria-hidden="true" /> Browse by region
              </Pill>
            </Link>
          </PillRow>
        </Container>
      </Section>
    </>
  );
}
