"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";

export type LogotypeImages = Record<string, string | undefined>;

/**
 * "Logotype" homepage, ported from index_14.html. Markup and CSS (./logotype.css)
 * are unchanged and the original script runs in the effect below.
 *
 * Images: every <img> keeps its data-ph placeholder. When a file for that slot
 * exists (see page.tsx) it is passed in as `src`, and the placeholder is skipped,
 * exactly as the original script does for an <img> that already has a src.
 */
export default function Logotype({ img }: { img: LogotypeImages }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = root.current!;
    const html = document.documentElement;
    const $ = (s: string, r: ParentNode = scope) => r.querySelector<HTMLElement>(s)!;
    const $$ = (s: string, r: ParentNode = scope) => Array.from(r.querySelectorAll<HTMLElement>(s));
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const desktop = window.matchMedia("(min-width: 992px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (canHover) html.classList.add("hover-device");

    const off: (() => void)[] = [];
    const on = (t: EventTarget, type: string, fn: EventListener, opts?: AddEventListenerOptions) => {
      t.addEventListener(type, fn, opts);
      off.push(() => t.removeEventListener(type, fn, opts));
    };

    /* ---------- Placeholder images. Set a real src on any <img> and this skips it. ---------- */
    const tones: Record<string, [string, string]> = { 1: ["#d9d8d6", "#6d6c6a"], 2: ["#bdbcba", "#4a4a48"], 3: ["#e6e5e3", "#7b7a78"], 4: ["#55544f", "#efeeec"] };
    $$("img[data-ph]").forEach((el) => {
      const image = el as HTMLImageElement;
      if (image.getAttribute("src")) return;
      const p = image.dataset.ph!.split("|");
      const d = p[1].split("x");
      const t = tones[p[2]] || tones[1];
      const w = +d[0];
      const h = +d[1];
      const fs = Math.max(12, Math.min(w, h) / 14);
      const label = p[0]
        ? '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="' + fs + '" fill="' + t[1] + '">' + p[0] + " · " + w + "×" + h + "</text>"
        : "";
      const svg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + " " + h + '"><rect width="100%" height="100%" fill="' + t[0] + '"/>' +
        '<path d="M0 0L' + w + " " + h + "M" + w + " 0L0 " + h + '" stroke="' + t[1] + '" stroke-opacity=".18"/>' + label + "</svg>";
      image.src = "data:image/svg+xml," + encodeURIComponent(svg);
    });

    /* ---------- Fit the fixed 1200px desktop composition on narrower laptops ---------- */
    const page = $(".page");
    function fit() {
      const w = document.documentElement.clientWidth;
      page.style.zoom = w >= 992 && w < 1334 ? String(w / 1334) : "";
    }
    fit();
    on(window, "resize", fit);

    /* ---------- Reveal groups: animate once when the group scrolls into view ---------- */
    const groups = $$("[data-group]");
    let io: IntersectionObserver | null = null;
    if (reduced || !("IntersectionObserver" in window)) {
      groups.forEach((g) => g.classList.add("in"));
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io!.unobserve(e.target);
            }
          });
        },
        { rootMargin: "0px 0px -10% 0px" },
      );
      groups.forEach((g) => io!.observe(g));
    }

    /* ---------- Hero slider: 1.5s hold, 0.5s slide, infinite ---------- */
    let timer: ReturnType<typeof setInterval> | undefined;
    {
      const track = $("#track");
      const slider = $("#slider");
      const slides = $$(".slide", track);
      const n = slides.length;
      track.insertBefore(slides[n - 1].cloneNode(true), slides[0]);
      track.appendChild(slides[0].cloneNode(true));
      track.appendChild(slides[1].cloneNode(true));
      let i = 1;
      const set = (v: number) => {
        i = v;
        track.style.setProperty("--i", String(i));
      };
      const go = (v: number) => {
        track.classList.remove("snap");
        set(v);
      };
      const snap = (v: number) => {
        track.classList.add("snap");
        set(v);
        void track.offsetWidth;
        track.classList.remove("snap");
      };
      on(track, "transitionend", (e) => {
        if (e.target !== track) return;
        if (i > n) snap(i - n);
        else if (i < 1) snap(i + n);
      });
      const stop = () => clearInterval(timer);
      const play = () => {
        stop();
        if (!reduced) timer = setInterval(() => go(i + 1), 2000);
      };
      set(1);
      on($("#next"), "click", () => {
        if (i > n) snap(i - n);
        go(i + 1);
        play();
      });
      on($("#prev"), "click", () => {
        if (i < 1) snap(i + n);
        go(i - 1);
        play();
      });
      let x0: number | null = null;
      on(slider, "touchstart", ((e: TouchEvent) => {
        x0 = e.touches[0].clientX;
        stop();
      }) as EventListener, { passive: true });
      on(slider, "touchend", ((e: TouchEvent) => {
        if (x0 !== null) {
          const dx = e.changedTouches[0].clientX - x0;
          if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
        }
        x0 = null;
        play();
      }) as EventListener);
      on(document, "visibilitychange", () => (document.hidden ? stop() : play()));
      play();
    }

    /* ---------- Scroll-linked keyframes, with the same heavy smoothing feel ----------
       progress: 0 when the section's top enters the bottom of the viewport,
                 100 when its bottom leaves the top. */
    type Frame = [number, Partial<Record<"w" | "x" | "y" | "s" | "o", number>>];
    type Track = { el: HTMLElement; frames: Frame[] };
    type Scene = { sec: HTMLElement; smooth: number; always: boolean; tracks: Track[]; cur?: number; drawn?: number };
    const track = (el: HTMLElement, frames: Frame[]): Track => ({ el, frames });
    const lines = $$(".about-ink");
    const scenes: Scene[] = [
      {
        // About: lines fill in, note the last line finishes after line 4, as in the source
        sec: $("#about"),
        smooth: 0.96,
        always: true,
        tracks: [
          track(lines[0], [[16, { w: 0 }], [24, { w: 105 }]]),
          track(lines[1], [[25, { w: 0 }], [37, { w: 105 }]]),
          track(lines[2], [[38, { w: 0 }], [43, { w: 105 }]]),
          track(lines[3], [[44, { w: 0 }], [49, { w: 105 }]]),
          track(lines[4], [[54, { w: 0 }], [65, { w: 105 }]]),
        ],
      },
      {
        // Services: heading slides in, cards scale up from offset positions
        sec: $("#services"),
        smooth: 0.97,
        always: false,
        tracks: [
          track($("#svcHead"), [[0, { o: 0, x: -469 }], [25, { o: 1, x: 0 }]]),
          track($("#svc1"), [[7, { s: 0 }], [30, { s: 1 }]]),
          track($("#svc2"), [[30, { s: 0, x: 354, y: -119 }], [42, { s: 1, x: 0, y: 0 }]]),
          track($("#svc3"), [[42, { s: 0, x: -406, y: -273 }], [50, { s: 1, x: 0, y: 0 }]]),
          track($("#svc4"), [[54, { s: 0, x: 391, y: -108 }], [73, { s: 1, x: 0, y: 0 }]]),
          track($("#svcText"), [[56, { o: 0, x: 378 }], [73, { o: 1, x: 100 }]]),
        ],
      },
    ];

    function valueAt(frames: Frame[], prop: keyof Frame[1], p: number) {
      const pts = frames.filter((f) => prop in f[1]);
      if (!pts.length) return undefined;
      if (p <= pts[0][0]) return pts[0][1][prop]!;
      for (let k = 1; k < pts.length; k++) {
        if (p <= pts[k][0]) {
          const t = (p - pts[k - 1][0]) / (pts[k][0] - pts[k - 1][0]);
          return pts[k - 1][1][prop]! + (pts[k][1][prop]! - pts[k - 1][1][prop]!) * t;
        }
      }
      return pts[pts.length - 1][1][prop]!;
    }
    function apply(t: Track, p: number) {
      const f = t.frames;
      const w = valueAt(f, "w", p);
      if (w !== undefined) {
        t.el.style.width = w + "%";
        return;
      }
      const x = valueAt(f, "x", p) || 0;
      const y = valueAt(f, "y", p) || 0;
      const s = valueAt(f, "s", p);
      const o = valueAt(f, "o", p);
      t.el.style.transform = "translate(" + x + "px," + y + "px) scale(" + (s === undefined ? 1 : s) + ")";
      if (o !== undefined) t.el.style.opacity = String(o);
    }
    function clearScene(sc: Scene) {
      sc.tracks.forEach((t) => {
        t.el.style.transform = "";
        t.el.style.opacity = "";
      });
      sc.cur = undefined;
      sc.drawn = undefined;
    }
    function target(sc: Scene) {
      const r = sc.sec.getBoundingClientRect();
      const vh = window.innerHeight;
      return clamp((vh - r.top) / (r.height + vh), 0, 1) * 100;
    }
    let last = 0;
    let raf = 0;
    function tick(now: number) {
      const dt = Math.min(now - last, 100) || 16.67;
      last = now;
      scenes.forEach((sc) => {
        if (!sc.always && !desktop.matches) {
          if (sc.cur !== undefined) clearScene(sc);
          return;
        }
        const goal = target(sc);
        if (sc.cur === undefined || reduced) sc.cur = goal;
        else sc.cur += (goal - sc.cur) * (1 - Math.pow(sc.smooth, dt / 16.67));
        if (sc.drawn === undefined || Math.abs(sc.drawn - sc.cur) > 0.005) {
          sc.tracks.forEach((t) => apply(t, sc.cur!));
          sc.drawn = sc.cur;
        }
      });
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    /* ---------- Process hover: unblur the row, show its tilted image ---------- */
    const processImgs = $$(".process-images > div");
    $$(".process-card").forEach((c) => {
      const pimg = processImgs[+c.dataset.i!];
      on(c, "mouseenter", () => pimg.classList.add("on"));
      on(c, "mouseleave", () => pimg.classList.remove("on"));
    });

    /* ---------- Testimonial tabs ---------- */
    const tabs = $$(".t-tab");
    const panes = $$(".t-pane");
    function selectTab(idx: number) {
      tabs.forEach((t, i) => {
        t.setAttribute("aria-selected", i === idx ? "true" : "false");
        t.tabIndex = i === idx ? 0 : -1;
      });
      panes.forEach((p, i) => {
        p.classList.toggle("show", i === idx);
        p.classList.remove("fade");
        if (i === idx) {
          void p.offsetWidth;
          p.classList.add("fade");
        }
      });
    }
    tabs.forEach((t, i) => {
      on(t, "click", () => selectTab(i));
      on(t, "keydown", ((e: KeyboardEvent) => {
        const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
        if (d) {
          e.preventDefault();
          const n = (i + d + tabs.length) % tabs.length;
          selectTab(n);
          tabs[n].focus();
        }
      }) as EventListener);
    });
    selectTab(0);

    /* ---------- Fullscreen menu ---------- */
    const menu = $("#menu");
    const openBtn = $("#menuOpen");
    const closeBtn = $("#menuClose");
    function setMenu(open: boolean) {
      menu.classList.toggle("open", open);
      menu.setAttribute("aria-hidden", open ? "false" : "true");
      openBtn.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("menu-open", open);
      (open ? closeBtn : openBtn).focus({ preventScroll: true });
    }
    on(openBtn, "click", () => setMenu(true));
    on(closeBtn, "click", () => setMenu(false));
    on(document, "keydown", ((e: KeyboardEvent) => {
      if (e.key === "Escape" && menu.classList.contains("open")) setMenu(false);
    }) as EventListener);
    $$(".menu-link").forEach((a) => on(a, "click", () => setMenu(false)));

    return () => {
      off.forEach((f) => f());
      clearInterval(timer);
      cancelAnimationFrame(raf);
      io?.disconnect();
      html.classList.remove("hover-device");
      document.body.classList.remove("menu-open");
    };
  }, []);

  return (
    <div ref={root} style={{ display: "contents" }}>
      <div className="page">

        {/* NAV */}
        <header className="nav">
          <div className="gutter"><div className="wrap nav-row">
            <div className="nav-left">
              <button className="burger" id="menuOpen" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><i></i><i></i></button>
              <span className="nav-divider"></span>
              <a className="cart" href="#" aria-label="Cart, 0 items">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l3 13h11l2.2-9H6"/></svg>
                <span>0</span>
              </a>
            </div>
            <a className="logo" href="#">Logotype</a>
            <a className="btn nav-contact" href="#">Contact Us<span className="btn-lines"><i></i><i></i></span></a>
          </div></div>
        </header>

        {/* FULLSCREEN MENU */}
        <div className="menu" id="menu" aria-hidden="true">
          <div className="gutter"><div className="wrap">
            <div className="nav-row menu-top">
              <button className="close" id="menuClose" aria-label="Close menu"><i></i><i></i></button>
              <a className="logo" href="#">Logotype</a>
              <div className="menu-social">
                <a className="social" href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/></svg></a>
                <a className="social" href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.5"/><circle cx="16.8" cy="7.2" r=".6" fill="currentColor"/></svg></a>
                <a className="social" href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4l16 16M20 4L4 20"/></svg></a>
              </div>
            </div>
            <ul className="menu-list">
              <li><a className="menu-link" href="#">Home</a></li>
              <li><a className="menu-link" href="#about">About</a></li>
              <li><a className="menu-link" href="#">Contact</a></li>
              <li><a className="menu-link" href="#">Collection</a></li>
              <li><a className="menu-link" href="#services">Service</a></li>
              <li><a className="menu-link" href="#projects">Project</a></li>
            </ul>
          </div></div>
        </div>

        <main>
          {/* HERO */}
          <section className="hero gutter"><div className="wrap" data-group="">
            <div className="hero-top">
              <h1 className="h1 hero-title" data-r="" style={{ "--x": "-80px", "--d": "1.4s" } as React.CSSProperties}>Discover your signature style today.</h1>
              <div className="hero-intro" data-r="" style={{ "--x": "80px", "--d": "1.4s", "--w": ".3s" } as React.CSSProperties}>
                <p>Placeholder intro copy goes here. Swap in a short line about what you offer and why it matters to the people you serve.</p>
                <a className="btn" href="#">View collection<span className="btn-lines"><i></i><i></i></span></a>
              </div>
            </div>
            <div className="hero-bottom">
              <div className="hero-social" data-r="" style={{ "--d": "1.4s" } as React.CSSProperties}>
                <a className="social" href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/></svg></a>
                <a className="social" href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.5"/><circle cx="16.8" cy="7.2" r=".6" fill="currentColor"/></svg></a>
                <a className="social" href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4l16 16M20 4L4 20"/></svg></a>
              </div>
              <div className="hero-stage">
                <div className="slider-wrap">
                  <div className="slider" id="slider" aria-roledescription="carousel" aria-label="Featured images">
                    <div className="track" id="track">
                      {/* Slide template: replace data-ph with src="your-image.jpg" on each <img /> */}
                      <div className="slide" data-slide="1"><figure><img src={img["hero-1a"]} data-ph="Hero 1A|200x271|1" alt="" /></figure><figure className="big"><img src={img["hero-1b"]} data-ph="Hero 1B|400x542|2" alt="" /></figure><figure><img src={img["hero-1c"]} data-ph="Hero 1C|200x271|3" alt="" /></figure></div>
                      <div className="slide" data-slide="2"><figure><img src={img["hero-2a"]} data-ph="Hero 2A|200x271|2" alt="" /></figure><figure className="big"><img src={img["hero-2b"]} data-ph="Hero 2B|400x542|4" alt="" /></figure><figure><img src={img["hero-2c"]} data-ph="Hero 2C|200x271|1" alt="" /></figure></div>
                      <div className="slide" data-slide="3"><figure><img src={img["hero-3a"]} data-ph="Hero 3A|200x271|3" alt="" /></figure><figure className="big"><img src={img["hero-3b"]} data-ph="Hero 3B|400x542|1" alt="" /></figure><figure><img src={img["hero-3c"]} data-ph="Hero 3C|200x271|4" alt="" /></figure></div>
                    </div>
                    <button className="slider-hit prev" id="prev" aria-label="Previous slide"></button>
                    <button className="slider-hit next" id="next" aria-label="Next slide"></button>
                  </div>
                  {/* Two stacked layers in difference mode give the dark-on-white, light-on-dark wordmark */}
                  <div className="wordmark" aria-hidden="true"><span>L</span><span>O</span><span>G</span><span>O</span><span>T</span><span>Y</span><span>P</span><span>E</span></div>
                  <div className="wordmark" aria-hidden="true"><span>L</span><span>O</span><span>G</span><span>O</span><span>T</span><span>Y</span><span>P</span><span>E</span></div>
                </div>
                <div className="scroll-cue" data-r="" style={{ "--d": "1.4s" } as React.CSSProperties}>
                  <svg viewBox="0 0 16 42" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M8 0v41M1 34l7 7 7-7"/></svg>
                  <span>Scroll Down</span>
                </div>
              </div>
            </div>
          </div></section>

          {/* ABOUT */}
          <section className="gutter" id="about"><div className="wrap pad" data-group="">
            <h2 className="h6 center about-label" data-r="">About us</h2>
            <p className="about-lines" data-r="" id="aboutLines">
              <span className="about-line">Logotype creates considered,<span className="about-ink" aria-hidden="true">Logotype creates considered,</span></span>
              <span className="about-line">personal clothing, offering<span className="about-ink" aria-hidden="true">personal clothing, offering</span></span>
              <span className="about-line">tailored advice and edited collections<span className="about-ink" aria-hidden="true">tailored advice and edited collections</span></span>
              <span className="about-line">to sharpen your everyday wardrobe and<span className="about-ink" aria-hidden="true">to sharpen your everyday wardrobe and</span></span>
              <span className="about-line">personal look<span className="about-ink" aria-hidden="true">personal look</span></span>
            </p>
            <div className="about-bottom" data-r="">
              <div className="about-img"><img src={img["about-1"]} data-ph="About 1|260x150|1" alt="" /></div>
              <a className="btn" href="#">Learn more<span className="btn-lines"><i></i><i></i></span></a>
              <div className="about-img"><img src={img["about-2"]} data-ph="About 2|260x150|3" alt="" /></div>
            </div>
          </div></section>

          {/* SERVICES */}
          <section className="gutter" id="services"><div className="wrap pad">
            <div className="services">
              <div className="svc-left">
                <h2 className="h2" id="svcHead">What we can do for you</h2>
                <a className="svc-card" id="svc2" href="#"><div className="svc-img"><img src={img["service-1"]} data-ph="Service 1|449x482|2" alt="" /></div><div className="h6">Personal wardrobe edit</div></a>
                <a className="svc-card" id="svc4" href="#"><div className="svc-img"><img src={img["service-2"]} data-ph="Service 2|449x482|4" alt="" /></div><div className="h6">Private styling session</div></a>
              </div>
              <div className="svc-right">
                <a className="svc-card" id="svc1" href="#"><div className="svc-img"><img src={img["service-3"]} data-ph="Service 3|439x482|3" alt="" /></div><div className="h6">Seasonal lookbooks</div></a>
                <a className="svc-card" id="svc3" href="#"><div className="svc-img"><img src={img["service-4"]} data-ph="Service 4|439x482|1" alt="" /></div><div className="h6">Fittings and repairs</div></a>
                <div className="svc-text" id="svcText">
                  <p>Placeholder service summary. Use two or three lines here to explain how your services fit together and what to do next.</p>
                  <a className="btn" href="#">View all services<span className="btn-lines"><i></i><i></i></span></a>
                </div>
              </div>
            </div>
          </div></section>

          {/* PROCESS */}
          <section className="gutter" id="process"><div className="wrap pad" data-group="">
            <h2 className="h2 center process-head" data-r="">Our process</h2>
            <div className="process-list" data-r="" id="processList">
              <div className="process-card" data-i="0"><span className="h6 num">01</span><span className="process-dot"></span><h3 className="h3">Discovery call</h3></div>
              <div className="process-card" data-i="1"><span className="h6 num">02</span><span className="process-dot"></span><h3 className="h3">Design &amp; materials</h3></div>
              <div className="process-card" data-i="2"><span className="h6 num">03</span><span className="process-dot"></span><h3 className="h3">Fittings and finishing</h3></div>
              <div className="process-card" data-i="3"><span className="h6 num">04</span><span className="process-dot"></span><h3 className="h3">Final delivery</h3></div>
              <div className="process-images" aria-hidden="true">
                <div><img src={img["process-1"]} data-ph="Process 1|400x450|4" alt="" /></div>
                <div><img src={img["process-2"]} data-ph="Process 2|400x450|2" alt="" /></div>
                <div><img src={img["process-3"]} data-ph="Process 3|400x450|3" alt="" /></div>
                <div><img src={img["process-4"]} data-ph="Process 4|400x450|1" alt="" /></div>
              </div>
            </div>
          </div></section>

          {/* PROJECTS */}
          <section className="gutter" id="projects"><div className="wrap pad" data-group="">
            <div className="project-head" data-r="">
              <h2 className="h2">Selected recent work</h2>
              <a className="btn" href="#">View all<span className="btn-lines"><i></i><i></i></span></a>
            </div>
            <div className="project-grid">
              <a className="project-card" data-r="" href="#"><img src={img["project-1"]} data-ph="Project 1|585x650|2" alt="" /><div className="project-info"><div><span className="pill">Category one</span><div className="h6">Placeholder project title</div></div><span>2026</span></div></a>
              <a className="project-card" data-r="" href="#"><img src={img["project-2"]} data-ph="Project 2|585x650|4" alt="" /><div className="project-info"><div><span className="pill">Category two</span><div className="h6">Placeholder project title</div></div><span>2025</span></div></a>
              <a className="project-card" data-r="" href="#"><img src={img["project-3"]} data-ph="Project 3|585x650|1" alt="" /><div className="project-info"><div><span className="pill">Category three</span><div className="h6">Placeholder project title</div></div><span>2024</span></div></a>
              <a className="project-card" data-r="" href="#"><img src={img["project-4"]} data-ph="Project 4|585x650|3" alt="" /><div className="project-info"><div><span className="pill">Category four</span><div className="h6">Placeholder project title</div></div><span>2023</span></div></a>
            </div>
          </div></section>

          {/* TESTIMONIALS */}
          <section className="gutter" id="testimonials"><div className="wrap pad" data-group="">
            <h2 className="h2 center t-head" data-r="">What clients say</h2>
            <div className="t-tabs" id="tabs" role="tablist" aria-label="Client testimonials">
              <button className="t-tab" role="tab" aria-selected="true" aria-label="Testimonial 1"><img src={img["avatar-1"]} data-ph="|50x50|2" alt="" /></button>
              <button className="t-tab" role="tab" aria-selected="false" aria-label="Testimonial 2"><img src={img["avatar-2"]} data-ph="|50x50|4" alt="" /></button>
              <button className="t-tab" role="tab" aria-selected="false" aria-label="Testimonial 3"><img src={img["avatar-3"]} data-ph="|50x50|1" alt="" /></button>
              <button className="t-tab" role="tab" aria-selected="false" aria-label="Testimonial 4"><img src={img["avatar-4"]} data-ph="|50x50|3" alt="" /></button>
              <button className="t-tab" role="tab" aria-selected="false" aria-label="Testimonial 5"><img src={img["avatar-5"]} data-ph="|50x50|2" alt="" /></button>
              <button className="t-tab" role="tab" aria-selected="false" aria-label="Testimonial 6"><img src={img["avatar-6"]} data-ph="|50x50|4" alt="" /></button>
              <div className="t-panes" data-r="">
                <div className="t-pane show fade" role="tabpanel">
                  <svg className="t-quote" viewBox="0 0 50 42" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 41V19C1 9 6 3 18 1v5c-5 2-7 5-7 9h10v26H1zM29 41V19c0-10 5-16 17-18v5c-5 2-7 5-7 9h10v26H29z"/></svg>
                  <p className="h4">Placeholder testimonial one. Replace this with a real client quote about working with your team, around two or three sentences long so the layout holds.</p>
                  <p className="h6 t-name">Client name</p>
                </div>
                <div className="t-pane" role="tabpanel"><svg className="t-quote" viewBox="0 0 50 42" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 41V19C1 9 6 3 18 1v5c-5 2-7 5-7 9h10v26H1zM29 41V19c0-10 5-16 17-18v5c-5 2-7 5-7 9h10v26H29z"/></svg><p className="h4">Placeholder testimonial two. Replace this with a real client quote about the result you delivered, around two or three sentences long.</p><p className="h6 t-name">Client name</p></div>
                <div className="t-pane" role="tabpanel"><svg className="t-quote" viewBox="0 0 50 42" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 41V19C1 9 6 3 18 1v5c-5 2-7 5-7 9h10v26H1zM29 41V19c0-10 5-16 17-18v5c-5 2-7 5-7 9h10v26H29z"/></svg><p className="h4">Placeholder testimonial three. Replace this with a real client quote about your process, around two or three sentences long so the layout holds.</p><p className="h6 t-name">Client name</p></div>
                <div className="t-pane" role="tabpanel"><svg className="t-quote" viewBox="0 0 50 42" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 41V19C1 9 6 3 18 1v5c-5 2-7 5-7 9h10v26H1zM29 41V19c0-10 5-16 17-18v5c-5 2-7 5-7 9h10v26H29z"/></svg><p className="h4">Placeholder testimonial four. Replace this with a real client quote about quality, around two or three sentences long so the layout holds.</p><p className="h6 t-name">Client name</p></div>
                <div className="t-pane" role="tabpanel"><svg className="t-quote" viewBox="0 0 50 42" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 41V19C1 9 6 3 18 1v5c-5 2-7 5-7 9h10v26H1zM29 41V19c0-10 5-16 17-18v5c-5 2-7 5-7 9h10v26H29z"/></svg><p className="h4">Placeholder testimonial five. Replace this with a real client quote about service, around two or three sentences long so the layout holds.</p><p className="h6 t-name">Client name</p></div>
                <div className="t-pane" role="tabpanel"><svg className="t-quote" viewBox="0 0 50 42" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 41V19C1 9 6 3 18 1v5c-5 2-7 5-7 9h10v26H1zM29 41V19c0-10 5-16 17-18v5c-5 2-7 5-7 9h10v26H29z"/></svg><p className="h4">Placeholder testimonial six. Replace this with a real client quote about results, around two or three sentences long so the layout holds.</p><p className="h6 t-name">Client name</p></div>
              </div>
            </div>
          </div></section>
        </main>
      </div>
    </div>
  );
}
