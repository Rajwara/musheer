"use client";

import Link from "next/link";
import gsap from "gsap";
import { useRef, useState } from "react";
import { money } from "@/lib/format";

export type FitCard = { slug: string; group: string; title: string; count: number; from: number; image: string };

const TABS = [
  { id: "all", label: "All" },
  { id: "kandura", label: "Kandura" },
  { id: "outerwear", label: "Outerwear" },
  { id: "casual", label: "Casual & Underwear" },
  { id: "headwear", label: "Headwear" },
  { id: "footwear", label: "Footwear" },
  { id: "kids", label: "Kids" },
  { id: "accessories", label: "Accessories & Gifts" },
];

/** Cards shown under "All" before "View all categories" is pressed. */
const FIRST = 6;

/** Filter tabs and the category cards they show, as on /test-mock-2. */
export default function FitGrid({ cards }: { cards: FitCard[] }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const grid = useRef<HTMLDivElement>(null);
  const visible = (c: FitCard, i: number) => (filter === "all" ? expanded || i < FIRST : c.group === filter);
  const count = (id: string) => (id === "all" ? cards.length : cards.filter((c) => c.group === id).length);

  const pick = (id: string, expand = expanded) => {
    setFilter(id);
    setExpanded(expand);
    // Fade the newly shown cards in, once React has rendered them.
    requestAnimationFrame(() => {
      const shown = grid.current?.querySelectorAll(".fyf-card:not([hidden])");
      if (!shown?.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.killTweensOf(shown);
      gsap.fromTo(shown, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.07 });
    });
  };

  return (
    <>
      <div className="fyf-tabs" role="tablist" aria-label="Filter categories">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={filter === t.id} className={filter === t.id ? "fyf-tab on" : "fyf-tab"} onClick={() => pick(t.id)}>
            {t.label}
            <span className="fyf-count">{count(t.id)}</span>
          </button>
        ))}
      </div>
      <div className="fyf-grid" ref={grid}>
        {cards.map((c, i) => (
          <Link className="fyf-card" key={c.slug} href={`/category/${c.slug}`} hidden={!visible(c, i)}>
            <div className="fyf-im">
              <span className="fyf-pill">
                {c.count} {c.count === 1 ? "Style" : "Styles"}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt="" loading="lazy" />
            </div>
            <h3>{c.title}</h3>
            {c.from > 0 && (
              <div>
                Starts from <span className="fyf-price">{money(c.from)}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
      {filter === "all" && cards.length > FIRST && (
        <div className="fyf-more">
          <button type="button" className="fyf-more-btn" aria-expanded={expanded} onClick={() => pick("all", !expanded)}>
            {expanded ? "Show fewer categories" : `View all ${cards.length} categories`}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={expanded ? { transform: "rotate(180deg)" } : undefined}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
