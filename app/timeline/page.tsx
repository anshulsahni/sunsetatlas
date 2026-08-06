import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";

import Container from "@/app/components/Container";
import JsonLd from "@/app/components/JsonLd";
import PageHero from "@/app/components/PageHero";
import SectionHeading from "@/app/components/SectionHeading";
import DecadeRow from "./components/DecadeRow";
import Section from "@/app/components/Section";
import { getAtlasTotals, getCountriesInDecade, getDecades } from "@/lib/countries";
import { decadeSlug } from "@/lib/dates";
import { routes } from "@/lib/routes";
import { buildCrumbs, buildMetadata, itemListJsonLd } from "@/lib/seo";

const PATH = routes.timeline();

export const metadata: Metadata = buildMetadata({
  title: "Independence timeline — every nation, decade by decade",
  description:
    "All 66 nations that left the British Empire, laid out decade by decade from the 1770s to the 1980s.",
  path: PATH,
});

/**
 * Every decade with its nations, plus a short observation — but only where the
 * counts alone honestly support one. No narrative, just arithmetic on the dataset.
 */
function buildDecadeRows() {
  const rows = getDecades().map((decade) => ({
    decade,
    countries: getCountriesInDecade(decade),
  }));

  const counts = rows.map((row) => row.countries.length);
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);
  const busiest = rows.filter((row) => row.countries.length === maxCount);
  const quietest = rows.filter((row) => row.countries.length === minCount);

  return rows.map((row) => {
    let observation: string | undefined;
    if (busiest.length === 1 && row.decade === busiest[0].decade) {
      observation = "The busiest decade in the atlas.";
    } else if (quietest.length === 1 && row.decade === quietest[0].decade && rows.length > 1) {
      observation = "The quietest decade in the atlas.";
    }
    return { ...row, observation };
  });
}

export default function TimelinePage() {
  const totals = getAtlasTotals();
  const rows = buildDecadeRows();

  return (
    <>
      <PageHero
        eyebrow={
          <>
            <CalendarClock size={14} aria-hidden="true" /> Timeline
          </>
        }
        title="The empire, decade by decade"
        lede={`All ${totals.countries} nations in the atlas, from ${totals.earliestYear} to ${totals.latestYear}, grouped by the decade they became independent.`}
        crumbs={buildCrumbs({ name: "Timeline", path: PATH })}
      />

      <JsonLd
        data={itemListJsonLd(
          "Decades in the atlas",
          rows.map((row) => ({
            name: `The ${decadeSlug(row.decade)}`,
            path: routes.decade(row.decade),
          })),
        )}
      />

      <Section>
        <Container>
          <SectionHeading
            icon={<CalendarClock size={22} aria-hidden="true" />}
            description="Every decade that saw at least one nation leave the empire."
          >
            {rows.length} decades
          </SectionHeading>

          {rows.map((row) => (
            <DecadeRow
              key={row.decade}
              decade={row.decade}
              countries={row.countries}
              observation={row.observation}
            />
          ))}
        </Container>
      </Section>
    </>
  );
}
