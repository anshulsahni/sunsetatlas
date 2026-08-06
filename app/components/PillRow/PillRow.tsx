import { styled } from "@linaria/react";

/** A wrapping row of `Pill`s — the cross-link groups at the foot of a hub page. */
const PillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-3);

  & + & {
    margin-top: var(--s-4);
  }
`;

export default PillRow;
