import { styled } from "@linaria/react";

/** Lays the previous/next `DecadeNeighbour` tiles side by side, stacking on narrow screens. */
const NeighbourGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s-4);

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export default NeighbourGrid;
