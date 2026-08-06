import type { ReactNode } from "react";
import Link from "next/link";
import { styled } from "@linaria/react";
import { ArrowRight, Calendar, Globe2, History, Layers, Map } from "lucide-react";

import CardGrid from "@/app/components/CardGrid";
import { COLLECTIONS, REGIONS, getAtlasTotals, getDecades } from "@/lib/countries";
import { routes } from "@/lib/routes";

interface MiniHub {
  name: string;
  description: string;
  count: string;
  href: string;
  icon: ReactNode;
}

/**
 * The five mini hubs as large link cards, each with a live count pulled straight
 * from the dataset — this is the section that gives crawlers a real reason to
 * descend past the home page.
 */
export default function MiniHubCards() {
  const totals = getAtlasTotals();
  const decadeCount = getDecades().length;

  const hubs: MiniHub[] = [
    {
      name: "Calendar",
      description: "Every independence day, laid out across the year.",
      count: `${totals.distinctDays} days`,
      href: routes.calendar(),
      icon: <Calendar size={22} aria-hidden="true" />,
    },
    {
      name: "Countries",
      description: "All 66 nations, searchable by name and region.",
      count: `${totals.countries} nations`,
      href: routes.countries(),
      icon: <Globe2 size={22} aria-hidden="true" />,
    },
    {
      name: "Regions",
      description: "Independence grouped into eight browsing regions.",
      count: `${REGIONS.length} regions`,
      href: routes.regions(),
      icon: <Map size={22} aria-hidden="true" />,
    },
    {
      name: "Timeline",
      description: "The end of empire, decade by decade.",
      count: `${decadeCount} decades`,
      href: routes.timeline(),
      icon: <History size={22} aria-hidden="true" />,
    },
    {
      name: "Collections",
      description: "Themed lists, each derived directly from the dataset.",
      count: `${COLLECTIONS.length} collections`,
      href: routes.collections(),
      icon: <Layers size={22} aria-hidden="true" />,
    },
  ];

  return (
    <CardGrid as="ul" data-columns="3">
      {hubs.map((hub) => (
        <li key={hub.href}>
          <Card href={hub.href}>
            <IconSlot aria-hidden="true">{hub.icon}</IconSlot>
            <Name>{hub.name}</Name>
            <Description>{hub.description}</Description>
            <Footer>
              <Count>{hub.count}</Count>
              <ArrowRight size={16} aria-hidden="true" />
            </Footer>
          </Card>
        </li>
      ))}
    </CardGrid>
  );
}

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--s-6);
  border: 1px solid var(--line-soft);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--sh-flat);
  color: var(--ink);
  transition:
    box-shadow var(--dur) var(--ease),
    transform var(--dur) var(--ease);

  &:hover {
    color: var(--ink);
    box-shadow: var(--sh-card);
    transform: translateY(-2px);
  }
`;

const IconSlot = styled.span`
  display: inline-flex;
  color: var(--empire-500);
`;

const Name = styled.span`
  display: block;
  margin-top: var(--s-3);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 20px;
`;

const Description = styled.span`
  display: block;
  margin-top: var(--s-2);
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink-2);
  flex: 1;
`;

const Footer = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--s-5);
  padding-top: var(--s-4);
  border-top: 1px solid var(--line-softer);
  color: var(--empire-500);
`;

const Count = styled.span`
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 13px;
  color: var(--ink-2);
`;
