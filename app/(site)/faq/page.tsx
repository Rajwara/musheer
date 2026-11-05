import type { Metadata } from "next";
import Link from "next/link";
import FieldwornShell from "@/components/FieldwornShell";
import FaqList, { type FaqGroup } from "@/components/faq/FaqList";
import { HOME_VISIT_URL, WHATSAPP_URL } from "@/lib/brand";
import { FAQ } from "@/lib/faq";
import { imageSrc } from "@/lib/images";
import "../shop-brand.css";
import "@/components/faq/faq.css";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about Al Musheer: made-to-measure kanduras, home tailoring visits, delivery, returns and our 13 branches.",
};

export default function FaqPage() {
  const groups: FaqGroup[] = FAQ.map((t) => ({
    ...t,
    items: t.items.map((it) => ({
      ...it,
      image: imageSrc(it.image),
      link: it.link && (it.link.href === "home-visit" ? { label: it.link.label, href: HOME_VISIT_URL, external: true } : it.link),
    })),
  }));
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <FieldwornShell className="shop-fw">
      <div className="cat-hero">
        <div className="cat-hero-copy">
          <div className="crumb">
            <Link href="/">Home</Link> / FAQ
          </div>
          <span className="eyebrow">*Help centre</span>
          <h1>Questions & Answers</h1>
          <p>Everything about tailoring, home visits, delivery and returns, answered by the Al Musheer team.</p>
        </div>
        <div className="cat-hero-pic">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc("images/content/story")} alt="" />
        </div>
      </div>

      <div className="faq-wrap">
        <div className="faq-head">
          <div>
            <span className="faq-label">*Frequently asked</span>
            <h2>How can we help?</h2>
          </div>
          <p>{total} answers across {groups.length} topics. Pick a topic, then click a question to open it.</p>
        </div>
        <FaqList groups={groups} />
      </div>

      <div className="faq-cta">
        <div>
          <h2>Still have a question?</h2>
          <p>WhatsApp is the quickest way to reach our team, or book a tailor to come to you.</p>
        </div>
        <div className="faq-cta-btns">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            Message us on WhatsApp
          </a>
          <a href={HOME_VISIT_URL} target="_blank" rel="noopener noreferrer">
            Book a home visit
          </a>
        </div>
      </div>
    </FieldwornShell>
  );
}
