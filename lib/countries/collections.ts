import { getAllCountries } from "./queries";
import type { Country } from "./types";

/**
 * Themed groupings of nations — the `/collections` mini hub.
 *
 * Every collection is derived from a column in the source dataset rather than from
 * editorial judgement, so each one can point at the evidence. `describe` explains
 * the rule in plain words and is rendered on the page, because a reader deserves to
 * know why a nation is in a list.
 */
export interface Collection {
  slug: string;
  /** Page `<h1>` and card title. */
  name: string;
  /** One line for cards and meta descriptions. */
  summary: string;
  /** Exactly how membership was decided. Shown on the collection page. */
  describe: string;
  select: (countries: readonly Country[]) => readonly Country[];
}

const byName = (a: Country, b: Country) => a.name.localeCompare(b.name);
const byYear = (a: Country, b: Country) => a.independence.year - b.independence.year;

export const COLLECTIONS: readonly Collection[] = [
  {
    slug: "commonwealth-realms",
    name: "Still Commonwealth realms",
    summary: "Nations where the British monarch remains head of state today.",
    describe:
      "Nations whose entry in the dataset answers yes to “Still a Commonwealth Realm” — King Charles III is head of state. Barbados was the most recent to leave, in November 2021.",
    select: (countries) => countries.filter((c) => c.isCommonwealthRealm).sort(byName),
  },
  {
    slug: "partitioned-nations",
    name: "Nations that were split",
    summary: "Territories that came apart at or after the British departure.",
    describe:
      "Nations whose entry answers yes to “Split Up After British Left” — the territory Britain governed did not survive intact as one state.",
    select: (countries) => countries.filter((c) => c.wasPartitioned).sort(byYear),
  },
  {
    slug: "violent-transfers",
    name: "Independence won in blood",
    summary: "Handovers marked by war, uprising or massacre.",
    describe:
      "Nations whose entry answers yes to “Violence or Bloodshed at Transfer”. The column scores the transfer itself and the decade around it — not the whole colonial period.",
    select: (countries) =>
      countries.filter((c) => c.transferCharacter === "violent").sort(byYear),
  },
  {
    slug: "peaceful-handovers",
    name: "Orderly handovers",
    summary: "Transfers of power that passed without bloodshed.",
    describe:
      "Nations whose entry answers no to “Violence or Bloodshed at Transfer”. An orderly handover means the transfer was peaceful — it does not mean British rule was.",
    select: (countries) =>
      countries.filter((c) => c.transferCharacter === "peaceful").sort(byYear),
  },
  {
    slug: "longest-under-british-rule",
    name: "Longest under British rule",
    summary: "The twelve territories Britain held for the greatest span of years.",
    describe:
      "Ranked by the dataset's “Approx Years of British Rule”. That figure has no single correct value: each nation's count is measured from a different starting event, given on its page.",
    select: (countries) =>
      [...countries].sort((a, b) => b.yearsOfBritishRule - a.yearsOfBritishRule).slice(0, 12),
  },
  {
    slug: "first-to-leave",
    name: "The first to leave",
    summary: "The dozen nations that broke away earliest.",
    describe:
      "The twelve earliest independence dates in the atlas, from the American declaration of 1776 onward.",
    select: (countries) => [...countries].sort(byYear).slice(0, 12),
  },
];

const BY_SLUG = new Map(COLLECTIONS.map((collection) => [collection.slug, collection]));

export function getCollection(slug: string): Collection | undefined {
  return BY_SLUG.get(slug);
}

export function getCollectionCountries(collection: Collection): readonly Country[] {
  return collection.select(getAllCountries());
}
