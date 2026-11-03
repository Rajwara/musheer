import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import MilanoSections from "./MilanoSections";
import "./milano.css";

// Archivo at 125% width, as in the original (Google Fonts: wdth 125, weights 300 and 400).
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo" });

export const metadata: Metadata = {
  title: "Test mock",
  robots: { index: false, follow: false },
};

export default function TestMockPage() {
  return (
    <div className={archivo.variable}>
      <MilanoSections />
    </div>
  );
}
