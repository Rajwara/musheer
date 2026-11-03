"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";

/**
 * "Milano" category and features sections, ported as-is from milano-sections.html.
 * Markup and CSS (./milano.css) are unchanged; the original script runs in the
 * effect below and is removed again when the page unmounts.
 */
export default function MilanoSections() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = root.current?.querySelector<HTMLElement>(".ml-page");
    if (!page) return;
    page.classList.add("ml-js");
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Fade-ins */
    const fades = page.querySelectorAll(".ml-fade");
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io?.unobserve(e.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      fades.forEach((f) => io!.observe(f));
    } else {
      fades.forEach((f) => f.classList.add("is-in"));
    }

    const cats = page.querySelector<HTMLElement>(".ml-cats")!;
    const cols = page.querySelectorAll<HTMLElement>(".ml-cat-col");
    const holder = page.querySelector<HTMLElement>(".ml-feat-holder")!;
    const glow = page.querySelector<HTMLElement>(".ml-glow")!;
    const S = reduced ? 1 : 0.12; /* scroll smoothing, 1 = none */
    const cur = { y: 0, p: 0, gx: 0, gy: 0 };
    const tgt = { y: 0, p: 0, gx: 0, gy: 0 };
    let running = false;
    let first = true;
    let raf = 0;

    function measure() {
      const vh = innerHeight;
      /* Parallax: even columns move twice as far as odd ones (see CSS) */
      if (innerWidth > 767 && !reduced) {
        const r = cats.getBoundingClientRect();
        const prog = (vh - r.top) / (vh + r.height);
        tgt.y = clamp(-28 + 94 * prog, -28, 40);
      } else {
        tgt.y = 0;
      }
      /* Features: swap runs from holder top at viewport top, over the next 93vh */
      tgt.p = clamp(-holder.getBoundingClientRect().top / (vh * 0.93), 0, 1);
      if (first) {
        cur.y = tgt.y;
        cur.p = tgt.p;
        first = false;
      }
    }

    function tick() {
      let moving = false;
      (
        [
          ["y", S],
          ["p", S],
          ["gx", 0.08],
          ["gy", 0.08],
        ] as const
      ).forEach(([k, f]) => {
        const d = tgt[k] - cur[k];
        if (Math.abs(d) < 0.001) cur[k] = tgt[k];
        else {
          cur[k] += d * f;
          moving = true;
        }
      });
      cols.forEach((c) => c.style.setProperty("--ml-y", cur.y.toFixed(2)));
      holder.style.setProperty("--ml-p", cur.p.toFixed(4));
      glow.style.transform = "translate3d(" + cur.gx.toFixed(1) + "px," + cur.gy.toFixed(1) + "px,0)";
      if (moving) raf = requestAnimationFrame(tick);
      else running = false;
    }
    function wake() {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    }
    function onScroll() {
      measure();
      wake();
    }

    let seen = false;
    function onPointer(e: PointerEvent) {
      if (e.pointerType === "touch" || (!seen && !e.clientX && !e.clientY)) return;
      tgt.gx = e.clientX;
      tgt.gy = e.clientY;
      if (!seen) {
        seen = true;
        cur.gx = tgt.gx;
        cur.gy = tgt.gy;
        glow.style.opacity = "1";
      }
      wake();
    }

    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    addEventListener("pointermove", onPointer, { passive: true });
    onScroll();

    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, []);

  return (
    <div ref={root}>
    <div className="ml-page">
      <div className="ml-glow" aria-hidden="true"></div>

      {/* SECTION 1: categories */}
      <section className="ml-cats">
        <div className="ml-cat-row">
          <div className="ml-cat-col">
            <a className="ml-cat-card" href="#">
              {/* REPLACE: put your Hoodies photo in src */}
              <img className="ml-cat-img" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22720%22%20height%3D%222000%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23b08968%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%233b2a1e%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url%28%23g%29%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2230%25%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2234%22%20fill%3D%22%23fff%22%20opacity%3D%22.65%22%3Ehoodies.jpg%3C%2Ftext%3E%3C%2Fsvg%3E" alt="Hoodies" loading="lazy" />
              <span className="ml-cat-overlay"></span>
              <h2 className="ml-cat-name">Hoodies</h2>
            </a>
          </div>
          <div className="ml-cat-col">
            <a className="ml-cat-card" href="#">
              {/* REPLACE: put your Sweatshirts photo in src */}
              <img className="ml-cat-img" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22720%22%20height%3D%222000%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%238d99ae%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2322223b%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url%28%23g%29%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2230%25%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2234%22%20fill%3D%22%23fff%22%20opacity%3D%22.65%22%3Esweatshirts.jpg%3C%2Ftext%3E%3C%2Fsvg%3E" alt="Sweatshirts" loading="lazy" />
              <span className="ml-cat-overlay"></span>
              <h2 className="ml-cat-name">Sweatshirts</h2>
            </a>
          </div>
          <div className="ml-cat-col">
            <a className="ml-cat-card" href="#">
              {/* REPLACE: put your Shirts photo in src */}
              <img className="ml-cat-img" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22720%22%20height%3D%222000%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%236b705c%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%231f2419%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url%28%23g%29%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2230%25%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2234%22%20fill%3D%22%23fff%22%20opacity%3D%22.65%22%3Eshirts.jpg%3C%2Ftext%3E%3C%2Fsvg%3E" alt="Shirts" loading="lazy" />
              <span className="ml-cat-overlay"></span>
              <h2 className="ml-cat-name">Shirts</h2>
            </a>
          </div>
          <div className="ml-cat-col">
            <a className="ml-cat-card" href="#">
              {/* REPLACE: put your T-Shirts photo in src */}
              <img className="ml-cat-img" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22720%22%20height%3D%222000%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23c1666b%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%233d1b1f%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url%28%23g%29%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2230%25%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2234%22%20fill%3D%22%23fff%22%20opacity%3D%22.65%22%3Et-shirts.jpg%3C%2Ftext%3E%3C%2Fsvg%3E" alt="T-Shirts" loading="lazy" />
              <span className="ml-cat-overlay"></span>
              <h2 className="ml-cat-name">T-Shirts</h2>
            </a>
          </div>
          <div className="ml-cat-col">
            <a className="ml-cat-card" href="#">
              {/* REPLACE: put your Jackets photo in src */}
              <img className="ml-cat-img" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22720%22%20height%3D%222000%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%234f6d7a%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2314213d%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url%28%23g%29%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2230%25%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2234%22%20fill%3D%22%23fff%22%20opacity%3D%22.65%22%3Ejackets.jpg%3C%2Ftext%3E%3C%2Fsvg%3E" alt="Jackets" loading="lazy" />
              <span className="ml-cat-overlay"></span>
              <h2 className="ml-cat-name">Jackets</h2>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: features. Note: no ancestor may have overflow:hidden, or sticky stops working */}
      <section className="ml-features">
        <div className="ml-fade"><h2>Features of our products</h2></div>
        <div className="ml-fade">
          <div className="ml-feat-holder">
            <div className="ml-feat-sticky">
              <div className="ml-feat-card">
                <div className="ml-feat-side ml-feat-left">
                  <div className="ml-feat-panel ml-feat-text dark">
                    <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porta feugiat etiam aliquet aliquet tellus vel. Et maecenas id bibendum sit. Augue nulla tortor faucibus nunc.</p>
                  </div>
                  <div className="ml-feat-panel ml-feat-text light">
                    <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porta feugiat etiam aliquet aliquet tellus vel. Et maecenas id bibendum sit. Augue nulla tortor faucibus nunc.</p>
                  </div>
                </div>
                <div className="ml-feat-side ml-feat-right">
                  {/* First img = shown at the END of the scroll; second img = shown at the START */}
                  <div className="ml-feat-panel"><img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221300%22%20height%3D%221640%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%235c6b73%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%231d2d35%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url%28%23g%29%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2230%25%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2234%22%20fill%3D%22%23fff%22%20opacity%3D%22.65%22%3Efeature-2.jpg%3C%2Ftext%3E%3C%2Fsvg%3E" alt="Feature two" loading="lazy" /></div>
                  <div className="ml-feat-panel"><img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221300%22%20height%3D%221640%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23a68a64%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23332a20%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url%28%23g%29%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2230%25%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2234%22%20fill%3D%22%23fff%22%20opacity%3D%22.65%22%3Efeature-1.jpg%3C%2Ftext%3E%3C%2Fsvg%3E" alt="Feature one" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}
