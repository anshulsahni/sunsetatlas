import { styled } from "@linaria/react";

/**
 * The measure every page is laid out against — 1080px of content with the design's
 * 32px gutters, collapsing to 20px on small screens.
 *
 * It is a plain `<div>`. Wrap it in, or apply it to, whatever semantic element the
 * section actually is rather than nesting a landmark inside it.
 */
const Container = styled.div`
  width: 100%;
  max-width: var(--content-width);
  margin: 0 auto;
  padding-inline: var(--s-8);

  @media (max-width: 640px) {
    padding-inline: 20px;
  }
`;

export default Container;
