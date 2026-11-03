"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav } from "@/lib/navigation";
import { useStore } from "./StoreProvider";

export default function Header() {
  const { cartCount, wishlist } = useStore();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="top">
      <div className="wrap">
        <Link className="logo" href="/">
          Musheer
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
