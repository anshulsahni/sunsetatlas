import Link from "next/link";
import { styled } from "@linaria/react";

import Container from "@/app/components/Container";
import FactList from "@/app/components/FactList";
import Panel, { PanelHeading } from "@/app/components/Panel";
import SectionHeading from "@/app/components/SectionHeading";
import { getAtlasTotals } from "@/lib/countries";

const WIKIPEDIA_MASTER_LIST =
  "https://en.wikipedia.org/wiki/List_of_countries_that_have_gained_independence_from_the_United_Kingdom";
const UK_LEGISLATION = "https://www.legislation.gov.uk";

/**
 * The body of `/about`: what the atlas is, where its dataset comes from, and the
 * judgement calls behind its harder columns. Every figure below is read live from
 * `lib/countries`; the methodology notes paraphrase `british-empire-independence.csv`
 * and `lib/countries/AGENT_GUIDE.md`, which are the research record for this project.
 */
export default function AboutContent() {
  const totals = getAtlasTotals();

  return (
    <Container>
      <Section>
        <SectionHeading description="A calendar and a country page for every nation that left the British Empire.">
          What this is
        </SectionHeading>
        <Prose>
          Sunset Atlas indexes {totals.countries} nations that gained independence
          from the United Kingdom, from the United States in 1776 to Brunei in 1984.
          Between them they celebrate on {totals.distinctDays} distinct calendar
          dates, {totals.sharedDays} of which are shared by more than one nation.{" "}
          {totals.commonwealthRealms} of the {totals.countries} still have King
          Charles III as head of state. The site is built to be crawled and searched
          as much as browsed — every date, region, decade and theme has its own page,
          and every page links back to the ones around it.
        </Prose>
      </Section>

      <Section>
        <SectionHeading description="A spreadsheet, transcribed once, kept as the record.">
          Where the data comes from
        </SectionHeading>
        <Prose>
          Every nation on this site starts as a row in{" "}
          <code>british-empire-independence.csv</code>, a single spreadsheet kept at
          the root of this project’s repository. Each row carries a source URL — most
          point at the relevant UK Independence Act or a Wikipedia article — and the
          notes at the bottom of the file record the judgement calls behind the
          harder columns. That CSV was transcribed once into the dataset this site
          actually reads; two things were added alongside the transcription that
          aren’t in the spreadsheet at all: an editorial <strong>region</strong> for
          browsing, and a <strong>colour palette</strong> drawn from each nation’s
          flag to theme its page. Neither is a claim about history.
        </Prose>
        <Prose>
          The master list of nations comes from Wikipedia’s{" "}
          <Link href={WIKIPEDIA_MASTER_LIST} target="_blank" rel="noopener noreferrer">
            list of countries that have gained independence from the United Kingdom
          </Link>
          , which itself counts 65 — this atlas lists {totals.countries}, because it
          keeps Singapore as its own entry alongside Malaysia and includes a small
          number of edge cases described below. UK Independence Acts are cited from{" "}
          <Link href={UK_LEGISLATION} target="_blank" rel="noopener noreferrer">
            legislation.gov.uk
          </Link>
          .
        </Prose>
      </Section>

      <Section>
        <SectionHeading description="The single figure most likely to be misread on this site.">
          “Years of British rule” is not one number
        </SectionHeading>
        <Prose>
          Every country page states an approximate span of years under British rule,
          and every one of those figures depends entirely on which event is chosen as
          the start — a choice the page states plainly alongside the number, because
          the number means nothing without it. India’s page counts 190 years from
          Plassey in 1757, but direct Crown rule there only began in 1858; Barbados,
          held without interruption from an English settlement in 1627, is the
          steadiest figure in the dataset for exactly that reason. Independence
          itself was often staged rather than a single clean date: Canada is dated to
          confederation in 1867 but could not amend its own constitution until 1982,
          and Egypt’s 1922 declaration of independence left British forces in the
          Suez Canal Zone until 1956. Where a date is genuinely staged, the country
          page’s “basis for start date” line is the fact to trust — not the headline
          year on its own.
        </Prose>
      </Section>

      <Section>
        <SectionHeading description="A word this site is careful with.">
          What “peaceful” does — and doesn’t — mean
        </SectionHeading>
        <Prose>
          Country pages describe some transfers of power as peaceful and others as
          violent or contested. That judgement is scored narrowly: it covers the
          transfer itself and the decade around it, not the whole span of colonial
          rule that came before it. A nation marked as having had an orderly handover
          can still have a brutal colonial history behind it — the word describes how
          power changed hands, not how it was held. Where the sourced material gives a
          qualified answer rather than a plain yes or no, the country is marked
          “contested” rather than forced into either extreme, and the fuller account
          is always quoted on its page rather than summarised away.
        </Prose>
      </Section>

      <Section>
        <SectionHeading description="Sixty-six nations, and a handful that deliberately aren’t here.">
          Scope: what’s included, and what isn’t
        </SectionHeading>
        <Grid>
          <Panel>
            <PanelHeading>Edge cases, included</PanelHeading>
            <FactList
              facts={[
                { label: "Bangladesh", value: "seceded from Pakistan, not Britain" },
                { label: "Samoa & Nauru", value: "League of Nations mandates" },
                { label: "Libya", value: "UN trusteeship, British/French rule" },
                { label: "Oman", value: "never formally a colony" },
              ]}
            />
          </Panel>
          <Panel>
            <PanelHeading>Excluded entirely</PanelHeading>
            <FactList
              facts={[
                { label: "Nepal & Bhutan", value: "never annexed" },
                { label: "Hong Kong", value: "transferred to China, not independent" },
                { label: "14 territories", value: "still British Overseas Territories" },
                { label: "Northern Ireland", value: "not a separate nation" },
              ]}
            />
          </Panel>
        </Grid>
      </Section>

      <Section>
        <SectionHeading description="Two things this site is honest about not having yet.">
          What’s still to come
        </SectionHeading>
        <Prose>
          Two pieces of the design are not built yet, and neither is faked in the
          meantime. There is no map view — the calendar is the only way to browse the
          dataset spatially right now, and no map route or view switcher exists until
          the map itself does. And the narrative history on each country page — the
          story of the road to independence, not just its dates — is being researched
          and written by hand, nation by nation. Until a section is written it shows
          clearly labelled placeholder text rather than anything that could be
          mistaken for a researched claim. Everything else on a country page — the
          dates, the figures, the source link — is real today.
        </Prose>
      </Section>
    </Container>
  );
}

const Section = styled.section`
  padding: var(--s-8) 0;

  & + & {
    border-top: 1px solid var(--line-softer);
  }
`;

const Prose = styled.p`
  max-width: 72ch;
  margin: 0 0 var(--s-4);
  font-size: 16px;
  line-height: 1.7;
  color: var(--ink-2);

  &:last-child {
    margin-bottom: 0;
  }

  code {
    font-family: var(--font-mono);
    font-size: 0.9em;
    color: var(--ink);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-5);

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;
