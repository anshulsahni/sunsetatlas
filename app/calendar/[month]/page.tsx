import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCountriesInMonth } from "@/lib/countries";
import { MONTH_NUMBERS, monthFromSlug, monthName, monthSlug } from "@/lib/dates";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

import MonthContent from "./components/MonthContent";

export const dynamicParams = false;

interface MonthPageProps {
  params: Promise<{ month: string }>;
}

export function generateStaticParams() {
  return MONTH_NUMBERS.map((month) => ({ month: monthSlug(month) }));
}

export async function generateMetadata({ params }: MonthPageProps): Promise<Metadata> {
  const { month: slug } = await params;
  const month = monthFromSlug(slug);
  if (!month) return {};

  const name = monthName(month);
  const countries = getCountriesInMonth(month);

  return buildMetadata({
    title: `Independence days in ${name}`,
    description: `Every nation that gained independence in ${name}: ${countries.length} ${countries.length === 1 ? "nation" : "nations"}, one date at a time.`,
    path: routes.month(month),
  });
}

export default async function MonthPage({ params }: MonthPageProps) {
  const { month: slug } = await params;
  const month = monthFromSlug(slug);
  if (!month) notFound();

  return <MonthContent month={month} />;
}
