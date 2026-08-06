export type { Country, IndependenceDate, NationalPalette, RegionSlug, TransferCharacter } from "./types";
export type { DatedCountry, IndependenceDay, AtlasTotals } from "./queries";
export type { Region } from "./regions";
export type { Collection } from "./collections";

export {
  getAllCountries,
  getAllIndependenceDays,
  getAtlasTotals,
  getCountriesByRegion,
  getCountriesChronologically,
  getCountriesInDecade,
  getCountriesInMonth,
  getCountryBySlug,
  getCountryNeighbours,
  getDatedCountries,
  getDecades,
  getIndependenceDay,
  getIndependenceDayNeighbours,
  getRelatedCountries,
  getSharedIndependenceDays,
} from "./queries";

export { REGIONS, getRegion } from "./regions";
export { COLLECTIONS, getCollection, getCollectionCountries } from "./collections";
