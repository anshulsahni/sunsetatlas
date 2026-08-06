export interface JsonLdProps {
  /** A structured-data object from `lib/seo`. */
  data: Record<string, unknown>;
}

/**
 * Renders one JSON-LD block.
 *
 * Build the payload with a helper from `lib/seo` — this component only serialises it.
 * `<` is escaped so a stray angle bracket in the data cannot close the script tag.
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
