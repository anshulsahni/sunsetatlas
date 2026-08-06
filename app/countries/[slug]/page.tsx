import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CountryPageContent from "@/app/countries/[slug]/components/CountryPageContent";
import { getAllCountries, getCountryBySlug } from "@/lib/countries";
import { formatLongDate } from "@/lib/dates";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

interface CountryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllCountries().map((country) => ({ slug: country.slug }));
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) return {};

  const { day, month, year } = country.independence;
  const dateLabel = day && month ? formatLongDate(day, month, year) : String(year);
  const dateClause = day && month ? `on ${dateLabel}` : `in ${dateLabel}`;

  return buildMetadata({
    title: `${country.name} — independence from Britain, ${dateLabel}`,
    description: `${country.name} became independent from Britain ${dateClause}, after ${country.yearsOfBritishRule} years of British rule as ${country.nameBeforeBritish}.`,
    path: routes.country(country.slug),
  });
}

/** `/countries/[slug]` — one of 66 nation spokes. */
export default async function CountryPage({ params }: CountryPageProps) {
  const { slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) notFound();

  return <CountryPageContent country={country} />;
}
