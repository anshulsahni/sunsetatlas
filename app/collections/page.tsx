import type { Metadata } from "next";
import { Layers } from "lucide-react";

import Container from "@/app/components/Container";
import JsonLd from "@/app/components/JsonLd";
import PageHero from "@/app/components/PageHero";
import SectionHeading from "@/app/components/SectionHeading";
import CardGrid from "@/app/components/CardGrid";
import CollectionCard from "./components/CollectionCard";
import Section from "@/app/components/Section";
import { COLLECTIONS, getCollectionCountries } from "@/lib/countries";
import { routes } from "@/lib/routes";
import { buildCrumbs, buildMetadata, itemListJsonLd } from "@/lib/seo";

const PATH = routes.collections();

export const metadata: Metadata = buildMetadata({
  title: "Themed collections — nations grouped by what the dataset shows",
  description:
    "Six themed lists built directly from the dataset's own columns: Commonwealth realms, partitioned nations, violent and peaceful handovers, and more.",
  path: PATH,
});

export default function CollectionsPage() {
  const collections = COLLECTIONS.map((collection) => ({
    collection,
    count: getCollectionCountries(collection).length,
  }));

  return (
    <>
      <PageHero
        eyebrow={
          <>
            <Layers size={14} aria-hidden="true" /> Collections
          </>
        }
        title="Themed collections"
        lede="Six ways to slice the atlas, each one derived from a single column in the dataset — never from editorial judgement alone."
        crumbs={buildCrumbs({ name: "Collections", path: PATH })}
      />

      <JsonLd
        data={itemListJsonLd(
          "Themed collections",
          COLLECTIONS.map((collection) => ({
            name: collection.name,
            path: routes.collection(collection.slug),
          })),
        )}
      />

      <Section>
        <Container>
          <SectionHeading
            icon={<Layers size={22} aria-hidden="true" />}
            description="Every collection links to the exact rule that decided its membership."
          >
            {COLLECTIONS.length} collections
          </SectionHeading>

          <CardGrid as="ul" data-columns="3">
            {collections.map(({ collection, count }) => (
              <li key={collection.slug}>
                <CollectionCard collection={collection} count={count} />
              </li>
            ))}
          </CardGrid>
        </Container>
      </Section>
    </>
  );
}
