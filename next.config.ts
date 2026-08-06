import type { NextConfig } from "next";
import { withWyw } from "@wyw-in-js/nextjs";

/** Readable Linaria class names in dev tooling: `.Heading-abc123`. */
const classNameSlug = "[title]-[hash]";

const nextConfig: NextConfig = {};

export default withWyw(nextConfig, {
  loaderOptions: { classNameSlug },
  turbopackLoaderOptions: { classNameSlug },
});
