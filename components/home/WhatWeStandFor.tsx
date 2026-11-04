"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import "./what-we-stand-for.css";

export type PromiseCard = { image: string; quote: string; title: string; note: string };

/**
 * "*Our Promise / What We Stand For" from /test-mock-2: the section pins
 * while a row of photos and promise cards travels sideways (phones swipe
 * the row instead).
 */
export default function WhatWeStandFor({ items }: { items: PromiseCard[] }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    const track = el?.querySelector<HTMLElement>(".ws-track");
    if (!el || !track) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
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
        <div className="ws-track">
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
      </div>
    </section>
  );
}
