import type { Metadata } from "next";
import { Branches, HomeVisit } from "@/components/BrandSections";
import PageBanner from "@/components/PageBanner";

export const metadata: Metadata = {
  title: "Branches",
  description: "Find an Al Musheer branch: 13 kandura tailoring stores across Abu Dhabi, Dubai, Sharjah, Ajman and Ras Al Khaimah.",
};

export default function BranchesPage() {
  return (
    <>
      <PageBanner
        image="images/pages/branches"
        eyebrow="13 branches · 5 Emirates"
        title="Our branches"
        text="Visit any of our branches across the Emirates to choose fabrics and be measured, or book a tailor to come to you."
      />
      <Branches />
      <HomeVisit />
    </>
  );
}
