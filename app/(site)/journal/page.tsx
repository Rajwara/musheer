import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";

export const metadata: Metadata = { title: "Journal" };

export default function JournalPage() {
  return (
    <>
      <PageBanner image="images/pages/journal" eyebrow="Style and care" title="Journal" />
      <div className="wrap narrow">
      <p>Publish style guides and care articles here. Suggested first topics:</p>
      <ul>
        <li>How to choose a kandura size</li>
        <li>Ghutra, shimagh and yashmagh explained</li>
        <li>How to care for white garments</li>
        <li>What to wear for Eid</li>
      </ul>
      </div>
    </>
  );
}
