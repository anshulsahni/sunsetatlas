import { styled } from "@linaria/react";

/**
 * The bordered white card that most content sits in — side-rail panels, stat boxes,
 * the calendar shell. Compose it with `PanelHeading` for the small uppercase label
 * the design puts at the top of each one.
 */
export const Panel = styled.div`
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--sh-flat);
  padding: var(--s-5);
`;

/** The uppercase eyebrow inside a `Panel`. Render it as an `<h2>`/`<h3>` where it titles a section. */
export const PanelHeading = styled.p`
  margin: 0 0 var(--s-4);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-3);
`;

export default Panel;
