/**
 * Placeholder narrative copy for pages whose history has not been researched yet.
 *
 * The independence story of each nation is being written by hand. Until a section is
 * written, it renders lorem ipsum rather than plausible-sounding prose, so that
 * nothing on the site can be mistaken for a researched claim. Every placeholder is
 * wrapped in `app/components/PlaceholderProse`, which labels it in the UI and marks
 * it up so crawlers do not index it as article text.
 *
 * The output is deterministic: the same slug always produces the same paragraphs, so
 * builds are reproducible and diffs stay quiet.
 */

const LOREM_WORDS = `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation
ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit
voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non
proident sunt culpa qui officia deserunt mollit anim id est laborum curabitur pretium
tincidunt lacus nulla gravida orci a odio nullam varius turpis et commodo pharetra est eros
suscipit magna imperdiet sagittis montes nascetur ridiculus mus`
  .split(/\s+/)
  .filter(Boolean);

/** The narrative sections a country page reserves for real writing. */
export interface PlaceholderSection {
  id: string;
  heading: string;
  paragraphs: readonly string[];
}

/** Small deterministic PRNG (mulberry32) so a slug always yields the same text. */
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function buildSentence(random: () => number): string {
  const length = 8 + Math.floor(random() * 12);
  const words = Array.from(
    { length },
    () => LOREM_WORDS[Math.floor(random() * LOREM_WORDS.length)],
  );

  return `${words[0][0].toUpperCase()}${words[0].slice(1)} ${words.slice(1).join(" ")}.`;
}

function buildParagraph(random: () => number): string {
  const sentences = 3 + Math.floor(random() * 3);
  return Array.from({ length: sentences }, () => buildSentence(random)).join(" ");
}

/** `count` paragraphs of lorem ipsum, stable for a given seed. */
export function placeholderParagraphs(seed: string, count: number): string[] {
  const random = createRandom(hashString(seed));
  return Array.from({ length: count }, () => buildParagraph(random));
}

const COUNTRY_SECTIONS: readonly { id: string; heading: string; paragraphs: number }[] = [
  { id: "under-british-rule", heading: "Under British rule", paragraphs: 2 },
  { id: "the-road-to-independence", heading: "The road to independence", paragraphs: 3 },
  { id: "the-transfer-of-power", heading: "The transfer of power", paragraphs: 2 },
  { id: "after-independence", heading: "After independence", paragraphs: 2 },
];

/** The four narrative sections of a country page, filled with placeholder text. */
export function getCountryPlaceholderSections(slug: string): PlaceholderSection[] {
  return COUNTRY_SECTIONS.map((section) => ({
    id: section.id,
    heading: section.heading,
    paragraphs: placeholderParagraphs(`${slug}:${section.id}`, section.paragraphs),
  }));
}

/** The single unwritten section on a shared-date page. */
export function getDatePlaceholderSection(dateSlug: string): PlaceholderSection {
  return {
    id: "why-this-date",
    heading: "Why this date",
    paragraphs: placeholderParagraphs(`date:${dateSlug}`, 2),
  };
}
