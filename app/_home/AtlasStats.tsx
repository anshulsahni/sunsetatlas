import { styled } from "@linaria/react";

import type { AtlasTotals } from "@/lib/countries";

export interface AtlasStatsProps {
  totals: AtlasTotals;
}

/**
 * The three-figure stat strip under the home hero's hairline — the design cover's
 * closest analogue, filled with real atlas totals instead of design-system labels.
 */
export default function AtlasStats({ totals }: AtlasStatsProps) {
  const stats = [
    { value: String(totals.countries), label: "nations in the atlas" },
    { value: String(totals.distinctDays), label: "distinct days of celebration" },
    { value: `${totals.earliestYear}–${totals.latestYear}`, label: "span of independence" },
  ];

  return (
    <Row>
      {stats.map((stat) => (
        <Stat key={stat.label}>
          <Value>{stat.value}</Value>
          <Label>{stat.label}</Label>
        </Stat>
      ))}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-8);
  margin-top: var(--s-8);
  padding-top: var(--s-6);
  border-top: 1px solid rgba(255, 255, 255, 0.22);
`;

const Stat = styled.div``;

const Value = styled.div`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 30px;
`;

const Label = styled.div`
  margin-top: 2px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.72);
`;
