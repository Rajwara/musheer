import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TextPage from "@/components/TextPage";

const policies: Record<string, string> = {
  terms: "Terms of Service",
  privacy: "Privacy Policy",
  refund: "Refund Policy",
  shipping: "Shipping Policy",
};

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = policies[(await params).slug];
  return title ? { title } : {};
}

export default async function PolicyPage({ params }: Props) {
  const title = policies[(await params).slug];
  if (!title) notFound();
  return (
    <TextPage title={title}>
      <p className="notice">
        Draft placeholder. Have Musheer&apos;s adviser approve the final {title.toLowerCase()} before launch.
      </p>
    </TextPage>
  );
}
