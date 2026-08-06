import { styled } from "@linaria/react";

/**
 * Vertical rhythm for a full-width block below the hero.
 *
 * `Container` owns only the horizontal measure, so a section wraps its `Container`
 * to get consistent spacing above and below:
 *
 * ```tsx
 * <Section>
 *   <Container>…</Container>
 * </Section>
 * ```
 *
 * Set `data-divided="true"` on adjacent sections to draw a hairline between them —
 * used on the home page, where the blocks are unrelated to each other and need the
 * separation. Hub pages leave it off; their `SectionHeading`s do that work already.
 */
const Section = styled.section`
  padding-block: var(--s-12);

  &[data-divided="true"] + &[data-divided="true"] {
    border-top: 1px solid var(--line-softer);
  }
`;

export default Section;
