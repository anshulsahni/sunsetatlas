/** The eight regional groupings used by the `/regions` hub. */
export type RegionSlug =
  | "africa"
  | "asia"
  | "caribbean"
  | "europe"
  | "middle-east"
  | "north-america"
  | "oceania"
  | "south-america";

/**
 * How the transfer of power itself went, derived from the dataset's
 * "Violence or Bloodshed at Transfer" column.
 *
 * `peaceful` describes the handover only — it does not claim British rule was peaceful.
 * `contested` covers the rows whose answer is a qualified narrative rather than a
 * plain yes or no, and is deliberately not collapsed into either extreme.
 */
export type TransferCharacter = "violent" | "peaceful" | "contested";

/**
 * A nation's independence date.
 *
 * `day` and `month` are optional because a handful of entries are documented only to
 * the year (Oman's 1951 Treaty of Friendship, for instance). Such a country appears on
 * timeline and region pages but has no place on the calendar — always check for the
 * day before placing a country on a date.
 */
export interface IndependenceDate {
  day?: number;
  /** 1 = January. */
  month?: number;
  year: number;
  /** The unedited date cell from the source dataset. */
  raw: string;
  /** The qualifier that trailed the headline date, e.g. "republic 31 May 1961". */
  note?: string;
}

/**
 * Colours drawn from a nation's flag.
 *
 * These are data, not design tokens: they are the one sanctioned way to put a
 * non-token colour on screen. They flow into pages as inline custom properties —
 * see `app/components/NationalTheme`.
 */
export interface NationalPalette {
  /** Leads the country hero gradient and accents. */
  primary: string;
  /** Closes the country hero gradient. */
  secondary: string;
  /** Ordered flag bands, top to bottom, used to draw the circular flag disc. */
  flagStops: string[];
}

/** Everything the site knows about one nation. */
export interface Country {
  slug: string;
  /** Display name, e.g. "Myanmar (Burma)". */
  name: string;
  region: RegionSlug;
  independence: IndependenceDate;
  palette: NationalPalette;

  /** Approximate years under British rule. See `basisForStartDate` for the reckoning. */
  yearsOfBritishRule: number;
  /** Which event the rule count is measured from — the figure is meaningless without it. */
  basisForStartDate: string;
  nameBeforeBritish: string;
  splitUpAfterBritishLeft: string;
  stillCommonwealthRealm: string;
  unitedAfterIndependence: string;
  violenceAtTransfer: string;
  sourceUrl: string;

  /* Derived flags, computed once when the dataset was built, for filtering. */

  /** True when King Charles III remains head of state. */
  isCommonwealthRealm: boolean;
  /** True when the territory was split at or after the British departure. */
  wasPartitioned: boolean;
  transferCharacter: TransferCharacter;
}
