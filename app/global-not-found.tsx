import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import NotFoundContent from "@/components/not-found/NotFoundContent";
import { QuickViewProvider } from "@/components/QuickView";
import SiteFooter from "@/components/SiteFooter";
import { StoreProvider } from "@/components/StoreProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import { categories } from "@/lib/catalog";
import { fieldwornFonts } from "@/lib/fieldworn-fonts";
import { imageSrc } from "@/lib/images";
import "./(site)/globals.css";

// Unmatched URLs. The app has more than one root layout (the store and the test
// mocks), so this page brings its own <html> and the store header and footer.
const serif = Plus_Jakarta_Sans({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif", preload: false });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", preload: false });

export const metadata: Metadata = { title: "Page not found | Al Musheer" };

const categoryImages = Object.fromEntries(categories.map((c) => [c.slug, imageSrc(`images/categories/${c.slug}`)]));

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${fieldwornFonts}`}>
      <body>
        <StoreProvider>
          <AnnouncementBar />
          <QuickViewProvider>
            <Header images={categoryImages} />
            <main>
              <NotFoundContent />
            </main>
            <SiteFooter />
            <WhatsAppButton />
          </QuickViewProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
