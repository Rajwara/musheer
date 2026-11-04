"use client";

import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { money } from "@/lib/format";
import "./featured-looks.css";

export type Look = { photo: string; slug: string; pill: string; name: string; price: number; image: string };

/**
 * Pinned photo stack from /test-mock-2 ("Featured looks"): as you scroll,
 * each full-width photo slides up over the last and the small product card
 * in the corner rolls to the matching product.
 */
export default function FeaturedLooks({ looks }: { looks: Look[] }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const panels = gsap.utils.toArray<HTMLElement>(".fl-panel", el);
      const track = el.querySelector(".fl-track");
      const n = panels.length;
      const offset = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hdr-h")) || 0;
      gsap.set(panels.slice(1), { yPercent: 100 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: () => `top top+=${offset()}`, end: "bottom bottom", scrub: 0.4, invalidateOnRefresh: true },
      });
      panels.slice(1).forEach((p, i) => {
        tl.to(p, { yPercent: 0, duration: 1 }, i).to(track, { yPercent: -(100 / n) * (i + 1), duration: 1 }, i);
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="fl" ref={root} aria-label="Featured looks" style={{ "--fl-n": looks.length } as React.CSSProperties}>
      <div className="fl-sticky">
        {looks.map((l) => (
          <div className="fl-panel" key={l.slug}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.photo} alt="" loading="lazy" />
          </div>
        ))}
        <div className="fl-card-wrap">
          <div className="fl-container">
            <div className="fl-card">
              <div className="fl-track">
                {looks.map((l) => (
                  <Link className="fl-product" key={l.slug} href={`/product/${l.slug}`}>
                    <span className="fl-pill">{l.pill}</span>
                    <div className="fl-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={l.image} alt="" loading="lazy" />
                    </div>
                    <div className="fl-name">{l.name}</div>
                    <div className="fl-price">{money(l.price)}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
