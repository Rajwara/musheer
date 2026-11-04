import type { Metadata } from "next";
import localFont from "next/font/local";
import "./logotype.css";

// Fonts of the /test-mock-2 header and footer used on this page.
const bigShoulders = localFont({ src: "../test-mock-2/fonts/big-shoulders.woff2", weight: "100 900", display: "swap", variable: "--font-big-shoulders" });
const spaceGrotesk = localFont({ src: "../test-mock-2/fonts/space-grotesk.woff2", weight: "300 700", display: "swap", variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "About | Al Musheer",
  robots: { index: false, follow: false },
};

/**
 * Own root layout: this mock is a complete standalone page, so it does not
 * load the store's stylesheet, header or footer.
 */
export default function LogotypeLayout({ children }: { children: React.ReactNode }) {
  return (
    // The inline script adds "js" before first paint, as in the original, so reveal
    // animations start hidden; suppressHydrationWarning lets React keep that class.
    <html lang="en" className={`${bigShoulders.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://api.fontshare.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
