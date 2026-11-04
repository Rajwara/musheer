"use client";

import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import "./made-to-measure.css";

/** "Kanduras Made To Your Measure, Since 1998" call-to-action from /test-mock-2, with its parallax photo. */
export default function MadeToMeasure({ image }: { image: string }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(el.querySelector(".mtm-bg"), { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="mtm" ref={root} aria-labelledby="mtm-title">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="mtm-bg" src={image} alt="" loading="lazy" />
      <div className="mtm-container">
        <h2 id="mtm-title">Kanduras Made To Your Measure, Since 1998</h2>
        <div className="mtm-row">
          <Link className="mtm-btn" href="/category/kandura-thobes">
            <span className="mtm-roll">
              <span data-t="Shop Now">Shop Now</span>
            </span>
            <span className="mtm-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12h16M14 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
          <div className="mtm-tag">
            AL MUSHEER
            <br />
            TAILORING SINCE 1998
          </div>
        </div>
      </div>
    </section>
  );
}
