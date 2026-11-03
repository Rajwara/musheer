import type { Metadata } from "next";
import localFont from "next/font/local";
import "./fieldworn.css";

// The two fonts embedded in the original file, now served as files.
const bigShoulders = localFont({ src: "./fonts/big-shoulders.woff2", weight: "100 900", display: "swap", variable: "--font-big-shoulders" });
const spaceGrotesk = localFont({ src: "./fonts/space-grotesk.woff2", weight: "300 700", display: "swap", variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "Fieldworn | Clothing Store",
  description: "Placeholder homepage for a clothing store. Replace with your own description.",
  robots: { index: false, follow: false },
};

/**
 * Own root layout: this mock is a complete standalone homepage, so it does not
 * load the store's stylesheet, header or footer (their class names overlap).
 */
export default function FieldwornLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bigShoulders.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
