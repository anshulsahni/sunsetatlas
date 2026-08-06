import Link from "next/link";
import { styled } from "@linaria/react";

import { routes } from "@/lib/routes";

/**
 * A short, honest disclosure that the per-country narrative histories are not
 * written yet — truthful copy about the site itself, not a factual claim about any
 * nation, so it needs no dataset backing and no `PlaceholderProse` treatment.
 */
export default function StillWritingNote() {
  return (
    <Note>
      The per-country histories on this atlas are still being written. Every country
      page carries clearly labelled placeholder text until the real research replaces
      it — see the <Link href={routes.about()}>about page</Link> for where the dataset
      comes from and what’s still to come.
    </Note>
  );
}

const Note = styled.p`
  max-width: 66ch;
  margin: 0 0 var(--s-12);
  padding: var(--s-5);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--paper-2);
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-2);

  a {
    font-weight: 600;
  }
`;
