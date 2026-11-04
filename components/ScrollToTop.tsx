"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/**
 * Every move to another page starts at the top. Pinned scroll sections and
 * smooth scrolling can otherwise leave the new page part-way down. Links with
 * a #section still go to that section.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useLayoutEffect(() => {
    const go = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto"; // jump, don't glide
      if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
      html.style.scrollBehavior = prev;
    };
    go();
    // Again once the new page has painted and its scroll animations have set up,
    // since those can move the page after the first jump.
    let raf = requestAnimationFrame(() => (raf = requestAnimationFrame(go)));
    const t = setTimeout(go, 120);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
