import type { Metadata } from "next";
import "./logotype.css";

export const metadata: Metadata = {
  title: "About | Al Musheer",
  robots: { index: false, follow: false },
};

/**
 * Own root layout: this mock is a complete standalone homepage, so it does not
 * load the store's stylesheet, header or footer.
 */
export default function LogotypeLayout({ children }: { children: React.ReactNode }) {
  return (
    // The inline script adds "js" before first paint, as in the original, so reveal
    // animations start hidden; suppressHydrationWarning lets React keep that class.
    <html lang="en" suppressHydrationWarning>
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
