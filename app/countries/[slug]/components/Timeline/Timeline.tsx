import Link from "next/link";
import { styled } from "@linaria/react";

import type { Country } from "@/lib/countries";
import { decadeOf } from "@/lib/dates";
import { routes } from "@/lib/routes";

import { buildTimelineEntries } from "./timelineEntries";

export interface TimelineProps {
  country: Country;
}

/**
 * The rail of real, dataset-backed moments under the placeholder narrative: when
 * British rule began (by the reckoning `basisForStartDate` explains) and when the
 * nation became independent. The final dot is themed in the nation's own colour, and
 * its year links to the decade hub — the page's explicit link up to `/timeline`.
 */
export default function Timeline({ country }: TimelineProps) {
  const entries = buildTimelineEntries(country);

  return (
    <Rail>
      {entries.map((entry) => (
        <Entry key={entry.title}>
          <Dot
            data-final={entry.isFinal ? "true" : undefined}
            style={entry.isFinal ? { background: country.palette.primary } : undefined}
          />
          <Year>
            {entry.isFinal ? (
              <Link href={routes.decade(decadeOf(entry.year))}>{entry.year}</Link>
            ) : (
              entry.year
            )}
          </Year>
          <Title>{entry.title}</Title>
          <Detail>{entry.detail}</Detail>
        </Entry>
      ))}
    </Rail>
  );
}

const Rail = styled.div`
  margin-top: var(--s-8);
  border-left: 2px solid var(--line);
  padding-left: 22px;
`;

const Entry = styled.div`
  position: relative;
  margin-bottom: var(--s-6);

  &:last-child {
    margin-bottom: 0;
  }
`;

const Dot = styled.span`
  position: absolute;
  left: -31px;
  top: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--empire-500);
  border: 3px solid var(--paper);
  box-shadow: 0 0 0 1px var(--line-soft);

  &[data-final="true"] {
    animation: atlas-pulse 2.2s infinite;
  }
`;

const Year = styled.p`
  margin: 0 0 2px;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 13px;
  color: var(--empire-600);
`;

const Title = styled.p`
  margin: 0 0 4px;
  font-weight: 700;
  font-size: 16px;
  color: var(--ink);
`;

const Detail = styled.p`
  margin: 0;
  font-size: 14.5px;
  line-height: 1.5;
  color: var(--ink-2);
`;
