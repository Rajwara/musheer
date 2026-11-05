"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import "./what-we-stand-for.css";

export type PromiseCard = { image: string; quote: string; title: string; note: string };

/**
 * "*Our Promise / What We Stand For" from /test-mock-2: the section pins
 * while a row of photos and promise cards travels sideways (phones swipe
 * the row instead).
 */
export default function WhatWeStandFor({ items }: { items: PromiseCard[] }) {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);

  // Phones and tablets: the row is a swipe carousel; keep the dots and counter in step.
  const onScroll = () => {
    const t = trackRef.current;
    if (!t) return;
    const pairs = Array.from(t.children) as HTMLElement[];
    const left = t.scrollLeft + t.clientWidth * 0.3;
    let i = 0;
    pairs.forEach((p, k) => {
      if (p.offsetLeft <= left) i = k;
    });
    if (t.scrollLeft + t.clientWidth >= t.scrollWidth - 4) i = pairs.length - 1;
    setAt(i);
  };
  const go = (i: number) => {
    const t = trackRef.current;
    const pair = t?.children[Math.max(0, Math.min(items.length - 1, i))] as HTMLElement | undefined;
    if (t && pair) t.scrollTo({ left: pair.offsetLeft - parseFloat(getComputedStyle(t).paddingLeft || "0"), behavior: "smooth" });
  };

  useEffect(() => {
    const el = root.current;
    const track = el?.querySelector<HTMLElement>(".ws-track");
    if (!el || !track) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const offset = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hdr-h")) || 0;
      gsap.to(track, {
        x: () => -(track.scrollWidth - el.clientWidth),
        ease: "none",
        scrollTrigger: { trigger: el, start: () => `top top+=${offset()}`, end: "bottom bottom", scrub: 0.4, invalidateOnRefresh: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="ws" ref={root} aria-labelledby="ws-title">
      <div className="ws-sticky">
        <div className="ws-container ws-head">
          <div>
            <span className="ws-label">*Our Promise</span>
            <h2 id="ws-title">What We Stand For</h2>
          </div>
          <p>The standard every Al Musheer piece is held to, in store or at your door.</p>
        </div>
        <div className="ws-track" ref={trackRef} onScroll={onScroll}>
          {items.map((it) => (
            <div className="ws-pair" key={it.title}>
              <div className="ws-im">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image} alt="" loading="lazy" />
              </div>
              <article className="ws-card">
                <div className="ws-stars" aria-hidden="true">
                  ✦ ✦ ✦ ✦ ✦
                </div>
                <blockquote>{it.quote}</blockquote>
                <hr />
                <b>{it.title}</b>
                <small>{it.note}</small>
              </article>
            </div>
          ))}
        </div>
        <div className="ws-nav">
          <span className="ws-count" aria-hidden="true">
            {String(at + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <div className="ws-dots">
            {items.map((it, i) => (
              <button key={it.title} type="button" className={i === at ? "on" : undefined} aria-label={`Show ${it.title}`} aria-current={i === at} onClick={() => go(i)} />
            ))}
          </div>
          <button type="button" className="ws-arrow" aria-label="Previous" disabled={at === 0} onClick={() => go(at - 1)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 12H4M10 6l-6 6 6 6" />
            </svg>
          </button>
          <button type="button" className="ws-arrow" aria-label="Next" disabled={at === items.length - 1} onClick={() => go(at + 1)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12h16M14 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
