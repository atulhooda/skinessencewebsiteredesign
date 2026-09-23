import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { LeadPopupMount } from "@/components/lead/LeadPopupMount";
import { FunnelTracking } from "@/components/layout/FunnelTracking";
import { Gtm } from "@/components/layout/Gtm";
import { Header } from "@/components/layout/Header";
import { StickyBar } from "@/components/layout/StickyBar";
import { getSite } from "@/lib/content";
import { HOME_TITLE, OG_LOCALE, SITE_NAME, SITE_URL } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: HOME_TITLE, template: `%s | ${SITE_NAME}` },
  description: getSite().description,
  applicationName: SITE_NAME,
  openGraph: { type: "website", locale: OG_LOCALE, siteName: SITE_NAME },
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c5860",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <Gtm />
      <body className="pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-0">
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
      </body>
    </html>
  );
}
