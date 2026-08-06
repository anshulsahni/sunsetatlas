import { styled } from "@linaria/react";
import { MapPinned } from "lucide-react";

/**
 * Stands in for the map when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is unset.
 *
 * A missing key is a deployment fact, not an error the reader caused, so this says
 * what is missing and points at the list of nations below rather than showing a
 * broken grey rectangle. Local development runs without a key by default — the same
 * choice `lib/analytics.ts` makes about the Mixpanel token.
 */
export default function MapUnavailable() {
  return (
    <Shell>
      <IconSlot aria-hidden="true">
        <MapPinned size={26} />
      </IconSlot>
      <Title>The map needs a Google Maps key</Title>
      <Body>
        Set <Code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</Code> to draw the world map. Every nation on it
        is listed below either way — the map is a way into those pages, never the only one.
      </Body>
    </Shell>
  );
}

const Shell = styled.div`
  display: grid;
  place-items: center;
  gap: var(--s-3);
  padding: var(--s-16) var(--s-6);
  border: 1px dashed var(--line);
  border-radius: 20px;
  background: var(--paper-2);
  text-align: center;
`;

const IconSlot = styled.span`
  display: inline-flex;
  color: var(--ink-3);
`;

const Title = styled.p`
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 19px;
`;

const Body = styled.p`
  margin: 0;
  max-width: 52ch;
  font-size: 14.5px;
  color: var(--ink-2);
`;

const Code = styled.code`
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--ink);
`;
