import type { ReactNode } from "react";
import { styled } from "@linaria/react";

export interface Fact {
  label: string;
  value: ReactNode;
  /**
   * Marks a value as being about British rule, which tints it empire red. Use it
   * only for that — red carries one meaning in this palette.
   */
  isImperial?: boolean;
}

export interface FactListProps {
  facts: readonly Fact[];
}

/**
 * The label/value rows used in side panels and stat boxes.
 *
 * Rendered as a description list so the pairing survives without the visual layout,
 * which matters for screen readers and for how search engines read the facts.
 */
export default function FactList({ facts }: FactListProps) {
  return (
    <List>
      {facts.map((fact) => (
        <Row key={fact.label}>
          <Label>{fact.label}</Label>
          <Value data-imperial={fact.isImperial ? "true" : undefined}>{fact.value}</Value>
        </Row>
      ))}
    </List>
  );
}

const List = styled.dl`
  display: flex;
  flex-direction: column;
  margin: 0;
  font-size: 14.5px;
`;

const Row = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--s-4);
  padding-bottom: 11px;
  margin-bottom: 11px;
  border-bottom: 1px solid var(--line-softer);

  &:last-child {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: none;
  }
`;

const Label = styled.dt`
  margin: 0;
  color: var(--ink-2);
  flex-shrink: 0;
`;

const Value = styled.dd`
  margin: 0;
  font-weight: 700;
  text-align: right;

  &[data-imperial="true"] {
    color: var(--empire-600);
  }
`;
