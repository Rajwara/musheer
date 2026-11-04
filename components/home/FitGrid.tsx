"use client";

import Link from "next/link";
import gsap from "gsap";
import { useRef, useState } from "react";
import { money } from "@/lib/format";

export type FitCard = { slug: string; group: string; title: string; count: number; from: number; image: string };

const TABS = [
  { id: "all", label: "All" },
  { id: "kandura", label: "Kandura" },
  { id: "kids", label: "Kids" },
  { id: "headwear", label: "Headwear" },
  { id: "accessories", label: "Accessories" },
];

/** Filter tabs and the category cards they show, as on /test-mock-2. */
export default function FitGrid({ cards }: { cards: FitCard[] }) {
  const [filter, setFilter] = useState("all");
  const grid = useRef<HTMLDivElement>(null);

  const pick = (id: string) => {
    setFilter(id);
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
          </button>
        ))}
      </div>
      <div className="fyf-grid" ref={grid}>
        {cards.map((c) => (
          <Link className="fyf-card" key={c.slug} href={`/category/${c.slug}`} hidden={filter !== "all" && c.group !== filter}>
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
    </>
  );
}
