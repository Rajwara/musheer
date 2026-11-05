"use client";

import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { money } from "@/lib/format";
import type { CardProduct } from "@/lib/types";
import QuickViewArea from "../QuickViewArea";
import BtnContent from "../ui/BtnContent";
import "./new-arrivals.css";

export type Arrival = { slug: string; name: string; price: number; colour: string; category: string; image: string; card: CardProduct };

const Arrow = ({ back }: { back?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={back ? "M20 12H4M10 6l-6 6 6 6" : "M4 12h16M14 6l6 6-6 6"} />
  </svg>
);

/**
 * New arrivals in the layout of the /test-mock-2 "Occasion Wear" section: a
 * black panel with an outlined marquee behind one large product card that
 * cross-fades to the next with the arrows.
 */
export default function NewArrivals({ items }: { items: Arrival[] }) {
  const [at, setAt] = useState(0);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const n = items.length;

  // Cards rise in when the section first scrolls into view.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".na-cards", { y: 80, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: stage.current, start: "top 85%", once: true } });
    });
    return () => mm.revert();
  }, []);

  const go = (d: number) => {
    const cur = cards.current[at];
    const next = (at + d + n) % n;
    const nx = cards.current[next];
    setAt(next);
    if (!cur || !nx || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.killTweensOf([cur, nx]);
    gsap.to(cur, { autoAlpha: 0, x: -40 * d, scale: 0.96, duration: 0.5, ease: "power2.in" });
    gsap.fromTo(nx, { autoAlpha: 0, x: 40 * d, scale: 0.96 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.7, delay: 0.2, ease: "power3.out" });
  };

  return (
    <section className="na" aria-labelledby="na-title">
      <div className="na-container">
        <span className="na-label">*New Arrivals</span>
        <h2 id="na-title">Dressed For Every Occasion</h2>
        <Link className="am-btn am-light na-cta" href="/shop?filter=new">
          <BtnContent label="Shop New Arrivals" />
        </Link>
      </div>
      <div className="na-stage" ref={stage}>
        <div className="na-marquee" aria-hidden="true">
          <span>New In</span>
          <span>New In</span>
          <span>New In</span>
          <span>New In</span>
        </div>
        <div className="na-cards" aria-live="polite">
          {items.map((it, i) => (
            <Link
              key={it.slug}
              ref={(el) => {
                cards.current[i] = el;
              }}
              className={i === at ? "na-card on" : "na-card"}
              href={`/product/${it.slug}`}
              aria-hidden={i !== at}
              tabIndex={i === at ? 0 : -1}
            >
              <QuickViewArea className="na-area" product={it.card}>
                <div className="na-bg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image} alt="" loading="lazy" />
                </div>
                <span className="na-pill">New · {it.category.replace(/^All /, "")}</span>
                <div className="na-txt">
                  <b>{it.name}</b>
                  {money(it.price)} &nbsp;|&nbsp; {it.colour}
                </div>
              </QuickViewArea>
              <span className="na-go">
                <Arrow />
              </span>
            </Link>
          ))}
        </div>
        {n > 1 && (
          <div className="na-arrows">
            <span className="na-count" aria-hidden="true">
              {String(at + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
            <button className="na-round" type="button" aria-label="Previous new arrival" onClick={() => go(-1)}>
              <Arrow back />
            </button>
            <button className="na-round" type="button" aria-label="Next new arrival" onClick={() => go(1)}>
              <Arrow />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
