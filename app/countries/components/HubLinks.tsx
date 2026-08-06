import Link from "next/link";
import { styled } from "@linaria/react";
import { ArrowRight, CalendarDays, Compass, Layers, MapPin } from "lucide-react";

import SectionHeading from "@/app/components/SectionHeading";
import { routes } from "@/lib/routes";

const LINKS = [
  {
    href: routes.regions(),
    icon: MapPin,
    title: "Browse by region",
    description: "Eight groupings, from Africa to the Caribbean.",
  },
  {
    href: routes.timeline(),
    icon: Layers,
    title: "Browse by decade",
    description: "The chronological view, from 1776 to 1984.",
  },
  {
    href: routes.collections(),
    icon: Compass,
    title: "Themed collections",
    description: "Commonwealth realms, partitioned nations and more.",
  },
  {
    href: routes.calendar(),
    icon: CalendarDays,
    title: "Independence calendar",
    description: "The whole year, one card per month.",
  },
] as const;

/** Cross-links from the countries hub to the site's other mini hubs. */
export default function HubLinks() {
  return (
    <section>
      <SectionHeading>Keep exploring</SectionHeading>
      <Grid>
        {LINKS.map((link) => (
          <Tile key={link.href} href={link.href}>
            <IconSlot aria-hidden="true">
              <link.icon size={20} />
            </IconSlot>
            <TileBody>
              <TileTitle>{link.title}</TileTitle>
              <TileDescription>{link.description}</TileDescription>
            </TileBody>
            <ArrowRight size={18} aria-hidden="true" />
          </Tile>
        ))}
      </Grid>
    </section>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-4);

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Tile = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--s-4);
  padding: var(--s-5);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  background: var(--surface);
  color: var(--ink);
  transition:
    box-shadow var(--dur) var(--ease),
    transform var(--dur) var(--ease);

  &:hover {
    color: var(--ink);
    box-shadow: var(--sh-card);
    transform: translateY(-2px);
  }

  svg:last-child {
    flex-shrink: 0;
    color: var(--empire-500);
  }
`;

const IconSlot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--r-md);
  background: var(--empire-50);
  color: var(--empire-600);
`;

const TileBody = styled.div`
  flex: 1;
`;

const TileTitle = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 15.5px;
`;

const TileDescription = styled.p`
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--ink-3);
`;
