import localFont from "next/font/local";

/** The /test-mock-2 fonts, for store pages in its branding (Branches, Blog). */
export const bigShoulders = localFont({ src: "../app/(mock)/test-mock-2/fonts/big-shoulders.woff2", weight: "100 900", display: "swap", variable: "--font-big-shoulders" });
export const spaceGrotesk = localFont({ src: "../app/(mock)/test-mock-2/fonts/space-grotesk.woff2", weight: "300 700", display: "swap", variable: "--font-space-grotesk" });
export const fieldwornFonts = `${bigShoulders.variable} ${spaceGrotesk.variable}`;
