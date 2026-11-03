import type { Metadata } from "next";
import TextPage from "@/components/TextPage";

export const metadata: Metadata = { title: "Journal" };

export default function JournalPage() {
  return (
    <TextPage title="Journal">
      <p>Publish style guides and care articles here. Suggested first topics:</p>
      <ul>
        <li>How to choose a kandura size</li>
        <li>Ghutra, shimagh and yashmagh explained</li>
        <li>How to care for white garments</li>
        <li>What to wear for Eid</li>
      </ul>
    </TextPage>
  );
}
