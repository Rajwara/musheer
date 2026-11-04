"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import "./hero-slider.css";

export type Slide = { eyebrow: string; title: string; text?: string; cta: string; href: string; image: string };

const DELAY = 6500;

/**
 * Full-width home banner in the /test-mock-2 branding: photo slides that
 * cross-fade, round arrows on both sides, dots at the bottom, swipe on touch.
 */
export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  const go = useCallback((i: number) => setAt(((i % n) + n) % n), [n]);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    if (paused || n < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => go(at + 1), DELAY);
    return () => clearTimeout(t);
  }, [at, paused, n, go]);

  return (
    <section
      className={`hb-hero${paused ? " is-paused" : ""}`}
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={(e) => { if (e.pointerType !== "mouse") startX.current = e.clientX; }}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 40) go(at + (dx < 0 ? 1 : -1));
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(at - 1);
        if (e.key === "ArrowRight") go(at + 1);
      }}
    >
      {slides.map((s, i) => {
        const Title = i === 0 ? "h1" : "h2";
        return (
          <div
            key={s.title}
            className={`hb-slide${i === at ? " on" : ""}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}`}
            aria-hidden={i !== at}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.image} alt="" fetchPriority={i === 0 ? "high" : undefined} loading={i === 0 ? "eager" : "lazy"} />
            <div className="hb-copy">
              <span className="hb-eyebrow">*{s.eyebrow}</span>
              <Title className="hb-title">{s.title}</Title>
              {s.text && <p className="hb-text">{s.text}</p>}
              <Link className="hb-btn" href={s.href} tabIndex={i === at ? 0 : -1}>
                {s.cta}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
              </Link>
            </div>
          </div>
        );
      })}

      {n > 1 && (
        <>
          <button type="button" className="hb-arrow prev" aria-label="Previous slide" onClick={() => go(at - 1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg>
          </button>
          <button type="button" className="hb-arrow next" aria-label="Next slide" onClick={() => go(at + 1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
          </button>
          <div className="hb-dots">
            {slides.map((s, i) => (
              <button key={s.title} type="button" className={i === at ? "on" : undefined} aria-label={`Show slide ${i + 1}`} aria-current={i === at} onClick={() => go(i)}>
                <span />
              </button>
            ))}
          </div>
          <div className="hb-count" aria-hidden="true">
            {String(at + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </div>
        </>
      )}
    </section>
  );
}
