"use client";

import Link from "next/link";
import { HOME_VISIT_URL, whatsapp } from "@/lib/brand";
import { useStore } from "../StoreProvider";

const Arrow = () => (
  <span className="ac-go" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  </span>
);
const Ico = ({ d }: { d: string }) => (
  <span className="ac-ico" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  </span>
);

/** Quick links that already work without an account (cart and saved live in this browser). */
export default function AccountLinks() {
  const { cartCount, wishlist } = useStore();
  return (
    <div className="ac-links">
      <h2>Your shortcuts</h2>
      <p>Your cart and saved pieces are kept on this device, so they&apos;re ready even without signing in.</p>
      <div className="ac-grid">
        <Link className="ac-tile" href="/wishlist">
          <Ico d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z" />
          <span className="ac-count">{wishlist.length}</span>
          <b>Saved pieces</b>
          <small>Everything you&apos;ve hearted</small>
          <Arrow />
        </Link>
        <Link className="ac-tile" href="/cart">
          <Ico d="M5 8h14l1.5 13h-17zM8.5 8V6a3.5 3.5 0 0 1 7 0v2" />
          <span className="ac-count">{cartCount}</span>
          <b>Your cart</b>
          <small>Review and check out</small>
          <Arrow />
        </Link>
        <a className="ac-tile" href={whatsapp("Hello Al Musheer, I would like an update on my order.")} target="_blank" rel="noopener noreferrer">
          <Ico d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
          <b>Track an order</b>
          <small>Message us on WhatsApp with your order number</small>
          <Arrow />
        </a>
        <a className="ac-tile" href={HOME_VISIT_URL} target="_blank" rel="noopener noreferrer">
          <Ico d="M4 11 12 4l8 7v9h-5v-6H9v6H4z" />
          <b>Book a home visit</b>
          <small>A tailor comes to your home or majlis</small>
          <Arrow />
        </a>
      </div>
    </div>
  );
}
