import type { Metadata } from "next";
import BranchLocator, { type LocatorBranch } from "@/components/BranchLocator";
import BranchMarkets, { type EmirateCard } from "@/components/branches/BranchMarkets";
import PageBanner from "@/components/PageBanner";
import FieldwornShell from "@/components/FieldwornShell";
import { BRANCHES } from "@/lib/brand";
import { imageSrc } from "@/lib/images";
import "./branches-brand.css";


export const metadata: Metadata = {
  title: "Branches",
  description: "Find your nearest Al Musheer branch: 13 kandura tailoring stores across Abu Dhabi, Dubai, Sharjah, Ajman and Ras Al Khaimah.",
};

// Shown on hover until a photo of the branch itself is added at public/images/branches/<id>.webp.
const FALLBACKS = ["images/pages/branches", "images/pages/about", "images/hero/hero-new", "images/pages/contact", "images/content/story"];
// Photo revealed when hovering an emirate card.
const EMIRATE_PHOTOS = ["images/hero/hero-adult", "images/pages/branches", "images/hero/hero-new", "images/pages/about", "images/hero/hero-winter"];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function BranchesPage() {
  let i = 0;
  const branches: LocatorBranch[] = BRANCHES.flatMap((e) =>
    e.branches.map((b) => {
      const own = imageSrc(`images/branches/${b.id}`);
      const image = own.endsWith(".svg") ? imageSrc(FALLBACKS[i++ % FALLBACKS.length]) : own;
      return { ...b, emirate: e.emirate, image };
    }),
  );
  const cards: EmirateCard[] = BRANCHES.map((e, n) => ({
    emirate: e.emirate,
    slug: slug(e.emirate),
    count: e.branches.length,
    areas: e.branches.map((b) => b.name),
    photo: imageSrc(EMIRATE_PHOTOS[n % EMIRATE_PHOTOS.length]),
  }));

  return (
    <FieldwornShell>
      <PageBanner
        image="images/pages/branches"
        eyebrow="*13 branches · 5 Emirates"
        title="Our branches"
        text="Visit any of our branches across the Emirates to choose fabrics and be measured, or book a tailor to come to you."
      />
      <BranchMarkets cards={cards} total={branches.length} />
      <BranchLocator branches={branches} />
    </FieldwornShell>
  );
}
