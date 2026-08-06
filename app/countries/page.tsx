import type { Metadata } from "next";

import CountriesContent from "@/app/countries/components/CountriesContent";
import { getAllCountries, getAtlasTotals } from "@/lib/countries";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "All 66 nations that left the British Empire",
  description:
    "Every nation that gained independence from the British Empire, from 1776 to 1984 — searchable by name and filterable by region.",
  path: routes.countries(),
});

/** `/countries` — the mini hub for all 66 nations, searchable and filterable. */
export default function CountriesPage() {
  const countries = getAllCountries();
  const totals = getAtlasTotals();

  return <CountriesContent countries={countries} totals={totals} />;
}
