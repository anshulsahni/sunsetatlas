import type { ReactNode } from "react";
import { styled } from "@linaria/react";

export interface SectionHeadingProps {
  /** Rendered as an `<h2>` — the page's `<h1>` belongs to `PageHero`. */
  children: ReactNode;
  /** Lucide icon, tinted by the caller. Decorative, so it is hidden from the reader. */
  icon?: ReactNode;
  /** Optional supporting sentence under the heading. */
  description?: ReactNode;
  /** A "see all" link or count, pushed to the right. */
  action?: ReactNode;
  id?: string;
}

/** The standard section header: optional icon, an `<h2>`, and an optional action. */
export default function SectionHeading({
  children,
  icon,
  description,
  action,
  id,
}: SectionHeadingProps) {
  return (
    <Wrapper>
      <Row>
        <TitleGroup>
          {icon && <IconSlot aria-hidden="true">{icon}</IconSlot>}
          <Title id={id}>{children}</Title>
        </TitleGroup>
        {action && <Action>{action}</Action>}
      </Row>
      {description && <Description>{description}</Description>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-bottom: var(--s-6);
`;

const Row = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--s-4);
  flex-wrap: wrap;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s-3);
`;

const IconSlot = styled.span`
  display: inline-flex;
  color: var(--empire-500);
`;

const Title = styled.h2`
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 26px;
  line-height: 1.15;
  letter-spacing: -0.01em;
`;

const Action = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const Description = styled.p`
  margin: var(--s-3) 0 0;
  max-width: 66ch;
  font-size: 15.5px;
  color: var(--ink-2);
`;
