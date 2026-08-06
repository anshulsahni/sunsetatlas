import type { Metadata } from "next";

import { getAtlasTotals } from "@/lib/countries";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

import CalendarContent from "./components/CalendarContent";

export function generateMetadata(): Metadata {
  const totals = getAtlasTotals();

  return buildMetadata({
    title: "Independence Calendar — every nation's date, all year round",
    description: `A full year of independence days: ${totals.countries} nations across ${totals.distinctDays} distinct dates, from the earliest to the most recent. Browse the calendar month by month.`,
    path: routes.calendar(),
  });
}

export default function CalendarPage() {
  return <CalendarContent />;
}
