import type { Metadata } from "next";
import { HomeVisit, Services, Stats, Story, WhoWeAre } from "@/components/BrandSections";
import FieldwornShell from "@/components/FieldwornShell";
import PageBanner from "@/components/PageBanner";
import "./about-brand.css";

export const metadata: Metadata = {
  title: "About",
  description: "Since 1998, Al Musheer has dressed the men of the UAE in precisely tailored kanduras.",
};

export default function AboutPage() {
  return (
    <FieldwornShell className="fw-overlay about-fw">
      <PageBanner image="images/pages/about" eyebrow="*Est. 1998 · United Arab Emirates" title="About Al Musheer" />
      <Stats />
      <WhoWeAre />
      <Story />
      <Services />
      <HomeVisit />
    </FieldwornShell>
  );
}
