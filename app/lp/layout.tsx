import type { Metadata } from "next";
import { FunnelTracking } from "@/components/layout/FunnelTracking";

/**
 * Ad landing pages. No site header, nav, footer, mobile bar or entry popup:
 * the nav links to treatments whose names Google Ads restricts in India, and a
 * landing page is judged on what it actually serves.
 *
 * noindex, nofollow because these pages duplicate the site's own content and
 * exist only as ad destinations. Deliberately NOT blocked in robots.txt —
 * blocking would stop Google Ads crawling the destination, which is itself
 * grounds for disapproval.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      <main id="main">{children}</main>
      <FunnelTracking />
    </div>
  );
}
