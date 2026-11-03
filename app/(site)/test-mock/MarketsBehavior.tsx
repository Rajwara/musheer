"use client";

import { useEffect } from "react";

/** The original section script: card and marker hover, and the reveal on scroll. */
export default function MarketsBehavior() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".mk");
    if (!root) return;
    const cards = root.querySelectorAll<HTMLElement>(".mk-card");
    const markers = root.querySelectorAll<HTMLElement>(".mk-marker");
    const off: (() => void)[] = [];
    const on = (t: EventTarget, type: string, fn: EventListener) => {
      t.addEventListener(type, fn);
      off.push(() => t.removeEventListener(type, fn));
    };

    function setActive(i: number, active: boolean) {
      cards[i].classList.toggle("is-active", active);
      markers[i].classList.toggle("is-active", active);
    }

    cards.forEach((card, i) => {
      card.style.setProperty("--n", String(i));
      const photo = card.querySelector<HTMLElement>(".mk-card__photo")!;
      on(card, "pointerenter", ((e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        photo.style.setProperty("--x", e.clientX - r.left + "px");
        photo.style.setProperty("--y", e.clientY - r.top + "px");
        setActive(i, true);
      }) as EventListener);
      on(card, "pointerleave", () => setActive(i, false));
      on(card, "focus", () => setActive(i, true));
      on(card, "blur", () => setActive(i, false));
    });

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("mk--ready");
      io = new IntersectionObserver(
        (entries, obs) => {
          if (entries[0].isIntersecting) {
            root.classList.add("mk--in");
            obs.disconnect();
          }
        },
        { threshold: 0.12 },
      );
      io.observe(root);
    }

    return () => {
      off.forEach((f) => f());
      io?.disconnect();
    };
  }, []);

  return null;
}
