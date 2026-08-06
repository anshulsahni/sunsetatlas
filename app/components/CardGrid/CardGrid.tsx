import { styled } from "@linaria/react";

/**
 * The responsive card grid the hubs are built from.
 *
 * Columns are set with `data-columns` (2 or 3) and collapse to one on narrow screens.
 * Render it as a `<ul>` when the cards are a list of things — most hubs are:
 *
 * ```tsx
 * <CardGrid as="ul" data-columns="3">
 * ```
 */
const CardGrid = styled.div`
  display: grid;
  gap: var(--s-5);
  margin: 0;
  padding: 0;
  list-style: none;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  &[data-columns="3"] {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 900px) {
    &[data-columns="3"] {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;

    &[data-columns="3"] {
      grid-template-columns: 1fr;
    }
  }
`;

export default CardGrid;
