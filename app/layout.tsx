import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Bricolage_Grotesque, Hanken_Grotesk, Space_Mono } from "next/font/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Analytics from "@/app/components/Analytics";
import JsonLd from "@/app/components/JsonLd";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { websiteJsonLd } from "@/lib/seo";
import { SITE_URL, site } from "@/lib/site";
import { rawColors } from "@/lib/theme";

import "./globals.css";

/* The three families the design system calls for, self-hosted by next/font. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display-family",
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body-family",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono-family",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — every nation that left the British Empire`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
  },
  twitter: { card: "summary_large_image", site: site.twitter },
};

export const viewport: Viewport = {
  themeColor: rawColors.empire900,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />

        <JsonLd data={websiteJsonLd()} />

        {/* Reads search params, so it needs a boundary of its own. */}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
