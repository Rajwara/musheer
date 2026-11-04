"use client";

import { useRef } from "react";
import type { CardProduct } from "@/lib/types";
import { useQuickView } from "./QuickView";
import "./quick-view-cursor.css";

/** Clicks on these keep their own behaviour instead of opening quick view. */
const SKIP = "button, .na-go, [data-no-qv]";

/**
 * Wraps a product photo. With a mouse, a round black "Quick view" button
 * follows the cursor while it is over the photo, and clicking the photo opens
 * the quick view dialog instead of going to the product page. Touch screens
 * and keyboards keep the normal link (and the card's own Quick view button).
 */
export default function QuickViewArea({ product, className = "", children }: { product: CardProduct; className?: string; children: React.ReactNode }) {
  const open = useQuickView();
  const box = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const preloaded = useRef(false);

  const place = (e: React.PointerEvent) => {
    const el = box.current, d = dot.current;
    if (!el || !d || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    d.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0)`;
    // Hide the circle over the heart and other buttons so they stay usable.
    el.classList.toggle("qva-on", !(e.target as HTMLElement).closest(SKIP));
  };

  return (
    <div
      ref={box}
      className={`qva ${className}`}
      onPointerEnter={(e) => {
        place(e);
        // Fetch the gallery photos now so quick view opens with them ready.
        if (!preloaded.current && e.pointerType === "mouse") {
          preloaded.current = true;
          product.images.forEach((src) => {
            const img = new Image();
            img.src = src;
          });
        }
      }}
      onPointerMove={place}
      onPointerLeave={() => box.current?.classList.remove("qva-on")}
      onClickCapture={(e) => {
        if (!box.current?.classList.contains("qva-on") || (e.target as HTMLElement).closest(SKIP)) return;
        e.preventDefault();
        e.stopPropagation();
        box.current.classList.remove("qva-on");
        open(product);
      }}
    >
      {children}
      <span className="qva-dot" ref={dot} aria-hidden="true">
        <span>Quick view</span>
      </span>
    </div>
  );
}
