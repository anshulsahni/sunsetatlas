"use client";

import { styled } from "@linaria/react";
import { Search } from "lucide-react";

import CardGrid from "@/app/components/CardGrid";
import CountryCard from "@/app/components/CountryCard";
import { REGIONS } from "@/lib/countries";
import type { Country } from "@/lib/countries";

import type { CountrySort, RegionFilter } from "./hooks";
import { useCountryExplorer } from "./hooks";

export interface CountryExplorerProps {
  countries: readonly Country[];
}

const SORT_OPTIONS: { value: CountrySort; label: string }[] = [
  { value: "name", label: "Name, A–Z" },
  { value: "date", label: "Date of independence" },
  { value: "rule", label: "Years of British rule" },
];

/**
 * The only interactive leaf on the countries hub: search, region chips and a sort
 * control, filtering the already-rendered list of 66 nations client-side. The full
 * list is still present in the server-rendered HTML — this only narrows what shows.
 */
export default function CountryExplorer({ countries }: CountryExplorerProps) {
  const { query, setQuery, region, setRegion, sortBy, setSortBy, results, resultCount } =
    useCountryExplorer(countries);

  return (
    <div>
      <Toolbar>
        <SearchField>
          <Search size={17} aria-hidden="true" />
          <SearchInput
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name…"
            aria-label="Search nations by name"
          />
        </SearchField>

        <SortField>
          <label htmlFor="country-sort">Sort</label>
          <SortSelect
            id="country-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as CountrySort)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SortSelect>
        </SortField>
      </Toolbar>

      <Chips role="group" aria-label="Filter by region">
        <RegionFilterChip current={region} target="all" onSelect={setRegion}>
          All regions
        </RegionFilterChip>
        {REGIONS.map((r) => (
          <RegionFilterChip key={r.slug} current={region} target={r.slug} onSelect={setRegion}>
            {r.name}
          </RegionFilterChip>
        ))}
      </Chips>

      <ResultCount aria-live="polite">
        {resultCount} of {countries.length} nations
      </ResultCount>

      {results.length > 0 ? (
        <CardGrid as="ul" data-columns="3">
          {results.map((country) => (
            <li key={country.slug}>
              <CountryCard country={country} footer="predecessor" />
            </li>
          ))}
        </CardGrid>
      ) : (
        <Empty>No nations match “{query}”. Try a different name or region.</Empty>
      )}
    </div>
  );
}

interface RegionFilterChipProps {
  current: RegionFilter;
  target: RegionFilter;
  onSelect: (value: RegionFilter) => void;
  children: React.ReactNode;
}

function RegionFilterChip({ current, target, onSelect, children }: RegionFilterChipProps) {
  return (
    <Chip type="button" aria-pressed={current === target} onClick={() => onSelect(target)}>
      {children}
    </Chip>
  );
}

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-4);
  margin-bottom: var(--s-5);
`;

const SearchField = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s-2);
  flex: 1 1 260px;
  padding: 10px var(--s-4);
  border: 1px solid var(--line);
  border-radius: var(--r-pill);
  background: var(--surface);
  color: var(--ink-3);
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14.5px;
  color: var(--ink);
  font-family: var(--font-body);

  &::placeholder {
    color: var(--ink-3);
  }
`;

const SortField = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s-2);
  font-size: 13px;
  color: var(--ink-3);

  label {
    font-weight: 600;
  }
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--surface);
  color: var(--ink);
  font-size: 13.5px;
  font-family: var(--font-body);
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-2);
  margin-bottom: var(--s-5);
`;

const Chip = styled.button`
  padding: 7px 14px;
  border: 1px solid var(--line);
  border-radius: var(--r-pill);
  background: var(--surface);
  color: var(--ink-2);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background var(--dur) var(--ease),
    color var(--dur) var(--ease),
    border-color var(--dur) var(--ease);

  &[aria-pressed="true"] {
    background: var(--empire-500);
    border-color: var(--empire-500);
    color: var(--paper);
  }

  &:hover:not([aria-pressed="true"]) {
    background: var(--empire-50);
    border-color: var(--empire-300);
    color: var(--empire-700);
  }
`;

const ResultCount = styled.p`
  margin: 0 0 var(--s-4);
  font-size: 13px;
  color: var(--ink-3);
`;

const Empty = styled.p`
  padding: var(--s-8);
  border: 1px dashed var(--line);
  border-radius: var(--r-lg);
  text-align: center;
  color: var(--ink-3);
`;
