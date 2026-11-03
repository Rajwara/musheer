import type { Metadata } from "next";
import { HomeVisit, Services, Stats, Story, WhoWeAre } from "@/components/BrandSections";
import PageBanner from "@/components/PageBanner";

export const metadata: Metadata = {
  title: "About",
  description: "Since 1998, Al Musheer has dressed the men of the UAE in precisely tailored kanduras.",
};

export default function AboutPage() {
  return (
    <>
      <PageBanner image="images/pages/about" eyebrow="Est. 1998 · United Arab Emirates" title="About Al Musheer" />
      <Stats />
      <WhoWeAre />
      <Story />
      <Services />
      <HomeVisit />
    </>
  );
}
