import type { Metadata } from "next";
import { HomeVisit, Services, Stats, Story, WhoWeAre } from "@/components/BrandSections";

export const metadata: Metadata = {
  title: "About",
  description: "Since 1998, Al Musheer has dressed the men of the UAE in precisely tailored kanduras.",
};

export default function AboutPage() {
  return (
    <>
      <div className="wrap" style={{ paddingTop: 30, paddingBottom: 30 }}>
        <span className="eyebrow">Est. 1998 · United Arab Emirates</span>
        <h1 style={{ marginTop: 10 }}>About Al Musheer</h1>
      </div>
      <Stats />
      <WhoWeAre />
      <Story />
      <Services />
      <HomeVisit />
    </>
  );
}
