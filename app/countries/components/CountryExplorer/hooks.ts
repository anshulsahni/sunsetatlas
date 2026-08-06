"use client";

import { useEffect, useMemo, useState } from "react";

import { trackCountrySearch } from "@/lib/analytics";
import type { Country, RegionSlug } from "@/lib/countries";
import { routes } from "@/lib/routes";

export type RegionFilter = RegionSlug | "all";
export type CountrySort = "name" | "date" | "rule";

const DEBOUNCE_MS = 400;

/** Case-insensitive match against a nation's current and former names. */
export function computeFilteredCountries(
  countries: readonly Country[],
  query: string,
  region: RegionFilter,
): Country[] {
  const needle = query.trim().toLowerCase();

  return countries.filter((country) => {
    const matchesRegion = region === "all" || country.region === region;
    const matchesQuery =
      needle === "" ||
      country.name.toLowerCase().includes(needle) ||
      country.nameBeforeBritish.toLowerCase().includes(needle);

    return matchesRegion && matchesQuery;
  });
}

/** Sorts a copy of `countries` — never mutates the array it is given. */
export function computeSortedCountries(
  countries: readonly Country[],
  sortBy: CountrySort,
): Country[] {
  const sorted = [...countries];

  if (sortBy === "date") {
    sorted.sort(
      (a, b) =>
        a.independence.year - b.independence.year ||
        (a.independence.month ?? 0) - (b.independence.month ?? 0) ||
        (a.independence.day ?? 0) - (b.independence.day ?? 0) ||
        a.name.localeCompare(b.name),
    );
  } else if (sortBy === "rule") {
    sorted.sort((a, b) => b.yearsOfBritishRule - a.yearsOfBritishRule || a.name.localeCompare(b.name));
  } else {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  return sorted;
}

export interface CountryExplorerViewModel {
  query: string;
  setQuery: (value: string) => void;
  region: RegionFilter;
  setRegion: (value: RegionFilter) => void;
  sortBy: CountrySort;
  setSortBy: (value: CountrySort) => void;
  results: readonly Country[];
  resultCount: number;
}

/**
 * Owns the search/region/sort state for the countries hub and narrows the
 * already-rendered list of 66 nations client-side — nothing is fetched or paged.
 */
export function useCountryExplorer(countries: readonly Country[]): CountryExplorerViewModel {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [sortBy, setSortBy] = useState<CountrySort>("name");

  const filtered = useMemo(
    () => computeFilteredCountries(countries, query, region),
    [countries, query, region],
  );
  const results = useMemo(() => computeSortedCountries(filtered, sortBy), [filtered, sortBy]);

  // Fires once the user settles on a query or region, not on every keystroke, and
  // not for the default unfiltered view (there is nothing to report there).
  useEffect(() => {
    if (query.trim() === "" && region === "all") return;

    const timer = setTimeout(() => {
      trackCountrySearch({ query, resultCount: filtered.length, page: routes.countries() });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, region, filtered.length]);

  return { query, setQuery, region, setRegion, sortBy, setSortBy, results, resultCount: results.length };
}
