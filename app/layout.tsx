import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/layout/Analytics";
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

/**
 * Document shell only. The site's header, footer, mobile bar and popup live in
 * app/(site)/layout.tsx so that the ad landing pages under /lp can render
 * without them: Google Ads reviews the landing page, and the site nav links to
 * treatments whose names are restricted terms in India. Hiding that chrome with
 * CSS would leave it in the HTML, so /lp genuinely does not render it.
 *
 * Analytics stays here, so it covers every page including /lp.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
