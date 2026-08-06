import { Compass } from "lucide-react";

import Container from "@/app/components/Container";
import PageHero from "@/app/components/PageHero";
import SectionHeading from "@/app/components/SectionHeading";
import MiniHubCards from "@/app/_home/MiniHubCards";
import Section from "@/app/components/Section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Page not found",
  description: "This page doesn't exist. Find your way back into the atlas from here.",
  path: "/404",
  noIndex: true,
});

/**
 * The root 404. Next.js renders this for any unmatched URL and for explicit
 * `notFound()` calls, inside the normal root layout — so `SiteHeader` and
 * `SiteFooter` (and the whole month/region/decade link map in the footer) still
 * surround it. This page's own job is just to route people back to the five mini
 * hubs rather than dead-end them.
 */
export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow={
          <>
            <Compass size={14} aria-hidden="true" /> Off the map
          </>
        }
        title="This page doesn't exist"
        lede="Whatever you were looking for isn't here — but it's probably one click from these."
      />
      <Container>
        <Section>
          <SectionHeading description="Every nation in the atlas is reachable from one of these five.">
            Find your way back in
          </SectionHeading>
          <MiniHubCards />
        </Section>
      </Container>
    </>
  );
}
