import Link from "next/link";
import { styled } from "@linaria/react";
import { ArrowRight } from "lucide-react";

import type { Collection } from "@/lib/countries";
import { routes } from "@/lib/routes";

export interface CollectionCardProps {
  collection: Collection;
  count: number;
}

/** The card for one themed list on the `/collections` hub. */
export default function CollectionCard({ collection, count }: CollectionCardProps) {
  return (
    <Card href={routes.collection(collection.slug)}>
      <Count>
        {count} {count === 1 ? "nation" : "nations"}
      </Count>
      <Name>{collection.name}</Name>
      <Summary>{collection.summary}</Summary>
      <Footer>
        See the list <ArrowRight size={15} aria-hidden="true" />
      </Footer>
    </Card>
  );
}

const Card = styled(Link)`
  display: block;
  padding: var(--s-5);
  border: 1px solid var(--line-soft);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--sh-flat);
  color: var(--ink);
  transition:
    box-shadow var(--dur) var(--ease),
    transform var(--dur) var(--ease);

  &:hover {
    color: var(--ink);
    box-shadow: var(--sh-card);
    transform: translateY(-2px);
  }
`;

const Count = styled.span`
  display: inline-block;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 11.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--empire-600);
`;

const Name = styled.span`
  display: block;
  margin-top: var(--s-2);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 21px;
  line-height: 1.15;
`;

const Summary = styled.p`
  margin: var(--s-3) 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink-2);
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s-2);
  margin-top: var(--s-4);
  padding-top: var(--s-4);
  border-top: 1px solid var(--line-softer);
  font-size: 13px;
  font-weight: 600;
  color: var(--empire-600);
`;
