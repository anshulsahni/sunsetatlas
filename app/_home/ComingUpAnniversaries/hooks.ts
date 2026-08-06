"use client";

import { useEffect, useState } from "react";

import type { DatedCountry } from "@/lib/countries";
import { daysUntilAnniversary } from "@/lib/dates";

export interface UpcomingEntry {
  country: DatedCountry;
  daysUntil: number;
}

/**
 * Sorts every dated nation by how soon its next anniversary falls, relative to
 * `today`. Pure and exported so the ordering can be checked without a clock: pass
 * any instant and assert the result.
 */
export function computeUpcomingViewModel(
  countries: readonly DatedCountry[],
  today: Date,
  limit: number,
): UpcomingEntry[] {
  return countries
    .map((country) => ({
      country,
      daysUntil: daysUntilAnniversary(country.independence.month, country.independence.day, today),
    }))
    .sort((a, b) => a.daysUntil - b.daysUntil || a.country.name.localeCompare(b.country.name))
    .slice(0, limit);
}

/**
 * Resolves the "coming up" list after mount.
 *
 * The site is statically prerendered, so a list ordered by "days until" baked into
 * the HTML at build time would be stale the moment anyone reads it. This returns
 * `undefined` until the first effect runs, so the caller can render a stable,
 * date-free fallback for the server-rendered markup and swap in the real ordering
 * once a real clock is available.
 */
export function useUpcomingAnniversaries(
  countries: readonly DatedCountry[],
  limit: number,
): UpcomingEntry[] | undefined {
  const [entries, setEntries] = useState<UpcomingEntry[] | undefined>(undefined);

  useEffect(() => {
    const resolve = () => setEntries(computeUpcomingViewModel(countries, new Date(), limit));
    resolve();
  }, [countries, limit]);

  return entries;
}
