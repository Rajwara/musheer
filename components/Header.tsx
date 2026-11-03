"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/brand";
import { mainNav } from "@/lib/navigation";
import Icon from "./Icon";
import { useStore } from "./StoreProvider";

export default function Header() {
  const { cartCount, wishlist } = useStore();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="top">
      <div className="wrap">
        <Link className="logo" href="/" aria-label="Al Musheer home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Al Musheer" width={354} height={593} />
        </Link>
        <nav
          className={open ? "nav open" : "nav"}
          aria-label="Main"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {mainNav.map((item) => (
            <div key={item.label}>
              <Link href={item.href}>{item.label}</Link>
              {item.columns && (
                <div className="drop">
                  {item.columns.map((col) => (
                    <div key={col.heading}>
                      <b>{col.heading}</b>
                      {col.links.map((l) => (
                        <Link key={l.href} href={l.href}>
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="icons">
          <form action="/search">
            <input name="q" type="search" placeholder="Search" aria-label="Search" />
          </form>
          <Link className="icon-search" href="/search" aria-label="Search">
            Find
          </Link>
          <a className="icon-wa" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Al Musheer">
            <Icon name="whatsapp" size={17} />
            <span>{PHONE_DISPLAY}</span>
          </a>
          <Link className="icon-account" href="/account">
            Account
          </Link>
          <Link href="/wishlist">
            Saved<span className="count">{wishlist.length}</span>
          </Link>
          <Link href="/cart">
            Cart<span className="count">{cartCount}</span>
          </Link>
          <button className="menu-btn" type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}
