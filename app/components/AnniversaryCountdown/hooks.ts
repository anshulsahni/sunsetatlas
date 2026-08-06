"use client";

import { useEffect, useState } from "react";

import { nextAnniversary, ordinal } from "@/lib/dates";

export interface CountdownViewModel {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  /** "Thursday, 15 August 2027" — the date the countdown is running towards. */
  targetLabel: string;
  /** "78th anniversary". */
  anniversaryLabel: string;
  /** True on the day itself, which the UI celebrates rather than counts down to. */
  isToday: boolean;
}

const PENDING: CountdownViewModel = {
  days: "––",
  hours: "––",
  minutes: "––",
  seconds: "––",
  targetLabel: "",
  anniversaryLabel: "",
  isToday: false,
};

/**
 * Splits the interval between `now` and the next anniversary into display parts.
 *
 * Pure and exported so the arithmetic can be checked without a clock: pass any two
 * instants and assert the result.
 */
export function computeCountdownViewModel(
  independenceYear: number,
  month: number,
  day: number,
  now: Date,
): CountdownViewModel {
  const target = nextAnniversary(month, day, now);
  const isToday =
    now.getUTCMonth() + 1 === month && now.getUTCDate() === day;

  const remaining = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(remaining / 1000);

  const pad = (value: number) => String(value).padStart(2, "0");

  return {
    days: String(Math.floor(totalSeconds / 86_400)),
    hours: pad(Math.floor((totalSeconds % 86_400) / 3_600)),
    minutes: pad(Math.floor((totalSeconds % 3_600) / 60)),
    seconds: pad(totalSeconds % 60),
    targetLabel: target.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }),
    anniversaryLabel: `${ordinal(target.getUTCFullYear() - independenceYear)} anniversary`,
    isToday,
  };
}

/**
 * Ticks once a second, starting after mount.
 *
 * The first render deliberately returns placeholder dashes: a countdown baked into
 * static HTML at build time would be wrong by the time anyone read it, and rendering
 * the real value on the server would mismatch the client on hydration.
 */
export function useCountdown(
  independenceYear: number,
  month: number,
  day: number,
): CountdownViewModel {
  const [viewModel, setViewModel] = useState<CountdownViewModel>(PENDING);

  useEffect(() => {
    const update = () =>
      setViewModel(computeCountdownViewModel(independenceYear, month, day, new Date()));

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [independenceYear, month, day]);

  return viewModel;
}
