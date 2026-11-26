import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { loadServerSiteCache } from "@/lib/server-bootstrap";

export const dynamic = "force-dynamic";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Milli Gençlik Derneği (MGD) — Resmî Web Portalı",
  description:
    "Milli Gençlik Derneği (MGD) resmî web portalı. Şuurlu Gençlik, Güçlü Türkiye. 81 ilde ahlak, ilim ve sorumlulukla yarınları inşa ediyoruz.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialCache = await loadServerSiteCache();
  return (
    <html lang="tr" className="scroll-smooth">
      <body
        className={`${plusJakarta.variable} ${montserrat.variable} font-sans antialiased bg-white text-ink selection:bg-primary selection:text-white`}
      >
        <AppProviders initialCache={initialCache}>{children}</AppProviders>
      </body>
    </html>
  );
}
