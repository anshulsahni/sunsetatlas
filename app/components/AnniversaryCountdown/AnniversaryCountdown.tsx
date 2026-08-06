"use client";

import { styled } from "@linaria/react";
import { PartyPopper } from "lucide-react";

import { useCountdown } from "./hooks";

export interface AnniversaryCountdownProps {
  /** The year independence was gained — used to number the anniversary. */
  independenceYear: number;
  month: number;
  day: number;
}

/** The dark band counting down to a nation's next Independence Day. */
export default function AnniversaryCountdown({
  independenceYear,
  month,
  day,
}: AnniversaryCountdownProps) {
  const countdown = useCountdown(independenceYear, month, day);

  return (
    <Band>
      <Inner>
        <Intro>
          <PartyPopper size={26} aria-hidden="true" color="var(--gold)" />
          <div>
            <IntroTitle>
              {countdown.isToday ? "Independence Day is today" : "Next Independence Day"}
            </IntroTitle>
            <IntroMeta>
              {countdown.targetLabel
                ? `${countdown.targetLabel} · ${countdown.anniversaryLabel}`
                : "Counting…"}
            </IntroMeta>
          </div>
        </Intro>

        <Units>
          <Unit data-lead="true">
            <UnitValue>{countdown.days}</UnitValue>
            <UnitLabel>Days</UnitLabel>
          </Unit>
          <Unit>
            <UnitValue>{countdown.hours}</UnitValue>
            <UnitLabel>Hrs</UnitLabel>
          </Unit>
          <Unit>
            <UnitValue>{countdown.minutes}</UnitValue>
            <UnitLabel>Min</UnitLabel>
          </Unit>
          <Unit>
            <UnitValue>{countdown.seconds}</UnitValue>
            <UnitLabel>Sec</UnitLabel>
          </Unit>
        </Units>
      </Inner>
    </Band>
  );
}

const Band = styled.section`
  background: var(--empire-900);
  color: var(--paper);
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-6);
  flex-wrap: wrap;
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--s-6) var(--s-8);

  @media (max-width: 640px) {
    padding: var(--s-5) 20px;
  }
`;

const Intro = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s-4);
`;

const IntroTitle = styled.p`
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 20px;
`;

const IntroMeta = styled.p`
  margin: 2px 0 0;
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.7);
`;

const Units = styled.div`
  display: flex;
  gap: var(--s-3);
`;

const Unit = styled.div`
  min-width: 74px;
  padding: var(--s-3) var(--s-4);
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.1);
  text-align: center;

  &[data-lead="true"] {
    background: linear-gradient(160deg, var(--empire-700), var(--empire-500));
  }

  @media (max-width: 520px) {
    min-width: 0;
    flex: 1;
    padding: var(--s-3) var(--s-2);
  }
`;

const UnitValue = styled.div`
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 28px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
`;

const UnitLabel = styled.div`
  margin-top: 5px;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.75;
`;
