"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type Slide = { eyebrow: string; title: string; text?: string; cta: string; href: string; image: string };

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [at, setAt] = useState(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setAt((n) => (n + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length, at]);

  return (
    <div className="hero">
      <div className="hero-copy">
        {slides.map((s, i) => (
          <div key={s.title} hidden={i !== at}>
            <span className="eyebrow">{s.eyebrow}</span>
            <h1 style={{ margin: "14px 0 22px" }}>{s.title}</h1>
            {s.text && <p className="hero-text">{s.text}</p>}
            <Link className="btn" href={s.href}>
              {s.cta}
            </Link>
          </div>
        ))}
        <div className="dots">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              className={i === at ? "on" : undefined}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setAt(i)}
            />
          ))}
        </div>
      </div>
      <div className="hero-media">
        {slides.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={s.image} src={s.image} alt="" className={i === at ? "on" : undefined} />
        ))}
      </div>
    </div>
  );
}
