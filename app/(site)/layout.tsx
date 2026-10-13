import { Footer } from "@/components/layout/Footer";
import { FunnelTracking } from "@/components/layout/FunnelTracking";
import { Gtm } from "@/components/layout/Gtm";
import { Header } from "@/components/layout/Header";
import { StickyBar } from "@/components/layout/StickyBar";
import { LeadPopupMount } from "@/components/lead/LeadPopupMount";

/**
 * The public site: header, footer, mobile quick-actions bar and entry popup.
 * Everything under /lp is deliberately outside this group and renders none of
 * it. URLs are unaffected — a route group is invisible to routing.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-0">
      <Gtm />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="relative mx-auto w-full max-w-[1600px] px-3 pt-3 md:px-5 md:pt-5">
        <Header />
        <main id="main" className="flex flex-col gap-3 md:gap-5">
          {children}
        </main>
        <Footer />
      </div>
      <StickyBar />
      <LeadPopupMount />
      <FunnelTracking />
    </div>
  );
}
