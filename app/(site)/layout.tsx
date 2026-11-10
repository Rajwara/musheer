import type { Metadata } from "next";
import { SITE_URL, share } from "@/lib/og";
import { Inter, Noto_Kufi_Arabic, Plus_Jakarta_Sans } from "next/font/google";
import AnnouncementBar from "@/components/AnnouncementBar";
import SiteFooter from "@/components/SiteFooter";
import Header from "@/components/Header";
import { StoreProvider } from "@/components/StoreProvider";
import Motion from "@/components/Motion";
import OfferPopup from "@/components/OfferPopup";
import { QuickViewProvider } from "@/components/QuickView";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import { categories } from "@/lib/catalog";
import { fieldwornFonts } from "@/lib/fieldworn-fonts";
import { imageSrc } from "@/lib/images";
import "./globals.css";
import "./blog-layout.css";

const serif = Plus_Jakarta_Sans({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
// Arabic typeface for the Arabic version of the site (Google-translated pages).
const arabic = Noto_Kufi_Arabic({ subsets: ["arabic"], weight: ["400", "500", "700"], variable: "--font-arabic", preload: false });

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: { default: "Al Musheer | Kandura Tailoring Since 1998", template: "%s | Al Musheer" },
  description:
    "Al Musheer: the UAE's trusted name in kandura textile and tailoring since 1998. Bespoke kanduras, home tailoring visits, headwear, sandals and accessories across 13 branches in 5 Emirates.",
  ...share("Al Musheer | Kandura Tailoring Since 1998", "Al Musheer: the UAE's trusted name in kandura textile and tailoring since 1998. Bespoke kanduras, home tailoring visits, headwear, sandals and accessories across 13 branches in 5 Emirates.", "home"),
};

const categoryImages = Object.fromEntries(categories.map((c) => [c.slug, imageSrc(`images/categories/${c.slug}`)]));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${serif.variable} ${sans.variable} ${arabic.variable} ${fieldwornFonts}`}>
      <body id="top">
        <ScrollToTop />
        <StoreProvider>
          <AnnouncementBar />
          <QuickViewProvider>
            <Header images={categoryImages} />
            <main>{children}</main>
            <SiteFooter />
            <WhatsAppButton />
            <OfferPopup image={imageSrc("images/hero/hero-winter")} />
          </QuickViewProvider>
          <Motion />
        </StoreProvider>
      </body>
    </html>
  );
}
