import { GoogleAnalytics } from "@next/third-parties/google";

/**
 * Google Analytics 4 (measurement ID supplied by the client, 11 Oct 2026).
 *
 * Uses Next's own GoogleAnalytics component rather than two hand-written
 * <Script> tags: it loads gtag.js after hydration, sets up window.dataLayer
 * and the gtag config, and keeps page views working across client-side route
 * changes, which a raw snippet in the layout does not.
 *
 * Set NEXT_PUBLIC_GA_ID to "" to switch it off, or to another measurement ID
 * to point at a different property.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-4X6MTB1JS6";

export function Analytics() {
  if (!GA_ID) return null;
  return <GoogleAnalytics gaId={GA_ID} />;
}
