import { styled } from "@linaria/react";

import { Panel, PanelHeading } from "@/app/components/Panel";
import type { NationalPalette } from "@/lib/countries";

export interface NationalColoursPanelProps {
  palette: NationalPalette;
}

/** The flag's colour bands as swatch chips, each labelled with its hex value. */
export default function NationalColoursPanel({ palette }: NationalColoursPanelProps) {
  return (
    <Panel>
      <PanelHeading>National colours</PanelHeading>
      <Swatches>
        {palette.flagStops.map((stop, index) => (
          <Swatch key={`${stop}-${index}`}>
            <Chip aria-hidden="true" style={{ background: stop }} />
            <Hex>{stop.toUpperCase()}</Hex>
          </Swatch>
        ))}
      </Swatches>
    </Panel>
  );
}

const Swatches = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-3);
`;

const Swatch = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const Chip = styled.span`
  display: block;
  width: 36px;
  height: 36px;
  border-radius: var(--r-md);
  box-shadow: 0 0 0 1px var(--line-soft);
`;

const Hex = styled.span`
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--ink-3);
`;
