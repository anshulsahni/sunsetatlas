import Link from "next/link";
import { styled } from "@linaria/react";
import { CalendarDays, Map } from "lucide-react";

import { routes } from "@/lib/routes";

/** The two ways the atlas can be looked at as a whole. */
export type AtlasView = "map" | "calendar";

export interface ViewSwitcherProps {
  /** The view the reader is already on. Rendered as the current page, not a link target. */
  active: AtlasView;
}

/**
 * Switches between the atlas's two whole-dataset views: the world map on `/` and the
 * year grid on `/calendar`.
 *
 * Both options are real `<Link>`s to real pages rather than client-side tabs — the
 * two views are separate documents with their own titles and canonicals, and a tab
 * that swapped them in place would hide one of them from search entirely.
 */
export default function ViewSwitcher({ active }: ViewSwitcherProps) {
  return (
    <Switcher aria-label="Atlas view">
      <Option
        href={routes.home()}
        data-active={active === "map" ? "true" : undefined}
        aria-current={active === "map" ? "page" : undefined}
      >
        <Map size={15} aria-hidden="true" />
        Map
      </Option>
      <Option
        href={routes.calendar()}
        data-active={active === "calendar" ? "true" : undefined}
        aria-current={active === "calendar" ? "page" : undefined}
      >
        <CalendarDays size={15} aria-hidden="true" />
        Calendar
      </Option>
    </Switcher>
  );
}

const Switcher = styled.nav`
  display: inline-flex;
  gap: var(--s-1);
  padding: var(--s-1);
  border: 1px solid var(--line);
  border-radius: var(--r-pill);
  background: var(--surface);
  box-shadow: var(--sh-flat);
`;

const Option = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  padding: 8px 16px;
  border-radius: var(--r-pill);
  color: var(--ink-2);
  font-size: 13.5px;
  font-weight: 600;
  transition:
    background var(--dur) var(--ease),
    color var(--dur) var(--ease);

  &:hover {
    background: var(--empire-50);
    color: var(--empire-700);
  }

  &[data-active="true"] {
    background: var(--empire-500);
    color: var(--paper);
  }

  &[data-active="true"]:hover {
    background: var(--empire-600);
    color: var(--paper);
  }
`;
