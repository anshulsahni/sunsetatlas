import AboutContent from "@/app/about/components/AboutContent";
import PageHero from "@/app/components/PageHero";
import { buildCrumbs, buildMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About the atlas",
  description:
    "What Sunset Atlas is, where its dataset comes from, and why a figure like " +
    "\"years of British rule\" has no single correct value.",
  path: routes.about(),
});

const CRUMBS = buildCrumbs({ name: "About", path: routes.about() });

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Sunset Atlas"
        lede={`How ${site.name} is built, where its numbers come from, and what's still being written.`}
        crumbs={CRUMBS}
      />
      <AboutContent />
    </>
  );
}
