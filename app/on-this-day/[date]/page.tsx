import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllIndependenceDays, getIndependenceDay } from "@/lib/countries";
import { formatDayMonth, parseDayMonthSlug } from "@/lib/dates";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

import DateContent from "./components/DateContent";

export const dynamicParams = false;

interface DatePageProps {
  params: Promise<{ date: string }>;
}

export function generateStaticParams() {
  return getAllIndependenceDays().map((entry) => ({ date: entry.slug }));
}

export async function generateMetadata({ params }: DatePageProps): Promise<Metadata> {
  const { date: slug } = await params;
  const parsed = parseDayMonthSlug(slug);
  const entry = parsed && getIndependenceDay(parsed.day, parsed.month);
  if (!entry) return {};

  const dateLabel = formatDayMonth(entry.day, entry.month);
  const headline =
    entry.countries.length === 1
      ? `${entry.countries[0].name}'s independence day`
      : `${entry.countries.length} nations, one independence date`;

  return buildMetadata({
    title: `${dateLabel} — ${headline}`,
    description: `Every nation that became independent on ${dateLabel}: ${entry.countries
      .map((country) => `${country.name} (${country.independence.year})`)
      .join(", ")}.`,
    path: routes.day(entry.day, entry.month),
  });
}

export default async function DatePage({ params }: DatePageProps) {
  const { date: slug } = await params;
  const parsed = parseDayMonthSlug(slug);
  const entry = parsed && getIndependenceDay(parsed.day, parsed.month);
  if (!entry) notFound();

  return <DateContent entry={entry} />;
}
