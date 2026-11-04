"use client";

/* eslint-disable @next/next/no-img-element */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export type FieldwornImages = Record<string, string>;

/**
 * "Fieldworn" homepage, ported from index_13.html. Markup and CSS
 * (./fieldworn.css) are unchanged; the placeholder drawings are replaced with
 * the store's own images (see page.tsx), and the original script runs in the
 * effect below, using GSAP from npm instead of the inlined copy.
 */
export default function Fieldworn({ img, community }: { img: FieldwornImages; community?: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = root.current!;
    const $ = (s: string, r: ParentNode = scope) => r.querySelector<HTMLElement>(s)!;
    const $$ = (s: string, r: ParentNode = scope) => Array.from(r.querySelectorAll<HTMLElement>(s));
    const off: (() => void)[] = [];
    const on = (t: EventTarget, type: string, fn: EventListener) => {
      t.addEventListener(type, fn);
      off.push(() => t.removeEventListener(type, fn));
    };

    /* Scale the giant wordmarks to fill the container width */
    function fit() {
      $$(".giant").forEach((el) => {
        const box = el.parentElement!;
        const span = $(".fit", el) || el;
        el.style.fontSize = "100px";
        const w = span.getBoundingClientRect().width;
        if (w) el.style.fontSize = 100 * (box.clientWidth / w) * 0.995 + "px";
      });
    }
    fit();
    on(window, "resize", fit);
    document.fonts?.ready.then(() => {
      fit();
      ScrollTrigger.refresh();
    });

    /* Mobile menu and cart drawer */
    const nav = $(".nav");
    const burger = $(".burger");
    on(burger, "click", () => {
      const o = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(o));
    });
    const cart = (o: boolean) => document.body.classList.toggle("cart-open", o);
    on($(".cart"), "click", () => cart(true));
    on($(".drawer-close"), "click", () => cart(false));
    on($(".drawer-bg"), "click", () => cart(false));
    on(document, "keydown", ((e: KeyboardEvent) => {
      if (e.key === "Escape") cart(false);
    }) as EventListener);

    /* Category filter */
    const tabs = $$(".tab");
    const cats = $$(".cat-card");
    tabs.forEach((t) =>
      on(t, "click", () => {
        tabs.forEach((x) => {
          const sel = x === t;
          x.classList.toggle("on", sel);
          x.setAttribute("aria-selected", String(sel));
        });
        const f = t.getAttribute("data-f");
        const show: HTMLElement[] = [];
        cats.forEach((c) => {
          const m = f === "all" || c.getAttribute("data-c") === f;
          c.hidden = !m;
          if (m) show.push(c);
        });
        gsap.killTweensOf(cats);
        gsap.fromTo(show, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.07 });
        ScrollTrigger.refresh();
      }),
    );

    /* Slider: arrows move one card */
    const track = $(".slider-track");
    const looks = $$(".look", track);
    let idx = 0;
    function slide(d: number) {
      const step = looks[0].offsetWidth + 16;
      const max = Math.max(0, track.scrollWidth - track.parentElement!.clientWidth);
      idx = Math.max(0, Math.min(looks.length - 1, idx + d));
      const x = Math.min(idx * step, max);
      if (x === max && d > 0) idx = Math.round(max / step);
      gsap.to(track, { x: -x, duration: 0.8, ease: "power3.inOut" });
    }
    on($(".c-prev"), "click", () => slide(-1));
    on($(".c-next"), "click", () => slide(1));
    on(window, "resize", () => {
      idx = 0;
      gsap.set(track, { x: 0 });
    });

    /* Offer cards: crossfade */
    const offers = $$(".disc-card");
    let oi = 0;
    const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
    function offer(d: number) {
      const cur = offers[oi];
      oi = (oi + d + offers.length) % offers.length;
      const nx = offers[oi];
      if (!reduced) {
        gsap.to(cur, { autoAlpha: 0, x: -40 * d, scale: 0.96, duration: 0.5, ease: "power2.in", onComplete: () => cur.classList.remove("on") });
        nx.classList.add("on");
        gsap.fromTo(nx, { autoAlpha: 0, x: 40 * d, scale: 0.96 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.7, delay: 0.2, ease: "power3.out" });
      } else {
        cur.classList.remove("on");
        nx.classList.add("on");
      }
    }
    on($(".d-prev"), "click", () => offer(-1));
    on($(".d-next"), "click", () => offer(1));

    /* Scroll and load animations */
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion:no-preference)", () => {
        function reveal(sel: string, o: { y?: number; scale?: number; start?: string; d?: number; st?: number } = {}) {
          const els = $$(sel);
          if (!els.length) return;
          gsap.set(els, { opacity: 0, y: o.y == null ? 40 : o.y, scale: o.scale || 1 });
          ScrollTrigger.batch(els, {
            start: o.start || "top 90%",
            once: true,
            onEnter: (b) => {
              gsap.to(b, { opacity: 1, y: 0, scale: 1, duration: o.d || 0.9, ease: "power3.out", stagger: o.st == null ? 0.12 : o.st, overwrite: "auto" });
            },
          });
        }

        /* Banner entrance */
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".banner-bg", { scale: 1.14, duration: 1.8, ease: "power2.out" }, 0)
          .from(".banner-title .ch", { yPercent: 110, duration: 1.1, stagger: 0.05 }, 0.2)
          .from(".nav-row>*", { y: -20, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.3)
          .from(".banner-text>*", { y: 30, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.6)
          .from(".banner-year", { y: 30, opacity: 0, duration: 0.9 }, 0.75);

        /* Banner image eases as the page scrolls away */
        gsap.to(".banner-bg", { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".banner", start: "top top", end: "bottom top", scrub: true } });

        /* Section headings and copy */
        reveal(".rv", { y: 30, st: 0.08 });

        /* Why us: image scales down inside its frame, cards rise in sequence */
        gsap.fromTo(".why-img .scale", { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".why-img", start: "top bottom", end: "bottom 70%", scrub: 0.5 } });
        reveal(".why-card", { y: 70, scale: 0.95, st: 0.14, d: 1 });
        reveal(".products .product", { y: 50, st: 0.1 });
        reveal(".cat-card", { y: 50, st: 0.1 });

        /* Pinned stack: each photo slides over the last and the product card follows */
        const panels = $$(".panel");
        const n = panels.length;
        gsap.set(panels.slice(1), { yPercent: 100 });
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ".stack", start: "top top", end: "bottom bottom", scrub: 0.4 } });
        panels.slice(1).forEach((p, i) => {
          tl.to(p, { yPercent: 0, duration: 1 }, i).to(".stack-track", { yPercent: -(100 / n) * (i + 1), duration: 1 }, i);
        });

        reveal(".look", { y: 50, st: 0.12 });

        /* Offer card and heading */
        gsap.from(".disc-cards", { y: 80, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".disc-stage", start: "top 85%", once: true } });

        /* Testimonials: pinned while the row travels sideways */
        mm.add("(min-width:768px)", () => {
          const t = $(".tst-track");
          gsap.to(t, {
            x: () => -(t.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: { trigger: ".tst", start: "top top", end: "bottom bottom", scrub: 0.4, invalidateOnRefresh: true },
          });
        });

        reveal(".blog-card", { y: 50, st: 0.14 });
        reveal(".follow-grid a", { y: 80, scale: 0.92, st: 0.14, d: 1 });

        /* CTA and footer */
        gsap.fromTo(".cta-bg", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".cta", start: "top bottom", end: "bottom top", scrub: true } });
        gsap.from(".foot-giant .ch", { yPercent: 100, duration: 1, ease: "power3.out", stagger: 0.04, scrollTrigger: { trigger: ".foot-giant", start: "top 98%", once: true } });
        gsap.from(".foot-img img", { scale: 1.2, ease: "none", scrollTrigger: { trigger: ".foot-img", start: "top bottom", end: "bottom 80%", scrub: 0.5 } });
      });
    }, scope);

    // The original refits and refreshes on window load; in a client-side page load may already have fired.
    const settle = () => {
      fit();
      ScrollTrigger.refresh();
    };
    if (document.readyState === "complete") requestAnimationFrame(settle);
    else on(window, "load", settle);

    return () => {
      off.forEach((f) => f());
      ctx.revert();
      document.body.classList.remove("cart-open");
    };
  }, []);

  return (
    <div ref={root} style={{ display: "contents" }}>
      <header className="banner">
       <div className="banner-in">
        <img className="banner-bg" src={img.hero} alt="" />
        <nav className="nav" aria-label="Main">
         <div className="container nav-row">
          <a className="logo" href="#">FIELDWORN</a>
          <ul className="links">
           <li><a href="#">Home</a></li><li><a href="#collections">Collections</a></li><li><a href="#why">About Us</a></li>
           <li><button type="button">Pages ⌄</button><ul className="drop"><li><a href="#categories">Categories</a></li><li><a href="#journal">Journal</a></li><li><a href="#">Contact</a></li></ul></li>
          </ul>
          <div className="nav-end">
           <button className="cart" type="button" aria-label="Open cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 8h14l1.500 13h-17zM8.500 8V6a3.500 3.500 0 0 1 7 0v2"/></svg><b>0</b></button>
           <button className="burger" type="button" aria-label="Menu" aria-expanded="false"><i></i><i></i><i></i></button>
          </div>
         </div>
        </nav>
        <div className="banner-copy"><div className="container">
         <div className="banner-text"><p>Everyday clothing made with care, in easy shapes and honest fabrics you'll reach for again and again.</p><a className="banner-link" href="#collections"><span className="roll"><span data-t="Shop Now">Shop Now</span></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4v13h17M17 13l4 4-4 4"/></svg></a></div>
         <div className="banner-year">NEW<br />SEASON<br />@2026</div>
         <h1 className="banner-title"><span className="giant"><span className="fit" style={{ display: "inline-block" }} aria-label="FIELDWORN"><span className="ch" aria-hidden="true">F</span><span className="ch" aria-hidden="true">I</span><span className="ch" aria-hidden="true">E</span><span className="ch" aria-hidden="true">L</span><span className="ch" aria-hidden="true">D</span><span className="ch" aria-hidden="true">W</span><span className="ch" aria-hidden="true">O</span><span className="ch" aria-hidden="true">R</span><span className="ch" aria-hidden="true">N</span></span></span></h1>
        </div></div>
       </div>
      </header>
      <main>
      <section className="section" id="why"><div className="container why-grid">
       <div className="why-img"><div className="scale"><img src={img.why} alt="" /></div><span className="label">*Why Us</span><p>Clothes That Feel Good, Look Right And Keep Going.</p></div>
       <article className="why-card"><div className="why-top"><svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="7" width="26" height="24" rx="4"/><path d="M5 14h26M14 7v7h8V7M20 25l3 3 6-7"/></svg><b>01</b></div><h3>Built to Last</h3><p>Choose fabrics and finishes that keep their shape, colour and feel, wash after wash.</p></article><article className="why-card"><div className="why-top"><svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="7" width="26" height="24" rx="4"/><path d="M5 14h26"/><rect x="21" y="22" width="9" height="7" rx="1"/><path d="M23 22v-2a2.500 2.500 0 0 1 5 0v2"/></svg><b>02</b></div><h3>Tracked Delivery</h3><p>Replace this with your own delivery promise, including timing and where you ship.</p></article><article className="why-card"><div className="why-top"><svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="7" width="26" height="24" rx="4"/><path d="M5 14h26M22 25h-9M16 21l-4 4 4 4"/></svg><b>03</b></div><h3>Easy Returns</h3><p>Replace this with your own returns policy, including the window and how it works.</p></article><article className="why-card"><div className="why-top"><svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="7" width="26" height="24" rx="4"/><circle cx="17" cy="19" r="4"/><path d="M10 29c1-4 4-6 7-6s6 2 7 6M27 9v6M24 12h6"/></svg><b>04</b></div><h3>Customer Reviews</h3><p>Replace this with a real figure from your own customer reviews or ratings.</p></article>
      </div></section>

      <section className="section grey" id="collections"><div className="container coll-grid">
       <div className="coll-side"><span className="label rv">*Collections</span><h2 className="rv">Most Wanted Right Now</h2><div className="coll-end"><p className="rv">The pieces everyone is asking for this season, ready to wear from day one.</p><div className="rv"><a className="btn " href="#"><span className="roll"><span data-t="Explore All">Explore All</span></span><span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></span></a></div></div></div>
       <div className="products"><a className="product" href="#"><span className="pill">Hot Deal</span><div className="thumb"><img src={img.g1} alt="" /></div><div className="name">Field Overshirt</div><div className="price">$ 00.00</div></a><a className="product" href="#"><span className="pill">New In</span><div className="thumb"><img src={img.g2} alt="" /></div><div className="name">Heavy Hoodie</div><div className="price">$ 00.00</div></a><a className="product" href="#"><span className="pill">Hot Deal</span><div className="thumb"><img src={img.g3} alt="" /></div><div className="name">Boxy Tee</div><div className="price">$ 00.00</div></a><a className="product" href="#"><span className="pill">New In</span><div className="thumb"><img src={img.g4} alt="" /></div><div className="name">Knit Cardigan</div><div className="price">$ 00.00</div></a><a className="product" href="#"><span className="pill">Hot Deal</span><div className="thumb"><img src={img.g5} alt="" /></div><div className="name">Zip Hoodie</div><div className="price">$ 00.00</div></a><a className="product" href="#"><span className="pill">New In</span><div className="thumb"><img src={img.g6} alt="" /></div><div className="name">Check Shirt</div><div className="price">$ 00.00</div></a></div>
      </div></section>

      <section className="section dark" id="categories"><div className="container">
       <div className="cat-head"><div><span className="label rv">*Category</span><h2 className="rv">Find Your Fit</h2></div><p className="rv">Sort by occasion and find the pieces that work for how you actually dress.</p></div>
       <div className="tabs rv" role="tablist" aria-label="Filter categories"><button className="tab on" role="tab" aria-selected="true" data-f="all">All</button><button className="tab" role="tab" aria-selected="false" data-f="formal">Formal</button><button className="tab" role="tab" aria-selected="false" data-f="casual">Casual</button><button className="tab" role="tab" aria-selected="false" data-f="active">Active</button><button className="tab" role="tab" aria-selected="false" data-f="tee">Tees</button></div>
       <div className="cat-grid"><a className="cat-card" href="#" data-c="casual"><div className="im zoom"><span className="pill">20% Off</span><img src={img.p1} alt="" /></div><h3>Linen Band Shirt</h3><div>Starts from <span className="price">$ 00.00</span></div></a><a className="cat-card" href="#" data-c="formal"><div className="im zoom"><span className="pill">30% Off</span><img src={img.p2} alt="" /></div><h3>Roll Neck Blazer</h3><div>Starts from <span className="price">$ 00.00</span></div></a><a className="cat-card" href="#" data-c="casual"><div className="im zoom"><span className="pill">15% Off</span><img src={img.p3} alt="" /></div><h3>Washed Twill Shirt</h3><div>Starts from <span className="price">$ 00.00</span></div></a><a className="cat-card" href="#" data-c="active"><div className="im zoom"><span className="pill">25% Off</span><img src={img.p4} alt="" /></div><h3>Pique Polo</h3><div>Starts from <span className="price">$ 00.00</span></div></a><a className="cat-card" href="#" data-c="tee"><div className="im zoom"><span className="pill">40% Off</span><img src={img.p5} alt="" /></div><h3>Striped Jersey Tee</h3><div>Starts from <span className="price">$ 00.00</span></div></a><a className="cat-card" href="#" data-c="formal"><div className="im zoom"><span className="pill">10% Off</span><img src={img.p6} alt="" /></div><h3>Poplin Shirt</h3><div>Starts from <span className="price">$ 00.00</span></div></a></div>
      </div></section>

      <section className="stack" aria-label="Featured looks"><div className="stack-sticky">
       <div className="panel"><img src={img.s1} alt="" /></div><div className="panel"><img src={img.s2} alt="" /></div><div className="panel"><img src={img.s3} alt="" /></div><div className="panel"><img src={img.s4} alt="" /></div>
       <div className="stack-card-wrap"><div className="container"><div className="stack-card"><div className="stack-track"><a className="product" href="#"><span className="pill">Hot Deal</span><div className="thumb"><img src={img.g1} alt="" /></div><div className="name">Field Overshirt</div><div className="price">$ 00.00</div></a><a className="product" href="#"><span className="pill">New In</span><div className="thumb"><img src={img.g2} alt="" /></div><div className="name">Heavy Hoodie</div><div className="price">$ 00.00</div></a><a className="product" href="#"><span className="pill">Hot Deal</span><div className="thumb"><img src={img.g3} alt="" /></div><div className="name">Boxy Tee</div><div className="price">$ 00.00</div></a><a className="product" href="#"><span className="pill">New In</span><div className="thumb"><img src={img.g6} alt="" /></div><div className="name">Check Shirt</div><div className="price">$ 00.00</div></a></div></div></div></div>
      </div></section>

      <section className="section"><div className="container">
       <div className="comfort-head"><span className="label rv">*Comfort</span><h2 className="rv">Made For Moving<br />Through Your Day</h2><div className="arrows rv"><button className="round c-prev" type="button" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 12H4M10 6l-6 6 6 6"/></svg></button><button className="round c-next" type="button" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></button></div></div>
       <div className="slider"><div className="slider-track"><a className="look" href="#"><div className="bg zoom"><img src={img.p1} alt="" /></div><div className="look-txt"><b>Linen Band Shirt</b><span className="price">$ 00.00</span></div><span className="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></span></a><a className="look" href="#"><div className="bg zoom"><img src={img.p2} alt="" /></div><div className="look-txt"><b>Roll Neck Blazer</b><span className="price">$ 00.00</span></div><span className="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></span></a><a className="look" href="#"><div className="bg zoom"><img src={img.p3} alt="" /></div><div className="look-txt"><b>Washed Twill Shirt</b><span className="price">$ 00.00</span></div><span className="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></span></a><a className="look" href="#"><div className="bg zoom"><img src={img.p4} alt="" /></div><div className="look-txt"><b>Pique Polo</b><span className="price">$ 00.00</span></div><span className="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></span></a><a className="look" href="#"><div className="bg zoom"><img src={img.p5} alt="" /></div><div className="look-txt"><b>Striped Jersey Tee</b><span className="price">$ 00.00</span></div><span className="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></span></a><a className="look" href="#"><div className="bg zoom"><img src={img.p6} alt="" /></div><div className="look-txt"><b>Poplin Shirt</b><span className="price">$ 00.00</span></div><span className="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></span></a></div></div>
      </div></section>

      <section className="section dark disc"><div className="container"><span className="label rv">*Offers</span><h2 className="rv">Good Pieces, Better Prices</h2></div>
       <div className="disc-stage" style={{ position: "relative" }}>
        <div className="marquee" aria-hidden="true"><span>Season Sale</span><span>Season Sale</span><span>Season Sale</span><span>Season Sale</span></div>
        <div className="disc-cards"><a className="disc-card on" href="#"><div className="bg zoom"><img src={img.p1} alt="" /></div><span className="pill">25% Off</span><div className="disc-txt"><b>Linen Band Shirt</b>$ 00.00 &nbsp;|&nbsp; <s>$ 00.00</s></div><span className="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></span></a><a className="disc-card" href="#"><div className="bg zoom"><img src={img.p2} alt="" /></div><span className="pill">25% Off</span><div className="disc-txt"><b>Roll Neck Blazer</b>$ 00.00 &nbsp;|&nbsp; <s>$ 00.00</s></div><span className="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></span></a><a className="disc-card" href="#"><div className="bg zoom"><img src={img.p3} alt="" /></div><span className="pill">25% Off</span><div className="disc-txt"><b>Washed Twill Shirt</b>$ 00.00 &nbsp;|&nbsp; <s>$ 00.00</s></div><span className="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></span></a></div>
        <div className="arrows"><button className="round d-prev" type="button" aria-label="Previous offer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 12H4M10 6l-6 6 6 6"/></svg></button><button className="round d-next" type="button" aria-label="Next offer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></button></div>
       </div>
      </section>

      <section className="tst" aria-label="Customer reviews"><div className="tst-sticky">
       <div className="container tst-head"><div><span className="label">*Reviews</span><h2>Words From Our Customers</h2></div><p>Add real reviews here to show customers what others think of your clothes and service.</p></div>
       <div className="tst-track"><div className="tst-im zoom"><img src={img.t1} alt="" /></div><article className="tst-card"><div className="stars" aria-label="5 stars">★★★★★</div><blockquote>Sample text. Replace this with a real customer quote about fit, fabric or delivery.</blockquote><hr /><b>Customer Name</b><small>Sample review</small></article><div className="tst-im zoom"><img src={img.t2} alt="" /></div><article className="tst-card"><div className="stars" aria-label="5 stars">★★★★★</div><blockquote>Sample text. Replace this with a real customer quote about fit, fabric or delivery.</blockquote><hr /><b>Customer Name</b><small>Sample review</small></article><div className="tst-im zoom"><img src={img.t3} alt="" /></div><article className="tst-card"><div className="stars" aria-label="5 stars">★★★★★</div><blockquote>Sample text. Replace this with a real customer quote about fit, fabric or delivery.</blockquote><hr /><b>Customer Name</b><small>Sample review</small></article><div className="tst-im zoom"><img src={img.t4} alt="" /></div><article className="tst-card"><div className="stars" aria-label="5 stars">★★★★★</div><blockquote>Sample text. Replace this with a real customer quote about fit, fabric or delivery.</blockquote><hr /><b>Customer Name</b><small>Sample review</small></article><div className="tst-im zoom"><img src={img.t5} alt="" /></div><article className="tst-card"><div className="stars" aria-label="5 stars">★★★★★</div><blockquote>Sample text. Replace this with a real customer quote about fit, fabric or delivery.</blockquote><hr /><b>Customer Name</b><small>Sample review</small></article><div className="tst-im zoom"><img src={img.t6} alt="" /></div><article className="tst-card"><div className="stars" aria-label="5 stars">★★★★★</div><blockquote>Sample text. Replace this with a real customer quote about fit, fabric or delivery.</blockquote><hr /><b>Customer Name</b><small>Sample review</small></article><div className="tst-im zoom"><img src={img.t7} alt="" /></div><article className="tst-card"><div className="stars" aria-label="5 stars">★★★★★</div><blockquote>Sample text. Replace this with a real customer quote about fit, fabric or delivery.</blockquote><hr /><b>Customer Name</b><small>Sample review</small></article><div className="tst-im zoom"><img src={img.t8} alt="" /></div><article className="tst-card"><div className="stars" aria-label="5 stars">★★★★★</div><blockquote>Sample text. Replace this with a real customer quote about fit, fabric or delivery.</blockquote><hr /><b>Customer Name</b><small>Sample review</small></article></div>
      </div></section>

      <section className="section grey" id="journal"><div className="container blog-grid">
       <div className="blog-side"><div><span className="label rv">*Journal</span><h2 className="rv">Notes On<br />Getting Dressed</h2></div><div className="rv"><a className="btn " href="#"><span className="roll"><span data-t="View All Posts">View All Posts</span></span><span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></span></a></div></div>
       <a className="blog-card" href="#"><div className="im zoom"><img src={img.b1} alt="" /></div><h3>Five Ways to Wear a Light Overshirt</h3><span className="read"><span className="roll"><span data-t="Read More">Read More</span></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></span></a><a className="blog-card" href="#"><div className="im zoom"><img src={img.b2} alt="" /></div><h3>A Simple Guide to Layering in Cold Weather</h3><span className="read"><span className="roll"><span data-t="Read More">Read More</span></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></span></a>
      </div></section>

      {/* Follow Us: the home page "Behind the craft" reels section (see page.tsx) */}

      <section className="section reels-section" style={{ paddingBottom: "64px" }}>
        <div className="container tst-head reels-head">
          <div><span className="label rv">*Behind The Craft</span><h2 className="rv">See It On Instagram</h2></div>
          <p className="rv">Follow <a href="https://www.instagram.com/almusheer" target="_blank" rel="noopener noreferrer">@almusheer</a> on Instagram for more, and tag us wearing Al Musheer to be featured in our community showcase.</p>
        </div>
        {community}
      </section>

      <section className="cta"><img className="cta-bg" src={img.cta} alt="" /><div className="container">
       <h2 className="rv">Build A Wardrobe That Works As Hard As You Do</h2>
       <div className="cta-row"><div className="rv"><a className="btn light" href="#"><span className="roll"><span data-t="Shop Now">Shop Now</span></span><span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></span></a></div><div className="rv">FIELDWORN<br />NEW SEASON @2026</div></div>
      </div></section>
      </main>

      <footer className="footer"><div className="container">
       <div className="foot-grid">
        <div className="foot-img zoom"><img src={img.foot} alt="" /></div>
        <div>
         <div className="foot-cols">
          <div><h4>Shop</h4><ul><li><a href="#">Home</a></li><li><a href="#">Categories</a></li><li><a href="#">Collections</a></li><li><a href="#">Journal</a></li><li><a href="#">About Us</a></li></ul></div>
          <div><h4>Help</h4><ul><li><a href="#">Size Guide</a></li><li><a href="#">Shipping</a></li><li><a href="#">Returns</a></li><li><a href="#">Privacy Policy</a></li><li><a href="#">Contact</a></li></ul></div>
          <div><h4>Contact</h4><ul><li><a href="tel:+10000000000">+1 000 000 0000</a></li><li><a href="mailto:hello@example.com">hello@example.com</a></li><li><address>Your Street Address,<br />Your City</address></li></ul></div>
         </div>
         <div className="foot-end"><span>© 2026 Fieldworn. All rights reserved.</span><div className="socials"><a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M15 8h-1.500a2 2 0 0 0-2 2v8M9 13h5"/></svg></a><a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".5"/></svg></a><a href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 8l8 8M16 8l-8 8"/></svg></a><a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 11v5M8 8v.01M12 16v-5M12 13a2 2 0 0 1 4 0v3"/></svg></a></div></div>
        </div>
       </div>
       <div className="foot-giant"><span className="giant"><span className="fit" style={{ display: "inline-block" }} aria-label="FIELDWORN"><span className="ch" aria-hidden="true">F</span><span className="ch" aria-hidden="true">I</span><span className="ch" aria-hidden="true">E</span><span className="ch" aria-hidden="true">L</span><span className="ch" aria-hidden="true">D</span><span className="ch" aria-hidden="true">W</span><span className="ch" aria-hidden="true">O</span><span className="ch" aria-hidden="true">R</span><span className="ch" aria-hidden="true">N</span></span></span></div>
      </div></footer>

      <div className="drawer-bg"></div>
      <aside className="drawer" aria-label="Shopping cart"><div className="drawer-head"><h4>Your Cart</h4><button className="drawer-close" type="button" aria-label="Close cart">✕</button></div><p>Your cart is empty.</p></aside>
    </div>
  );
}
