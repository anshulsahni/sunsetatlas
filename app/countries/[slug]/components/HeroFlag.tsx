import { styled } from "@linaria/react";

import FlagDisc from "@/app/components/FlagDisc";
import type { NationalPalette } from "@/lib/countries";

export interface HeroFlagProps {
  palette: NationalPalette;
  countryName: string;
}

/** The large flag disc in the country hero, with its outer ring and "NATIONAL FLAG" label. */
export default function HeroFlag({ palette, countryName }: HeroFlagProps) {
  return (
    <Wrapper>
      <Ring>
        <FlagDisc palette={palette} size={210} ringColor="rgba(255, 255, 255, 0.9)" />
      </Ring>
      <Label aria-hidden="true">National flag</Label>
      <VisuallyHidden>{countryName}&rsquo;s national flag</VisuallyHidden>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-4);
`;

const Ring = styled.div`
  border-radius: 50%;
  box-shadow:
    0 0 0 10px rgba(255, 255, 255, 0.22),
    0 24px 60px rgba(0, 0, 0, 0.28);
`;

const Label = styled.p`
  margin: 0;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
`;
