"use client";

import { usePageViewTracking, useAutoClickTracking } from "./hooks";

/**
 * Mounts the app's automatic analytics. Renders nothing.
 *
 * It reads search params, so the root layout keeps it inside a `<Suspense>` boundary.
 */
export default function Analytics() {
  usePageViewTracking();
  useAutoClickTracking();

  return null;
}
