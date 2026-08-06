import { styled } from "@linaria/react";

import { Panel, PanelHeading } from "@/app/components/Panel";
import type { Country } from "@/lib/countries";

export interface AfterBritishLeftPanelProps {
  country: Country;
}

const ROWS: { label: string; field: keyof Pick<
  Country,
  "splitUpAfterBritishLeft" | "unitedAfterIndependence" | "violenceAtTransfer"
> }[] = [
  { label: "Split up", field: "splitUpAfterBritishLeft" },
  { label: "United after", field: "unitedAfterIndependence" },
  { label: "Violence at transfer", field: "violenceAtTransfer" },
];

/**
 * `FactList` right-aligns single-line values, which does not work for these three
 * columns — each is a full sentence from the dataset. This stacks label above value
 * instead, and lets the value wrap.
 */
export default function AfterBritishLeftPanel({ country }: AfterBritishLeftPanelProps) {
  return (
    <Panel>
      <PanelHeading>After the British left</PanelHeading>
      <List>
        {ROWS.map((row) => (
          <Row key={row.label}>
            <Label>{row.label}</Label>
            <Value>{country[row.field]}</Value>
          </Row>
        ))}
      </List>
    </Panel>
  );
}

const List = styled.dl`
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
  margin: 0;
`;

const Row = styled.div`
  padding-bottom: var(--s-4);
  border-bottom: 1px solid var(--line-softer);

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const Label = styled.dt`
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
`;

const Value = styled.dd`
  margin: 0;
  font-size: 14.5px;
  line-height: 1.5;
  color: var(--ink-2);
`;
