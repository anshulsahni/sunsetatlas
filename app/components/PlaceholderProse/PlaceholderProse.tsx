import { styled } from "@linaria/react";

export interface PlaceholderProseProps {
  paragraphs: readonly string[];
  /** Names what will eventually be written here, e.g. "The road to independence". */
  label?: string;
}

/**
 * Renders unwritten narrative sections as visibly-marked lorem ipsum.
 *
 * The independence story of each nation is being researched and written by hand. Until
 * then these sections carry placeholder text, and this component makes that
 * unmistakable in three ways: a labelled banner, muted styling, and `data-nosnippet`
 * so search engines do not lift the filler into a result snippet.
 *
 * Get the text from `lib/placeholderContent` — never write plausible-sounding prose
 * that a reader could mistake for research.
 */
export default function PlaceholderProse({ paragraphs, label }: PlaceholderProseProps) {
  return (
    <Wrapper data-nosnippet>
      <Notice>
        Placeholder text{label ? ` — ${label} has not been written yet` : ""}
      </Notice>
      {paragraphs.map((paragraph, index) => (
        <Paragraph key={index}>{paragraph}</Paragraph>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border-left: 2px dashed var(--line);
  padding-left: var(--s-5);
`;

const Notice = styled.p`
  display: inline-flex;
  align-items: center;
  margin: 0 0 var(--s-3);
  padding: 4px 10px;
  border-radius: var(--r-pill);
  background: var(--paper-2);
  color: var(--ink-3);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const Paragraph = styled.p`
  margin: 0 0 var(--s-4);
  font-size: 17px;
  line-height: 1.7;
  color: var(--ink-3);

  &:last-child {
    margin-bottom: 0;
  }
`;
