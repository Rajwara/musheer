import type { Metadata } from "next";
import { Branches, HomeVisit } from "@/components/BrandSections";

export const metadata: Metadata = {
  title: "Branches",
  description: "Find an Al Musheer branch: 13 kandura tailoring stores across Abu Dhabi, Dubai, Sharjah, Ajman and Ras Al Khaimah.",
};

export default function BranchesPage() {
  return (
    <>
      <div className="wrap" style={{ paddingTop: 30, paddingBottom: 30 }}>
        <h1>Our branches</h1>
        <p style={{ color: "var(--muted)", marginTop: 12, maxWidth: 620 }}>
          Visit any of our 13 branches across the Emirates to choose fabrics and be measured, or book a tailor to come to you.
        </p>
      </div>
      <Branches />
      <HomeVisit />
    </>
  );
}
