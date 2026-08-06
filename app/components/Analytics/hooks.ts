"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { initMixpanel, trackButtonClick, trackLinkClick, trackPageView } from "@/lib/analytics";

/** Longest label we will send; anything longer is almost certainly a whole paragraph. */
const MAX_LABEL_LENGTH = 80;

/**
 * The visible text of a control, as a human would describe it.
 *
 * Prefers an explicit `aria-label`, then a `data-analytics-label` override, then the
 * trimmed text content. Falls back to the element's title so a button that is only an
 * icon still produces something readable.
 */
export function readElementLabel(element: HTMLElement): string {
  const explicit =
    element.dataset.analyticsLabel ??
    element.getAttribute("aria-label") ??
    element.getAttribute("title");

  const label = explicit ?? element.textContent ?? "";
  return label.replace(/\s+/g, " ").trim().slice(0, MAX_LABEL_LENGTH);
}

/** True for anything that leaves the site — those clicks are worth separating out. */
export function isExternalHref(href: string, origin: string): boolean {
  if (href.startsWith("/") || href.startsWith("#")) return false;
  if (/^(mailto|tel):/i.test(href)) return true;

  try {
    return new URL(href, origin).origin !== origin;
  } catch {
    return false;
  }
}

/**
 * Fires a page view on first paint and on every client-side navigation.
 *
 * The query string is included because the country list keeps its filters there, and
 * a filtered list is a genuinely different page from an analytics point of view.
 */
export function usePageViewTracking(): void {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initMixpanel();
  }, []);

  useEffect(() => {
    const query = searchParams.toString();
    trackPageView(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);
}

/**
 * Tracks every link and button click in the app from one delegated listener.
 *
 * Delegation is what makes the instrumentation automatic: a new page or component is
 * measured the moment it renders, with no `onClick` to remember. Opt a control out
 * with `data-analytics="off"`, and give it a clearer name with `data-analytics-label`.
 */
export function useAutoClickTracking(): void {
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const control = target.closest<HTMLElement>("a[href], button");
      if (!control || control.closest('[data-analytics="off"]')) return;

      const label = readElementLabel(control);

      if (control instanceof HTMLAnchorElement) {
        const href = control.getAttribute("href") ?? "";
        trackLinkClick({
          label,
          href,
          page: pathname,
          isExternal: isExternalHref(href, window.location.origin),
        });
        return;
      }

      trackButtonClick({ label, buttonId: control.id || undefined, page: pathname });
    }

    // Capture phase, so a click is recorded even when a handler stops propagation.
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [pathname]);
}
