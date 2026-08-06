import { styled } from "@linaria/react";

/**
 * The small rounded label used for regions, dates and status tags.
 *
 * Pick a tone with `data-tone`:
 *
 * - `neutral` (default) — facts with no charge, like a region name.
 * - `empire` — anything about British rule. Red only ever means the empire.
 * - `gold` — celebration: anniversaries, "today".
 * - `outline` — sits on a coloured hero.
 */
const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  padding: 6px 12px;
  border-radius: var(--r-pill);
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.2;
  background: var(--paper-2);
  color: var(--ink-2);
  white-space: nowrap;

  &[data-tone="empire"] {
    background: var(--empire-50);
    color: var(--empire-700);
    font-weight: 700;
  }

  &[data-tone="gold"] {
    background: var(--gold-surface);
    color: var(--gold-ink);
    font-weight: 700;
  }

  &[data-tone="outline"] {
    background: rgba(255, 255, 255, 0.16);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: var(--paper);
  }
`;

export default Pill;
