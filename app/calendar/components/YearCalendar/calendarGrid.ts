import { daysInMonth, monthName, MONTH_NUMBERS } from "@/lib/dates";
import { getCountriesInMonth, type DatedCountry } from "@/lib/countries";

/**
 * How a single day cell reads on the year grid: nothing happened, one nation, or
 * several sharing the date.
 */
export type DayCellStatus = "empty" | "single" | "shared";

export interface DayCellViewModel {
  day: number;
  month: number;
  status: DayCellStatus;
  /** Never has more than one entry unless `status` is "shared". */
  countries: readonly DatedCountry[];
}

export interface MonthGridViewModel {
  month: number;
  name: string;
  /** Nations celebrating somewhere in this month. */
  count: number;
  /** One entry per day of the month, in order — no weekday offset, no leading blanks. */
  days: readonly DayCellViewModel[];
  /** True for the month(s) with the most nations. */
  isBusiest: boolean;
}

/**
 * Builds the twelve month cells the year grid renders, each carrying every day of
 * that month already classified as empty / single / shared.
 */
export function computeYearGridViewModel(): readonly MonthGridViewModel[] {
  const months = MONTH_NUMBERS.map((month) => {
    const countries = getCountriesInMonth(month);

    const byDay = new Map<number, DatedCountry[]>();
    for (const country of countries) {
      const { day } = country.independence;
      const existing = byDay.get(day);
      if (existing) existing.push(country);
      else byDay.set(day, [country]);
    }

    const days: DayCellViewModel[] = Array.from({ length: daysInMonth(month) }, (_, index) => {
      const day = index + 1;
      const dayCountries = byDay.get(day) ?? [];
      const status: DayCellStatus =
        dayCountries.length === 0 ? "empty" : dayCountries.length === 1 ? "single" : "shared";

      return { day, month, status, countries: dayCountries };
    });

    return { month, name: monthName(month), count: countries.length, days };
  });

  const busiestCount = Math.max(...months.map((entry) => entry.count));

  return months.map((entry) => ({
    ...entry,
    isBusiest: entry.count > 0 && entry.count === busiestCount,
  }));
}
