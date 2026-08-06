import { styled } from "@linaria/react";
import { ExternalLink } from "lucide-react";

import { Panel, PanelHeading } from "@/app/components/Panel";

export interface SourcePanelProps {
  sourceUrl: string;
}

/** Links out to the research record behind this page's facts. */
export default function SourcePanel({ sourceUrl }: SourcePanelProps) {
  return (
    <Panel>
      <PanelHeading>Source</PanelHeading>
      <SourceLink href={sourceUrl} target="_blank" rel="noopener noreferrer">
        <ExternalLink size={15} aria-hidden="true" />
        View the primary source
      </SourceLink>
    </Panel>
  );
}

const SourceLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  font-size: 14px;
  font-weight: 600;
  color: var(--empire-600);

  &:hover {
    text-decoration: underline;
  }
`;
