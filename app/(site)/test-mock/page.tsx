import type { Metadata } from "next";
import { Archivo, Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import MarketsSection from "./MarketsSection";
import MilanoSections from "./MilanoSections";
import "./milano.css";

// Archivo at 125% width, as in the original (Google Fonts: wdth 125, weights 300 and 400).
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo" });
// Markets section: Bricolage Grotesque (opsz 12-96, 400/500) and Instrument Sans (400/500).
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--font-bricolage" });
const instrument = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-instrument-sans" });

export const metadata: Metadata = {
  title: "Test mock",
  robots: { index: false, follow: false },
};

export default function TestMockPage() {
  return (
    <div className={`${archivo.variable} ${bricolage.variable} ${instrument.variable}`}>
      <MilanoSections />
      <MarketsSection />
    </div>
  );
}
