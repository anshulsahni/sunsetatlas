import Link from "next/link";

import FactList from "@/app/components/FactList";
import type { Fact } from "@/app/components/FactList";
import { Panel, PanelHeading } from "@/app/components/Panel";
import { getRegion } from "@/lib/countries";
import type { Country } from "@/lib/countries";
import { formatLongDate } from "@/lib/dates";
import { routes } from "@/lib/routes";

export interface FastFactsPanelProps {
  country: Country;
}

/**
 * The "Fast facts" panel. The Region and Independence rows double as the page's
 * explicit links up to the region and date hubs (breadcrumbs already cover
 * `/countries`, and the timeline links the decade) — see AGENTS.md 1.6.
 */
export default function FastFactsPanel({ country }: FastFactsPanelProps) {
  const { day, month, year } = country.independence;
  const region = getRegion(country.region);

  const facts: Fact[] = [
    {
      label: "Region",
      value: region ? <Link href={routes.region(region.slug)}>{region.name}</Link> : country.region,
    },
    {
      label: "Independence",
      value:
        day && month ? (
          <Link href={routes.day(day, month)}>{formatLongDate(day, month, year)}</Link>
        ) : (
          String(year)
        ),
    },
    { label: "Under British rule", value: `${country.yearsOfBritishRule} years`, isImperial: true },
    { label: "Was called", value: country.nameBeforeBritish },
    { label: "Commonwealth realm", value: country.stillCommonwealthRealm },
  ];

  return (
    <Panel>
      <PanelHeading>Fast facts</PanelHeading>
      <FactList facts={facts} />
    </Panel>
  );
}
