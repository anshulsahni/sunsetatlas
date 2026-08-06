import { styled } from "@linaria/react";
import { CalendarDays } from "lucide-react";

import Container from "@/app/components/Container";
import JsonLd from "@/app/components/JsonLd";
import PageHero from "@/app/components/PageHero";
import SectionHeading from "@/app/components/SectionHeading";
import { getAtlasTotals } from "@/lib/countries";
import { MONTH_NUMBERS, monthName } from "@/lib/dates";
import { routes } from "@/lib/routes";
import { buildCrumbs, itemListJsonLd } from "@/lib/seo";

import MonthList from "./MonthList";
import YearCalendar from "./YearCalendar";

/** The `/calendar` page body: the year grid, then a link to every month. */
export default function CalendarContent() {
  const totals = getAtlasTotals();
  const crumbs = buildCrumbs({ name: "Calendar", path: routes.calendar() });

  return (
    <>
      <PageHero
        eyebrow="The year at a glance"
        title="The Independence Calendar"
        lede={`${totals.countries} nations across ${totals.distinctDays} distinct days — every anniversary the British Empire left behind, laid out across the year.`}
        crumbs={crumbs}
      />

      <Section>
        <Container>
          <YearCalendar totals={totals} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            icon={<CalendarDays size={22} aria-hidden="true" />}
            description="Every month the empire ever handed one back."
          >
            Browse by month
          </SectionHeading>
          <MonthList />
        </Container>
      </Section>

      <JsonLd
        data={itemListJsonLd(
          "Months in the independence calendar",
          MONTH_NUMBERS.map((month) => ({ name: monthName(month), path: routes.month(month) })),
        )}
      />
    </>
  );
}

const Section = styled.section`
  padding: var(--s-12) 0;

  &:first-of-type {
    padding-top: var(--s-8);
  }
`;
