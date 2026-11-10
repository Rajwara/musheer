import type { Metadata } from "next";
import { share } from "@/lib/og";
import BranchGlobe, { type GlobeBranch } from "@/components/branches/BranchGlobe";
import PageBanner from "@/components/PageBanner";
import FieldwornShell from "@/components/FieldwornShell";
import { BRANCHES, directions } from "@/lib/brand";
import { locatorBranches } from "@/lib/branch-list";
import "./branches-brand.css";

export const metadata: Metadata = {
  title: "Branches",
  description: "Find your nearest Al Musheer branch: 13 kandura tailoring stores across Abu Dhabi, Dubai, Sharjah, Ajman and Ras Al Khaimah.",
  ...share("Branches", "Find your nearest Al Musheer branch: 13 kandura tailoring stores across Abu Dhabi, Dubai, Sharjah, Ajman and Ras Al Khaimah.", "branches"),
};

export default function BranchesPage() {
  const branches = locatorBranches();
  const globe: GlobeBranch[] = branches.map((b) => ({
    id: b.id,
    name: b.name,
    area: b.area,
    emirate: b.emirate,
    image: b.image,
    directions: directions(b),
    lat: b.lat,
    lng: b.lng,
  }));

  return (
    <FieldwornShell className="fw-overlay">
      <PageBanner
        image="images/pages/branches"
        eyebrow="*13 branches · 5 Emirates"
        title="Our branches"
        text="Visit any of our branches across the Emirates to choose fabrics and be measured, or book a tailor to come to you."
      />
      <BranchGlobe branches={globe} emirates={BRANCHES.length} />
    </FieldwornShell>
  );
}
