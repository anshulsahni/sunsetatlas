import Link from "next/link";
import { styled } from "@linaria/react";

import JsonLd from "@/app/components/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";

export interface BreadcrumbsProps {
  /** Built with `buildCrumbs` from `lib/seo`. The last entry is the current page. */
  crumbs: readonly Crumb[];
  /** Set on dark heroes so the trail stays legible. */
  tone?: "default" | "inverse";
}

/**
 * The trail back up the hub-and-spoke tree, rendered once per page.
 *
 * It emits its own BreadcrumbList JSON-LD, so a page that renders this does not need
 * to add breadcrumb structured data separately.
 */
export default function Breadcrumbs({ crumbs, tone = "default" }: BreadcrumbsProps) {
  const last = crumbs.length - 1;

  return (
    <>
      <Nav aria-label="Breadcrumb" data-tone={tone}>
        <Trail>
          {crumbs.map((crumb, index) => (
            <Crumb key={crumb.path}>
              {index === last ? (
                <Current aria-current="page">{crumb.name}</Current>
              ) : (
                <>
                  <Link href={crumb.path}>{crumb.name}</Link>
                  <Separator aria-hidden="true">/</Separator>
                </>
              )}
            </Crumb>
          ))}
        </Trail>
      </Nav>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}

const Nav = styled.nav`
  --crumb-color: var(--ink-3);
  --crumb-link-color: var(--empire-600);

  &[data-tone="inverse"] {
    --crumb-color: rgba(255, 255, 255, 0.72);
    --crumb-link-color: rgba(255, 255, 255, 0.92);
  }
`;

const Trail = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-2);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 13px;
  color: var(--crumb-color);
`;

const Crumb = styled.li`
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);

  a {
    color: var(--crumb-link-color);
    font-weight: 600;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const Separator = styled.span`
  color: var(--crumb-color);
  opacity: 0.6;
`;

const Current = styled.span`
  color: var(--crumb-color);
  font-weight: 600;
`;
