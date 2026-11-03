import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { StoreProvider } from "@/components/StoreProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import { TAGLINE } from "@/lib/brand";
import "./globals.css";

const serif = Playfair_Display({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "Al Musheer | Kandura Tailoring Since 1998", template: "%s | Al Musheer" },
  description:
    "Al Musheer: the UAE's trusted name in kandura textile and tailoring since 1998. Bespoke kanduras, home tailoring visits, headwear, sandals and accessories across 13 branches in 5 Emirates.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <StoreProvider>
          <div className="demo">{TAGLINE}</div>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </StoreProvider>
      </body>
    </html>
  );
}
