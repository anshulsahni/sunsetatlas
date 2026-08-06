const NUMBER_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
] as const;

/** "four" for 4 — the design spells small counts out in the date-page headline. */
export function spellCount(count: number): string {
  return NUMBER_WORDS[count] ?? String(count);
}

/** "Four" — capitalised, for leading a sentence. */
export function capitalize(value: string): string {
  return value.length === 0 ? value : `${value[0].toUpperCase()}${value.slice(1)}`;
}
