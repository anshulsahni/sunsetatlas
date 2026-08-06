import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

/** Everything is public and worth indexing — a static history site has no private routes. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
