import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HideOnPaths from "@/components/HideOnPaths";
import { StoreProvider } from "@/components/StoreProvider";
import Motion from "@/components/Motion";
import OfferPopup from "@/components/OfferPopup";
import { QuickViewProvider } from "@/components/QuickView";
import WhatsAppButton from "@/components/WhatsAppButton";
import { categories } from "@/lib/catalog";
import { fieldwornFonts } from "@/lib/fieldworn-fonts";
import { imageSrc } from "@/lib/images";
import "./globals.css";
import "./blog-layout.css";

const serif = Plus_Jakarta_Sans({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "Al Musheer | Kandura Tailoring Since 1998", template: "%s | Al Musheer" },
  description:
    "Al Musheer: the UAE's trusted name in kandura textile and tailoring since 1998. Bespoke kanduras, home tailoring visits, headwear, sandals and accessories across 13 branches in 5 Emirates.",
};

const categoryImages = Object.fromEntries(categories.map((c) => [c.slug, imageSrc(`images/categories/${c.slug}`)]));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${fieldwornFonts}`}>
      <body id="top">
        <StoreProvider>
          <HideOnPaths>
            <AnnouncementBar />
          </HideOnPaths>
          <QuickViewProvider>
            <HideOnPaths>
              <Header images={categoryImages} />
            </HideOnPaths>
            <main>{children}</main>
            <HideOnPaths>
              <Footer />
            </HideOnPaths>
            <WhatsAppButton />
            <OfferPopup />
          </QuickViewProvider>
          <Motion />
        </StoreProvider>
      </body>
    </html>
  );
}
