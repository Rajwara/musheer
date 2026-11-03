import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { StoreProvider } from "@/components/StoreProvider";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "Arabic Menswear | Musheer", template: "%s | Musheer" },
  description: "Musheer Arabic menswear: kandura, thobes, headwear, footwear and accessories.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <StoreProvider>
          <div className="demo">Sample catalogue: replace sample products, prices and text before launch.</div>
          <Header />
          <main>{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
