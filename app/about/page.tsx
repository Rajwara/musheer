import type { Metadata } from "next";
import TextPage from "@/components/TextPage";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <TextPage title="About">
      <p>Replace this page with Musheer&apos;s own story, founders, values and service promise.</p>
    </TextPage>
  );
}
