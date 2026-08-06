import { styled } from "@linaria/react";
import { Flag } from "lucide-react";

import JsonLd from "@/app/components/JsonLd";
import PageHero from "@/app/components/PageHero";
import type { AtlasTotals, Country } from "@/lib/countries";
import { routes } from "@/lib/routes";
import { buildCrumbs, itemListJsonLd } from "@/lib/seo";

import CountryExplorer from "./CountryExplorer";
import HubLinks from "./HubLinks";

export interface CountriesContentProps {
  countries: readonly Country[];
  totals: AtlasTotals;
}

/** The full `/countries` hub: hero, filterable grid, and cross-links to the other hubs. */
export default function CountriesContent({ countries, totals }: CountriesContentProps) {
  return (
    <>
      <PageHero
        eyebrow={
          <>
            <Flag size={14} aria-hidden="true" /> The full atlas
          </>
        }
        title="All 66 nations"
        lede={`Every nation that gained independence from the British Empire, from ${totals.earliestYear} to ${totals.latestYear} — across ${totals.distinctDays} distinct days of celebration, ${totals.sharedDays} of them shared by more than one nation.`}
        crumbs={buildCrumbs({ name: "Countries", path: routes.countries() })}
      />

      <ExplorerSection>
        <CountryExplorer countries={countries} />
      </ExplorerSection>

      <LinksSection>
        <HubLinks />
      </LinksSection>

      <JsonLd
        data={itemListJsonLd(
          "All nations in the atlas",
          countries.map((country) => ({ name: country.name, path: routes.country(country.slug) })),
        )}
      />
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

const ExplorerSection = styled(SectionShell)`
  padding-block: var(--s-12);
`;

const LinksSection = styled(SectionShell)`
  padding-bottom: var(--s-16);
`;
