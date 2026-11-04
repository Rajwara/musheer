"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavItem } from "@/lib/navigation";
import "./mega-menu.css";

type Props = { item: NavItem & { columns: NonNullable<NavItem["columns"]> }; images: Record<string, string> };

const slugOf = (href: string) => href.match(/^\/category\/([^/?#]+)/)?.[1];

/**
 * Dropdown with link columns and a feature panel. Hovering or focusing a
 * category swaps the panel's image and "Explore" button to that category.
 */
export default function MegaMenu({ item, images }: Props) {
  const links = item.columns.flatMap((c) => c.links).filter((l) => slugOf(l.href) && images[slugOf(l.href)!]);
  const fallback = links.find((l) => l.href === item.href) ?? links[0];
  const [active, setActive] = useState(fallback);

  const show = active ?? fallback;
  const src = show ? images[slugOf(show.href)!] : undefined;

  return (
    <div className="mega" onMouseLeave={() => setActive(fallback)}>
      <div className="mega-inner">
        <div className="mega-cols">
          {item.columns.map((col) => (
            <div key={col.heading}>
              <b>{col.heading}</b>
              {col.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={show?.href === l.href ? "on" : undefined}
                  onMouseEnter={() => slugOf(l.href) && images[slugOf(l.href)!] && setActive(l)}
                  onFocus={() => slugOf(l.href) && images[slugOf(l.href)!] && setActive(l)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        {show && src && (
          <Link className="mega-feature" href={show.href} tabIndex={-1} aria-hidden="true">
            <span className="mega-pic">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={src} src={src} alt="" />
            </span>
            <span className="mega-caption">
              <span className="mega-title">{show.label}</span>
              <span className="btn mega-btn">
                Explore {show.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
              </span>
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
