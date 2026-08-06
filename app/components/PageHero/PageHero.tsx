import type { ReactNode } from "react";
import { styled } from "@linaria/react";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import type { Crumb } from "@/lib/seo";

export interface PageHeroProps {
  /** Small uppercase label above the title. */
  eyebrow?: ReactNode;
  /** The page's one and only `<h1>`. */
  title: ReactNode;
  /** A sentence or two under the title. */
  lede?: ReactNode;
  crumbs?: readonly Crumb[];
  /**
   * Any CSS `background` value. Defaults to the empire gradient; country pages pass
   * their national colours instead — the palette's one meaning is that red is the
   * empire and everything else belongs to a nation.
   */
  background?: string;
  /** Stat strip, tags or a flag disc, laid out to the right on wide screens. */
  aside?: ReactNode;
  /**
   * `start` (default) is the standard left-aligned hero. `center` is for pages whose
   * subject is a single moment rather than a place — the shared-date pages use it.
   * Centring is incompatible with `aside`, which is ignored when set.
   */
  align?: "start" | "center";
  /** Sits below the lede, full width. */
  children?: ReactNode;
}

const EMPIRE_GRADIENT =
  "linear-gradient(150deg, var(--empire-900) 0%, var(--empire-700) 50%, var(--empire-500) 100%)";

/**
 * The banner every page opens with: dark gradient, dotted overlay, breadcrumb trail
 * and the page's single `<h1>`.
 */
export default function PageHero({
  eyebrow,
  title,
  lede,
  crumbs,
  background = EMPIRE_GRADIENT,
  aside,
  align = "start",
  children,
}: PageHeroProps) {
  const showAside = Boolean(aside) && align === "start";

  return (
    <Hero style={{ background }} data-align={align}>
      <Dots aria-hidden="true" />
      <Inner>
        {crumbs && <Breadcrumbs crumbs={crumbs} tone="inverse" />}
        <Layout data-has-aside={showAside ? "true" : "false"}>
          <div>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <Title>{title}</Title>
            {lede && <Lede>{lede}</Lede>}
          </div>
          {showAside && <Aside>{aside}</Aside>}
        </Layout>
        {children}
      </Inner>
    </Hero>
  );
}

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  color: var(--paper);
  padding: var(--s-12) 0 var(--s-16);

  &[data-align="center"] {
    text-align: center;
  }

  @media (max-width: 640px) {
    padding: var(--s-8) 0 var(--s-12);
  }
`;

const Dots = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-image: radial-gradient(circle at 1.4px 1.4px, #ffffff 1.4px, transparent 0);
  background-size: 26px 26px;
`;

const Inner = styled.div`
  position: relative;
  max-width: var(--content-width);
  margin: 0 auto;
  padding-inline: var(--s-8);

  @media (max-width: 640px) {
    padding-inline: 20px;
  }
`;

const Layout = styled.div`
  display: grid;
  gap: var(--s-8);
  margin-top: var(--s-6);

  &[data-has-aside="true"] {
    grid-template-columns: 1.5fr 1fr;
    align-items: center;
  }

  @media (max-width: 860px) {
    &[data-has-aside="true"] {
      grid-template-columns: 1fr;
    }
  }
`;

const Eyebrow = styled.p`
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  margin: 0 0 var(--s-4);
  padding: 6px 13px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: var(--r-pill);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(40px, 6vw, 68px);
  line-height: 0.98;
  letter-spacing: -0.02em;
  max-width: 18ch;

  [data-align="center"] & {
    max-width: none;
  }
`;

const Lede = styled.p`
  margin: var(--s-4) 0 0;
  max-width: 56ch;
  font-size: 19px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);

  [data-align="center"] & {
    margin-inline: auto;
  }

  @media (max-width: 640px) {
    font-size: 17px;
  }
`;

const Aside = styled.div`
  justify-self: center;
`;
