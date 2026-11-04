"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/brand";
import { mainNav } from "@/lib/navigation";
import Icon from "./Icon";
import MegaMenu from "./MegaMenu";
import "./header-brand.css";
import { useStore } from "./StoreProvider";

export default function Header({ images }: { images: Record<string, string> }) {
  const { cartCount, wishlist } = useStore();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOpen(false);
    setSearching(false);
    // A clicked menu link keeps focus, which would hold its dropdown open (:focus-within).
    const el = document.activeElement as HTMLElement | null;
    if (el?.closest(".site-header")) el.blur();
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searching) searchRef.current?.focus();
  }, [searching]);

  const cls = ["site-header", "hb", scrolled && "is-scrolled", open && "menu-open"].filter(Boolean).join(" ");

  return (
    <header className={cls}>
      <div className="hdr-inner">
        <button
          className="hdr-icon hdr-menu"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "close" : "menu"} size={22} />
        </button>

        <nav
          className="hdr-nav"
          aria-label="Main"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {mainNav.map((item) => (
            <div className={item.button ? "hdr-item hdr-item-btn" : "hdr-item"} key={item.label}>
              <Link href={item.href}>
                {item.label}
                {item.columns && <Icon name="chevron" size={14} />}
              </Link>
              {item.columns && <MegaMenu item={{ ...item, columns: item.columns }} images={images} />}
            </div>
          ))}
        </nav>

        <Link className="hdr-logo" href="/" aria-label={`${BRAND} home`}>
          AL MUSHEER
        </Link>

        <div className="hdr-icons">
          <form className="hb-search" action="/search" role="search">
            <Icon name="search" size={18} />
            <input name="q" type="search" placeholder="I'm looking for…" aria-label="Search products" />
          </form>
          <button className="hdr-icon hb-search-btn" type="button" aria-label="Search" aria-expanded={searching} onClick={() => setSearching((s) => !s)}>
            <Icon name="search" size={21} />
          </button>
          <Link className="hdr-icon hide-sm" href="/account" aria-label="Account">
            <Icon name="user" size={21} />
          </Link>
          <Link className="hdr-icon hide-sm" href="/wishlist" aria-label={`Saved products (${wishlist.length})`}>
            <Icon name="heart" size={21} />
            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          </Link>
          <Link className="hdr-icon" href="/cart" aria-label={`Cart (${cartCount})`}>
            <Icon name="bag" size={22} />
            <span className="badge">{cartCount}</span>
          </Link>
        </div>
      </div>

      {searching && (
        <form className="hdr-search" action="/search">
          <Icon name="search" size={18} />
          <input ref={searchRef} name="q" type="search" placeholder="Search kanduras, ghutra, sandals…" aria-label="Search" />
          <button type="button" aria-label="Close search" onClick={() => setSearching(false)}>
            <Icon name="close" size={18} />
          </button>
        </form>
      )}
    </header>
  );
}
