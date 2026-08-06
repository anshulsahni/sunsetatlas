import Link from "next/link";
import { styled } from "@linaria/react";

import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * The sticky masthead.
 *
 * Its nav is the top of the hub-and-spoke tree: every mini hub is one click from
 * every page in the site. It stays a server component — on narrow screens the nav
 * scrolls horizontally rather than collapsing behind a menu button, which keeps all
 * five hub links in the DOM for crawlers.
 */
export default function SiteHeader() {
  return (
    <Header>
      <Bar>
        <Brand href={routes.home()} aria-label={`${site.name} — home`}>
          <Mark aria-hidden="true">
            <MarkDot />
          </Mark>
          <BrandText>
            <BrandName>{site.name}</BrandName>
            <BrandKicker>Independence from the British Empire</BrandKicker>
          </BrandText>
        </Brand>

        <Nav aria-label="Main">
          {HUB_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </Nav>
      </Bar>
    </Header>
  );
}

const HUB_LINKS = [
  { label: "Calendar", href: routes.calendar() },
  { label: "Countries", href: routes.countries() },
  { label: "Regions", href: routes.regions() },
  { label: "Timeline", href: routes.timeline() },
  { label: "Collections", href: routes.collections() },
  { label: "About", href: routes.about() },
];

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-6);
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 14px var(--s-8);

  @media (max-width: 860px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--s-3);
    padding: 12px 20px;
  }
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--s-3);
  color: var(--ink);
  flex-shrink: 0;

  &:hover {
    color: var(--ink);
  }
`;

/* Red is the empire: the mark is the imperial dot the whole atlas hangs off. */
const Mark = styled.span`
  position: relative;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--empire-500);
  box-shadow: 0 0 0 4px rgba(200, 16, 46, 0.16);
`;

const MarkDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--paper);
`;

const BrandText = styled.span`
  display: flex;
  flex-direction: column;
  line-height: 1;
`;

const BrandName = styled.span`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.01em;
`;

const BrandKicker = styled.span`
  margin-top: 3px;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-3);
`;

const Nav = styled.nav`
  display: flex;
  gap: var(--s-1);
  flex-wrap: wrap;

  @media (max-width: 860px) {
    width: 100%;
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 2px;
  }
`;

const NavLink = styled(Link)`
  padding: 7px 12px;
  border-radius: var(--r-pill);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-2);
  white-space: nowrap;
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);

  &:hover {
    background: var(--empire-50);
    color: var(--empire-700);
  }
`;
