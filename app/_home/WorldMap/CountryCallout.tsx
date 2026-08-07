import Link from "next/link";
import { styled } from "@linaria/react";
import { ArrowRight, X } from "lucide-react";

import FactList from "@/app/components/FactList";
import FlagDisc from "@/app/components/FlagDisc";
import Pill from "@/app/components/Pill";

import type { MapPointViewModel } from "./mapPoints";

export interface CountryCalloutProps {
  point: MapPointViewModel;
  onClose: () => void;
}

/**
 * The card that opens over the map when a pin is chosen.
 *
 * It is a summary and two links, not a country page — the point of the map is to get
 * the reader to the page, so the card always ends at `/countries/[slug]` and, where
 * the date is known to the day, at `/on-this-day/[date]` too.
 */
export default function CountryCallout({ point, onClose }: CountryCalloutProps) {
  const facts = [
    { label: "Independence", value: point.dateLabel },
    { label: "Under British rule", value: `${point.yearsOfBritishRule} years`, isImperial: true },
    { label: "Region", value: point.regionName },
  ];

  return (
    <Card role="dialog" aria-label={`${point.name} — independence summary`}>
      <Close type="button" onClick={onClose} aria-label={`Close ${point.name}`}>
        <X size={16} aria-hidden="true" />
      </Close>

      <Head>
        <FlagDisc palette={point.palette} size={44} />
        <div>
          <Name>{point.name}</Name>
          <Tags>
            <Pill data-tone="empire">{point.dateLabel}</Pill>
          </Tags>
        </div>
      </Head>

      <FactList facts={facts} />

      {point.sharesDateWith.length > 0 && (
        <Shared>
          Shares {point.anniversaryLabel} with {formatList(point.sharesDateWith)}.
        </Shared>
      )}

      <Actions>
        <Primary href={point.countryHref}>
          {point.name}
          <ArrowRight size={15} aria-hidden="true" />
        </Primary>
        {point.dayHref && point.anniversaryLabel && (
          <Secondary href={point.dayHref}>Everyone on {point.anniversaryLabel}</Secondary>
        )}
      </Actions>
    </Card>
  );
}

/** "India", "India and Pakistan", "India, Pakistan and Ghana". */
function formatList(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

const Card = styled.div`
  position: absolute;
  left: var(--s-5);
  bottom: var(--s-5);
  z-index: 5;
  width: min(320px, calc(100% - var(--s-8)));
  padding: var(--s-5);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--sh-card);
  /* Declared locally, not reused from globals.css — Linaria's CSS-module output
     rewrites animation names, so a global keyframe cannot be named from in here. */
  animation: callout-rise var(--dur-enter) var(--ease) both;

  @keyframes callout-rise {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @media (max-width: 640px) {
    left: var(--s-3);
    right: var(--s-3);
    bottom: var(--s-3);
    width: auto;
    padding: var(--s-4);
  }
`;

const Close = styled.button`
  position: absolute;
  top: var(--s-3);
  right: var(--s-3);
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--surface);
  color: var(--ink-3);
  cursor: pointer;
  transition:
    color var(--dur) var(--ease),
    border-color var(--dur) var(--ease);

  &:hover {
    color: var(--empire-600);
    border-color: var(--empire-100);
  }
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s-3);
  margin-bottom: var(--s-4);
  padding-right: var(--s-8);
`;

const Name = styled.h3`
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 19px;
  line-height: 1.2;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-2);
  margin-top: var(--s-2);
`;

const Shared = styled.p`
  margin: var(--s-4) 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--ink-2);
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-2);
  margin-top: var(--s-5);
`;

const Primary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  padding: 9px 15px;
  border-radius: var(--r-pill);
  background: var(--empire-500);
  color: var(--paper);
  font-size: 13.5px;
  font-weight: 700;
  transition: background var(--dur) var(--ease);

  &:hover {
    background: var(--empire-600);
    color: var(--paper);
  }
`;

const Secondary = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 9px 15px;
  border: 1px solid var(--line);
  border-radius: var(--r-pill);
  color: var(--ink-2);
  font-size: 13.5px;
  font-weight: 600;
  transition:
    border-color var(--dur) var(--ease),
    color var(--dur) var(--ease);

  &:hover {
    border-color: var(--empire-100);
    color: var(--empire-700);
  }
`;
